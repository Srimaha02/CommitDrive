// Practical Path Curriculum Data — CommitDrive
// Hands-on Modules: Git, Linux, and SQL
// Features: Practice Mode (24 Story Missions) + Mock Test Mode (30 Placement Questions with Diagnostic Evaluation)

export const practicalModules = [
  {
    id: 'git',
    name: 'Git Version Control',
    shortName: 'Git',
    tagline: 'Snapshots, DAG trees, branch isolation & conflict resolution',
    iconName: 'GitBranch',
    color: '#e8604a',
    promptUser: 'student',
    promptHost: 'commitdrive',
    promptDir: '~/codebase',
    promptBranch: 'main',
    totalMissions: 8,
    totalQuestions: 10,
    description: 'Master practical version control required for day-1 engineering: commit staging, feature branches, merge conflicts, stashing, and commit tree traversal.'
  },
  {
    id: 'linux',
    name: 'Linux Shell & Systems',
    shortName: 'Linux',
    tagline: 'Filesystem hierarchy, permissions bitmask, process signals & pipelines',
    iconName: 'Terminal',
    color: '#588b8b',
    promptUser: 'student',
    promptHost: 'commitdrive-prod',
    promptDir: '/var/www',
    promptBranch: null,
    totalMissions: 8,
    totalQuestions: 10,
    description: 'Build command-line fluency for backend deployment and debugging: file navigation, chmod permissions, ps/kill process management, and grep/awk/sed text pipelines.'
  },
  {
    id: 'sql',
    name: 'SQL Query Engineering',
    shortName: 'SQL',
    tagline: 'Relational data querying, multi-table joins, aggregation & window ranking',
    iconName: 'Database',
    color: '#f4a261',
    promptUser: 'mysql',
    promptHost: 'production_db',
    promptDir: 'analytics',
    promptBranch: null,
    totalMissions: 8,
    totalQuestions: 10,
    description: 'Write production-grade SQL queries tested in data & backend interviews: filtering, joins, aggregations with HAVING, subqueries, and analytical window functions.'
  }
];

