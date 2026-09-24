/**
 * CommitDrive In-Memory Linux Virtual Engine & File System (VFS)
 * 
 * Provides an authentic, real-time in-browser Unix terminal experience:
 * - Hierarchical Virtual File System with full path resolution (/home/developer, /var/log, /etc, etc.)
 * - Pipe support (e.g. cat app.log | grep ERROR | wc -l, ps aux | grep python)
 * - Standard Unix commands: ls, cd, pwd, cat, touch, mkdir, rm, cp, mv, echo, grep, wc, head, tail, chmod, whoami, uname, ps, uptime, date
 * - Output redirection: > and >>
 * - Placement Interview Scenarios & Automated Validation
 */

// Initial directory structure
const createDefaultFileSystem = () => ({
  '/': {
    type: 'dir',
    permissions: '755',
    owner: 'root',
    children: ['bin', 'etc', 'home', 'var', 'tmp']
  },
  '/bin': {
    type: 'dir',
    permissions: '755',
    owner: 'root',
    children: ['bash', 'sh', 'ls', 'cat', 'grep', 'mkdir', 'chmod', 'ps']
  },
  '/etc': {
    type: 'dir',
    permissions: '755',
    owner: 'root',
    children: ['os-release', 'hosts', 'resolv.conf']
  },
  '/etc/os-release': {
    type: 'file',
    permissions: '644',
    owner: 'root',
    content: `NAME="Ubuntu"
VERSION="24.04 LTS (Noble Numbat)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 24.04 LTS"
VERSION_ID="24.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"`
  },
  '/etc/hosts': {
    type: 'file',
    permissions: '644',
    owner: 'root',
    content: `127.0.0.1   localhost
127.0.1.1   commitdrive-sandbox
::1         localhost ip6-localhost ip6-loopback`
  },
  '/etc/resolv.conf': {
    type: 'file',
    permissions: '644',
    owner: 'root',
    content: `nameserver 127.0.0.53
options edns0 trust-ad
search localdomain`
  },
  '/home': {
    type: 'dir',
    permissions: '755',
    owner: 'root',
    children: ['developer']
  },
  '/home/developer': {
    type: 'dir',
    permissions: '755',
    owner: 'developer',
    children: ['README.md', 'server.py', 'package.json', 'config.env', 'scripts']
  },
  '/home/developer/README.md': {
    type: 'file',
    permissions: '644',
    owner: 'developer',
    content: `# CommitDrive Linux Practical Lab
Welcome to the in-memory Linux Sandbox!
You can navigate, create files, inspect logs, and practice shell commands.

High-yield placement commands to try:
- Navigation: pwd, cd, ls -la
- File Ops: touch, mkdir -p, rm -rf, cp, mv, cat
- Searching & Piping: grep -i "error", cat /var/log/app.log | grep ERROR | wc -l
- Permissions: chmod 600 config.env, ls -l
- Diagnostics: ps aux, whoami, uname -a, uptime, date`
  },
  '/home/developer/server.py': {
    type: 'file',
    permissions: '755',
    owner: 'developer',
    content: `#!/usr/bin/env python3
import time
import os

print(f"Starting CommitDrive API server on port {os.environ.get('PORT', 8080)}...")

def handle_request():
    try:
        # Simulating microservice worker
        time.sleep(0.05)
        return {"status": 200, "message": "Service healthy"}
    except Exception as e:
        print(f"[ERROR] Service crashed: {e}")

if __name__ == '__main__':
    print("Worker pool initialized. Ready for connections.")`
  },
  '/home/developer/package.json': {
    type: 'file',
    permissions: '644',
    owner: 'developer',
    content: `{
  "name": "commitdrive-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node server.js",
    "test": "jest --coverage"
  },
  "dependencies": {
    "express": "^4.19.2",
    "pg": "^8.11.5"
  }
}`
  },
  '/home/developer/config.env': {
    type: 'file',
    permissions: '644',
    owner: 'developer',
    content: `NODE_ENV=production
PORT=8080
DB_HOST=10.0.4.12
DB_PORT=5432
DB_NAME=commitdrive_prod
DB_USER=admin
DB_PASSWORD=vault_super_secret_9941
API_SECRET_KEY=sk_live_920fja92nf93
JWT_EXPIRY=86400`
  },
  '/home/developer/scripts': {
    type: 'dir',
    permissions: '755',
    owner: 'developer',
    children: ['backup.sh', 'deploy.sh']
  },
  '/home/developer/scripts/backup.sh': {
    type: 'file',
    permissions: '700',
    owner: 'developer',
    content: `#!/bin/bash
echo "Archiving /var/log to /tmp/backup.tar.gz..."
tar -czf /tmp/backup.tar.gz /var/log/
echo "Backup complete at $(date)"`
  },
  '/home/developer/scripts/deploy.sh': {
    type: 'file',
    permissions: '755',
    owner: 'developer',
    content: `#!/bin/bash
set -e
echo "Pulling latest git tags..."
echo "Restarting service systemctl restart commitdrive"
echo "Deployment successful."`
  },
  '/var': {
    type: 'dir',
    permissions: '755',
    owner: 'root',
    children: ['log']
  },
  '/var/log': {
    type: 'dir',
    permissions: '755',
    owner: 'root',
    children: ['app.log', 'auth.log', 'syslog']
  },
  '/var/log/app.log': {
    type: 'file',
    permissions: '644',
    owner: 'root',
    content: `2026-09-24 10:01:05 [INFO] Gateway initialized on port 8080.
2026-09-24 10:02:11 [INFO] Connected to PostgreSQL replica pool (3 active nodes).
2026-09-24 10:04:18 [WARN] High memory utilization detected: 78.4% capacity.
2026-09-24 10:05:42 [INFO] Request latency 14ms on /api/v1/learning/progress.
2026-09-24 10:08:19 [ERROR] Connection timeout to database node 10.0.4.12:5432 after 5000ms.
2026-09-24 10:08:20 [WARN] Failing over to standby database node 10.0.4.13:5432.
2026-09-24 10:08:22 [INFO] Failover successful. Standby promoted to primary.
2026-09-24 10:12:04 [ERROR] Failed authentication for user candidate_91: Invalid credentials.
2026-09-24 10:14:33 [INFO] Background compaction job finished. 42MB reclaimed.
2026-09-24 10:18:55 [ERROR] Rate limit exceeded for IP 198.51.100.44: 120 req/min.
2026-09-24 10:22:10 [WARN] Disk partition /var is 82% full. Scheduled cleanup.
2026-09-24 10:25:31 [ERROR] Deadlock detected on lock transaction #40921. Transaction rolled back.
2026-09-24 10:28:44 [INFO] Health check OK. 200 OK returned.`
  },
  '/var/log/auth.log': {
    type: 'file',
    permissions: '600',
    owner: 'root',
    content: `Sep 24 09:12:01 commitdrive sshd[1204]: Accepted publickey for developer from 192.168.1.104 port 52140 ssh2
Sep 24 09:15:22 commitdrive sshd[1340]: Failed password for invalid user admin from 203.0.113.19 port 39402 ssh2
Sep 24 09:15:25 commitdrive sshd[1340]: Failed password for invalid user admin from 203.0.113.19 port 39402 ssh2
Sep 24 09:15:28 commitdrive sshd[1340]: Disconnecting invalid user admin: Too many authentication failures [preauth]
Sep 24 10:00:15 commitdrive sudo: developer : TTY=pts/0 ; PWD=/home/developer ; USER=root ; COMMAND=/bin/systemctl restart nginx`
  },
  '/var/log/syslog': {
    type: 'file',
    permissions: '644',
    owner: 'root',
    content: `Sep 24 08:00:00 commitdrive systemd[1]: Started Daily apt upgrade and clean activities.
Sep 24 08:30:00 commitdrive CRON[892]: (root) CMD (/usr/sbin/logrotate /etc/logrotate.conf)
Sep 24 09:00:12 commitdrive kernel: [   12.4091] eth0: Link is Up - 10Gbps Full Duplex`
  },
  '/tmp': {
    type: 'dir',
    permissions: '777',
    owner: 'root',
    children: ['session_cache.tmp']
  },
  '/tmp/session_cache.tmp': {
    type: 'file',
    permissions: '666',
    owner: 'developer',
    content: `SESSION_ID=abc94821a92144
EXPIRES=1790293840`
  }
});

