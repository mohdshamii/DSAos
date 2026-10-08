import { TestCase } from '../../types/problem';
import { RunResult, TestCaseResult, Verdict } from '../../types/runner';
import { deepEqual, formatValue } from './harness';

const WORKER_SCRIPT = `
self.onmessage = function(e) {
  const { code, testCases, functionName } = e.data;
  const logs = [];
  const oldLog = console.log;
  console.log = function(...args) {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    oldLog.apply(console, args);
  };

  try {
    // Wrap code in closure and extract target function
    const wrapped = new Function(\`
      \${code}
      let fn = null;
      if (typeof \${functionName} === 'function') {
        fn = \${functionName};
      } else if (typeof Solution !== 'undefined') {
        const sol = new Solution();
        if (typeof sol[\${JSON.stringify(functionName)}] === 'function') {
          fn = sol[\${JSON.stringify(functionName)}].bind(sol);
        } else {
          // Find first method on Solution instance
          const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(sol)).filter(m => m !== 'constructor');
          if (methods.length > 0 && typeof sol[methods[0]] === 'function') {
            fn = sol[methods[0]].bind(sol);
          }
        }
      }
      return fn;
    \`);

    const fn = wrapped();

    if (!fn) {
      self.postMessage({
        success: false,
        error: "Could not find a callable solution function. Make sure your function matches the starter signature."
      });
      return;
    }

    const results = [];
    let totalTime = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      let args = [];

      if (Array.isArray(tc.input)) {
        args = tc.input;
      } else if (tc.input !== null && typeof tc.input === 'object') {
        args = Object.values(tc.input);
      } else {
        args = [tc.input];
      }

      // Clone args to prevent mutations between runs
      const clonedArgs = JSON.parse(JSON.stringify(args));
      const start = performance.now();
      let actual;
      let runtimeError = null;

      try {
        actual = fn(...clonedArgs);
      } catch (err) {
        runtimeError = err && err.message ? err.message : String(err);
      }
      const duration = performance.now() - start;
      totalTime += duration;

      results.push({
        testCaseId: i + 1,
        input: JSON.stringify(tc.input),
        expected: tc.expected,
        actual: actual,
        runtimeError: runtimeError,
        duration: Math.round(duration * 10) / 10
      });
    }

    self.postMessage({
      success: true,
      results: results,
      totalTime: Math.round(totalTime * 10) / 10,
      logs: logs.join('\\n')
    });

  } catch (err) {
    self.postMessage({
      success: false,
      error: err && err.message ? err.message : String(err)
    });
  }
};
`;

export async function runJavaScript(
  code: string,
  testCases: TestCase[],
  functionName: string,
  timeoutMs: number = 3500
): Promise<RunResult> {
  const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  const worker = new Worker(workerUrl);

  const cleanup = () => {
    worker.terminate();
    URL.revokeObjectURL(workerUrl);
  };

  return new Promise<RunResult>((resolve) => {
    let hasResolved = false;

    const timer = setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        cleanup();
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
            error: `Execution timed out after ${timeoutMs}ms. Check for infinite loops or recursion.`,
          })),
        });
      }
    }, timeoutMs);

    worker.onmessage = (e) => {
      if (hasResolved) return;
      hasResolved = true;
      clearTimeout(timer);
      cleanup();

      const data = e.data;
      if (!data.success) {
        resolve({
          verdict: 'Runtime Error',
          totalPassed: 0,
          totalCount: testCases.length,
          executionTimeMs: 0,
          compileError: data.error,
          testCaseResults: [],
        });
        return;
      }

      const caseResults: TestCaseResult[] = [];
      let allPassed = true;
      let firstFailureVerdict: Verdict = 'Accepted';

      interface WorkerRawCase {
        testCaseId: number;
        input: string;
        expected: unknown;
        actual: unknown;
        runtimeError: string | null;
        duration: number;
      }

      data.results.forEach((item: WorkerRawCase) => {
        let status: Verdict = 'Accepted';
        if (item.runtimeError) {
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
          input: item.input,
          expectedOutput: formatValue(item.expected),
          actualOutput: item.runtimeError ? 'Error' : formatValue(item.actual),
          executionTimeMs: item.duration,
          error: item.runtimeError || undefined,
          stdout: data.logs || undefined,
        });
      });

      resolve({
        verdict: allPassed ? 'Accepted' : firstFailureVerdict,
        totalPassed: caseResults.filter((c) => c.status === 'Accepted').length,
        totalCount: testCases.length,
        executionTimeMs: data.totalTime || 1,
        testCaseResults: caseResults,
        stdout: data.logs || undefined,
      });
    };

    worker.onerror = (err) => {
      if (hasResolved) return;
      hasResolved = true;
      clearTimeout(timer);
      cleanup();

      resolve({
        verdict: 'Runtime Error',
        totalPassed: 0,
        totalCount: testCases.length,
        executionTimeMs: 0,
        compileError: err.message || 'Worker runtime error',
        testCaseResults: [],
      });
    };

    worker.postMessage({ code, testCases, functionName });
  });
}
