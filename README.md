# DSA OS — LeetCode Coding Practice Platform

A 100% static, client-side LeetCode-style coding practice platform built for software engineering placements and interview preparation. Preloaded with the **250 LeetCode MNC placement problems** across 17 topics, featuring in-browser code execution, a Monaco editor, a two-pane resizable workspace, study roadmaps, and detailed analytics.

Live URL: [https://mohdshamii.github.io/DSAos/](https://mohdshamii.github.io/DSAos/)

---

## Features

- **LeetCode Dark Theme UI**: Pixel-close LeetCode aesthetic (`#1a1a1a` background, `#282828` panels, `#ffa116` accent, Inter font, custom dark scrollbars).
- **Core Problem Workspace (`/problem/:slug`)**:
  - Resizable two-pane layout powered by `react-resizable-panels`.
  - Left pane with tabs: **Description** (markdown, examples, constraints, hints accordion, topic/company tags), **Editorial/Solution**, **Submissions**, and **Notes**.
  - Right pane with top **Monaco Editor** (lazy-loaded, syntax highlighting, font size options, reset code, fullscreen) and bottom **Testcase & Result Console**.
  - Keyboard shortcuts: `Ctrl+'` or `Cmd+'` to Run, `Ctrl+Enter` or `Cmd+Enter` to Submit.
  - Confetti animation on **Accepted** verdict.
- **In-Browser Code Execution (No Backend Required)**:
  - **JavaScript**: Executes in an isolated Web Worker with strict timeout enforcement (`Time Limit Exceeded` protection).
  - **Python**: Lazy-loaded Pyodide Web Worker running Python directly in WebAssembly inside the browser, capturing `stdout` and enforcing timeouts.
  - **C++ / Java**: Connects to the public Judge0 CE API (`https://ce.judge0.com`), with customizable endpoints and API keys in Settings.
  - **Test Harness**: Automatically parses arguments, executes user code, and validates outputs using recursive deep equality.
- **Problem List (`/problems`)**:
  - Filterable by difficulty (Easy, Medium, Hard), topic tags (17 topics), company tags (FAANG / MNCs), and status (Todo, Attempted, Solved).
  - Search input with instant filtering and table sorting (ID, Title, Acceptance %, Difficulty, Frequency).
  - "Pick Random" problem button.
  - Daily Challenge banner and circular progress ring with difficulty breakdown.
- **Study Roadmaps & Lists (`/lists`)**:
  - Preset study lists: **Blind 75**, **Top Interview 150**, and **MNC 250 Placement Pack**.
  - Custom study lists: create personal collections, add/remove problems, and track progress.
- **Dashboard & Analytics (`/dashboard`)**:
  - 365-day GitHub-style streak heatmap.
  - Solved-by-difficulty interactive donut chart (`recharts`).
  - Topic-wise progress bars across all 17 algorithmic topics.
  - Interactive daily focus goals.
  - Recent submissions history with runtime and testcase scores.
- **Command Palette (`cmdk`)**:
  - Press `Ctrl+K` or `Cmd+K` anywhere to search problems, jump to lists, toggle themes, or pick random problems.
- **Storage & Backup (`/settings`)**:
  - Offline-first storage using `localStorage` and `IndexedDB` (`idb-keyval`).
  - One-click JSON progress export and import for seamless cross-device migration.

---

## Tech Stack

| Component | Technology |
|---|---|
| **Framework** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Lucide Icons |
| **Routing** | `react-router-dom` with `HashRouter` (GitHub Pages compatible) |
| **State & Storage** | Zustand, `localStorage`, `idb-keyval` (IndexedDB) |
| **Code Editor** | `@monaco-editor/react` (lazy-loaded) |
| **Split Panes** | `react-resizable-panels` |
| **Markdown** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Palette & Search**| `cmdk` (Ctrl+K palette) |
| **Charts** | `recharts` |
| **Animations** | `canvas-confetti` |

---

## File Tree

```
DSAos/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD
├── public/
│   └── favicon.svg                 # Platform icon
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DailyGoals.tsx
│   │   │   ├── DifficultyDonut.tsx
│   │   │   ├── RecentSubmissions.tsx
│   │   │   ├── StreakHeatmap.tsx
│   │   │   └── TopicProgress.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── problems/
│   │   │   ├── DailyProblemBanner.tsx
│   │   │   ├── ProblemFilters.tsx
│   │   │   ├── ProblemTable.tsx
│   │   │   └── ProgressStats.tsx
│   │   ├── ui/
│   │   │   ├── CommandPalette.tsx
│   │   │   └── Toast.tsx
│   │   └── workspace/
│   │       ├── CodeEditor.tsx
│   │       ├── ConsolePanel.tsx
│   │       ├── DescriptionTab.tsx
│   │       ├── EditorialTab.tsx
│   │       ├── NotesTab.tsx
│   │       ├── SubmissionsTab.tsx
│   │       ├── Timer.tsx
│   │       └── WorkspaceHeader.tsx
│   ├── data/
│   │   ├── problems.json           # All 250 MNC LeetCode problems
│   │   └── studyLists.json         # Preset lists (Blind 75, Top 150, MNC 250)
│   ├── lib/
│   │   ├── runner/
│   │   │   ├── harness.ts          # Deep equality and test harness
│   │   │   ├── index.ts            # Unified runner dispatcher
│   │   │   ├── javascriptRunner.ts # Web Worker runner with TLE watchdog
│   │   │   ├── judge0Runner.ts     # Public Judge0 CE client
│   │   │   └── pythonRunner.ts     # Pyodide Web Worker runner
│   │   ├── storage.ts              # LocalStorage & IndexedDB helpers
│   │   └── utils.ts                # Tailwind merge and formatting helpers
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── ProblemsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── StudyListsPage.tsx
│   │   └── WorkspacePage.tsx
│   ├── store/
│   │   ├── useProblemStore.ts      # Problems, user progress, submissions
│   │   ├── useSettingsStore.ts     # Appearance, themes, compiler settings
│   │   └── useStudyListStore.ts    # Preset & custom study lists
│   ├── types/
│   │   ├── problem.ts
│   │   ├── runner.ts
│   │   └── user.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── scripts/
│   └── generateProblems.js         # Problem generation and validator script
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Local Setup & Development

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22)
- npm 9+

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/mohdshamii/DSAos.git
   cd DSAos
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173/DSAos/](http://localhost:5173/DSAos/) in your browser.

5. Build for production:
   ```bash
   npm run build
   ```

---

## How to Add or Customize Problems

All problem data is stored statically in `/src/data/problems.json`. To add a new problem or modify an existing one, adhere to the schema below:

```json
{
  "id": 251,
  "lcNumber": 200,
  "title": "Number of Islands",
  "slug": "number-of-islands",
  "difficulty": "Medium",
  "topics": ["Graphs", "DFS", "BFS"],
  "companies": ["Amazon", "Google", "Bloomberg"],
  "description": "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
  "examples": [
    {
      "input": "grid = [[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"0\",\"0\",\"0\"]]",
      "output": "1",
      "explanation": "All 1s connect into a single island."
    }
  ],
  "constraints": [
    "m == grid.length",
    "n == grid[i].length",
    "1 <= m, n <= 300"
  ],
  "hints": [
    "Use a traversal (DFS or BFS) to visit all reachable 1s whenever an unvisited land cell is found."
  ],
  "starterCode": {
    "javascript": "function numIslands(grid) {\n  // Write your code here\n}",
    "python": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass",
    "cpp": "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        return 0;\n    }\n};",
    "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}"
  },
  "testCases": [
    {
      "input": { "grid": [["1","1","0"],["0","1","0"],["0","0","0"]] },
      "expected": 1
    }
  ],
  "solution": "### Approach: Breadth/Depth First Search\n...",
  "frequency": 92,
  "acceptance": "57.8%"
}
```

### Adding New Questions:
1. Append the new problem object to `/src/data/problems.json`.
2. Ensure `slug` matches the URL pattern (e.g. `number-of-islands`).
3. If you want the question included in a specific study list, add its `id` to `/src/data/studyLists.json`.
4. Run `npm run build` to verify type safety and bundle integrity.

---

## Deploying to GitHub Pages

The repository is configured for automated deployment via GitHub Actions:

1. Push your changes to the `main` branch:
   ```bash
   git add .
   git commit -m "Rebuild DSA OS with LeetCode practice platform"
   git push origin main
   ```
2. In your GitHub repository:
   - Navigate to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. The `.github/workflows/deploy.yml` workflow will automatically:
   - Check out the repository
   - Install dependencies via `npm ci`
   - Build the static bundle (`npm run build`)
   - Deploy the `./dist` folder to GitHub Pages at `https://mohdshamii.github.io/DSAos/`.

---

## Sensible Architectural Choices Noted

1. **HashRouter over BrowserRouter**:
   - Standard static hosting on GitHub Pages returns 404 for arbitrary subpaths on direct refresh (e.g. `/problem/two-sum`). Using `HashRouter` (`/#/problem/two-sum`) ensures 100% static routing compatibility without needing 404 hack redirects.
2. **Client-Side Workers with Watchdog**:
   - In-browser execution ensures users can practice without incurring server costs or backend maintenance.
   - Both JavaScript and Python workers have timeouts (3.5s and 10s respectively) and are forcefully terminated (`worker.terminate()`) if user code enters an infinite loop.
3. **Graceful Judge0 CE Fallback**:
   - C++ and Java use the public Judge0 CE server. If the public instance experiences rate limits or CORS restrictions, the platform surfaces a helpful diagnostic message and allows configuring a custom endpoint or API key in Settings.
4. **Offline Resilience with IndexedDB**:
   - While `localStorage` is used for fast synchronous reads, large solution histories and drafts are mirrored to IndexedDB using `idb-keyval` to prevent storage quota exhaustion.