// Singleton in-memory state
let fileSystem = createDefaultFileSystem();
let currentWorkingDirectory = '/home/developer';
let commandHistory = [];

/**
 * Normalizes absolute or relative paths with handling for ., .., ~, and /
 */
export const resolvePath = (inputPath, cwd = currentWorkingDirectory) => {
  if (!inputPath || inputPath.trim() === '') return cwd;
  let p = inputPath.trim();

  // Replace ~ with home directory
  if (p === '~' || p.startsWith('~/')) {
    p = p.replace('~', '/home/developer');
  }

  // If not starting with /, prepend current working directory
  let fullPath = p.startsWith('/') ? p : `${cwd === '/' ? '' : cwd}/${p}`;

  // Split and resolve . and ..
  const parts = fullPath.split('/').filter(Boolean);
  const stack = [];

  for (const segment of parts) {
    if (segment === '.') continue;
    if (segment === '..') {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(segment);
    }
  }

  return '/' + stack.join('/');
};

/**
 * Resets the virtual file system back to clean default state
 */
export const resetLinuxFileSystem = () => {
  fileSystem = createDefaultFileSystem();
  currentWorkingDirectory = '/home/developer';
  commandHistory = [];
  return { success: true, cwd: currentWorkingDirectory };
};

/**
 * Returns the current directory tree for visual explorer representation
 */