// =============================================================================
// 1. PRACTICE MODE MISSIONS (8 Missions per Module = 24 Total Missions)
// =============================================================================
export const practicalMissions = {
  git: [
    {
      id: 'git-1',
      moduleId: 'git',
      order: 1,
      title: 'Mission 1: The Inaugural Repository',
      difficulty: 'Beginner',
      storyContext: 'You just joined CommitDrive as a junior software engineer. Your manager assigned you to create a brand-new repository for the authentication service. The folder currently has no version control initialized.',
      objective: 'Initialize a new Git repository in the current working directory.',
      targetCommand: 'git init',
      expectedRegexes: [
        /^\s*git\s+init(\s+\.)?\s*$/i
      ],
      initialLogs: [
        { type: 'info', text: 'CommitDrive Git Simulation Terminal v2.4' },
        { type: 'info', text: 'Current directory: /home/student/codebase (Empty Directory)' },
        { type: 'system', text: 'Objective: Initialize Git tracking in this directory.' }
      ],
      hints: [
        'Hint 1: Git uses a short four-letter command to initialize a repository.',
        'Hint 2: Type `git init` and press Enter to create the initial .git repository structure.'
      ],
      successOutput: [
        'Initialized empty Git repository in /home/student/codebase/.git/'
      ],
      explanationOnSuccess: 'Git created a hidden `.git/` directory in your project folder. This directory contains Git\'s object store (holding binary blobs, trees, and commits), configuration files, and reference pointers (`refs/heads/`). Your folder is now an active Git-tracked repository.'
    },
    {
      id: 'git-2',
      moduleId: 'git',
      order: 2,
      title: 'Mission 2: Inspecting & Staging Files',
      difficulty: 'Beginner',
      storyContext: 'You wrote the initial HTML template `index.html`. Before you can record it in a permanent commit, Git requires you to explicitly stage it into the staging index (preparation area).',
      objective: 'Check repository status, then stage `index.html` for commit.',
      targetCommand: 'git add index.html',
      expectedRegexes: [
        /^\s*git\s+add\s+(index\.html|\.)\s*$/i,
        /^\s*git\s+add\s+-A\s*$/i
      ],
      initialLogs: [
        { type: 'system', text: 'Untracked files present: index.html' },
        { type: 'info', text: 'Type `git status` to see untracked files, then stage `index.html`.' }
      ],
      hints: [
        'Hint 1: You can check the state of the working tree with `git status`.',
        'Hint 2: Use `git add index.html` (or `git add .`) to move the file from the working directory to the staging area.'
      ],
      successOutput: [
        'Changes to be committed:',
        '  (use "git rm --cached <file>..." to unstage)',
        '        new file:   index.html'
      ],
      explanationOnSuccess: '`git add` compressed `index.html` into a SHA-1 hashed blob object inside `.git/objects/` and recorded its file path and hash into the `.git/index` binary file. The file is now staged and ready for a permanent commit.'
    },
    {
      id: 'git-3',
      moduleId: 'git',
      order: 3,
      title: 'Mission 3: Crafting the First Commit',
      difficulty: 'Beginner',
      storyContext: 'Your `index.html` file is safely staged in the index. Now you must take a permanent snapshot of this state with a descriptive commit message.',
      objective: 'Commit your staged changes with the message "Initial commit".',
      targetCommand: 'git commit -m "Initial commit"',
      expectedRegexes: [
        /^\s*git\s+commit\s+(-m|--message)\s+["'][^"']+["']\s*$/i
      ],
      initialLogs: [
        { type: 'system', text: 'Staged file ready: index.html' },
        { type: 'info', text: 'Use `git commit -m "..."` to record your snapshot.' }
      ],
      hints: [
        'Hint 1: The `-m` flag allows you to provide an inline commit message.',
        'Hint 2: Run: `git commit -m "Initial commit"`.'
      ],
      successOutput: [
        '[main (root-commit) 4f8b2a1] Initial commit',
        ' 1 file changed, 25 insertions(+)',
        ' create mode 100644 index.html'
      ],
      explanationOnSuccess: 'Git created a Commit Object containing the author name, timestamp, a pointer to the root directory tree object, and your commit message. The `main` branch pointer was updated to point to this new commit hash (`4f8b2a1`).'
    },
    {
      id: 'git-4',
      moduleId: 'git',
      order: 4,
      title: 'Mission 4: Feature Branch Isolation',
      difficulty: 'Intermediate',
      storyContext: 'A senior developer asks you to implement user login. Production best practices dictate you should never write unreviewed code directly on the `main` branch. You must create an isolated branch named `feature-login`.',
      objective: 'Create and switch to a new branch named `feature-login`.',
      targetCommand: 'git checkout -b feature-login',
      expectedRegexes: [
        /^\s*git\s+(checkout\s+-b|switch\s+-c)\s+feature-login\s*$/i,
        /^\s*git\s+branch\s+feature-login\s*$/i
      ],
      initialLogs: [
        { type: 'info', text: 'Current branch: main' },
        { type: 'system', text: 'Objective: Create an isolated branch `feature-login`.' }
      ],
      hints: [
        'Hint 1: `git checkout -b <branch_name>` creates and switches to a branch in one step.',
        'Hint 2: Modern Git also supports `git switch -c feature-login`.'
      ],
      successOutput: [
        'Switched to a new branch \'feature-login\''
      ],
      explanationOnSuccess: 'A Git branch is simply a 41-byte text file inside `.git/refs/heads/feature-login` storing a 40-character commit hash pointer. Switching branches updated `.git/HEAD` to point to `refs/heads/feature-login`, creating an isolated line of development.'
    },
    {
      id: 'git-5',
      moduleId: 'git',
      order: 5,
      title: 'Mission 5: Inspecting Commit History',
      difficulty: 'Intermediate',
      storyContext: 'You committed your login code on the feature branch. Before opening a Pull Request, you want to review the commit history in a concise single-line format.',
      objective: 'Display a concise, one-line-per-commit history of the current branch.',
      targetCommand: 'git log --oneline',
      expectedRegexes: [
        /^\s*git\s+log(\s+--oneline|\s+--pretty=oneline|\s+-n\s+\d+)*\s*$/i
      ],
      initialLogs: [
        { type: 'info', text: 'Current branch: feature-login' },
        { type: 'system', text: 'Objective: Inspect recent commit history concisely.' }
      ],
      hints: [
        'Hint 1: `git log` displays commit history, but can be verbose.',
        'Hint 2: Add the flag `--oneline` to condense each commit to its short SHA and message: `git log --oneline`.'
      ],
      successOutput: [
        '7a19c03 (HEAD -> feature-login) Add user authentication endpoints',
        '4f8b2a1 (main) Initial commit'
      ],
      explanationOnSuccess: '`git log` traverses the directed acyclic graph (DAG) backward starting from the current `HEAD` commit through parent commit pointers, displaying abbreviated 7-character hashes and subject lines.'
    },
    {
      id: 'git-6',
      moduleId: 'git',
      order: 6,
      title: 'Mission 6: Merging Feature Timelines',
      difficulty: 'Intermediate',
      storyContext: 'Your login feature passed code review! Now you need to switch back to the `main` branch and merge `feature-login` into it.',
      objective: 'Merge the `feature-login` branch into `main`.',
      targetCommand: 'git merge feature-login',
      expectedRegexes: [
        /^\s*git\s+merge\s+feature-login\s*$/i
      ],
      initialLogs: [
        { type: 'info', text: 'Current branch: main' },
        { type: 'info', text: 'Branch `feature-login` is ready for integration.' }
      ],
      hints: [
        'Hint 1: Make sure you are on the `main` branch before merging.',
        'Hint 2: Run `git merge feature-login` to integrate changes.'
      ],
      successOutput: [
        'Updating 4f8b2a1..7a19c03',
        'Fast-forward',
        ' auth.js   | 42 ++++++++++++++++++++++++++++++++++++++++++',
        ' login.html| 18 ++++++++++++++++++',
        ' 2 files changed, 60 insertions(+)'
      ],
      explanationOnSuccess: 'Because `main` had no new commits since branching, Git performed a Fast-Forward Merge: it simply moved the `main` branch pointer forward to point directly to `7a19c03` without needing an extra merge commit.'
    },
    {
      id: 'git-7',
      moduleId: 'git',
      order: 7,
      title: 'Mission 7: The Emergency Stash',
      difficulty: 'Advanced',
      storyContext: 'You are in the middle of editing `dashboard.js` with uncommitted experimental code when an urgent production bug alert fires! You must quickly clear your working directory without losing your uncommitted work.',
      objective: 'Temporarily shelve (stash) your uncommitted changes.',
      targetCommand: 'git stash',
      expectedRegexes: [
        /^\s*git\s+stash(\s+push)?(\s+-m\s+["'][^"']+["'])?\s*$/i
      ],
      initialLogs: [
        { type: 'warning', text: 'Uncommitted changes detected in dashboard.js (dirty working tree)' },
        { type: 'system', text: 'Objective: Clean the working directory without losing uncommitted edits.' }
      ],
      hints: [
        'Hint 1: Git provides a specialized command to park modified tracked files on a temporary stack.',
        'Hint 2: Type `git stash` to save modified state and revert to a clean HEAD.'
      ],
      successOutput: [
        'Saved working directory and index state WIP on main: 7a19c03 Add user authentication endpoints',
        'Working tree clean: dashboard.js changes safely shelved in stash@{0}.'
      ],
      explanationOnSuccess: 'Git created two special commit objects in `.git/refs/stash`: one recording staged changes and another recording unstaged working tree changes. Your working directory was restored to a pristine `HEAD` state, allowing you to fix the production bug immediately.'
    },
    {
      id: 'git-8',
      moduleId: 'git',
      order: 8,
      title: 'Mission 8: Resolving a Merge Conflict',
      difficulty: 'Advanced',
      storyContext: 'Two developers edited the exact same line in `config.env` simultaneously. A merge attempt resulted in CONFLICT markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`). You resolved the conflict in the editor. Now stage the resolved file and conclude the merge commit.',
      objective: 'Stage `config.env` and finalize the merge commit.',
      targetCommand: 'git add config.env',
      expectedRegexes: [
        /^\s*git\s+add\s+(config\.env|\.)\s*$/i,
        /^\s*git\s+commit(\s+-m\s+["'][^"']+["'])?\s*$/i
      ],
      initialLogs: [
        { type: 'warning', text: 'CONFLICT (content): Merge conflict in config.env' },
        { type: 'info', text: 'Conflict markers have been manually resolved by the developer.' },
        { type: 'system', text: 'Objective: Stage `config.env` to mark conflict as resolved, then finalize.' }
      ],
      hints: [
        'Hint 1: To tell Git a conflict is resolved, stage the file using `git add config.env`.',
        'Hint 2: After staging, type `git commit` to complete the merge.'
      ],
      successOutput: [
        '[main c38f901] Merge branch \'hotfix-config\' into main',
        'Resolved conflict in config.env successfully.'
      ],
      explanationOnSuccess: 'Staging a conflicted file clears its conflict stages (Stage 1: Common ancestor, Stage 2: Target branch, Stage 3: Source branch) from the index. Committing writes a 3-Way Merge Commit with two parent hashes, recording how the conflicting timelines converged.'
    }
  ],

  linux: [
    {
      id: 'linux-1',
      moduleId: 'linux',
      order: 1,
      title: 'Mission 1: Exploring the Filesystem',
      difficulty: 'Beginner',
      storyContext: 'You just SSHed into a Linux production web server. Before making any changes, you need to verify where you are in the filesystem hierarchy and list all files, including hidden dotfiles.',
      objective: 'Print the current working directory, then list all files in detailed long format including hidden files.',
      targetCommand: 'ls -la',
      expectedRegexes: [
        /^\s*ls\s+(-la|-al|-l\s+-a|-a\s+-l)\s*$/i,
        /^\s*pwd\s*$/i
      ],
      initialLogs: [
        { type: 'info', text: 'Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)' },
        { type: 'system', text: 'Prompt: student@commitdrive-prod:/var/www$' },
        { type: 'info', text: 'Objective: Check current path (`pwd`) or list all files (`ls -la`).' }
      ],
      hints: [
        'Hint 1: `pwd` prints the working directory path.',
        'Hint 2: `ls -la` lists permissions, ownership, byte size, modification dates, and hidden files.'
      ],
      successOutput: [
        'total 24',
        'drwxr-xr-x 4 www-data www-data 4096 Sep 13 12:00 .',
        'drwxr-xr-x 3 root     root     4096 Sep 10 09:15 ..',
        '-rw-r--r-- 1 www-data www-data  220 Sep 13 11:30 .env',
        '-rw-r--r-- 1 www-data www-data 1024 Sep 13 10:45 index.html',
        'drwxr-xr-x 2 www-data www-data 4096 Sep 13 11:00 static'
      ],
      explanationOnSuccess: '`ls -la` executed a `getdents64` system call to read directory entries. The `-l` flag inspected each file\'s inode metadata for permissions and byte size, while `-a` instructed the shell not to filter out entries starting with a dot (`.` and `..`).'
    },
    {
      id: 'linux-2',
      moduleId: 'linux',
      order: 2,
      title: 'Mission 2: Navigating & Creating Directories',
      difficulty: 'Beginner',
      storyContext: 'You need to set up a new nested directory structure `deploy/releases/v1` for the production application without typing three separate mkdir commands.',
      objective: 'Create the nested directories `deploy/releases/v1` using a single command.',
      targetCommand: 'mkdir -p deploy/releases/v1',
      expectedRegexes: [
        /^\s*mkdir\s+-p\s+deploy\/releases\/v1\s*$/i
      ],
      initialLogs: [
        { type: 'system', text: 'Current directory: /var/www' },
        { type: 'info', text: 'Objective: Create parents as needed using the `-p` flag.' }
      ],
      hints: [
        'Hint 1: Standard `mkdir` fails if parent directories don\'t exist yet.',
        'Hint 2: Use the `-p` (parents) flag: `mkdir -p deploy/releases/v1`.'
      ],
      successOutput: [
        'Created directory tree: deploy/ -> releases/ -> v1/'
      ],
      explanationOnSuccess: 'The `-p` flag instructs the kernel to create intermediate parent directories (`deploy/` and `releases/`) if they do not already exist, rather than throwing an `ENOENT` (No such file or directory) error.'
    },
    {
      id: 'linux-3',
      moduleId: 'linux',
      order: 3,
      title: 'Mission 3: File Creation & Inspection',
      difficulty: 'Beginner',
      storyContext: 'You deployed a service, but it crashed. The application log `/var/log/syslog` contains 50,000 lines. You need to inspect just the first 5 lines to check the boot headers.',
      objective: 'Display only the first 5 lines of the log file `/var/log/syslog`.',
      targetCommand: 'head -n 5 /var/log/syslog',
      expectedRegexes: [
        /^\s*head(\s+-n\s*5|\s+-5)\s+(\/var\/log\/syslog|syslog)\s*$/i
      ],
      initialLogs: [
        { type: 'system', text: 'Log file exists: /var/log/syslog (50,000 lines)' },
        { type: 'info', text: 'Objective: Display the first 5 lines without freezing the terminal.' }
      ],
      hints: [
        'Hint 1: `cat` would dump all 50,000 lines. Use `head` instead.',
        'Hint 2: Specify the line count flag: `head -n 5 /var/log/syslog`.'
      ],
      successOutput: [
        'Sep 13 06:00:01 kernel: Linux version 6.8.0-31-generic (buildd@lcy02-amd64)',
        'Sep 13 06:00:01 kernel: Command line: BOOT_IMAGE=/vmlinuz-6.8.0-31 root=/dev/nvme0n1p2',
        'Sep 13 06:00:01 kernel: KERNEL supported cpus: Intel, AMD',
        'Sep 13 06:00:01 kernel: x86/fpu: Supporting XSAVE feature 0x001',
        'Sep 13 06:00:01 kernel: Memory: 16384MB available'
      ],
      explanationOnSuccess: '`head -n 5` opened the file, read bytes until encountering 5 newline (`\\n`) delimiters, printed the buffer to `stdout`, and immediately issued an exit call without wasting I/O reading the remaining 49,995 lines.'
    },
    {
      id: 'linux-4',
      moduleId: 'linux',
      order: 4,
      title: 'Mission 4: Permission Lockdown (chmod)',
      difficulty: 'Intermediate',
      storyContext: 'Security audit warning! An SSH private key file `id_rsa` has unsafe permissions (`644` - readable by everyone on the server). OpenSSH refuses to use private keys that are accessible by group or others.',
      objective: 'Change permissions of `id_rsa` so only the owner can read and write (octal 600).',
      targetCommand: 'chmod 600 id_rsa',
      expectedRegexes: [
        /^\s*chmod\s+(600|u=rw,go=)\s+id_rsa\s*$/i
      ],
      initialLogs: [
        { type: 'warning', text: 'Permissions of id_rsa are 0644 (Too open!)' },
        { type: 'system', text: 'Objective: Set permissions to Read/Write for owner ONLY (chmod 600).' }
      ],
      hints: [
        'Hint 1: In octal notation, Owner=4+2=6, Group=0, Others=0.',
        'Hint 2: Run: `chmod 600 id_rsa`.'
      ],
      successOutput: [
        '-rw------- 1 student student 2602 Sep 13 12:00 id_rsa (Locked down to owner only)'
      ],
      explanationOnSuccess: '`chmod` issued a `fchmodat` system call, updating the file\'s inode mode bitmask to `100600` in octal (`-rw-------`). The file owner retains Read (4) and Write (2) access, while group and other users have 0, satisfying OpenSSH security requirements.'
    },
    {
      id: 'linux-5',
      moduleId: 'linux',
      order: 5,
      title: 'Mission 5: Process Hunting & Termination',
      difficulty: 'Intermediate',
      storyContext: 'A rogue background crypto-miner process named `miner_daemon` with PID `4521` is hogging 99% CPU on the production server. You must forcibly terminate it immediately.',
      objective: 'Forcibly terminate process with PID 4521 using SIGKILL (signal 9).',
      targetCommand: 'kill -9 4521',
      expectedRegexes: [
        /^\s*kill\s+(-9|-SIGKILL|-s\s+KILL)\s+4521\s*$/i
      ],
      initialLogs: [
        { type: 'warning', text: 'CPU Alert: PID 4521 (miner_daemon) consuming 99.4% CPU' },
        { type: 'system', text: 'Objective: Send SIGKILL to PID 4521.' }
      ],
      hints: [
        'Hint 1: The `kill` command sends signals to processes by PID.',
        'Hint 2: Flag `-9` or `-SIGKILL` cannot be caught or ignored: `kill -9 4521`.'
      ],
      successOutput: [
        '[1]+  Killed                  ./miner_daemon (PID 4521 terminated)'
      ],
      explanationOnSuccess: '`kill` issued a `kill(4521, SIGKILL)` kernel system call. Unlike SIGTERM (signal 15), which can be caught or ignored by application code, SIGKILL is handled directly by the OS kernel scheduler, which immediately reclaims the process\'s page tables and memory.'
    },
    {
      id: 'linux-6',
      moduleId: 'linux',
      order: 6,
      title: 'Mission 6: Pipelines & Word Counts',
      difficulty: 'Intermediate',
      storyContext: 'The security team suspects a brute-force attack. You must count how many times HTTP 404 errors occurred in the web server access log `access.log`.',
      objective: 'Filter lines containing "404" in `access.log` and count the total number of occurrences using a pipe.',
      targetCommand: 'grep "404" access.log | wc -l',
      expectedRegexes: [
        /^\s*(grep\s+["']?404["']?\s+access\.log|cat\s+access\.log\s*\|\s*grep\s+["']?404["']?)\s*\|\s*wc\s+-l\s*$/i
      ],
      initialLogs: [
        { type: 'info', text: 'Log file: access.log (HTTP web server access log)' },
        { type: 'system', text: 'Objective: Pipe `grep "404"` into `wc -l`.' }
      ],
      hints: [
        'Hint 1: `grep "404" access.log` prints all matching error lines.',
        'Hint 2: Pipe the output to `wc -l` to count matching lines: `grep "404" access.log | wc -l`.'
      ],
      successOutput: [
        '142'
      ],
      explanationOnSuccess: 'The shell created a unidirectional IPC pipe buffer via the `pipe()` system call. `grep` wrote matching 404 lines to `stdout` (connected to the pipe\'s write end), and `wc` read directly from the pipe\'s read end to count newline characters, running in parallel across CPU cores.'
    },
    {
      id: 'linux-7',
      moduleId: 'linux',
      order: 7,
      title: 'Mission 7: I/O Redirection & Environment Variables',
      difficulty: 'Advanced',
      storyContext: 'You are writing an automated deployment script. You need to append the configuration line `API_PORT=8080` to the end of the existing file `.env` without overwriting its existing contents.',
      objective: 'Append `API_PORT=8080` to `.env` using append output redirection (`>>`).',
      targetCommand: 'echo "API_PORT=8080" >> .env',
      expectedRegexes: [
        /^\s*echo\s+["']?API_PORT=8080["']?\s*>>\s*\.env\s*$/i
      ],
      initialLogs: [
        { type: 'info', text: 'Target file: .env (Contains existing DB_HOST and DB_USER)' },
        { type: 'warning', text: 'Do NOT use single `>` as it would overwrite the entire file!' }
      ],
      hints: [
        'Hint 1: `>` overwrites files, while `>>` appends to the end.',
        'Hint 2: Run: `echo "API_PORT=8080" >> .env`.'
      ],
      successOutput: [
        '[Appended to .env]: API_PORT=8080'
      ],
      explanationOnSuccess: 'The shell opened `.env` with the `O_WRONLY | O_CREAT | O_APPEND` flags. The file pointer was positioned at the exact end of the file before writing, preserving the existing database credentials while adding the port configuration.'
    },
    {
      id: 'linux-8',
      moduleId: 'linux',
      order: 8,
      title: 'Mission 8: Multi-File Searching (grep & find)',
      difficulty: 'Advanced',
      storyContext: 'A legacy security vulnerability requires finding all occurrences of the word "PASSWORD_SALT" across all source files in the entire project directory tree.',
      objective: 'Search recursively for "PASSWORD_SALT" in all files in the current directory, showing line numbers.',
      targetCommand: 'grep -rn "PASSWORD_SALT" .',
      expectedRegexes: [
        /^\s*grep\s+(-rn|-rnI|-r\s+-n|-n\s+-r)\s+["']?PASSWORD_SALT["']?\s+(\.|\.\/)\s*$/i
      ],
      initialLogs: [
        { type: 'system', text: 'Current directory: /var/www (multi-level project tree)' },
        { type: 'info', text: 'Objective: Recursive search with line numbers (`grep -rn "PASSWORD_SALT" .`).' }
      ],
      hints: [
        'Hint 1: `-r` enables recursive directory traversal; `-n` prints line numbers.',
        'Hint 2: Execute: `grep -rn "PASSWORD_SALT" .`'
      ],
      successOutput: [
        './config/auth.js:14:const PASSWORD_SALT = "k9#mP$2@xL";',
        './services/crypto.js:82:    const hash = pbkdf2(pass, PASSWORD_SALT);'
      ],
      explanationOnSuccess: '`grep -rn` performed an iterative filesystem walk traversing subdirectories, opening each text file and scanning buffers using Boyer-Moore string matching. It printed the matching relative path, line number, and matching line content.'
    }
  ],

  sql: [
    {
      id: 'sql-1',
      moduleId: 'sql',
      order: 1,
      title: 'Mission 1: The Initial Query',
      difficulty: 'Beginner',
      storyContext: 'You are querying the production HR database table `employees`. Your manager needs a list of all active employees currently working in the \'Engineering\' department.',
      objective: 'Select all columns for employees whose department is \'Engineering\'.',
      targetCommand: "SELECT * FROM employees WHERE department = 'Engineering';",
      expectedRegexes: [
        /^\s*SELECT\s+\*\s+FROM\s+employees\s+WHERE\s+department\s*=\s*['"]Engineering['"]\s*;?\s*$/i
      ],
      initialLogs: [
        { type: 'info', text: 'Connected to MySQL 8.0 [production_db]' },
        { type: 'system', text: 'Schema: employees(emp_id, first_name, last_name, department, salary, hire_date)' },
        { type: 'info', text: 'Objective: Filter rows WHERE department = \'Engineering\'.' }
      ],
      hints: [
        'Hint 1: Use `SELECT * FROM employees` to query all columns.',
        'Hint 2: Add the filter: `WHERE department = \'Engineering\';`.'
      ],
      successOutput: [
        '+--------+------------+-----------+-------------+----------+------------+',
        '| emp_id | first_name | last_name | department  | salary   | hire_date  |',
        '+--------+------------+-----------+-------------+----------+------------+',
        '|    101 | Sarah      | Chen      | Engineering | 95000.00 | 2022-03-15 |',
        '|    104 | Alex       | Rivera    | Engineering | 88000.00 | 2023-01-10 |',
        '|    109 | Priya      | Patel     | Engineering | 102000.00| 2021-08-01 |',
        '+--------+------------+-----------+-------------+----------+------------+',
        '3 rows in set (0.002 sec)'
      ],
      explanationOnSuccess: 'The SQL query optimizer evaluated the `FROM employees` clause to load table metadata, applied the `WHERE department = \'Engineering\'` predicate during a sequential or index scan to filter tuples, and projected all requested columns via `SELECT *`.'
    },
    {
      id: 'sql-2',
      moduleId: 'sql',
      order: 2,
      title: 'Mission 2: Sorting & Slicing Output',
      difficulty: 'Beginner',
      storyContext: 'Executive leadership wants to inspect the top 3 highest-earning employees in the entire company to evaluate executive compensation brackets.',
      objective: 'Select `first_name`, `last_name`, and `salary` from `employees`, ordered by salary from highest to lowest, limited to 3 rows.',
      targetCommand: 'SELECT first_name, last_name, salary FROM employees ORDER BY salary DESC LIMIT 3;',
      expectedRegexes: [
        /^\s*SELECT\s+(first_name\s*,\s*last_name\s*,\s*salary|salary\s*,\s*first_name\s*,\s*last_name)\s+FROM\s+employees\s+ORDER\s+BY\s+salary\s+DESC\s+LIMIT\s+3\s*;?\s*$/i
      ],
      initialLogs: [
        { type: 'system', text: 'Table: employees (Contains 500 employee records)' },
        { type: 'info', text: 'Objective: Sort by salary descending and limit output to 3 records.' }
      ],
      hints: [
        'Hint 1: Specify the columns: `SELECT first_name, last_name, salary FROM employees`.',
        'Hint 2: Append `ORDER BY salary DESC LIMIT 3;`.'
      ],
      successOutput: [
        '+------------+-----------+-----------+',
        '| first_name | last_name | salary    |',
        '+------------+-----------+-----------+',
        '| Michael    | Scott     | 145000.00 |',
        '| Priya      | Patel     | 102000.00 |',
        '| Sarah      | Chen      |  95000.00 |',
        '+------------+-----------+-----------+',
        '3 rows in set (0.001 sec)'
      ],
      explanationOnSuccess: 'The query engine performed a quicksort (or top-N priority heap sort) on the `salary` column in descending (`DESC`) order, and cut off evaluation after the top 3 rows (`LIMIT 3`), avoiding full sorting overhead.'
    },
    {
      id: 'sql-3',
      moduleId: 'sql',
      order: 3,
      title: 'Mission 3: Aggregate Statistics with GROUP BY',
      difficulty: 'Beginner',
      storyContext: 'The finance department requests an audit of total payroll and headcounts across every department in the organization.',
      objective: 'Calculate the total number of employees (`COUNT(*)`) and average salary (`AVG(salary)`) grouped by department.',
      targetCommand: 'SELECT department, COUNT(*), AVG(salary) FROM employees GROUP BY department;',
      expectedRegexes: [
        /^\s*SELECT\s+department\s*,\s*(COUNT\(\*\)|COUNT\(emp_id\))\s*,\s*AVG\(salary\)\s+FROM\s+employees\s+GROUP\s+BY\s+department\s*;?\s*$/i,
        /^\s*SELECT\s+department\s*,\s*AVG\(salary\)\s*,\s*(COUNT\(\*\)|COUNT\(emp_id\))\s+FROM\s+employees\s+GROUP\s+BY\s+department\s*;?\s*$/i
      ],
      initialLogs: [
        { type: 'system', text: 'Objective: Aggregate employees by department using `GROUP BY`.' }
      ],
      hints: [
        'Hint 1: Group the rows using `GROUP BY department`.',
        'Hint 2: Query: `SELECT department, COUNT(*), AVG(salary) FROM employees GROUP BY department;`.'
      ],
      successOutput: [
        '+-------------+----------+--------------+',
        '| department  | COUNT(*) | AVG(salary)  |',
        '+-------------+----------+--------------+',
        '| Engineering |        3 | 95000.000000 |',
        '| Marketing   |        2 | 72000.000000 |',
        '| Sales       |        4 | 68500.000000 |',
        '+-------------+----------+--------------+',
        '3 rows in set (0.003 sec)'
      ],
      explanationOnSuccess: 'The database engine scanned the table, hashed each employee into memory buckets based on `department`, and evaluated the aggregate functions `COUNT(*)` and `AVG(salary)` on each bucket.'
    },
    {
      id: 'sql-4',
      moduleId: 'sql',
      order: 4,
      title: 'Mission 4: Filtering Groups with HAVING',
      difficulty: 'Intermediate',
      storyContext: 'Management wants to review only large departments. You must find all departments that have 3 or more employees and an average salary greater than $70,000.',
      objective: 'Filter aggregated department groups using the `HAVING` clause.',
      targetCommand: 'SELECT department, COUNT(*), AVG(salary) FROM employees GROUP BY department HAVING COUNT(*) >= 3 AND AVG(salary) > 70000;',
      expectedRegexes: [
        /^\s*SELECT\s+department\s*,\s*(COUNT\(\*\)|COUNT\(emp_id\))\s*,\s*AVG\(salary\)\s+FROM\s+employees\s+GROUP\s+BY\s+department\s+HAVING\s+(COUNT\(\*\)|COUNT\(emp_id\))\s*>=\s*3\s+AND\s+AVG\(salary\)\s*>\s*70000\s*;?\s*$/i
      ],
      initialLogs: [
        { type: 'warning', text: 'Common trap: Aggregate functions cannot be used in WHERE!' },
        { type: 'system', text: 'Objective: Filter grouped aggregate metrics using `HAVING`.' }
      ],
      hints: [
        'Hint 1: `WHERE` filters rows before grouping; `HAVING` filters groups after aggregation.',
        'Hint 2: Append: `HAVING COUNT(*) >= 3 AND AVG(salary) > 70000;`.'
      ],
      successOutput: [
        '+-------------+----------+--------------+',
        '| department  | COUNT(*) | AVG(salary)  |',
        '+-------------+----------+--------------+',
        '| Engineering |        3 | 95000.000000 |',
        '+-------------+----------+--------------+',
        '1 row in set (0.002 sec)'
      ],
      explanationOnSuccess: 'The `HAVING` clause was evaluated after `GROUP BY`. Departments like Sales (with 4 employees but average salary $68,500) were filtered out, leaving only Engineering.'
    },
    {
      id: 'sql-5',
      moduleId: 'sql',
      order: 5,
      title: 'Mission 5: The Relational Inner Join',
      difficulty: 'Intermediate',
      storyContext: 'Employee records store a numeric `dept_id` foreign key referencing the `departments` table. You need to produce a report showing each employee\'s `first_name`, `last_name`, and their human-readable `dept_name`.',
      objective: 'Perform an `INNER JOIN` between `employees` and `departments` on matching department IDs.',
      targetCommand: 'SELECT e.first_name, e.last_name, d.dept_name FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id;',
      expectedRegexes: [
        /^\s*SELECT\s+(e\.)?first_name\s*,\s*(e\.)?last_name\s*,\s*(d\.)?dept_name\s+FROM\s+employees(\s+e|\s+AS\s+e)?\s+(INNER\s+)?JOIN\s+departments(\s+d|\s+AS\s+d)?\s+ON\s+(e\.)?dept_id\s*=\s*(d\.)?dept_id\s*;?\s*$/i
      ],
      initialLogs: [
        { type: 'info', text: 'Tables: employees (with dept_id) and departments (dept_id, dept_name)' },
        { type: 'system', text: 'Objective: Join both tables on e.dept_id = d.dept_id.' }
      ],
      hints: [
        'Hint 1: Use table aliases `e` and `d` for clean syntax.',
        'Hint 2: `SELECT e.first_name, e.last_name, d.dept_name FROM employees e JOIN departments d ON e.dept_id = d.dept_id;`'
      ],
      successOutput: [
        '+------------+-----------+-----------------------+',
        '| first_name | last_name | dept_name             |',
        '+------------+-----------+-----------------------+',
        '| Sarah      | Chen      | Software Engineering  |',
        '| Alex       | Rivera    | Software Engineering  |',
        '| Marcus     | Vance     | Marketing & Growth    |',
        '+------------+-----------+-----------------------+',
        '3 rows in set (0.003 sec)'
      ],
      explanationOnSuccess: 'The query engine performed a Hash Join (or Nested Loop Index Join): it scanned `departments` to build an in-memory hash table of `dept_id`, and probed the table for each matching row in `employees`.'
    },
    {
      id: 'sql-6',
      moduleId: 'sql',
      order: 6,
      title: 'Mission 6: Outlier Subqueries',
      difficulty: 'Intermediate',
      storyContext: 'The compensation committee wants to reward high performers. You must find all employees whose individual salary is strictly greater than the overall company-wide average salary.',
      objective: 'Use a subquery in the `WHERE` clause to find employees earning above the company average.',
      targetCommand: 'SELECT first_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
      expectedRegexes: [
        /^\s*SELECT\s+first_name\s*,\s*salary\s+FROM\s+employees\s+WHERE\s+salary\s*>\s*\(\s*SELECT\s+AVG\(salary\)\s+FROM\s+employees\s*\)\s*;?\s*$/i
      ],
      initialLogs: [
        { type: 'system', text: 'Objective: Write a subquery calculating `(SELECT AVG(salary) FROM employees)`.' }
      ],
      hints: [
        'Hint 1: The inner query `(SELECT AVG(salary) FROM employees)` computes the single average benchmark.',
        'Hint 2: Filter with: `WHERE salary > (SELECT AVG(salary) FROM employees);`.'
      ],
      successOutput: [
        '+------------+-----------+',
        '| first_name | salary    |',
        '+------------+-----------+',
        '| Sarah      |  95000.00 |',
        '| Priya      | 102000.00 |',
        '| Michael    | 145000.00 |',
        '+------------+-----------+',
        '3 rows in set (0.002 sec)'
      ],
      explanationOnSuccess: 'Because the subquery is non-correlated, the database evaluated `SELECT AVG(salary)` exactly once (returning $81,200), substituted that scalar constant into the outer query, and filtered matching employees in a single linear pass.'
    },
    {
      id: 'sql-7',
      moduleId: 'sql',
      order: 7,
      title: 'Mission 7: Analytical Window Leaderboard',
      difficulty: 'Advanced',
      storyContext: 'Human Resources needs a departmental salary leaderboard. You must rank employees within their respective departments by salary from highest to lowest without collapsing rows.',
      objective: 'Use `DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)` to rank employees within their department.',
      targetCommand: 'SELECT first_name, dept_id, salary, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS salary_rank FROM employees;',
      expectedRegexes: [
        /^\s*SELECT\s+first_name\s*,\s*dept_id\s*,\s*salary\s*,\s*DENSE_RANK\(\)\s+OVER\s*\(\s*PARTITION\s+BY\s+dept_id\s+ORDER\s+BY\s+salary\s+DESC\s*\)(\s+AS\s+salary_rank|\s+salary_rank)?\s+FROM\s+employees\s*;?\s*$/i
      ],
      initialLogs: [
        { type: 'system', text: 'Objective: Apply a window partition without using GROUP BY.' }
      ],
      hints: [
        'Hint 1: Use the `DENSE_RANK() OVER (...)` window function.',
        'Hint 2: Partition by department and order by salary descending: `PARTITION BY dept_id ORDER BY salary DESC`.'
      ],
      successOutput: [
        '+------------+---------+-----------+-------------+',
        '| first_name | dept_id | salary    | salary_rank |',
        '+------------+---------+-----------+-------------+',
        '| Priya      |       1 | 102000.00 |           1 |',
        '| Sarah      |       1 |  95000.00 |           2 |',
        '| Alex       |       1 |  88000.00 |           3 |',
        '| Marcus     |       2 |  78000.00 |           1 |',
        '+------------+---------+-----------+-------------+',
        '4 rows in set (0.004 sec)'
      ],
      explanationOnSuccess: 'The window engine sorted each department partition into memory frames, assigning dense rankings (1, 2, 3...) based on salary while preserving individual employee row identities.'
    },
    {
      id: 'sql-8',
      moduleId: 'sql',
      order: 8,
      title: 'Mission 8: Transactional Record Modification',
      difficulty: 'Advanced',
      storyContext: 'Annual cost-of-living adjustments have been approved. You must apply a 10% raise (`salary * 1.10`) to all employees in department 2.',
      objective: 'Update `employees` table, setting `salary = salary * 1.10` where `dept_id = 2`.',
      targetCommand: 'UPDATE employees SET salary = salary * 1.10 WHERE dept_id = 2;',
      expectedRegexes: [
        /^\s*UPDATE\s+employees\s+SET\s+salary\s*=\s*(salary\s*\*\s*1\.10?|salary\s*\*\s*1\.1|salary\s*\+\s*salary\s*\*\s*0\.10?)\s+WHERE\s+dept_id\s*=\s*2\s*;?\s*$/i
      ],
      initialLogs: [
        { type: 'warning', text: 'Careful: Always ensure a WHERE clause is provided to avoid updating all rows!' },
        { type: 'system', text: 'Objective: Update salary by 10% for dept_id = 2.' }
      ],
      hints: [
        'Hint 1: The `UPDATE` statement sets column values matching a `WHERE` condition.',
        'Hint 2: Run: `UPDATE employees SET salary = salary * 1.10 WHERE dept_id = 2;`.'
      ],
      successOutput: [
        'Query OK, 2 rows affected (0.003 sec)',
        'Rows matched: 2  Changed: 2  Warnings: 0'
      ],
      explanationOnSuccess: 'The storage engine acquired exclusive row locks on matching records, wrote Undo log records (storing old salaries) and Redo log records (storing new salaries) into the Write-Ahead Log, and committed the changes to disk.'
    }
  ]
};

// =============================================================================
// 2. MOCK TEST QUESTIONS (10 Placement Questions per Module = 30 Total Questions)
// =============================================================================
export const mockTestQuestions = {
  git: [
    {
      id: 'gt-q1',
      category: 'Branching & Safety',
      question: 'You accidentally made and committed 2 commits directly on the `main` branch instead of creating your new feature branch `feature-auth`. You have NOT pushed to remote yet. What is the cleanest, non-destructive way to move those commits onto `feature-auth` and restore `main`?',
      options: [
        'Delete the repository and re-clone from GitHub.',
        'Run `git checkout -b feature-auth` to preserve commits on the new branch, switch back to `main`, and run `git reset --hard HEAD~2`.',
        'Run `git revert HEAD` twice on main and cherry-pick the commits.',
        'Force-push `main` to remote immediately.'
      ],
      correctIndex: 1,
      explanation: 'Since a Git branch is just a 41-byte pointer to a commit, running `git checkout -b feature-auth` captures the current commits under the new branch. Switching back to `main` and running `git reset --hard HEAD~2` resets the `main` pointer back to where it was before your commits, leaving your work safely on `feature-auth`.'
    },
    {
      id: 'gt-q2',
      category: 'Stash & Workflow',
      question: 'You are halfway through refactoring payment logic when an urgent production bug alert fires. You must switch to `hotfix-v1` immediately, but your current files are half-broken and will not compile. You do not want to make a messy commit. How should you safely park your uncommitted changes?',
      options: [
        'Run `git reset --hard` to discard all edits and restart from scratch tomorrow.',
        'Run `git stash save "wip payments"`, switch branches to fix the hotfix, and later run `git stash pop` to resume your work.',
        'Force checkout using `git checkout -f hotfix-v1`, overwriting modified files.',
        'Copy each file manually to your Desktop and run `git clean -fd`.'
      ],
      correctIndex: 1,
      explanation: '`git stash` snapshots both staged and unstaged modifications into a temporary commit stack in `.git/refs/stash` and cleans your working tree. Running `git stash pop` re-applies those exact modifications onto your working tree once you return to your branch.'
    },
    {
      id: 'gt-q3',
      category: 'Public Branches & Revert',
      question: 'A teammate merged and pushed commit `c84a12f` to the shared `production` branch, which immediately broke live checkout. Company policy strictly forbids force-pushing or rewriting shared Git history. How do you safely undo the broken commit?',
      options: [
        'Run `git reset --hard c84a12f~1` followed by `git push --force`.',
        'Run `git revert c84a12f` to create a new forward-moving commit that applies the exact inverse changes.',
        'Delete the commit from the GitHub web UI directly.',
        'Run `git rebase -i` to delete the commit from the branch history.'
      ],
      correctIndex: 1,
      explanation: '`git revert` is the industry standard for public shared branches. Instead of rewriting past commit history (which desynchronizes teammates\' local clones), it creates a brand-new commit that records the exact inverse diff of `c84a12f`, cleanly restoring the codebase.'
    },
    {
      id: 'gt-q4',
      category: 'Linear History & Rebase',
      question: 'Your team lead requires pull requests to maintain a clean, strictly linear commit history without diamond-shaped merge bubbles. Before opening a PR from your branch `feature-search` into `main`, how do you update your branch with the latest `main` commits?',
      options: [
        'Run `git merge main --no-ff` on your branch.',
        'Switch to `feature-search` and run `git rebase main` to replay your commits on top of the latest main tip.',
        'Run `git reset --soft main` and squash everything into one untracked diff.',
        'Run `git pull origin main --force`.'
      ],
      correctIndex: 1,
      explanation: '`git rebase main` temporarily stashes your feature branch commits, fast-forwards your branch to the tip of `main`, and then replays your commits one by one on top. This avoids diamond-shaped 3-way merge commits and keeps project history strictly linear.'
    },
    {
      id: 'gt-q5',
      category: 'Staging & Accidental Adds',
      question: 'While preparing a commit, you accidentally ran `git add .` and staged a private `.env` file containing production database credentials. The file has NOT been committed yet. Which command safely removes `.env` from the staging area without deleting your local changes?',
      options: [
        'git rm -f .env',
        'git restore --staged .env',
        'git clean -df',
        'git checkout -- .env'
      ],
      correctIndex: 1,
      explanation: '`git restore --staged .env` (or legacy `git reset HEAD .env`) clears the file from Git\'s index (staging area) while leaving your file contents in the working directory completely untouched.'
    },
    {
      id: 'gt-q6',
      category: 'Commit Amending',
      question: 'You just ran `git commit -m "feat: user profile upload"` but realized within seconds that you forgot to include `avatar-helper.js` and had a typo in the commit message. You haven\'t pushed yet. What command allows you to fix both issues in the same commit?',
      options: [
        'Run `git reset --hard HEAD~1` and re-type all your code.',
        'Stage the missing file with `git add avatar-helper.js`, then run `git commit --amend` to update both contents and commit message.',
        'Create a second commit named `fix: typo and helper` and merge them.',
        'Run `git rebase --abort`.'
      ],
      correctIndex: 1,
      explanation: '`git commit --amend` replaces the current tip commit with a new commit containing your staged index additions plus your updated message, preserving a clean single commit before pushing.'
    },
    {
      id: 'gt-q7',
      category: 'Merge Conflicts',
      question: 'During a merge, Git stops with `CONFLICT (content): Merge conflict in api.js`. You open `api.js`, edit the code to keep the correct lines, and delete the `<<<<<<< HEAD`, `=======`, and `>>>>>>>` markers. What must you do next to finalize the merge?',
      options: [
        'Run `git merge --abort` to let Git resolve it automatically.',
        'Run `git add api.js` to mark the conflict resolved, then run `git commit` (or `git merge --continue`) to record the merge commit.',
        'Run `git checkout api.js` to reload original files.',
        'Push immediately with `git push origin main`.'
      ],
      correctIndex: 1,
      explanation: 'In Git, staging a conflicted file with `git add <file>` tells the index that the conflict markers have been manually resolved. Running `git commit` with no arguments will prompt with Git\'s default merge commit message to complete the merge.'
    },
    {
      id: 'gt-q8',
      category: 'Emergency Recovery & Reflog',
      question: 'A junior engineer panicked during a rebase and executed `git reset --hard HEAD~3`, wiping out 3 days of unpushed commits. `git log` no longer shows any of those commits. How can you find and recover the lost commit SHA hashes?',
      options: [
        'Those commits are permanently wiped from the hard drive and cannot be recovered.',
        'Run `git reflog` to inspect the chronological log of every local HEAD pointer movement, find the commit SHA prior to the reset, and checkout or branch from it.',
        'Check the browser history on GitHub.',
        'Re-clone the repository from origin.'
      ],
      correctIndex: 1,
      explanation: 'Git rarely deletes committed data immediately. `git reflog` maintains an append-only journal of all HEAD updates in `.git/logs/HEAD`. Even after a hard reset, the commit objects remain in the repository for weeks until garbage collected (`git gc`).'
    },
    {
      id: 'gt-q9',
      category: 'Local File Discard',
      question: 'You were experimenting with performance tweaks in `queryEngine.js`. The experiment failed and the code is broken. You want to discard all local uncommitted modifications in `queryEngine.js` and restore it to the clean state of the last commit without touching any other files. Which command does this?',
      options: [
        'git clean -fd',
        'git restore queryEngine.js',
        'git rm queryEngine.js',
        'git reset --hard'
      ],
      correctIndex: 1,
      explanation: '`git restore queryEngine.js` (or legacy `git checkout -- queryEngine.js`) replaces your working tree copy of that single file with the pristine version from the index/HEAD without discarding changes in your other files.'
    },
    {
      id: 'gt-q10',
      category: 'Branch Housekeeping',
      question: 'You finished merging feature branch `feature-notifications` into `main` and pushed everything to remote. You want to delete your local copy of `feature-notifications` safely, ensuring Git warns you if there were any unmerged commits you might have overlooked. Which command should you use?',
      options: [
        'git branch -D feature-notifications (uppercase -D)',
        'git branch -d feature-notifications (lowercase -d)',
        'git push origin --delete feature-notifications',
        'git branch --wipe feature-notifications'
      ],
      correctIndex: 1,
      explanation: 'The lowercase `-d` flag is a safe delete: Git checks if the branch has been fully merged into its upstream branch or current HEAD before deleting. If unmerged commits exist, Git aborts with a warning. The uppercase `-D` forces deletion regardless of merge status.'
    }
  ],

  linux: [
    // --- 4 EASIER QUESTIONS (Basic Commands: ls, cd, chmod basics, simple grep) ---
    {
      id: 'lx-q1',
      category: 'Basic Navigation & Listing',
      question: 'You just cloned a full-stack project repository and opened your terminal in the project directory. You want to see all files in the folder, including essential hidden configuration files like `.env` and `.gitignore`, along with file permissions and sizes. Which basic command do you run?',
      options: [
        'cat .env',
        'ls -la',
        'pwd',
        'touch -a'
      ],
      correctIndex: 1,
      explanation: 'The standard `ls` command hides files that start with a dot (`.`). Adding `-a` shows all files including hidden dotfiles, and `-l` provides the long listing format showing permissions, ownership, file size, and modification timestamp.'
    },
    {
      id: 'lx-q2',
      category: 'Directory Navigation',
      question: 'You are working deeply nested inside `/var/www/ecommerce-api/src/controllers` and need to jump straight back to your current user\'s personal home directory (`~/`). Which simple command takes you directly home from anywhere in the filesystem?',
      options: [
        'cd',
        'back',
        'exit',
        'pwd ~'
      ],
      correctIndex: 0,
      explanation: 'In Linux shells, running `cd` without any arguments (or `cd ~`) automatically changes your working directory directly to your user\'s home directory (`$HOME`).'
    },
    {
      id: 'lx-q3',
      category: 'Permissions & Executables',
      question: 'You wrote a quick bash script named `start_dev.sh` to launch your frontend and backend servers together. When you type `./start_dev.sh`, the terminal responds with `-bash: ./start_dev.sh: Permission denied`. What simple command grants you execute permission on the script?',
      options: [
        'chmod +x start_dev.sh',
        'chown guest start_dev.sh',
        'run start_dev.sh',
        'touch start_dev.sh'
      ],
      correctIndex: 0,
      explanation: 'Newly created text files default to non-executable permissions (typically 0644). Adding the execute bit with `chmod +x <file>` tells the operating system kernel that the file can be executed as a program or script.'
    },
    {
      id: 'lx-q4',
      category: 'Text Searching',
      question: 'You need to verify whether a user named "devops" exists on your Ubuntu server by inspecting the system accounts file `/etc/passwd`. Which simple command searches for the line containing "devops" in that file?',
      options: [
        'grep "devops" /etc/passwd',
        'find "devops" /etc/passwd',
        'cat /etc/passwd --search "devops"',
        'ls /etc/passwd "devops"'
      ],
      correctIndex: 0,
      explanation: '`grep <pattern> <file>` is the standard tool to search plain-text files for lines matching a specified string or regular expression and print them to standard output.'
    },

    // --- 4 MEDIUM QUESTIONS (Pipes, Redirection, Find, Stream Viewing) ---
    {
      id: 'lx-q5',
      category: 'I/O Redirection',
      question: 'You are creating an automated deployment script and want to append a completion message "Deploy finished" to the end of `deploy.log` without overwriting the existing history of earlier deployments. Which command should you use?',
      options: [
        'echo "Deploy finished" > deploy.log',
        'echo "Deploy finished" >> deploy.log',
        'echo "Deploy finished" < deploy.log',
        'echo "Deploy finished" | deploy.log'
      ],
      correctIndex: 1,
      explanation: 'The single `>` operator truncates the file and overwrites it from the beginning. The double `>>` append operator opens the file with the `O_APPEND` flag, preserving existing contents and writing new data to the very end of the file.'
    },
    {
      id: 'lx-q6',
      category: 'Pipelines & Word Counts',
      question: 'You want to find out how many error entries were logged in `error.log` that contain the keyword "CRITICAL". Which command pipeline filters the matching lines and counts them?',
      options: [
        'grep "CRITICAL" error.log | wc -l',
        'grep "CRITICAL" error.log > wc -l',
        'count error.log "CRITICAL"',
        'cat error.log | find "CRITICAL"'
      ],
      correctIndex: 0,
      explanation: 'The pipe operator (`|`) connects the standard output of `grep "CRITICAL" error.log` directly to the standard input of `wc -l` (word count lines), which counts and displays the exact number of matching lines in the stream.'
    },
    {
      id: 'lx-q7',
      category: 'Filesystem Search',
      question: 'You are working in a large repository and forgot where the configuration file `database.yml` is saved. Which command searches the current directory and all subdirectories to find files named `database.yml`?',
      options: [
        'find . -name "database.yml"',
        'which database.yml',
        'ls -r database.yml',
        'whereis -f database.yml'
      ],
      correctIndex: 0,
      explanation: '`find <path> -name "<pattern>"` traverses directory inodes recursively starting from the given path (here `.` for current folder) and matches file names against the pattern.'
    },
    {
      id: 'lx-q8',
      category: 'Log Inspection & Streaming',
      question: 'Your local backend API is running, and you are about to trigger a login request from your browser. You want your terminal to stay open and display new log messages as they are actively written to `/var/log/app.log`. Which command does this?',
      options: [
        'cat /var/log/app.log',
        'tail -f /var/log/app.log',
        'head -n 20 /var/log/app.log',
        'less /var/log/app.log'
      ],
      correctIndex: 1,
      explanation: '`tail -f` (follow) prints the final lines of the file and keeps the file descriptor open, actively streaming newly appended lines to the terminal in real time until stopped with Ctrl+C.'
    },

    // --- 2 HARDER / SCENARIO-BASED QUESTIONS (Production Incident & Systems Depth) ---
    {
      id: 'lx-q9',
      category: 'Process Hunting & Signals',
      question: 'A runaway Node.js backend server crashed into an infinite CPU loop and hung on port 3000. Normal termination with `kill <PID>` (SIGTERM) was ignored by the process. What command instructs the Linux kernel to immediately and forcefully terminate process ID 4892 without allowing it to block?',
      options: [
        'kill -1 4892 (SIGHUP)',
        'kill -9 4892 (SIGKILL)',
        'kill -2 4892 (SIGINT)',
        'kill -15 4892 (SIGTERM)'
      ],
      correctIndex: 1,
      explanation: '`SIGKILL` (signal 9) is handled directly by the operating system kernel. Unlike `SIGTERM` (signal 15), user-space applications cannot catch, trap, or ignore `SIGKILL`; the kernel immediately halts the process and reclaims its memory and port.'
    },
    {
      id: 'lx-q10',
      category: 'Security & File Permissions',
      question: 'You downloaded your cloud instance\'s private key `deploy_key.pem` and attempted to connect using `ssh -i deploy_key.pem ubuntu@10.0.0.1`. The connection was rejected with: "Permissions 0644 for deploy_key.pem are too open. It is required that your private key files are NOT accessible by others." What command sets the exact secure permissions required?',
      options: [
        'chmod 777 deploy_key.pem',
        'chmod 600 deploy_key.pem',
        'chmod 755 deploy_key.pem',
        'chown root deploy_key.pem'
      ],
      correctIndex: 1,
      explanation: 'OpenSSH strictly enforces that private keys cannot be readable by other users on the system. `chmod 600` sets permissions to `rw-------` (read and write for the file owner only, with zero permissions for group or others).'
    }
  ],

  sql: [
    {
      id: 'sq-q1',
      category: 'Query Basics & Filtering',
      question: 'Why does `SELECT * FROM users WHERE email = NULL;` fail to return rows where the email is null?',
      options: [
        'The query produces a fatal syntax error.',
        'In SQL, comparisons with NULL using `=` evaluate to UNKNOWN (Three-Valued Logic); you must use `IS NULL`.',
        'NULL values can only be filtered in the HAVING clause.',
        'MySQL does not allow columns to contain NULL.'
      ],
      correctIndex: 1,
      explanation: 'SQL implements Three-Valued Logic (`TRUE`, `FALSE`, `UNKNOWN`). NULL represents missing information, so `col = NULL` evaluates to `UNKNOWN`. You must use `IS NULL` or `IS NOT NULL`.'
    },
    {
      id: 'sq-q2',
      category: 'Joins & Set Operations',
      question: 'What is the result of a `LEFT OUTER JOIN` between Table A (10 rows) and Table B (5 matching rows)?',
      options: [
        'Exactly 5 rows.',
        'At least 10 rows (all rows from Table A, with NULLs for unmatched columns in Table B).',
        'An empty result set.',
        '15 rows.'
      ],
      correctIndex: 1,
      explanation: 'A `LEFT OUTER JOIN` preserves all rows from the left table (Table A). Matching rows display Table B attributes; non-matching rows display NULLs for Table B attributes.'
    },
    {
      id: 'sq-q3',
      category: 'Grouping & Aggregates',
      question: 'Which SQL clause is used to filter aggregated group results (e.g. groups where average salary exceeds $50,000)?',
      options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
      correctIndex: 1,
      explanation: '`WHERE` filters individual rows before grouping and cannot contain aggregate functions. `HAVING` filters group buckets after aggregation.'
    },
    {
      id: 'sq-q4',
      category: 'Subqueries & Window Functions',
      question: 'How does `DENSE_RANK()` handle tied values compared to `RANK()`?',
      options: [
        '`DENSE_RANK()` breaks ties randomly; `RANK()` does not.',
        '`DENSE_RANK()` does not skip subsequent rank numbers after ties (1, 2, 2, 3); `RANK()` skips numbers (1, 2, 2, 4).',
        '`DENSE_RANK()` can only be used with numeric columns.',
        '`DENSE_RANK()` produces fractional values.'
      ],
      correctIndex: 1,
      explanation: 'When ties occur, `RANK()` assigns tied rows the same rank but leaves gaps in subsequent numbering (e.g. 1, 2, 2, 4). `DENSE_RANK()` leaves no gaps (1, 2, 2, 3).'
    },
    {
      id: 'sq-q5',
      category: 'Database Normalization',
      question: 'A table violates Second Normal Form (2NF) if it contains which of the following?',
      options: [
        'Transitive dependencies between non-prime attributes.',
        'Partial functional dependencies on a composite candidate key.',
        'Multi-valued array attributes.',
        'Foreign keys referencing non-existent primary keys.'
      ],
      correctIndex: 1,
      explanation: '2NF requires the table to be in 1NF and contain No Partial Dependencies (every non-prime attribute must depend on the whole candidate key, not a proper subset).'
    },
    {
      id: 'sq-q6',
      category: 'Transactions & ACID',
      question: 'Which SQL Transaction Isolation Level prevents Dirty Reads but still allows Non-Repeatable Reads and Phantom Reads?',
      options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
      correctIndex: 1,
      explanation: '`Read Committed` guarantees that transactions only read committed data (preventing dirty reads). However, if another transaction updates or inserts rows and commits, subsequent queries will see the changes.'
    },
    {
      id: 'sq-q7',
      category: 'Indexing & Performance',
      question: 'Why are B+ Tree indexes preferred over Hash Indexes in relational database engines?',
      options: [
        'B+ Trees are faster for point lookups than Hash Indexes.',
        'B+ Trees efficiently support range queries (`BETWEEN`, `>`, `<`) and sorting (`ORDER BY`) because leaf nodes form a sorted linked list.',
        'Hash indexes consume 100 times more disk space.',
        'B+ Trees do not require disk storage.'
      ],
      correctIndex: 1,
      explanation: 'Hash indexes provide $O(1)$ point lookups (`WHERE id = 5`) but cannot perform range queries (`WHERE age BETWEEN 20 AND 30`) or prefix searches. B+ Trees support both point lookups and range scans.'
    },
    {
      id: 'sq-q8',
      category: 'Data Modification & DDL',
      question: 'What is the primary operational difference between `TRUNCATE TABLE` and `DELETE FROM table;`?',
      options: [
        '`TRUNCATE` can be filtered with a WHERE clause; `DELETE` cannot.',
        '`TRUNCATE` is a fast DDL command that deallocates data pages without logging individual row deletions; `DELETE` is a DML command that logs row-by-row.',
        '`TRUNCATE` drops the schema definition from the catalog.',
        '`DELETE` cannot be rolled back inside a transaction.'
      ],
      correctIndex: 1,
      explanation: '`TRUNCATE` deallocates table storage pages at the file level as a DDL operation, resetting auto-increment counters with minimal transaction logging. `DELETE` is a row-by-row DML operation.'
    },
    {
      id: 'sq-q9',
      category: 'Subqueries & CTEs',
      question: 'What is a Correlated Subquery?',
      options: [
        'A subquery that runs exactly once and stores results in a temporary table.',
        'A subquery that references columns from the outer query table, requiring evaluation for each candidate row in the outer query.',
        'A subquery containing a UNION operator.',
        'A recursive CTE traversing a graph tree.'
      ],
      correctIndex: 1,
      explanation: 'A Correlated Subquery references columns from the outer query in its `WHERE` or `HAVING` clause, meaning the inner query must re-evaluate repeatedly for each candidate row processed by the outer query.'
    },
    {
      id: 'sq-q10',
      category: 'Constraints & Integrity',
      question: 'What action does the foreign key constraint `ON DELETE RESTRICT` enforce?',
      options: [
        'Automatically deletes child rows when the parent row is deleted.',
        'Blocks and aborts deletion of the parent row if any child rows currently reference it.',
        'Sets foreign key values in child rows to NULL.',
        'Archives deleted parent rows to an audit table.'
      ],
      correctIndex: 1,
      explanation: '`ON DELETE RESTRICT` (and `NO ACTION`) prevents the deletion of a parent record if any foreign key in a referencing child table references that parent, preserving referential integrity.'
    }
  ]
};

// =============================================================================
// 3. HELPER FUNCTIONS
// =============================================================================

export function getPracticalModule(moduleId) {
  return practicalModules.find(m => m.id === moduleId) || practicalModules[0];
}

export function getModuleMissions(moduleId) {
  return practicalMissions[moduleId] || [];
}

export function getModuleQuestions(moduleId) {
  return mockTestQuestions[moduleId] || [];
}

export function calculateModuleProgress(moduleId, completedMissions = []) {
  const missions = getModuleMissions(moduleId);
  if (!missions.length) return 0;
  const completed = missions.filter(m => completedMissions.includes(m.id)).length;
  return Math.round((completed / missions.length) * 100);
}

// Evaluates a Mock Test submission and delivers a structured Weak-Area Diagnostic Report
export function evaluateMockTest(moduleId, userAnswers = {}) {
  const questions = getModuleQuestions(moduleId);
  let correctCount = 0;
  const categoryStats = {}; // { [category]: { total: 0, correct: 0 } }
  const questionReviews = [];

  questions.forEach((q, idx) => {
    const selectedOption = userAnswers[q.id];
    const isCorrect = selectedOption === q.correctIndex;
    if (isCorrect) correctCount++;

    // Track category breakdown
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { total: 0, correct: 0 };
    }
    categoryStats[q.category].total += 1;
    if (isCorrect) categoryStats[q.category].correct += 1;

    questionReviews.push({
      questionNumber: idx + 1,
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options,
      selectedOption,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    });
  });

  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= 70;

  // Compute weak areas (< 70% accuracy)
  const weakAreas = [];
  const strongAreas = [];

  Object.entries(categoryStats).forEach(([category, stats]) => {
    const catPercent = Math.round((stats.correct / stats.total) * 100);
    const item = {
      category,
      correct: stats.correct,
      total: stats.total,
      percentage: catPercent,
      isWeak: catPercent < 70
    };
    if (catPercent < 70) {
      weakAreas.push(item);
    } else {
      strongAreas.push(item);
    }
  });

  return {
    moduleId,
    score: correctCount,
    totalQuestions,
    percentage,
    passed,
    categoryStats,
    weakAreas,
    strongAreas,
    questionReviews
  };
}

// =============================================================================
// 3. INTERVIEW VIVA SCENARIOS (Attached to Practice Missions)
// =============================================================================
export const practicalVivaMap = {
  // Git Vivas
  'git-1': {
    question: 'What is inside the .git directory created by git init, and what happens if you delete it?',
    answer: 'The .git folder contains the entire object database (blobs, trees, commits, tags), branch references (refs/heads/), HEAD pointer, configuration, and the staging index. Deleting .git erases all commit history and branches, reverting the folder to an untracked directory while leaving working files intact.'
  },
  'git-2': {
    question: 'What is the exact difference between the Working Directory, the Staging Area, and the Repository?',
    answer: 'The Working Directory contains editable files on disk. The Staging Area (.git/index) is a binary preparation cache storing hashed blob references ready to be snapshot. The Repository (.git/objects) contains immutable commit snapshots in a directed acyclic graph.'
  },
  'git-3': {
    question: 'What are the 4 core object types stored inside .git/objects?',
    answer: '1. Blob (raw file data without filename), 2. Tree (directory structure, file modes, and names mapped to blobs), 3. Commit (author, committer, timestamp, parent pointer, root tree pointer), and 4. Annotated Tag (named permanent release pointer).'
  },
  'git-4': {
    question: 'Why is creating a Git branch instantaneous (O(1)) compared to SVN or CVS?',
    answer: 'A Git branch is not a directory copy; it is literally a 41-byte text file in .git/refs/heads/<name> containing a 40-character SHA hash pointer to a commit. Creating a branch simply writes 41 bytes to disk.'
  },
  'git-5': {
    question: 'How does git reflog differ from git log?',
    answer: 'git log only displays commits reachable in the current branch history. git reflog records every single movement of the HEAD pointer (including resets, deleted branches, and rebases). It acts as a safety net to recover lost work for 30 days.'
  },
  'git-6': {
    question: 'What is the difference between a Fast-Forward merge and a Three-Way merge?',
    answer: 'A Fast-Forward merge occurs when no commits diverge on the base branch; Git simply slides the pointer forward with zero merge commits. A Three-Way merge compares the common ancestor with both branch tips to generate a new merge commit with two parents.'
  },
  'git-7': {
    question: 'Where does Git store stashed changes, and does git stash save untracked files by default?',
    answer: 'Stashes are stored in .git/refs/stash as commit-like DAG objects. By default, untracked files are ignored unless you supply the -u or --include-untracked flag.'
  },
  'git-8': {
    question: 'Why is git rebase dangerous on shared public branches (Golden Rule of Rebasing)?',
    answer: 'Rebasing rewrites commit hashes by recalculating their parent pointers. If pushed to a shared public branch, other collaborators will have divergent commit histories and will suffer merge conflicts.'
  },

  // Linux Vivas
  'linux-1': {
    question: 'What do the permission bits -rwxr-xr-x mean in octal notation?',
    answer: 'Octal 755. User: 7 (rwx = 4+2+1), Group: 5 (r-x = 4+1), Others: 5 (r-x = 4+1). A leading hyphen indicates a regular file; a leading "d" indicates a directory.'
  },
  'linux-2': {
    question: 'Why is the -p flag in mkdir -p mandatory in CI/CD and production deployment scripts?',
    answer: 'mkdir -p creates all necessary parent directories recursively and does NOT error out if the directory already exists, guaranteeing idempotent script execution.'
  },
  'linux-3': {
    question: 'How do you search for an exact word in all log files under /var/log recursively with line numbers?',
    answer: 'Use `grep -rnw "/var/log" -e "FATAL"`. -r traverses subdirectories recursively, -n outputs line numbers, and -w ensures exact whole-word matching.'
  },
  'linux-4': {
    question: 'What is the difference between chmod and chown?',
    answer: 'chmod modifies read/write/execute access permissions bitmasks. chown changes the user ownership and group ownership of the file or directory.'
  },
  'linux-5': {
    question: 'What is the difference between kill -15 (SIGTERM) and kill -9 (SIGKILL)?',
    answer: 'SIGTERM (15) politely requests a process to terminate, allowing it to execute cleanup handlers (closing open DB sockets, flushing disk buffers). SIGKILL (9) is handled directly by the kernel and terminates the process immediately; it cannot be caught or blocked.'
  },
  'linux-6': {
    question: 'If df -h reports 100% disk usage, but du -sh shows only 40%, what is happening?',
    answer: 'A running process is holding open file descriptors to large deleted files (removed with rm). The directory link was unlinked, but disk blocks cannot be freed by the filesystem until the process releases the FD or is killed (identified via `lsof +L1`).'
  },
  'linux-7': {
    question: 'Why does Unix separate tar from gzip?',
    answer: 'Tar archives multiple files into a single sequential file stream without compressing. Gzip compresses a single stream. Following Unix philosophy (do one thing well), `tar -czvf` combines archive packing and gzip compression.'
  },
  'linux-8': {
    question: 'Why has ss replaced netstat on modern Linux servers?',
    answer: 'netstat parses /proc/net which causes massive kernel lock contention on servers with tens of thousands of active connections. ss uses netlink kernel sockets to dump socket states in O(1) time.'
  },

  // SQL Vivas
  'sql-1': {
    question: 'What is the logical order of query execution in a SQL database engine?',
    answer: 'FROM & JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT / OFFSET.'
  },
  'sql-2': {
    question: 'Why is LIMIT 1000000, 10 slow for pagination, and how do you optimize it?',
    answer: 'The database engine must scan 1,000,010 rows from the B+ tree and discard the first million. Optimize with Keyset Pagination (Seek Method): `WHERE id > last_seen_id ORDER BY id LIMIT 10`.'
  },
  'sql-3': {
    question: 'Can you use aggregate functions like COUNT(*) inside a WHERE clause?',
    answer: 'No. WHERE filters individual table rows BEFORE grouping takes place. Aggregates only exist after grouping, so aggregate filters must reside in the HAVING clause.'
  },
  'sql-4': {
    question: 'What are the 3 core join algorithms database engines use under the hood?',
    answer: '1. Nested Loop Join (efficient for small tables or index lookups), 2. Hash Join (efficient for large unsorted equi-joins), and 3. Merge Join (most efficient when both inputs are pre-sorted).'
  },
  'sql-5': {
    question: 'How do you find records in Table A that have no corresponding match in Table B?',
    answer: 'Use an Anti-Join: `SELECT a.* FROM a LEFT JOIN b ON a.id = b.a_id WHERE b.a_id IS NULL;` or `WHERE NOT EXISTS (...)`.'
  },
  'sql-6': {
    question: 'What is the difference between a Common Table Expression (WITH CTE) and a Temporary Table?',
    answer: 'A CTE exists solely within the scope of a single query and is often inlined by the optimizer. A Temporary Table is written to temp storage, supports indexing, and persists for the entire session.'
  },
  'sql-7': {
    question: 'What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?',
    answer: 'For duplicate values (100, 100, 90): ROW_NUMBER gives (1, 2, 3), RANK gives (1, 1, 3 - skips rank 2), and DENSE_RANK gives (1, 1, 2 - no rank gaps).'
  },
  'sql-8': {
    question: 'What is the difference between a Clustered Index and a Non-Clustered (Secondary) Index?',
    answer: 'A Clustered Index dictates the physical ordering of rows on disk (leaf nodes ARE the table rows; only 1 per table). A Non-Clustered Index leaf node contains the indexed columns and a pointer back to the clustered index key.'
  }
};

// Enrich all practical missions with interviewViva data
Object.keys(practicalMissions).forEach(modKey => {
  practicalMissions[modKey] = practicalMissions[modKey].map(mission => ({
    ...mission,
    interviewViva: practicalVivaMap[mission.id] || {
      question: `How does the ${mission.targetCommand.split(' ')[0]} command impact production environments?`,
      answer: mission.explanationOnSuccess
    }
  }));
});

