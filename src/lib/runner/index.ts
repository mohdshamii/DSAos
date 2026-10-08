import { Language, RunResult } from '../../types/runner';
import { TestCase } from '../../types/problem';
import { runJavaScript } from './javascriptRunner';
import { runPython } from './pythonRunner';
import { runJudge0 } from './judge0Runner';

export interface ExecuteOptions {
  language: Language;
  code: string;
  testCases: TestCase[];
  functionName: string;
  judge0Endpoint?: string;
  judge0ApiKey?: string;
}

export async function executeCode(options: ExecuteOptions): Promise<RunResult> {
  const { language, code, testCases, functionName, judge0Endpoint, judge0ApiKey } = options;

  switch (language) {
    case 'javascript':
      return runJavaScript(code, testCases, functionName);
    case 'python':
      return runPython(code, testCases, functionName);
    case 'cpp':
    case 'java':
      return runJudge0(language, code, testCases, judge0Endpoint, judge0ApiKey);
    default:
      throw new Error(`Unsupported execution language: ${language}`);
  }
}