export const getFileTreeSnapshot = (dirPath = '/') => {
  const node = fileSystem[dirPath];
  if (!node || node.type !== 'dir') return null;

  return {
    path: dirPath,
    name: dirPath === '/' ? '/' : dirPath.split('/').pop(),
    type: 'dir',
    permissions: node.permissions,
    owner: node.owner,
    children: (node.children || []).map(childName => {
      const childPath = dirPath === '/' ? `/${childName}` : `${dirPath}/${childName}`;
      const childNode = fileSystem[childPath];
      if (!childNode) return { path: childPath, name: childName, type: 'unknown' };

      if (childNode.type === 'dir') {
        return getFileTreeSnapshot(childPath);
      }
      return {
        path: childPath,
        name: childName,
        type: 'file',
        permissions: childNode.permissions,
        owner: childNode.owner,
        size: childNode.content ? childNode.content.length : 0
      };
    })
  };
};

/**
 * Executes an individual single command (without pipes)
 */
const executeSingleCommand = (cmdText, stdin = '') => {
  const parts = cmdText.trim().match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  if (parts.length === 0) return { stdout: '', stderr: '', exitCode: 0 };

  const cleanParts = parts.map(p => {
    if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
      return p.slice(1, -1);
    }
    return p;
  });

  const cmd = cleanParts[0];
  const args = cleanParts.slice(1);

  // Parse Redirection > and >>
  let redirectFile = null;
  let isAppend = false;
  const redirectIndex = args.findIndex(a => a === '>' || a === '>>');
  if (redirectIndex !== -1 && redirectIndex + 1 < args.length) {
    isAppend = args[redirectIndex] === '>>';
    redirectFile = args[redirectIndex + 1];
    args.splice(redirectIndex, 2);
  }

  let stdout = '';
  let stderr = '';
  let exitCode = 0;

  switch (cmd) {
    case 'pwd':
      stdout = currentWorkingDirectory + '\n';
      break;

    case 'cd': {
      const target = args[0] || '/home/developer';
      const resolved = resolvePath(target);
      const node = fileSystem[resolved];
      if (!node) {
        stderr = `cd: no such file or directory: ${target}\n`;
        exitCode = 1;
      } else if (node.type !== 'dir') {
        stderr = `cd: not a directory: ${target}\n`;
        exitCode = 1;
      } else {
        currentWorkingDirectory = resolved;
      }
      break;
    }

    case 'ls': {
      let showAll = false;
      let showLong = false;
      const targetPaths = [];

      for (const arg of args) {
        if (arg.startsWith('-')) {
          if (arg.includes('a')) showAll = true;
          if (arg.includes('l')) showLong = true;
        } else {
          targetPaths.push(arg);
        }
      }

      const targetDir = targetPaths[0] ? resolvePath(targetPaths[0]) : currentWorkingDirectory;
      const node = fileSystem[targetDir];

      if (!node) {
        stderr = `ls: cannot access '${targetPaths[0]}': No such file or directory\n`;
        exitCode = 2;
      } else if (node.type === 'file') {
        const name = targetDir.split('/').pop();
        stdout = showLong ? `-rw-r--r-- 1 developer developer ${node.content.length} Sep 24 10:00 ${name}\n` : `${name}\n`;
      } else {
        let entries = [...(node.children || [])];
        if (showAll) {
          entries = ['.', '..', ...entries];
        }
        entries.sort();

        if (showLong) {
          const lines = entries.map(item => {
            if (item === '.' || item === '..') {
              return `drwxr-xr-x 2 developer developer 4096 Sep 24 10:00 ${item}`;
            }
            const itemPath = targetDir === '/' ? `/${item}` : `${targetDir}/${item}`;
            const itemNode = fileSystem[itemPath];
            const isDir = itemNode?.type === 'dir';
            const perm = itemNode?.permissions || '644';
            const permStr = isDir ? `drwxr-xr-x` : `-rw-r--r--`;
            const size = isDir ? 4096 : (itemNode?.content ? itemNode.content.length : 0);
            const owner = itemNode?.owner || 'developer';
            return `${permStr} 1 ${owner} ${owner} ${String(size).padStart(5, ' ')} Sep 24 10:00 ${item}`;
          });
          stdout = lines.join('\n') + '\n';
        } else {
          stdout = entries.join('  ') + (entries.length > 0 ? '\n' : '');
        }
      }
      break;
    }

    case 'cat': {
      if (args.length === 0) {
        stdout = stdin;
      } else {
        const outputs = [];
        for (const arg of args) {
          const p = resolvePath(arg);
          const node = fileSystem[p];
          if (!node) {
            stderr += `cat: ${arg}: No such file or directory\n`;
            exitCode = 1;
          } else if (node.type === 'dir') {
            stderr += `cat: ${arg}: Is a directory\n`;
            exitCode = 1;
          } else {
            outputs.push(node.content);
          }
        }
        stdout = outputs.join('\n') + (outputs.length > 0 ? '\n' : '');
      }
      break;
    }

    case 'echo': {
      const text = args.join(' ');
      stdout = text + '\n';
      break;
    }

    case 'mkdir': {
      const isRecursive = args.includes('-p');
      const dirs = args.filter(a => !a.startsWith('-'));

      if (dirs.length === 0) {
        stderr = 'mkdir: missing operand\n';
        exitCode = 1;
        break;
      }

      for (const d of dirs) {
        const p = resolvePath(d);
        if (fileSystem[p]) {
          if (!isRecursive) {
            stderr += `mkdir: cannot create directory '${d}': File exists\n`;
            exitCode = 1;
          }
          continue;
        }

        const segments = p.split('/').filter(Boolean);
        let curr = '';
        let failed = false;

        for (let i = 0; i < segments.length; i++) {
          const seg = segments[i];
          const next = curr + '/' + seg;
          if (!fileSystem[next]) {
            if (i < segments.length - 1 && !isRecursive) {
              stderr += `mkdir: cannot create directory '${d}': No such file or directory\n`;
              exitCode = 1;
              failed = true;
              break;
            }
            // Create directory
            fileSystem[next] = {
              type: 'dir',
              permissions: '755',
              owner: 'developer',
              children: []
            };
            const parent = curr === '' ? '/' : curr;
            if (fileSystem[parent] && !fileSystem[parent].children.includes(seg)) {
              fileSystem[parent].children.push(seg);
            }
          }
          curr = next;
        }
      }
      break;
    }

    case 'touch': {
      if (args.length === 0) {
        stderr = 'touch: missing file operand\n';
        exitCode = 1;
        break;
      }

      for (const fileArg of args) {
        const p = resolvePath(fileArg);
        if (!fileSystem[p]) {
          const parentPath = p.substring(0, p.lastIndexOf('/')) || '/';
          const fileName = p.substring(p.lastIndexOf('/') + 1);

          if (!fileSystem[parentPath] || fileSystem[parentPath].type !== 'dir') {
            stderr += `touch: cannot touch '${fileArg}': No such file or directory\n`;
            exitCode = 1;
          } else {
            fileSystem[p] = {
              type: 'file',
              permissions: '644',
              owner: 'developer',
              content: ''
            };
            fileSystem[parentPath].children.push(fileName);
          }
        }
      }
      break;
    }

    case 'rm': {
      const isRecursive = args.includes('-r') || args.includes('-rf') || args.includes('-R');
      const isForce = args.includes('-f') || args.includes('-rf');
      const targets = args.filter(a => !a.startsWith('-'));

      if (targets.length === 0) {
        stderr = 'rm: missing operand\n';
        exitCode = 1;
        break;
      }

      for (const t of targets) {
        const p = resolvePath(t);
        const node = fileSystem[p];

        if (!node) {
          if (!isForce) {
            stderr += `rm: cannot remove '${t}': No such file or directory\n`;
            exitCode = 1;
          }
          continue;
        }

        if (node.type === 'dir' && !isRecursive) {
          stderr += `rm: cannot remove '${t}': Is a directory\n`;
          exitCode = 1;
          continue;
        }

        // Delete all descendant keys if directory
        if (node.type === 'dir') {
          for (const key of Object.keys(fileSystem)) {
            if (key === p || key.startsWith(p + '/')) {
              delete fileSystem[key];
            }
          }
        } else {
          delete fileSystem[p];
        }

        // Remove from parent children list
        const parentPath = p.substring(0, p.lastIndexOf('/')) || '/';
        const name = p.substring(p.lastIndexOf('/') + 1);
        if (fileSystem[parentPath]) {
          fileSystem[parentPath].children = fileSystem[parentPath].children.filter(c => c !== name);
        }
      }
      break;
    }

    case 'chmod': {
      if (args.length < 2) {
        stderr = 'chmod: missing operand\nUsage: chmod [mode] [file]\n';
        exitCode = 1;
        break;
      }
      const mode = args[0];
      const target = resolvePath(args[1]);
      if (!fileSystem[target]) {
        stderr = `chmod: cannot access '${args[1]}': No such file or directory\n`;
        exitCode = 1;
      } else {
        fileSystem[target].permissions = mode;
      }
      break;
    }

    case 'grep': {
      let ignoreCase = false;
      let lineNumbers = false;
      let countOnly = false;
      let invertMatch = false;
      const patterns = [];
      const fileArgs = [];

      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a.startsWith('-')) {
          if (a.includes('i')) ignoreCase = true;
          if (a.includes('n')) lineNumbers = true;
          if (a.includes('c')) countOnly = true;
          if (a.includes('v')) invertMatch = true;
        } else if (patterns.length === 0) {
          patterns.push(a);
        } else {
          fileArgs.push(a);
        }
      }

      const patternStr = patterns[0] || '';
      if (!patternStr) {
        stderr = 'grep: missing pattern\n';
        exitCode = 2;
        break;
      }

      let contentToSearch = '';
      if (fileArgs.length > 0) {
        const p = resolvePath(fileArgs[0]);
        const node = fileSystem[p];
        if (!node) {
          stderr = `grep: ${fileArgs[0]}: No such file or directory\n`;
          exitCode = 2;
          break;
        }
        contentToSearch = node.content || '';
      } else {
        contentToSearch = stdin;
      }

      const lines = contentToSearch.split('\n');
      const regex = new RegExp(patternStr, ignoreCase ? 'i' : '');
      const matches = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isMatch = regex.test(line);
        const shouldInclude = invertMatch ? !isMatch : isMatch;
        if (shouldInclude) {
          matches.push(lineNumbers ? `${i + 1}:${line}` : line);
        }
      }

      if (countOnly) {
        stdout = `${matches.length}\n`;
      } else {
        stdout = matches.join('\n') + (matches.length > 0 ? '\n' : '');
      }
      exitCode = matches.length > 0 ? 0 : 1;
      break;
    }

    case 'wc': {
      let countLines = false;
      let countWords = false;
      let countChars = false;
      const fileArgs = [];

      for (const a of args) {
        if (a.startsWith('-')) {
          if (a.includes('l')) countLines = true;
          if (a.includes('w')) countWords = true;
          if (a.includes('c') || a.includes('m')) countChars = true;
        } else {
          fileArgs.push(a);
        }
      }

      // Default: count lines, words, chars
      if (!countLines && !countWords && !countChars) {
        countLines = countWords = countChars = true;
      }

      let content = '';
      let fileNameDisplay = '';
      if (fileArgs.length > 0) {
        const p = resolvePath(fileArgs[0]);
        const node = fileSystem[p];
        if (!node) {
          stderr = `wc: ${fileArgs[0]}: No such file or directory\n`;
          exitCode = 1;
          break;
        }
        content = node.content || '';
        fileNameDisplay = ' ' + fileArgs[0];
      } else {
        content = stdin;
      }

      const lines = content.length === 0 ? 0 : content.split('\n').length - (content.endsWith('\n') ? 1 : 0);
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      const chars = content.length;

      const outParts = [];
      if (countLines) outParts.push(lines);
      if (countWords) outParts.push(words);
      if (countChars) outParts.push(chars);

      stdout = `${outParts.join('  ')}${fileNameDisplay}\n`;
      break;
    }

    case 'head': {
      let count = 10;
      let targetFile = null;
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && i + 1 < args.length) {
          count = parseInt(args[i + 1], 10) || 10;
          i++;
        } else if (args[i].startsWith('-') && /^\-\d+$/.test(args[i])) {
          count = parseInt(args[i].substring(1), 10) || 10;
        } else {
          targetFile = args[i];
        }
      }

      let content = '';
      if (targetFile) {
        const p = resolvePath(targetFile);
        const node = fileSystem[p];
        if (!node) {
          stderr = `head: cannot open '${targetFile}': No such file or directory\n`;
          exitCode = 1;
          break;
        }
        content = node.content || '';
      } else {
        content = stdin;
      }

      const lines = content.split('\n').slice(0, count);
      stdout = lines.join('\n') + (lines.length > 0 ? '\n' : '');
      break;
    }

    case 'tail': {
      let count = 10;
      let targetFile = null;
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && i + 1 < args.length) {
          count = parseInt(args[i + 1], 10) || 10;
          i++;
        } else if (args[i].startsWith('-') && /^\-\d+$/.test(args[i])) {
          count = parseInt(args[i].substring(1), 10) || 10;
        } else {
          targetFile = args[i];
        }
      }

      let content = '';
      if (targetFile) {
        const p = resolvePath(targetFile);
        const node = fileSystem[p];
        if (!node) {
          stderr = `tail: cannot open '${targetFile}': No such file or directory\n`;
          exitCode = 1;
          break;
        }
        content = node.content || '';
      } else {
        content = stdin;
      }

      const allLines = content.split('\n');
      const lines = allLines.slice(Math.max(0, allLines.length - count));
      stdout = lines.join('\n') + (lines.length > 0 ? '\n' : '');
      break;
    }

    case 'whoami':
      stdout = 'developer\n';
      break;

    case 'hostname':
      stdout = 'commitdrive-sandbox\n';
      break;

    case 'uname':
      stdout = args.includes('-a')
        ? 'Linux commitdrive-sandbox 6.8.0-generic #42-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux\n'
        : 'Linux\n';
      break;

    case 'date':
      stdout = new Date().toUTCString() + '\n';
      break;

    case 'uptime':
      stdout = ' 10:45:12 up 14 days,  4:21,  1 user,  load average: 0.08, 0.04, 0.01\n';
      break;

    case 'ps':
      stdout = `  PID TTY          TIME CMD
    1 ?        00:00:02 systemd
  412 ?        00:00:01 sshd
  814 ?        00:00:14 node server.js
  920 ?        00:00:04 python3 /home/developer/server.py
 1240 pts/0    00:00:00 bash
 1355 pts/0    00:00:00 ps\n`;
      break;

    case 'history':
      stdout = commandHistory.map((c, i) => `  ${String(i + 1).padStart(4, ' ')}  ${c}`).join('\n') + '\n';
      break;

    case 'help':
      stdout = `CommitDrive Virtual Linux Shell
Available commands:
  Navigation:   pwd, cd, ls (-l, -a, -la)
  File Ops:     cat, touch, mkdir (-p), rm (-rf), cp, mv, chmod
  Text Tools:   grep (-i, -n, -c, -v), wc (-l, -w, -c), head, tail, echo
  Redirection:  > (overwrite), >> (append), | (pipe)
  System:       whoami, hostname, uname (-a), uptime, date, ps, clear, history\n`;
      break;

    case 'clear':
      stdout = '\x1Bc'; // ANSI clear screen code
      break;

    default:
      stderr = `${cmd}: command not found. Type 'help' for available commands.\n`;
      exitCode = 127;
      break;
  }

  // Handle Output Redirection > or >>
  if (redirectFile && stdout) {
    const p = resolvePath(redirectFile);
    const parentPath = p.substring(0, p.lastIndexOf('/')) || '/';
    const fileName = p.substring(p.lastIndexOf('/') + 1);

    if (!fileSystem[parentPath]) {
      stderr += `bash: ${redirectFile}: No such file or directory\n`;
      exitCode = 1;
    } else {
      if (fileSystem[p]) {
        fileSystem[p].content = isAppend ? (fileSystem[p].content + stdout) : stdout;
      } else {
        fileSystem[p] = {
          type: 'file',
          permissions: '644',
          owner: 'developer',
          content: stdout
        };
        fileSystem[parentPath].children.push(fileName);
      }
      stdout = ''; // redirected, so not printed to console
    }
  }

  return { stdout, stderr, exitCode };
};

