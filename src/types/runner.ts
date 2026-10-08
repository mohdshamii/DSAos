export type Language = 'javascript' | 'python' | 'cpp' | 'java';

export type Verdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Runtime Error'
  | 'Compilation Error'
  | 'Pending';

export interface TestCaseResult {
  testCaseId: number;
  status: Verdict;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTimeMs: number;
  error?: string;
  stdout?: string;
}

export interface RunResult {
  verdict: Verdict;
  totalPassed: number;
  totalCount: number;
  executionTimeMs: number;
  memoryKb?: number;
  testCaseResults: TestCaseResult[];
  compileError?: string;
  stdout?: string;
}
