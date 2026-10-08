export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus = 'todo' | 'attempted' | 'solved';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string | Record<string, unknown> | unknown[];
  expected: unknown;
  isHidden?: boolean;
  label?: string;
}

export interface StarterCode {
  python: string;
  javascript: string;
  cpp: string;
  java: string;
}

export interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topics: string[];
  companies: string[];
  description: string;
  examples: Example[];
  constraints: string[];
  hints: string[];
  starterCode: StarterCode;
  testCases: TestCase[];
  solution: string;
  frequency: number;
  acceptance?: string;
  lcNumber?: number;
}