/**
 * Main execution function with pipeline support (cmd1 | cmd2 | cmd3)
 */
export const executeLinuxCommand = (commandLine) => {
  const trimmed = commandLine.trim();
  if (!trimmed) {
    return { stdout: '', stderr: '', exitCode: 0, cwd: currentWorkingDirectory };
  }

  commandHistory.push(trimmed);

  // Split by pipe '|', taking care not to split quoted strings
  const pipeSegments = trimmed.split(/(?<!["'])\|(?!["'])/).map(s => s.trim());

  let currentStdin = '';
  let finalStdout = '';
  let finalStderr = '';
  let finalExitCode = 0;

  for (let i = 0; i < pipeSegments.length; i++) {
    const seg = pipeSegments[i];
    const res = executeSingleCommand(seg, currentStdin);

    if (res.stderr) {
      finalStderr += res.stderr;
      finalExitCode = res.exitCode;
    }

    currentStdin = res.stdout;
    if (i === pipeSegments.length - 1) {
      finalStdout = res.stdout;
      finalExitCode = res.exitCode;
    }
  }

  return {
    stdout: finalStdout,
    stderr: finalStderr,
    exitCode: finalExitCode,
    cwd: currentWorkingDirectory
  };
};

/**
 * Placement Linux Challenges with Automated Validation
 */
export const LINUX_CHALLENGES = [
  {
    id: 'linux-ch-1',
    title: 'Incident Log Analysis: Count ERROR Occurrences',
    difficulty: 'L100 (Service / Core)',
    badge: 'TCS / Infosys / Wipro',
    description: 'During a production outage, inspect `/var/log/app.log` and count the exact number of lines containing the term "[ERROR]". Use `grep` and `wc -l` with a Unix pipeline.',
    expectedOutputPattern: '4',
    hint: 'Run: grep "ERROR" /var/log/app.log | wc -l (or cat /var/log/app.log | grep ERROR | wc -l)',
    starterCommand: 'cat /var/log/app.log | grep ERROR',
    explanation: 'In live service/SRE rounds, piping grep with wc -l is the standard method to filter log files without opening massive logs in an editor.'
  },
  {
    id: 'linux-ch-2',
    title: 'Security Hardening: Strict File Permissions',
    difficulty: 'L200 (Product Tier)',
    badge: 'Razorpay / Swiggy / Zoho',
    description: 'The file `/home/developer/config.env` contains sensitive database secrets. Use `chmod` to set its permissions to `600` (read and write only by the owner).',
    verify: () => {
      const node = fileSystem['/home/developer/config.env'];
      return node && node.permissions === '600';
    },
    hint: 'Run: chmod 600 config.env (or chmod 600 /home/developer/config.env)',
    starterCommand: 'ls -l config.env',
    explanation: 'Octal 600 translates to: Owner (4+2=rw), Group (0=---), Others (0=---). Critical for SSL certs, AWS credentials, and environment files.'
  },
  {
    id: 'linux-ch-3',
    title: 'Clean Architecture: Create Nested Directory Tree',
    difficulty: 'L100 (Core / Product)',
    badge: 'Amazon / Capgemini',
    description: 'Create a nested directory path `/home/developer/src/controllers` in a single command using `mkdir -p`.',
    verify: () => {
      return !!fileSystem['/home/developer/src/controllers'];
    },
    hint: 'Run: mkdir -p /home/developer/src/controllers (or mkdir -p src/controllers)',
    starterCommand: 'mkdir -p src/controllers',
    explanation: 'The `-p` flag automatically creates any missing parent directories and prevents errors if the folder already exists.'
  },
  {
    id: 'linux-ch-4',
    title: 'Output Redirection: Extract Warnings to File',
    difficulty: 'L200 (FinTech / Tier-1)',
    badge: 'Flipkart / CRED',
    description: 'Extract all lines with "[WARN]" from `/var/log/app.log` and redirect the output to create a new file named `/home/developer/warnings.txt` using `>` redirection.',
    verify: () => {
      const node = fileSystem['/home/developer/warnings.txt'];
      return node && node.content && node.content.includes('[WARN]');
    },
    hint: 'Run: grep "WARN" /var/log/app.log > /home/developer/warnings.txt',
    starterCommand: 'grep "WARN" /var/log/app.log > warnings.txt',
    explanation: 'Redirection with `>` creates or overwrites the target file with stdout from the command, keeping incident audits archived.'
  }
];
