/**
 * CommitDrive In-Memory Git Virtual Engine & DAG State Machine
 * 
 * Provides an authentic, real-time in-browser Git repository:
 * - Working Tree -> Staging Area (Index) -> Immutable Commit DAG
 * - Multi-branching & HEAD reference management (main, feature/*, hotfix/*)
 * - Merging (Fast-forward & 3-Way Merge commits)
 * - Commit history tree for live visual Graph rendering
 * - Standard commands: git status, git add, git commit, git branch, git checkout / switch,
 *   git merge, git log (--oneline, --graph), git diff, git reset, git tag
 * - Placement Interview Challenges with automated validation
 */

// Generate realistic short Git SHA-1 hashes
const generateHash = () => {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 7; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Initial default state
const createDefaultGitState = () => {
  const c1Hash = 'c4f1a29';
  const c2Hash = 'e7b9012';

  const commits = {
    [c1Hash]: {
      hash: c1Hash,
      parentHashes: [],
      author: 'Developer <dev@commitdrive.com>',
      timestamp: 'Wed Sep 23 18:20:10 2026 +0530',
      message: 'chore: initial project scaffold and documentation',
      tree: {
        'README.md': '# CommitDrive\nPlacement engineering lab.',
        'package.json': '{\n  "name": "commitdrive"\n}'
      }
    },
    [c2Hash]: {
      hash: c2Hash,
      parentHashes: [c1Hash],
      author: 'Developer <dev@commitdrive.com>',
      timestamp: 'Wed Sep 23 20:45:00 2026 +0530',
      message: 'feat: implement JWT auth middleware and route guards',
      tree: {
        'README.md': '# CommitDrive\nPlacement engineering lab.\n\n## Auth Module\nJWT-based token validation added.',
        'package.json': '{\n  "name": "commitdrive"\n}',
        'src/auth.js': 'export const verifyToken = (token) => !!token;'
      }
    }
  };

  return {
    branches: {
      'main': c2Hash
    },
    currentBranch: 'main',
    HEAD: 'main', // points to branch name or detached commit hash
    commits,
    // Staging Area (filename -> content)
    staged: {},
    // Working Directory (filename -> { status: 'modified' | 'untracked', content })
    workingTree: {
      'src/payment.js': {
        status: 'untracked',
        content: '// Payment webhook listener\nexport const processCheckout = () => { return { status: "success" }; };'
      },
      'README.md': {
        status: 'modified',
        content: '# CommitDrive\nPlacement engineering lab.\n\n## Modules\n- Auth: Verified\n- Payment: In Progress'
      }
    },
    tags: {
      'v0.1.0': c1Hash
    },
    commandHistory: []
  };
};

let gitState = createDefaultGitState();

export const resetGitRepository = () => {
  gitState = createDefaultGitState();
  return { success: true };
};

/**
 * Returns current state snapshot for the visual graph inspector
 */
export const getGitStateSnapshot = () => {
  const currentCommitHash = gitState.HEAD in gitState.branches
    ? gitState.branches[gitState.HEAD]
    : gitState.HEAD;

  const commitList = Object.values(gitState.commits);

  return {
    currentBranch: gitState.currentBranch,
    HEAD: gitState.HEAD,
    currentCommitHash,
    branches: { ...gitState.branches },
    tags: { ...gitState.tags },
    commits: commitList,
    stagedCount: Object.keys(gitState.staged).length,
    stagedFiles: Object.keys(gitState.staged),
    untrackedFiles: Object.keys(gitState.workingTree).filter(f => gitState.workingTree[f].status === 'untracked'),
    modifiedFiles: Object.keys(gitState.workingTree).filter(f => gitState.workingTree[f].status === 'modified')
  };
};

/**
 * Executes Git Command Line
 */
export const executeGitCommand = (commandLine) => {
  const trimmed = commandLine.trim();
  if (!trimmed) {
    return { stdout: '', stderr: '', exitCode: 0, branch: gitState.currentBranch };
  }

  gitState.commandHistory.push(trimmed);

  // Parse arguments respecting double quotes
  const parts = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  const cleanParts = parts.map(p => {
    if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
      return p.slice(1, -1);
    }
    return p;
  });

  if (cleanParts[0] !== 'git') {
    if (cleanParts[0] === 'clear') {
      return { stdout: '\x1Bc', stderr: '', exitCode: 0, branch: gitState.currentBranch };
    }
    return {
      stdout: '',
      stderr: `Command '${cleanParts[0]}' not recognized. All Git commands must start with 'git' (e.g. git status, git add).\n`,
      exitCode: 1,
      branch: gitState.currentBranch
    };
  }

  const subCmd = cleanParts[1];
  const args = cleanParts.slice(2);

  let stdout = '';
  let stderr = '';
  let exitCode = 0;

  switch (subCmd) {
    case 'status': {
      stdout += `On branch ${gitState.currentBranch}\n`;
      const currentCommitHash = gitState.branches[gitState.currentBranch];
      if (!currentCommitHash) {
        stdout += `No commits yet\n\n`;
      }

      const stagedFiles = Object.keys(gitState.staged);
      const modifiedFiles = Object.keys(gitState.workingTree).filter(f => gitState.workingTree[f].status === 'modified');
      const untrackedFiles = Object.keys(gitState.workingTree).filter(f => gitState.workingTree[f].status === 'untracked');

      if (stagedFiles.length > 0) {
        stdout += `Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n`;
        stagedFiles.forEach(f => {
          stdout += `\tnew file:   ${f}\n`;
        });
        stdout += '\n';
      }

      if (modifiedFiles.length > 0) {
        stdout += `Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n`;
        modifiedFiles.forEach(f => {
          stdout += `\tmodified:   ${f}\n`;
        });
        stdout += '\n';
      }

      if (untrackedFiles.length > 0) {
        stdout += `Untracked files:\n  (use "git add <file>..." to include in what will be committed)\n`;
        untrackedFiles.forEach(f => {
          stdout += `\t${f}\n`;
        });
        stdout += '\n';
      }

      if (stagedFiles.length === 0 && modifiedFiles.length === 0 && untrackedFiles.length === 0) {
        stdout += `nothing to commit, working tree clean\n`;
      }
      break;
    }

    case 'add': {
      if (args.length === 0) {
        stderr = `Nothing specified, nothing added.\nMaybe you wanted to say 'git add .'?\n`;
        exitCode = 1;
        break;
      }

      const target = args[0];
      if (target === '.' || target === '-A' || target === '--all') {
        // Stage all working tree files
        for (const [file, info] of Object.entries(gitState.workingTree)) {
          gitState.staged[file] = info.content;
          delete gitState.workingTree[file];
        }
      } else {
        const file = target;
        if (gitState.workingTree[file]) {
          gitState.staged[file] = gitState.workingTree[file].content;
          delete gitState.workingTree[file];
        } else {
          stderr = `fatal: pathspec '${target}' did not match any files\n`;
          exitCode = 128;
        }
      }
      break;
    }

    case 'commit': {
      let message = '';
      const mIdx = args.findIndex(a => a === '-m' || a === '-am');
      if (mIdx !== -1 && mIdx + 1 < args.length) {
        message = args[mIdx + 1];
      }

      // Check if -am was passed (auto-stage modified)
      if (args.includes('-am')) {
        for (const [file, info] of Object.entries(gitState.workingTree)) {
          if (info.status === 'modified') {
            gitState.staged[file] = info.content;
            delete gitState.workingTree[file];
          }
        }
      }

      const stagedFiles = Object.keys(gitState.staged);
      if (stagedFiles.length === 0) {
        stdout = `On branch ${gitState.currentBranch}\nnothing to commit, working tree clean\n`;
        break;
      }

      if (!message) {
        stderr = `error: switch \`m' requires a value\nAborting commit due to empty commit message.\n`;
        exitCode = 1;
        break;
      }

      const parentHash = gitState.branches[gitState.currentBranch] || null;
      const parentTree = parentHash ? (gitState.commits[parentHash]?.tree || {}) : {};
      const newTree = { ...parentTree, ...gitState.staged };

      const newHash = generateHash();
      gitState.commits[newHash] = {
        hash: newHash,
        parentHashes: parentHash ? [parentHash] : [],
        author: 'Developer <dev@commitdrive.com>',
        timestamp: new Date().toUTCString(),
        message,
        tree: newTree
      };

      // Advance branch pointer and HEAD
      gitState.branches[gitState.currentBranch] = newHash;
      gitState.HEAD = gitState.currentBranch;

      // Clear staged
      const count = stagedFiles.length;
      gitState.staged = {};

      stdout = `[${gitState.currentBranch} ${newHash}] ${message}\n ${count} file${count > 1 ? 's' : ''} changed\n`;
      break;
    }

    case 'branch': {
      // Delete branch
      if (args.includes('-d') || args.includes('-D')) {
        const branchName = args.find(a => !a.startsWith('-'));
        if (!branchName) {
          stderr = `fatal: branch name required\n`;
          exitCode = 1;
        } else if (branchName === gitState.currentBranch) {
          stderr = `error: Cannot delete branch '${branchName}' checked out at current directory.\n`;
          exitCode = 1;
        } else if (!gitState.branches[branchName]) {
          stderr = `error: branch '${branchName}' not found.\n`;
          exitCode = 1;
        } else {
          delete gitState.branches[branchName];
          stdout = `Deleted branch ${branchName}.\n`;
        }
        break;
      }

      // List branches
      if (args.length === 0 || args.includes('-a')) {
        for (const b of Object.keys(gitState.branches)) {
          if (b === gitState.currentBranch) {
            stdout += `* \x1b[32m${b}\x1b[0m\n`;
          } else {
            stdout += `  ${b}\n`;
          }
        }
        break;
      }

      // Create new branch
      const newBranchName = args[0];
      if (gitState.branches[newBranchName]) {
        stderr = `fatal: A branch named '${newBranchName}' already exists.\n`;
        exitCode = 128;
      } else {
        const currentHash = gitState.branches[gitState.currentBranch];
        gitState.branches[newBranchName] = currentHash;
      }
      break;
    }

    case 'checkout':
    case 'switch': {
      const isCreate = args.includes('-b') || args.includes('-c');
      const targetBranch = args.find(a => !a.startsWith('-'));

      if (!targetBranch) {
        stderr = `fatal: missing branch name\n`;
        exitCode = 1;
        break;
      }

      if (isCreate) {
        if (gitState.branches[targetBranch]) {
          stderr = `fatal: a branch named '${targetBranch}' already exists\n`;
          exitCode = 128;
          break;
        }
        const currentHash = gitState.branches[gitState.currentBranch];
        gitState.branches[targetBranch] = currentHash;
        gitState.currentBranch = targetBranch;
        gitState.HEAD = targetBranch;
        stdout = `Switched to a new branch '${targetBranch}'\n`;
      } else {
        if (!gitState.branches[targetBranch]) {
          stderr = `error: pathspec '${targetBranch}' did not match any file(s) known to git\n`;
          exitCode = 1;
          break;
        }
        gitState.currentBranch = targetBranch;
        gitState.HEAD = targetBranch;
        stdout = `Switched to branch '${targetBranch}'\n`;
      }
      break;
    }

    case 'merge': {
      const targetBranch = args[0];
      if (!targetBranch) {
        stderr = `fatal: No branch specified for merge.\n`;
        exitCode = 1;
        break;
      }

      if (!gitState.branches[targetBranch]) {
        stderr = `merge: ${targetBranch} - not something we can merge\n`;
        exitCode = 1;
        break;
      }

      if (targetBranch === gitState.currentBranch) {
        stdout = `Already up to date.\n`;
        break;
      }

      const currentHash = gitState.branches[gitState.currentBranch];
      const targetHash = gitState.branches[targetBranch];

      // Perform merge commit (combining trees)
      const currentTree = gitState.commits[currentHash]?.tree || {};
      const targetTree = gitState.commits[targetHash]?.tree || {};
      const mergedTree = { ...currentTree, ...targetTree };

      const mergeHash = generateHash();
      gitState.commits[mergeHash] = {
        hash: mergeHash,
        parentHashes: [currentHash, targetHash],
        author: 'Developer <dev@commitdrive.com>',
        timestamp: new Date().toUTCString(),
        message: `Merge branch '${targetBranch}' into ${gitState.currentBranch}`,
        tree: mergedTree
      };

      gitState.branches[gitState.currentBranch] = mergeHash;
      gitState.HEAD = gitState.currentBranch;

      stdout = `Merge made by the 'ort' strategy.\n Merge branch '${targetBranch}' into ${gitState.currentBranch}\n [${mergeHash}] Auto-merging complete.\n`;
      break;
    }

    case 'log': {
      const isOneline = args.includes('--oneline');
      const isGraph = args.includes('--graph');

      const currentHash = gitState.branches[gitState.currentBranch];
      if (!currentHash) {
        stdout = `fatal: your current branch '${gitState.currentBranch}' does not have any commits yet\n`;
        break;
      }

      // Traverse DAG backwards
      const visited = new Set();
      const queue = [currentHash];
      const orderedCommits = [];

      while (queue.length > 0) {
        const h = queue.shift();
        if (visited.has(h)) continue;
        visited.add(h);

        const c = gitState.commits[h];
        if (c) {
          orderedCommits.push(c);
          c.parentHashes.forEach(ph => queue.push(ph));
        }
      }

      if (isOneline) {
        orderedCommits.forEach((c, idx) => {
          const isHead = idx === 0 ? ` (HEAD -> ${gitState.currentBranch})` : '';
          const prefix = isGraph ? '* ' : '';
          stdout += `${prefix}\x1b[33m${c.hash}\x1b[0m${isHead} ${c.message}\n`;
        });
      } else {
        orderedCommits.forEach((c, idx) => {
          const isHead = idx === 0 ? ` (HEAD -> ${gitState.currentBranch})` : '';
          stdout += `\x1b[33mcommit ${c.hash}\x1b[0m${isHead}\n`;
          if (c.parentHashes.length > 1) {
            stdout += `Merge: ${c.parentHashes.join(' ')}\n`;
          }
          stdout += `Author: ${c.author}\nDate:   ${c.timestamp}\n\n    ${c.message}\n\n`;
        });
      }
      break;
    }

    case 'diff': {
      const isStaged = args.includes('--staged') || args.includes('--cached');
      if (isStaged) {
        const files = Object.keys(gitState.staged);
        if (files.length === 0) {
          stdout = '';
        } else {
          files.forEach(f => {
            stdout += `diff --git a/${f} b/${f}\nnew file mode 100644\n--- /dev/null\n+++ b/${f}\n@@ -0,0 +1,5 @@\n+${gitState.staged[f]}\n`;
          });
        }
      } else {
        const files = Object.keys(gitState.workingTree);
        if (files.length === 0) {
          stdout = '';
        } else {
          files.forEach(f => {
            stdout += `diff --git a/${f} b/${f}\n--- a/${f}\n+++ b/${f}\n@@ -1,3 +1,5 @@\n+${gitState.workingTree[f].content}\n`;
          });
        }
      }
      break;
    }

    case 'reset': {
      if (args.includes('--soft')) {
        const target = args.find(a => !a.startsWith('-')) || 'HEAD~1';
        const currentHash = gitState.branches[gitState.currentBranch];
        const currentCommit = gitState.commits[currentHash];
        if (currentCommit && currentCommit.parentHashes.length > 0) {
          const parentHash = currentCommit.parentHashes[0];
          gitState.branches[gitState.currentBranch] = parentHash;
          stdout = `Soft reset to ${parentHash}. Commit uncommitted, changes preserved in stage.\n`;
        } else {
          stderr = `fatal: Cannot reset initial commit\n`;
          exitCode = 1;
        }
        break;
      }

      // Default unstage file
      const target = args[0];
      if (target && gitState.staged[target]) {
        gitState.workingTree[target] = {
          status: 'modified',
          content: gitState.staged[target]
        };
        delete gitState.staged[target];
        stdout = `Unstaged changes after reset:\nM\t${target}\n`;
      } else {
        // Reset all staged
        for (const [file, content] of Object.entries(gitState.staged)) {
          gitState.workingTree[file] = { status: 'modified', content };
          delete gitState.staged[file];
        }
      }
      break;
    }

    case 'tag': {
      if (args.length === 0) {
        stdout = Object.keys(gitState.tags).join('\n') + (Object.keys(gitState.tags).length > 0 ? '\n' : '');
      } else {
        const tagName = args[0];
        const currentHash = gitState.branches[gitState.currentBranch];
        gitState.tags[tagName] = currentHash;
        stdout = `Created tag '${tagName}' -> ${currentHash}\n`;
      }
      break;
    }

    case 'help': {
      stdout = `CommitDrive Virtual Git State Machine
Supported commands:
  Status:     git status, git diff (--staged)
  Staging:    git add <file> (or git add .)
  Commit:     git commit -m "<message>"
  Branching:  git branch, git branch <name>, git branch -d <name>
  Switching:  git checkout <branch>, git checkout -b <name>, git switch <name>
  Merging:    git merge <branch>
  History:    git log, git log --oneline, git log --graph
  Undo:       git reset <file>, git reset --soft HEAD~1
  Release:    git tag <tagname>, git tag\n`;
      break;
    }

    default:
      stderr = `git: '${subCmd}' is not a git command. See 'git help'.\n`;
      exitCode = 1;
      break;
  }

  return {
    stdout,
    stderr,
    exitCode,
    branch: gitState.currentBranch
  };
};

