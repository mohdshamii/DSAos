import { TestCase } from '../../types/problem';
import { RunResult, TestCaseResult, Verdict } from '../../types/runner';
import { formatValue } from './harness';

const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
};

export async function runJudge0(
  language: 'cpp' | 'java',
  sourceCode: string,
  testCases: TestCase[],
  endpoint: string = 'https://ce.judge0.com',
  apiKey?: string
): Promise<RunResult> {
  const languageId = JUDGE0_LANGUAGE_IDS[language];
  if (!languageId) {
    return {
      verdict: 'Runtime Error',
      totalPassed: 0,
      totalCount: testCases.length,
      executionTimeMs: 0,
      compileError: `Unsupported language: ${language}`,
      testCaseResults: [],
    };
  }

  const caseResults: TestCaseResult[] = [];
  let totalTime = 0;
  let allPassed = true;
  let firstVerdict: Verdict = 'Accepted';

  // Format single input string for Judge0 stdin
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const stdin = typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['X-Auth-Token'] = apiKey;
      headers['X-RapidAPI-Key'] = apiKey;
    }

    const cleanEndpoint = endpoint.replace(/\/+$/, '');
    const url = `${cleanEndpoint}/submissions?base64_encoded=false&wait=true`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: languageId,
          stdin: stdin,
          expected_output: formatValue(tc.expected),
        }),
      });

      if (!response.ok) {
        throw new Error(`Judge0 returned HTTP ${response.status}: ${response.statusText}`);
      }

      const resData = await response.json();
      const statusId = resData.status?.id;
      const statusDesc = resData.status?.description || 'Unknown';
      const timeMs = Math.round((parseFloat(resData.time) || 0) * 1000);
      totalTime += timeMs;

      let verdict: Verdict = 'Accepted';
      let error = undefined;

      if (statusId === 3) {
        // Accepted
        verdict = 'Accepted';
      } else if (statusId === 4) {
        // Wrong Answer
        verdict = 'Wrong Answer';
        if (allPassed) firstVerdict = 'Wrong Answer';
        allPassed = false;
      } else if (statusId === 5) {
        // Time Limit Exceeded
        verdict = 'Time Limit Exceeded';
        if (allPassed) firstVerdict = 'Time Limit Exceeded';
        allPassed = false;
      } else if (statusId === 6) {
        // Compilation Error
        verdict = 'Compilation Error';
        error = resData.compile_output;
        if (allPassed) firstVerdict = 'Compilation Error';
        allPassed = false;
      } else {
        // Runtime error or other
        verdict = 'Runtime Error';
        error = resData.stderr || statusDesc;
        if (allPassed) firstVerdict = 'Runtime Error';
        allPassed = false;
      }

      caseResults.push({
        testCaseId: i + 1,
        status: verdict,
        input: stdin,
        expectedOutput: formatValue(tc.expected),
        actualOutput: resData.stdout ? resData.stdout.trim() : error || '',
        executionTimeMs: timeMs,
        error,
        stdout: resData.stdout || undefined,
      });

      // Break on compilation error
      if (verdict === 'Compilation Error') {
        return {
          verdict: 'Compilation Error',
          totalPassed: 0,
          totalCount: testCases.length,
          executionTimeMs: totalTime,
          compileError: error,
          testCaseResults: caseResults,
        };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return {
        verdict: 'Runtime Error',
        totalPassed: 0,
        totalCount: testCases.length,
        executionTimeMs: 0,
        compileError: `Judge0 CE public API connection issue: ${errMsg}.\n\nNote: The public Judge0 API endpoint (${endpoint}) may be subject to rate limits or network blocking. You can customize the Judge0 endpoint in Settings, or run your code in JavaScript or Python which run 100% locally in your browser.`,
        testCaseResults: [],
      };
    }
  }

  return {
    verdict: allPassed ? 'Accepted' : firstVerdict,
    totalPassed: caseResults.filter((c) => c.status === 'Accepted').length,
    totalCount: testCases.length,
    executionTimeMs: totalTime,
    testCaseResults: caseResults,
  };
}
