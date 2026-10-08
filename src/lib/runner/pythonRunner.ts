import { TestCase } from '../../types/problem';
import { RunResult, TestCaseResult, Verdict } from '../../types/runner';
import { deepEqual, formatValue } from './harness';

const PYODIDE_WORKER_SCRIPT = `
let pyodideInstance = null;

async function getPyodide() {
  if (!pyodideInstance) {
    self.importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");
    pyodideInstance = await self.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
    });
  }
  return pyodideInstance;
}

self.onmessage = async function(e) {
  const { code, testCases, functionName } = e.data;

  try {
    const py = await getPyodide();

    // Python harness code
    const harnessPy = \`
import sys, io, json

__stdout_buffer = io.StringIO()
sys.stdout = __stdout_buffer
sys.stderr = __stdout_buffer

# User Code
\${code}

def __run_harness(test_cases, fn_name):
    import inspect
    sol_obj = None
    target_fn = None

    if 'Solution' in globals() and inspect.isclass(Solution):
        sol_obj = Solution()
        if hasattr(sol_obj, fn_name):
            target_fn = getattr(sol_obj, fn_name)
        else:
            # find first public method
            for attr in dir(sol_obj):
                if not attr.startswith('_') and callable(getattr(sol_obj, attr)):
                    target_fn = getattr(sol_obj, attr)
                    break

    if not target_fn and fn_name in globals() and callable(globals()[fn_name]):
        target_fn = globals()[fn_name]

    if not target_fn:
        return {"error": "Could not locate function " + str(fn_name) + " or Solution class method."}

    results = []
    for i, tc in enumerate(test_cases):
        raw_input = tc.get("input")
        expected = tc.get("expected")

        try:
            if isinstance(raw_input, dict):
                actual = target_fn(**raw_input)
            elif isinstance(raw_input, list):
                actual = target_fn(*raw_input)
            else:
                actual = target_fn(raw_input)
            results.append({
                "testCaseId": i + 1,
                "input": raw_input,
                "expected": expected,
                "actual": actual,
                "error": None
            })
        except Exception as ex:
            results.append({
                "testCaseId": i + 1,
                "input": raw_input,
                "expected": expected,
                "actual": None,
                "error": str(ex)
            })

    return {
        "results": results,
        "logs": __stdout_buffer.getvalue()
    }
\`;

    await py.runPythonAsync(harnessPy);
    
    // Pass test cases and function name to python
    py.globals.set("__tc_data", py.toPy(testCases));
    py.globals.set("__fn_name", functionName);

    const execResult = await py.runPythonAsync('__run_harness(__tc_data.to_py(), __fn_name)');
    const jsonStr = py.runPython('import json; json.dumps(__run_harness(__tc_data.to_py(), __fn_name))');
    const parsed = JSON.parse(jsonStr);

    self.postMessage({ success: true, data: parsed });

  } catch (err) {
    self.postMessage({
      success: false,
      error: err && err.message ? err.message : String(err)
    });
  }
};
`;

let cachedPythonWorker: Worker | null = null;
let cachedWorkerUrl: string | null = null;

function getPythonWorker(): { worker: Worker; recreate: () => void } {
  if (!cachedPythonWorker) {
    const blob = new Blob([PYODIDE_WORKER_SCRIPT], { type: 'application/javascript' });
    cachedWorkerUrl = URL.createObjectURL(blob);
    cachedPythonWorker = new Worker(cachedWorkerUrl);
  }

  const recreate = () => {
    if (cachedPythonWorker) {
      cachedPythonWorker.terminate();
      cachedPythonWorker = null;
    }
    if (cachedWorkerUrl) {
      URL.revokeObjectURL(cachedWorkerUrl);
      cachedWorkerUrl = null;
    }
  };

  return { worker: cachedPythonWorker, recreate };
}

export async function runPython(
  code: string,
  testCases: TestCase[],
  functionName: string,
  timeoutMs: number = 10000
): Promise<RunResult> {
  const { worker, recreate } = getPythonWorker();

  return new Promise<RunResult>((resolve) => {
    let hasResolved = false;
    const startTime = performance.now();

    const timer = setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        recreate();
        resolve({
          verdict: 'Time Limit Exceeded',
          totalPassed: 0,
          totalCount: testCases.length,
          executionTimeMs: timeoutMs,
          testCaseResults: testCases.map((tc, idx) => ({
            testCaseId: idx + 1,
            status: 'Time Limit Exceeded',
            input: formatValue(tc.input),
            expectedOutput: formatValue(tc.expected),
            actualOutput: 'Time Limit Exceeded',
            executionTimeMs: timeoutMs,
            error: `Python execution timed out after ${timeoutMs}ms.`,
          })),
        });
      }
    }, timeoutMs);

    worker.onmessage = (e) => {
      if (hasResolved) return;
      hasResolved = true;
      clearTimeout(timer);

      const totalDuration = Math.round(performance.now() - startTime);
      const data = e.data;

      if (!data.success) {
        resolve({
          verdict: 'Runtime Error',
          totalPassed: 0,
          totalCount: testCases.length,
          executionTimeMs: totalDuration,
          compileError: data.error,
          testCaseResults: [],
        });
        return;
      }

      if (data.data.error) {
        resolve({
          verdict: 'Runtime Error',
          totalPassed: 0,
          totalCount: testCases.length,
          executionTimeMs: totalDuration,
          compileError: data.data.error,
          testCaseResults: [],
        });
        return;
      }

      const caseResults: TestCaseResult[] = [];
      let allPassed = true;
      let firstFailureVerdict: Verdict = 'Accepted';

      interface PythonRawItem {
        testCaseId: number;
        input: unknown;
        expected: unknown;
        actual: unknown;
        error: string | null;
      }

      data.data.results.forEach((item: PythonRawItem) => {
        let status: Verdict = 'Accepted';
        if (item.error) {
          status = 'Runtime Error';
          if (allPassed) firstFailureVerdict = 'Runtime Error';
          allPassed = false;
        } else if (!deepEqual(item.actual, item.expected)) {
          status = 'Wrong Answer';
          if (allPassed) firstFailureVerdict = 'Wrong Answer';
          allPassed = false;
        }

        caseResults.push({
          testCaseId: item.testCaseId,
          status,
          input: formatValue(item.input),
          expectedOutput: formatValue(item.expected),
          actualOutput: item.error ? 'Error' : formatValue(item.actual),
          executionTimeMs: Math.round(totalDuration / (data.data.results.length || 1)),
          error: item.error || undefined,
          stdout: data.data.logs || undefined,
        });
      });

      resolve({
        verdict: allPassed ? 'Accepted' : firstFailureVerdict,
        totalPassed: caseResults.filter((c) => c.status === 'Accepted').length,
        totalCount: testCases.length,
        executionTimeMs: totalDuration,
        testCaseResults: caseResults,
        stdout: data.data.logs || undefined,
      });
    };

    worker.onerror = (err) => {
      if (hasResolved) return;
      hasResolved = true;
      clearTimeout(timer);
      recreate();

      resolve({
        verdict: 'Runtime Error',
        totalPassed: 0,
        totalCount: testCases.length,
        executionTimeMs: 0,
        compileError: err.message || 'Python Pyodide execution error',
        testCaseResults: [],
      });
    };

    worker.postMessage({ code, testCases, functionName });
  });
}