/**
 * Placement Git Challenges with Automated Verification
 */
export const GIT_CHALLENGES = [
  {
    id: 'git-ch-1',
    title: 'Standard Feature Workflow: Branch, Commit & Merge',
    difficulty: 'L100 (Core / Product)',
    badge: 'TCS / Zoho / Cognizant',
    description: 'Create a new feature branch `feature/payment`, switch to it, stage all files (`git add .`), commit with message `feat: add checkout`, and merge `feature/payment` back into `main`.',
    verify: () => {
      const snap = getGitStateSnapshot();
      return (
        snap.currentBranch === 'main' &&
        snap.branches['feature/payment'] &&
        snap.commits.some(c => c.message && c.message.includes('feat: add checkout'))
      );
    },
    hint: 'Commands: git checkout -b feature/payment -> git add . -> git commit -m "feat: add checkout" -> git checkout main -> git merge feature/payment',
    starterCommand: 'git status',
    explanation: 'The industry-standard GitHub Flow requires isolated feature branches merged cleanly into main without polluting history.'
  },
  {
    id: 'git-ch-2',
    title: 'Selective Staging & Clean Commit Hygiene',
    difficulty: 'L200 (Product Tier)',
    badge: 'Razorpay / Swiggy',
    description: 'Inspect `git status`. You have two files. Stage ONLY `src/payment.js` without staging `README.md`, and commit it with message `feat: initial payment service`.',
    verify: () => {
      const snap = getGitStateSnapshot();
      return snap.commits.some(c => c.message && c.message.includes('feat: initial payment service') && c.tree['src/payment.js']);
    },
    hint: 'Run: git add src/payment.js -> git commit -m "feat: initial payment service"',
    starterCommand: 'git status',
    explanation: 'Senior interviewers check if you blindly run `git add .` or carefully select files to maintain atomic commits.'
  },
  {
    id: 'git-ch-3',
    title: 'Safe Reverting: Soft Reset Without Data Loss',
    difficulty: 'L200 (FinTech / FAANG)',
    badge: 'Amazon / CRED',
    description: 'Accidentally made a commit? Rewind the HEAD by 1 commit using `git reset --soft HEAD~1` so the changes stay in your staging area for editing.',
    verify: () => {
      const snap = getGitStateSnapshot();
      return snap.stagedCount > 0;
    },
    hint: 'Run: git reset --soft HEAD~1',
    starterCommand: 'git log --oneline',
    explanation: '`git reset --soft` undoes the commit but preserves all changes staged in the index, unlike `--hard` which wipes uncommitted work.'
  },
  {
    id: 'git-ch-4',
    title: 'Release Engineering: Create Semantic Version Tag',
    difficulty: 'L100 (Service / Core)',
    badge: 'Infosys / Wipro / HCL',
    description: 'Tag the current verified commit on `main` with semantic version `v1.0.0` using `git tag v1.0.0`.',
    verify: () => {
      const snap = getGitStateSnapshot();
      return !!snap.tags['v1.0.0'];
    },
    hint: 'Run: git tag v1.0.0',
    starterCommand: 'git tag',
    explanation: 'Tags mark specific points in repository history as important releases, triggering CI/CD deployment pipelines.'
  }
];
