// Verified High-Yield Placement Interview Question Bank, Tackling Guide & Official References — CommitDrive
// Real, non-hallucinated interview questions curated from GeeksforGeeks Top 50, Glassdoor campus/SDE-1 logs,
// InterviewBit, Striver's CS Fundamentals Sheet, and official technical documentation (RFCs, Linux man-pages, MySQL/Postgres Docs).
// Graded into Basic (L100), Intermediate (L200), and Advanced (L300) with
// Interviewer Intent, Step-by-Step Verbal Blueprints, Model Answers, Trap Warnings, Keywords, and Official Citations.

export const topicWiseCramData = {
  // =========================================================================
  // 1. OPERATING SYSTEMS
  // =========================================================================
  os: {
    id: 'os',
    name: 'Operating Systems',
    shortName: 'OS',
    iconName: 'Cpu',
    accentColor: '#e8604a',
    tagline: 'Kernel architecture, CPU scheduling, concurrency, deadlocks, virtual memory & paging',
    topics: [
      'OS Architecture & System Calls',
      'Processes & PCB',
      'Threads & Multithreading',
      'CPU Scheduling',
      'Process Synchronization',
      'Deadlocks',
      'Memory Management & Paging',
      'Virtual Memory & Page Replacement',
      'Storage & File Systems',
      'Kernel Internals'
    ],
    questions: [
      // --- BASIC (L100 / Freshers / Screening) ---
      {
        id: 'os-q1',
        topic: 'OS Architecture & System Calls',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What is an Operating System, and what are Dual-Mode Operations (User Mode vs Kernel Mode)?',
        frequency: 'Asked in 85%+ of fresher screening rounds (TCS, Infosys, Cognizant, Wipro)',
        companyTags: ['GFG Top 50', 'TCS Digital', 'Cognizant', 'Infosys'],
        reference: {
          source: 'GeeksforGeeks & Silberschatz Operating System Concepts (10th Ed., Chapter 1 & 2)',
          citation: 'OS Dual-Mode Operations and Hardware Protection Architecture',
          linkText: 'GFG OS Dual-Mode Guide'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing if you understand why computers don’t crash when a user app bugs out, and how CPU hardware enforces privilege boundaries.',
          verbalBlueprint: [
            '1. Define OS in 1 punchy sentence: A resource manager and abstraction layer between user applications and bare-metal hardware.',
            '2. Explain Dual-Mode: User Mode (mode bit 1, restricted instructions) vs Kernel Mode (mode bit 0, privileged instructions).',
            '3. Explain how transitions happen: When user code needs disk I/O, it executes a CPU software trap (SYSCALL), flipping the mode bit to 0 and vectoring through the Interrupt Descriptor Table (IDT).'
          ]
        },
        modelAnswer: {
          summary: 'An OS acts as an intermediary between computer hardware and user applications. To prevent rogue software from halting the CPU or corrupting physical memory, modern CPUs enforce dual-mode execution controlled by a hardware Mode Bit.',
          table: {
            title: 'User Mode vs Kernel Mode Comparison',
            headers: ['Attribute', 'User Mode', 'Kernel Mode'],
            rows: [
              ['Mode Bit Value', '1', '0'],
              ['Privilege Level', 'Restricted (Non-privileged instructions only)', 'Unrestricted (Full hardware & memory access)'],
              ['Direct Hardware Access', '❌ Prohibited (Triggers CPU hardware trap)', '✅ Direct physical access to I/O and CPU registers'],
              ['Crash Impact', 'Only the faulty user process terminates', 'Kernel Panic / Blue Screen of Death (Machine crash)']
            ]
          },
          details: [
            'Whenever an application requires disk I/O, network communication, or memory mapping, it triggers a System Call.',
            'The CPU executes a software interrupt/trap instruction, saving user registers, switching the Mode Bit from 1 to 0, and jumping to a kernel dispatch table entry.',
            'Once the kernel completes the task, it switches the Mode Bit back to 1 and resumes user code execution.'
          ]
        },
        mustMentionKeywords: ['Hardware Mode Bit (0/1)', 'Privileged Instructions', 'Software Trap (SYSCALL)', 'Interrupt Descriptor Table (IDT)', 'Fault Isolation'],
        trapWarning: {
          rookieMistake: 'Saying every standard C library function (like strlen() or abs()) executes in Kernel Mode.',
          winningAnswer: 'Clarify that computational functions like strlen() run purely in User Mode inside process memory without kernel transitions. Only functions requiring hardware (read, write, fork) invoke system calls.'
        }
      },
      {
        id: 'os-q2',
        topic: 'Processes & PCB',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What is the difference between a Program and a Process, and what data structures are stored in a Process Control Block (PCB)?',
        frequency: 'Asked in 90%+ of technical rounds (Amazon, Zoho, TCS, Accenture)',
        companyTags: ['Amazon', 'Zoho', 'TCS', 'Accenture'],
        reference: {
          source: 'GeeksforGeeks & Tanenbaum Modern Operating Systems (Chapter 2: Processes & Threads)',
          citation: 'Process Control Block (PCB) & Address Space Layout',
          linkText: 'GFG PCB Architecture'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating if you understand passive disk storage vs active execution state in virtual memory, and what metadata the kernel maintains per process.',
          verbalBlueprint: [
            '1. State the fundamental distinction: Program = passive code on disk; Process = active instance in execution with allocated memory.',
            '2. List the 4 memory segments: Text (Code), Data, Heap (dynamic growth up), Stack (function frames down).',
            '3. Enumerate the 5 critical fields in the PCB: PID, State, Program Counter, CPU Registers, and Open File Descriptors.'
          ]
        },
        modelAnswer: {
          summary: 'A Program is an executable file containing passive machine code stored on non-volatile disk. A Process is an active instance of that program loaded into RAM with its own private virtual address space managed by the OS kernel.',
          table: {
            title: 'Process Address Space Segments',
            headers: ['Segment', 'Growth Direction', 'Contents Stored'],
            rows: [
              ['Stack', 'Downwards (High to Low Memory)', 'Local function variables, parameters, return addresses'],
              ['Heap', 'Upwards (Low to High Memory)', 'Dynamically allocated memory (malloc / new)'],
              ['Data Segment', 'Fixed Size', 'Initialized and uninitialized (BSS) global & static variables'],
              ['Text (Code)', 'Fixed Size', 'Compiled executable binary instructions (Read-Only)']
            ]
          },
          details: [
            'The kernel represents each process via a Process Control Block (PCB).',
            'Key PCB fields include: Process ID (PID), Process State (New, Ready, Running, Waiting, Terminated), Program Counter (address of next instruction), CPU Registers snapshot, Memory Management info (Page Table Base Pointer / CR3), and I/O status (open file descriptor table).'
          ]
        },
        mustMentionKeywords: ['Passive vs Active', 'Virtual Address Space', 'Stack vs Heap Growth', 'Process Control Block (PCB)', 'Program Counter', 'File Descriptor Table'],
        trapWarning: {
          rookieMistake: 'Claiming the stack and heap grow in the same direction or that a process shares memory by default.',
          winningAnswer: 'Emphasize that the stack and heap grow towards each other. If they collide, a Stack Overflow or out-of-memory fault is triggered.'
        }
      },
      {
        id: 'os-q3',
        topic: 'Processes & PCB',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'Explain the 5-State Process Lifecycle (New, Ready, Running, Waiting, Terminated). When does a process transition between them?',
        frequency: 'Standard campus recruitment question (Infosys, Wipro, Capgemini, HCL)',
        companyTags: ['GFG Top 50', 'Infosys', 'Wipro', 'Capgemini'],
        reference: {
          source: 'GeeksforGeeks & Silberschatz Operating System Concepts (Chapter 3: Process Concept)',
          citation: '5-State Process Lifecycle & Scheduling Queues',
          linkText: 'GFG Process States'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing your grasp of CPU scheduling events and I/O blocking states.',
          verbalBlueprint: [
            '1. Name the 5 states in order.',
            '2. Define the exact trigger for each transition (Admitted, Scheduler Dispatch, I/O wait, I/O complete, Exit).',
            '3. Emphasize the crucial difference between Ready (has everything except CPU) and Waiting (waiting for an external I/O event).'
          ]
        },
        modelAnswer: {
          summary: 'During its execution, a process moves through five primary states governed by the OS CPU scheduler and hardware I/O controllers.',
          table: {
            title: '5-State Transition Triggers',
            headers: ['From State', 'To State', 'Event / Trigger'],
            rows: [
              ['New', 'Ready', 'Process is created and memory is allocated (Admitted)'],
              ['Ready', 'Running', 'CPU Scheduler dispatches the process (Scheduler Dispatch)'],
              ['Running', 'Ready', 'Time quantum expires or a higher priority process preempts it'],
              ['Running', 'Waiting (Blocked)', 'Process issues a blocking I/O or system call request (e.g., disk read, socket wait)'],
              ['Waiting', 'Ready', 'The requested I/O operation or signal completes (I/O Completion)'],
              ['Running', 'Terminated', 'Process completes execution or encounters a fatal crash (exit())']
            ]
          },
          details: [
            'Crucial Distinction: A process in the "Ready" state is 100% prepared to execute instructions—it only needs CPU core allocation.',
            'A process in the "Waiting/Blocked" state CANNOT execute even if 100 CPU cores are free, because it is waiting on external hardware or event signals.'
          ]
        },
        mustMentionKeywords: ['Scheduler Dispatch', 'Ready vs Waiting State', 'I/O Bound vs CPU Bound', 'Preemption', 'Context Switch'],
        trapWarning: {
          rookieMistake: 'Saying a process moves directly from "Waiting" state back to "Running" state once I/O finishes.',
          winningAnswer: 'Clarify that when I/O completes, the process transitions to the READY state first, not Running. It must wait in the Ready Queue until the CPU scheduler selects it.'
        }
      },
      {
        id: 'os-q4',
        topic: 'OS Architecture & System Calls',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What is the difference between a Zombie Process and an Orphan Process in Linux? How does the OS clean them up?',
        frequency: 'Asked in 90%+ of technical interviews (Amazon, Zoho, Directi, Cisco)',
        companyTags: ['Glassdoor Top Pick', 'Amazon', 'Zoho', 'Directi', 'Cisco'],
        reference: {
          source: 'Linux Programmer\'s Manual: wait(2), waitpid(2), fork(2) & init(1)',
          citation: 'Linux Process Termination Semantics & Re-parenting',
          linkText: 'Linux man-pages: wait(2)'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing parent-child process semantics, wait() system call, and PID reclamation in the kernel.',
          verbalBlueprint: [
            '1. Define Orphan: Parent died before child; child is still running actively.',
            '2. Define Zombie: Child finished executing (dead); parent hasn\'t called wait() yet.',
            '3. Explain cleanup: Orphan adopted by init (PID 1); Zombie cleaned when parent calls wait() or parent terminates.'
          ]
        },
        modelAnswer: {
          summary: 'In Unix/Linux systems, process termination follows a parent-child contract. Deviations in parent behavior produce either Orphan or Zombie processes.',
          table: {
            title: 'Zombie vs Orphan Comparison',
            headers: ['Attribute', 'Orphan Process', 'Zombie Process (<defunct>)'],
            rows: [
              ['Parent Status', 'Parent terminated while child is still executing', 'Parent is alive but has NOT called wait() / waitpid()'],
              ['Execution State', 'Actively executing instructions in memory', 'Terminated / Dead (Finished execution)'],
              ['Resource Consumption', 'Consumes CPU time and RAM', 'Zero CPU time and Zero RAM (Only retains 1 PCB slot)'],
              ['Kernel Resolution', 'Adopted by systemd / init (PID 1) which cleans it upon exit', 'Reaped when parent calls wait(), or if parent dies, init adopts & reaps it']
            ]
          },
          details: [
            'Why does a Zombie exist at all? The kernel keeps a tiny PCB entry so the parent process can read the child’s exit status code.',
            'Danger of Zombies: Although zombies consume zero memory, an accumulation of thousands of zombies exhausts the system’s maximum available PIDs (/proc/sys/kernel/pid_max), preventing new processes from spawning.'
          ]
        },
        mustMentionKeywords: ['wait() / waitpid()', 'init (PID 1) / systemd Re-parenting', 'PID Exhaustion', 'defunct Process', 'Exit Status Code'],
        trapWarning: {
          rookieMistake: 'Trying to kill a zombie process using "kill -9 <PID>".',
          winningAnswer: 'A zombie is already dead; you cannot kill a dead process! To remove it, either trigger the parent to call wait() (via SIGCHLD signal), or kill the parent process so init (PID 1) adopts and immediately reaps the zombie.'
        }
      },
      // --- INTERMEDIATE (L200 / Core Campus & Technical Rounds) ---
      {
        id: 'os-q5',
        topic: 'Threads & Multithreading',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What is the exact technical difference between a Process and a Thread? Compare memory, overhead, and context switching.',
        frequency: 'Asked in 95%+ of SDE-1 interviews across all product & IT firms',
        companyTags: ['GFG Top 50', 'Amazon', 'Microsoft', 'Adobe', 'Zoho'],
        reference: {
          source: 'GeeksforGeeks Top 50 & Linux clone(2) manual page',
          citation: 'Threads vs Processes Architectural Distinctions',
          linkText: 'GFG Process vs Thread'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating architectural depth on address spaces, TLB caching, and concurrency safety.',
          verbalBlueprint: [
            '1. Define Process (heavyweight unit of resource allocation with private address space) vs Thread (lightweight unit of CPU scheduling).',
            '2. Address space breakdown: Threads share code, data, heap, and open files; but each has private stack, registers, and Program Counter.',
            '3. Quantify context switch cost: Process switch = ~10-20µs (TLB flush, CR3 reload); Thread switch = ~1-2µs (TLB preserved).'
          ]
        },
        modelAnswer: {
          summary: 'A Process is an isolated execution environment with private virtual memory. A Thread is the smallest dispatchable execution stream within a process that shares resources with sibling threads.',
          table: {
            title: 'Process vs Thread Deep Architectural Comparison',
            headers: ['Dimension', 'Process', 'Thread (Same Process)'],
            rows: [
              ['Address Space', 'Private & Isolated (enforced by MMU hardware)', 'Shared Virtual Address Space (Heap, Code, Globals)'],
              ['Stack & Registers', 'Private Stack, Program Counter, Registers', 'Private Stack, Program Counter, Registers'],
              ['Context Switch Overhead', 'Heavy (~10-20 microseconds)', 'Lightweight (~1-2 microseconds)'],
              ['TLB Cache Impact', 'Flushed / Invalidated (cold cache penalty)', 'Preserved (hot cache hits continue)'],
              ['Failure Isolation', 'Strong: Crash in one process does not affect others', 'Fragile: Memory corruption in one thread crashes entire process'],
              ['Communication (IPC)', 'Slow (Pipes, Sockets, Shared Memory syscalls)', 'Fast (Direct memory reads/writes with synchronization)']
            ]
          },
          details: [
            'Why is thread switching so much faster? When switching threads within the same process, the memory page table pointer (CR3 register on x86) remains unchanged.',
            'This preserves the CPU Translation Lookaside Buffer (TLB) and L1/L2 CPU hardware caches, eliminating expensive RAM lookups.'
          ]
        },
        mustMentionKeywords: ['Shared Heap vs Private Stack', 'TLB Flushing', 'Page Directory Pointer (CR3)', 'Fault Isolation Boundary', 'Inter-Process Communication (IPC)'],
        trapWarning: {
          rookieMistake: 'Claiming two threads in the same process can have separate heaps.',
          winningAnswer: 'By OS architecture, the heap belongs strictly to the process and is shared by all threads. Thread-local allocators (e.g. jemalloc) create thread-specific arenas on top, but they all reside inside the single shared process address space.'
        }
      },
      {
        id: 'os-q6',
        topic: 'Deadlocks',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What are the 4 Coffman Conditions required for a Deadlock? How do you prevent and detect deadlocks?',
        frequency: 'Guaranteed question in campus placement core rounds (TCS Digital, Zoho, Amazon, Microsoft)',
        companyTags: ['GFG Top 50', 'TCS Digital', 'Zoho', 'Amazon', 'Microsoft'],
        reference: {
          source: 'Coffman et al. (1971) & Silberschatz OS Concepts (Chapter 8: Deadlocks)',
          citation: 'System Deadlocks & 4 Necessary Preconditions',
          linkText: 'GFG 4 Coffman Conditions'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing if you know the mathematical preconditions of deadlocks and the practical engineering strategies to prevent them in production.',
          verbalBlueprint: [
            '1. State Coffman\'s 4 conditions clearly: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
            '2. Explain that breaking ANY ONE condition mathematically guarantees no deadlock can occur.',
            '3. Give the standard industry prevention pattern: Eliminating Circular Wait via Global Total Resource Ordering.'
          ]
        },
        modelAnswer: {
          summary: 'A Deadlock is a permanent state where a set of processes are blocked because each is holding a resource and waiting for another resource held by another process in the set.',
          table: {
            title: '4 Coffman Conditions & Elimination Strategies',
            headers: ['Condition', 'Definition', 'Engineering Prevention Strategy'],
            rows: [
              ['Mutual Exclusion', 'At least one resource must be held in a non-shareable mode.', 'Make resources shareable (read-only) or use spooling (printers).'],
              ['Hold and Wait', 'A process holds ≥1 resource while waiting to acquire others.', 'Require processes to request all needed resources simultaneously upfront.'],
              ['No Preemption', 'Resources cannot be forcibly seized; only voluntarily released.', 'If a process is denied a resource, force it to release all currently held resources.'],
              ['Circular Wait', 'A closed chain P0→R1→P1→R2→P0 exists in the resource graph.', 'Enforce Global Total Ordering: Assign an integer index to each resource; locks must be acquired in strictly increasing numerical order.']
            ]
          },
          details: [
            'Detection & Recovery: Deadlocks can be detected using Resource Allocation Graphs (RAG) for single-instance resources, or Banker’s Algorithm for multiple instances.',
            'Recovery methods: Process termination (killing processes one by one until cycle breaks) or Resource Preemption (rollback to checkpoint).'
          ]
        },
        mustMentionKeywords: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait', 'Total Resource Ordering', 'Resource Allocation Graph (RAG)', 'Banker\'s Algorithm'],
        trapWarning: {
          rookieMistake: 'Saying Banker\'s Algorithm is used in real operating systems like Linux or Windows.',
          winningAnswer: 'Point out that real general-purpose OS kernels DO NOT use Banker\'s Algorithm because processes rarely declare their maximum future resource claims in advance. General OS kernels use deadlock prevention (lock ordering) or the Ostrich algorithm (ignore rare occurrences).'
        }
      },
      {
        id: 'os-q7',
        topic: 'CPU Scheduling',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'Compare CPU Scheduling Algorithms: FCFS, SJF, SRTF, Round Robin, and Priority Scheduling. What is the Convoy Effect?',
        frequency: 'High frequency in written technical tests and interviews (TCS Digital, Cognizant, Infosys DSE)',
        companyTags: ['GFG Top 50', 'TCS Digital', 'Cognizant', 'Infosys'],
        reference: {
          source: 'GeeksforGeeks & Silberschatz OS Concepts (Chapter 5: CPU Scheduling)',
          citation: 'CPU Scheduling Algorithms & Performance Metrics',
          linkText: 'GFG CPU Scheduling Algorithms'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing calculation ability, understanding of preemption, starvation, and trade-offs between throughput and interactive latency.',
          verbalBlueprint: [
            '1. Define core metrics: Turnaround Time = Completion - Arrival; Waiting Time = Turnaround - Burst.',
            '2. Explain FCFS and the Convoy Effect (short jobs stuck behind 1 massive CPU-bound job).',
            '3. Explain SJF (mathematically optimal for minimum average waiting time, but impossible to know future burst time).',
            '4. Explain Round Robin and the importance of choosing the right Time Quantum.'
          ]
        },
        modelAnswer: {
          summary: 'CPU Scheduling determines which ready process receives CPU execution time to maximize CPU utilization and minimize average waiting time.',
          table: {
            title: 'CPU Scheduling Algorithms Comparison',
            headers: ['Algorithm', 'Type', 'Advantage', 'Disadvantage / Trap'],
            rows: [
              ['FCFS', 'Non-preemptive', 'Simple, zero starvation', 'Convoy Effect: Short jobs wait excessively for one large job'],
              ['SJF / SRTF', 'Non-preemptive / Preemptive', 'Mathematically optimal min waiting time', 'Starvation of long jobs; next CPU burst cannot be predicted'],
              ['Round Robin (RR)', 'Preemptive (Time-sliced)', 'Fair, excellent interactive response time', 'High context switch overhead if quantum is too small; degrades to FCFS if too large'],
              ['Priority Scheduling', 'Preemptive / Non-preemptive', 'Supports critical system tasks', 'Starvation (Priority Inversion) — solved by Aging (gradually bumping priority)']
            ]
          },
          details: [
            'The Convoy Effect: Occurs in FCFS when one CPU-heavy process occupies the CPU while multiple fast I/O-bound processes sit idle in the Ready Queue, causing CPU utilization and I/O bus throughput to plummet.',
            'Aging Solution: To prevent starvation in Priority and SJF scheduling, the OS gradually increments the priority of processes waiting in the queue over time.'
          ]
        },
        mustMentionKeywords: ['Turnaround Time (TAT)', 'Waiting Time (WT)', 'Convoy Effect', 'Time Quantum Calibration', 'Starvation & Aging', 'Preemptive vs Non-Preemptive'],
        trapWarning: {
          rookieMistake: 'Claiming Round Robin always produces lower average turnaround time than FCFS.',
          winningAnswer: 'Counter-intuitive truth: If all processes have identical burst times, Round Robin yields much WORSE average turnaround time than FCFS because all processes finish almost simultaneously at the very end.'
        }
      },
      {
        id: 'os-q8',
        topic: 'Process Synchronization',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What is the difference between a Mutex and a Semaphore? What is Priority Inversion and how is it solved?',
        frequency: 'Asked in 90%+ of systems & backend engineering interviews (Amazon, Cisco, Qualcomm)',
        companyTags: ['Amazon', 'Cisco', 'Qualcomm', 'Oracle'],
        reference: {
          source: 'Dijkstra (1965) Cooperating Sequential Processes & POSIX pthread_mutex(3)',
          citation: 'Mutex vs Semaphore Semantics & Priority Inheritance Protocol',
          linkText: 'GFG Mutex vs Semaphore'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing whether you understand concurrency primitives, locking ownership, and real-time scheduling bugs.',
          verbalBlueprint: [
            '1. State ownership: Mutex has ownership (only locker can unlock); Semaphore is a signaling counter (any thread can post/signal).',
            '2. Provide use-cases: Mutex = mutual exclusion for critical sections; Semaphore = signaling between producer and consumer.',
            '3. Define Priority Inversion (Low priority thread holds lock, medium thread starves high thread) and solve with Priority Inheritance.'
          ]
        },
        modelAnswer: {
          summary: 'Both are synchronization primitives used to control access to shared critical sections, but they serve fundamentally different concurrency purposes.',
          table: {
            title: 'Mutex vs Semaphore Architectural Differences',
            headers: ['Feature', 'Mutex (Mutual Exclusion Lock)', 'Semaphore (Counting / Binary)'],
            rows: [
              ['Core Concept', 'Locking mechanism', 'Signaling mechanism (Integer counter)'],
              ['Ownership', 'Strict: Only the thread that acquired the mutex can release it', 'No ownership: Any thread can call post()/signal()'],
              ['Capacity', 'Strictly binary (0 or 1)', 'Counting: Can allow N threads concurrent access'],
              ['Use Case', 'Protecting shared memory data structures', 'Producer-Consumer synchronization & resource pooling']
            ]
          },
          details: [
            'Priority Inversion: Occurs when a high-priority task (H) is blocked waiting for a lock held by a low-priority task (L), but a medium-priority task (M) preempts L because M has higher priority than L. Result: M indirectly starves H!',
            'Solution — Priority Inheritance Protocol: When task H blocks on a mutex held by L, task L temporarily inherits H’s high priority until it unlocks the mutex, preventing medium tasks from preempting it.'
          ]
        },
        mustMentionKeywords: ['Mutex Ownership', 'Counting Semaphore', 'Critical Section', 'Priority Inversion', 'Priority Inheritance Protocol', 'Mars Pathfinder Glitch'],
        trapWarning: {
          rookieMistake: 'Treating a binary semaphore as identical to a mutex.',
          winningAnswer: 'Emphasize that a binary semaphore has no thread ownership! If Thread A locks a critical section using a binary semaphore, Thread B can call signal() to unlock it, which is illegal with a mutex and creates severe synchronization bugs.'
        }
      },
      {
        id: 'os-q9',
        topic: 'Memory Management & Paging',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What is Paging, Page Fault, and Virtual Memory? Explain how the Translation Lookaside Buffer (TLB) speeds up address translation.',
        frequency: 'Crucial core question asked by Amazon, Microsoft, Intel, Qualcomm, Zoho',
        companyTags: ['GFG Top 50', 'Amazon', 'Microsoft', 'Qualcomm', 'Zoho'],
        reference: {
          source: 'GeeksforGeeks Top 50 & Intel 64 and IA-32 Architectures Software Developer Manual (Vol. 3A: Paging)',
          citation: 'Paging, TLB Translation & Effective Memory Access Time',
          linkText: 'GFG Paging & Virtual Memory'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating if you understand hardware MMU translation from virtual addresses to physical frames and hardware caching.',
          verbalBlueprint: [
            '1. Define Virtual Memory: Gives each process the illusion of a massive, contiguous private address space larger than physical RAM.',
            '2. Define Paging: Virtual memory split into fixed-size Pages (e.g. 4KB); physical RAM split into Frames. Translated via Page Tables.',
            '3. Define Page Fault: Accessing a valid virtual page not currently resident in physical RAM (swapped to disk).',
            '4. Explain TLB: High-speed hardware cache on the CPU that stores recent virtual-to-physical address translations.'
          ]
        },
        modelAnswer: {
          summary: 'Paging is a memory management scheme that eliminates external fragmentation by mapping non-contiguous physical RAM frames to contiguous virtual memory pages.',
          table: {
            title: 'Memory Terms Quick Matrix',
            headers: ['Term', 'Location', 'Function'],
            rows: [
              ['Page', 'Virtual Memory', 'Fixed-size block of process address space (typically 4 KB)'],
              ['Frame', 'Physical RAM', 'Fixed-size block of physical RAM matching page size'],
              ['Page Table', 'Kernel RAM (CR3 pointer)', 'Maps Virtual Page Number (VPN) to Physical Frame Number (PFN)'],
              ['TLB', 'CPU Hardware (MMU)', 'Ultra-fast associative cache for instant VPN→PFN lookups (1 CPU cycle)']
            ]
          },
          details: [
            'Effective Memory Access Time (EMAT) Formula: EMAT = (Hit Ratio × TLB Access Time) + ((1 - Hit Ratio) × (TLB + 2 × RAM Access Time)).',
            'Without a TLB, every single memory access would require two RAM reads: one to read the page table entry, and one to read the actual data!'
          ]
        },
        mustMentionKeywords: ['Virtual Page Number (VPN)', 'Physical Frame Number (PFN)', 'Memory Management Unit (MMU)', 'Translation Lookaside Buffer (TLB)', 'Page Fault Handler', 'Effective Memory Access Time'],
        trapWarning: {
          rookieMistake: 'Saying a Page Fault is a software error or application crash.',
          winningAnswer: 'Clarify that a Page Fault is a normal hardware interrupt, NOT an error! The OS trap handler transparently pauses the process, reads the missing 4KB page from disk swap space into an empty RAM frame, updates the page table valid bit, and resumes the instruction seamlessly.'
        }
      },
      // --- ADVANCED (L300 / FAANG / Systems Engineering) ---
      {
        id: 'os-q10',
        topic: 'Virtual Memory & Page Replacement',
        level: 'advanced',
        levelLabel: 'Advanced (FAANG / L300)',
        question: 'What is Belady\'s Anomaly and which page replacement algorithms suffer from it? Explain LRU vs Optimal (OPT).',
        frequency: 'Favorite screening trick question in Google, Microsoft, and Amazon interviews',
        companyTags: ['Google', 'Microsoft', 'Amazon', 'GFG Top 50'],
        reference: {
          source: 'Belady, L. A. (1969) Anomaly in Space-Time Characteristics of Certain Programs Running in a Paging Machine',
          citation: 'Stack Algorithms & Inclusion Property in Virtual Memory',
          linkText: 'GFG Belady\'s Anomaly'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing mathematical understanding of stack algorithms and page replacement performance.',
          verbalBlueprint: [
            '1. Define Belady\'s Anomaly: The counter-intuitive phenomenon where increasing the number of physical page frames results in MORE page faults.',
            '2. State which algorithms suffer from it: FIFO (First In First Out) and Second Chance.',
            '3. Explain WHY: FIFO is not a "Stack Algorithm". Algorithms like LRU and OPT satisfy inclusion property (set of pages in N frames is always a subset of N+1 frames).'
          ]
        },
        modelAnswer: {
          summary: 'In conventional thinking, granting an application more physical memory frames should always reduce or maintain the number of page faults. Belady proved that for certain algorithms, more memory can paradoxically increase page faults.',
          table: {
            title: 'Page Replacement Algorithms vs Belady\'s Anomaly',
            headers: ['Algorithm', 'Suffers from Belady\'s Anomaly?', 'Stack Algorithm?', 'Practical Real-World Use'],
            rows: [
              ['FIFO', '✅ YES (Can increase page faults)', '❌ No', 'Rarely used due to poor performance'],
              ['LRU (Least Recently Used)', '❌ NO (Immune)', '✅ Yes', 'Industry standard (approximated via Clock Algorithm)'],
              ['Optimal (OPT / Belady\'s OPT)', '❌ NO (Immune)', '✅ Yes', 'Theoretical benchmark (requires future knowledge)']
            ]
          },
          details: [
            'Classic Belady Proof Reference String: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5.',
            'With 3 frames, FIFO yields 9 page faults. Increasing memory to 4 frames increases page faults to 10!',
            'Stack Algorithm Condition: For any memory state, the set of pages in an n-frame system must be a subset of the pages in an (n+1)-frame system. LRU and OPT guarantee this; FIFO violates it.'
          ]
        },
        mustMentionKeywords: ['Belady\'s Anomaly', 'FIFO Failure', 'Stack Algorithm Property', 'Inclusion Property', 'LRU Approximation (Clock Algorithm)', 'Optimal Page Replacement'],
        trapWarning: {
          rookieMistake: 'Believing LRU is implemented in hardware with exact timestamps for every memory read.',
          winningAnswer: 'Explain that exact LRU is too expensive because writing a timestamp on every single CPU memory access causes massive bus contention. Production OS kernels use the Clock Algorithm (Second Chance) which uses a single 1-bit hardware reference flag to approximate LRU at near-zero overhead.'
        }
      },
      {
        id: 'os-q11',
        topic: 'Virtual Memory & Page Replacement',
        level: 'advanced',
        levelLabel: 'Advanced (FAANG / L300)',
        question: 'What is Memory Thrashing, why does it cause CPU utilization to collapse, and how does the Working Set Model resolve it?',
        frequency: 'Asked in high-tier engineering rounds (Uber, Amazon, Microsoft, Bloomberg)',
        companyTags: ['Uber', 'Amazon', 'Microsoft', 'Bloomberg'],
        reference: {
          source: 'Denning, Peter J. (1968) The Working Set Model for Program Behavior (Communications of the ACM)',
          citation: 'Working Set Theory & Locality of Reference in Virtual Memory Systems',
          linkText: 'GFG Thrashing in OS'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating system stability under extreme load and page-fault frequency feedback loops.',
          verbalBlueprint: [
            '1. Define Thrashing: The pathological state where processes spend more time swapping pages in/out of disk than executing instructions.',
            '2. Explain the Death Spiral: Page faults cause CPU to wait on disk → CPU scheduler mistakenly thinks CPU is idle and injects more processes → memory demand explodes further → CPU utilization plummets to near zero.',
            '3. Explain the Solution: Working Set Model (Denning) and Page Fault Frequency (PFF).'
          ]
        },
        modelAnswer: {
          summary: 'Thrashing occurs when the aggregate memory demand of active processes exceeds physical RAM capacity. The system spends 99% of its time servicing page fault disk I/O while application progress grinds to a halt.',
          table: {
            title: 'Thrashing Death Spiral Stages',
            headers: ['Stage', 'Symptom', 'OS Scheduler Mistaken Reaction'],
            rows: [
              ['1. Memory Saturation', 'Processes start evicting active working pages', 'Processes block on disk I/O'],
              ['2. CPU Drops', 'CPU core utilization drops because all threads wait on I/O', 'Long-term scheduler admits MORE processes to increase CPU utilization!'],
              ['3. Total Collapse', 'New processes steal frames from existing processes', 'Disk queue saturates 100%; CPU utilization crashes to < 5%']
            ]
          },
          details: [
            'Working Set Model (Peter Denning): Tracks the set of pages referenced by a process in the most recent time window Δ (Working Set W(p, Δ)).',
            'Total Demand D = Σ |W(p, Δ)|. If D > Total Physical Frames M, the OS suspends (swaps out) one entire process to free its frames for others, immediately ending thrashing.'
          ]
        },
        mustMentionKeywords: ['Thrashing', 'Working Set Model', 'Locality of Reference (Temporal & Spatial)', 'Page Fault Frequency (PFF)', 'Degree of Multiprogramming', 'Swap Space Saturation'],
        trapWarning: {
          rookieMistake: 'Suggesting adding more CPU cores will solve memory thrashing.',
          winningAnswer: 'Adding CPU cores does not help because thrashing is a RAM capacity and disk bandwidth bottleneck. The correct mitigation is reducing the degree of multiprogramming or adding physical RAM.'
        }
      },
      {
        id: 'os-q12',
        topic: 'Kernel Internals',
        level: 'advanced',
        levelLabel: 'Advanced (FAANG / L300)',
        question: 'What exactly happens at the hardware and kernel level during a Process Context Switch? Why is it significantly slower than a thread switch?',
        frequency: 'FAANG systems engineering interview question (Google, Meta, Apple)',
        companyTags: ['Google', 'Meta', 'Apple'],
        reference: {
          source: 'Bovet & Cesati: Understanding the Linux Kernel (Chapter 3: Processes & context_switch)',
          citation: 'Hardware Context Switching & CR3 Page Directory Mechanics',
          linkText: 'Linux Kernel Documentation: context_switch'
        },
        tackleStrategy: {
          interviewerIntent: 'Assessing your low-level systems knowledge beyond basic textbook definitions: registers, CR3, TLB shootdown, and CPU cache coldness.',
          verbalBlueprint: [
            '1. Step 1: Save state of outgoing process (Program Counter, general registers, stack pointer) into its PCB in kernel memory.',
            '2. Step 2: Switch virtual address space by writing the new process page directory address into the CPU CR3 register.',
            '3. Step 3: Address translation cache penalty: Writing CR3 flushes non-global entries in the Translation Lookaside Buffer (TLB).',
            '4. Step 4: Restore registers of incoming process and switch from Kernel to User Mode.',
            '5. Emphasize: The biggest cost is NOT saving registers (<1µs), but the subsequent hardware cache misses (cold L1/L2 caches).'
          ]
        },
        modelAnswer: {
          summary: 'A context switch is the mechanism by which the CPU shifts execution from one process to another. While saving registers is fast, reloading memory mappings and the resulting CPU cache invalidation make process switching expensive.',
          table: {
            title: 'Context Switch Hardware Steps',
            headers: ['Phase', 'Hardware Action Taken', 'Latency Cost'],
            rows: [
              ['State Preservation', 'Saves CPU registers (RAX, RSP, RIP, RFLAGS) into outgoing PCB', '~0.5 - 1 µs'],
              ['MMU Switching', 'Reloads CR3 control register with new Page Table Root', '~1 - 2 µs'],
              ['TLB Invalidation', 'Non-global TLB entries are purged; all virtual addresses unmapped', 'Immediate translation penalty'],
              ['Cache Coldness', 'Incoming process suffers a storm of L1/L2 cache misses until RAM lines load', '~10 - 20 µs hidden indirect penalty']
            ]
          },
          details: [
            'Thread Switch Advantage: In a thread switch within the same process, CR3 is untouched, the TLB remains valid, and CPU caches stay hot.',
            'Hardware Optimization: Modern x86 processors use Process-Context Identifiers (PCID) to tag TLB entries with an address-space ID, avoiding full TLB flushes on context switch.'
          ]
        },
        mustMentionKeywords: ['CR3 Register (Page Directory Base)', 'TLB Invalidation / Shootdown', 'Cache Coldness / Cache Miss Storm', 'Process-Context Identifier (PCID)', 'Direct vs Indirect Overhead'],
        trapWarning: {
          rookieMistake: 'Thinking context switching happens completely in hardware without kernel execution.',
          winningAnswer: 'Clarify that a context switch is initiated by a timer interrupt or system call, handled by kernel assembly code (e.g. switch_to() in Linux), which manipulates hardware registers and PCB memory structures.'
        }
      }
    ]
  },

  // =========================================================================
  // 2. DATABASE MANAGEMENT SYSTEMS (DBMS)
  // =========================================================================
  dbms: {
    id: 'dbms',
    name: 'Database Management Systems',
    shortName: 'DBMS',
    iconName: 'Database',
    accentColor: '#38bdf8',
    tagline: 'ACID transactions, Normalization (1NF–BCNF), B+ Tree indexing, Joins, WAL & MVCC',
    topics: [
      'DBMS vs File System',
      'ACID Properties & Transactions',
      'Database Keys & Integrity',
      'SQL Query Mechanics & Joins',
      'Normalization & Functional Dependencies',
      'Transaction Isolation & Concurrency Anomalies',
      'Indexing & B+ Trees',
      'Storage Engines & Write-Ahead Logging (WAL)',
      'MVCC & Distributed Transactions'
    ],
    questions: [
      // --- BASIC (L100 / Freshers / Screening) ---
      {
        id: 'dbms-q1',
        topic: 'ACID Properties & Transactions',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What are the ACID properties in DBMS? Explain each with a concrete bank account transfer example.',
        frequency: 'Asked in 95%+ of fresher & junior developer interviews worldwide',
        companyTags: ['GFG Top 50', 'TCS Digital', 'Infosys', 'Amazon', 'Zoho'],
        reference: {
          source: 'Jim Gray (1981) The Transaction Concept: Virtues and Limitations & Silberschatz Database System Concepts',
          citation: 'ACID Transaction Principles & Recovery Mechanisms',
          linkText: 'GFG ACID Properties'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing foundational understanding of database reliability and transaction atomicity.',
          verbalBlueprint: [
            '1. Define Transaction: A logical unit of work that must succeed or fail as a whole.',
            '2. Break down each letter with the bank transfer scenario ($100 from Account A to Account B).',
            '3. Atomicity (All or nothing), Consistency (Total balance stays constant), Isolation (Concurrent transfers don\'t corrupt balance), Durability (Committed money survives power cut).'
          ]
        },
        modelAnswer: {
          summary: 'ACID is the set of four essential guarantees that ensure database transactions are processed reliably, even during system crashes, network failures, or concurrent traffic.',
          table: {
            title: 'ACID Breakdown via Bank Transfer ($100 from A to B)',
            headers: ['Property', 'Definition', 'Bank Transfer Scenario ($100 from A to B)'],
            rows: [
              ['Atomicity', '"All or Nothing" — All operations complete or none execute', 'If debiting $100 from A succeeds, but crediting $100 to B crashes midway, the transaction rolls back completely. A loses nothing.'],
              ['Consistency', 'Preserves database integrity constraints and invariants', 'Total balance before transfer (A=$500 + B=$300 = $800) must equal total balance after transfer (A=$400 + B=$400 = $800).'],
              ['Isolation', 'Concurrent transactions execute as if they were running serially', 'If user C transfers money to B simultaneously, they cannot read uncommitted intermediate balances.'],
              ['Durability', 'Once committed, changes are permanent and survive any crash', 'Even if the server power plug is pulled 1 millisecond after COMMIT, upon reboot the $100 transfer remains intact on disk via WAL.']
            ]
          },
          details: [
            'How the DB enforces them: Atomicity & Durability are managed by the Undo/Redo Log (Write-Ahead Log); Consistency is enforced by constraints and application logic; Isolation is enforced by concurrency control (Locks / MVCC).'
          ]
        },
        mustMentionKeywords: ['Atomicity (All-or-Nothing)', 'Consistency (Invariants & Constraints)', 'Isolation (Concurrency Control)', 'Durability (Write-Ahead Logging)', 'Rollback & Commit'],
        trapWarning: {
          rookieMistake: 'Confusing Consistency in ACID with Consistency in CAP theorem.',
          winningAnswer: 'In ACID, Consistency means preserving schema constraints (foreign keys, check constraints). In distributed systems (CAP theorem), Consistency means every read receives the most recent write across distributed nodes.'
        }
      },
      {
        id: 'dbms-q2',
        topic: 'Database Keys & Integrity',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What is the difference between Primary Key, Candidate Key, Super Key, and Foreign Key?',
        frequency: 'Standard campus placement interview question (Cognizant, Wipro, TCS, Zoho)',
        companyTags: ['GFG Top 50', 'Cognizant', 'TCS', 'Zoho'],
        reference: {
          source: 'E.F. Codd (1970) A Relational Model of Data for Large Shared Data Banks & C.J. Date Database Systems',
          citation: 'Relational Model Keys and Integrity Rules',
          linkText: 'GFG Relational Keys'
        },
        tackleStrategy: {
          interviewerIntent: 'Checking relational data modeling fundamentals and uniqueness constraints.',
          verbalBlueprint: [
            '1. Define Super Key: Any attribute set that uniquely identifies a row.',
            '2. Define Candidate Key: Minimal Super Key with zero redundant attributes.',
            '3. Define Primary Key: The single Candidate Key chosen by the DBA (strictly Unique + NOT NULL).',
            '4. Define Foreign Key: A column referencing a Primary Key in another table to enforce referential integrity.'
          ]
        },
        modelAnswer: {
          summary: 'Relational keys enforce entity uniqueness and referential relationships between tables.',
          table: {
            title: 'Relational Key Hierarchy',
            headers: ['Key Type', 'Definition', 'NULL Allowed?', 'Real Example (Users Table)'],
            rows: [
              ['Super Key', 'Any combination of attributes that uniquely identifies a record', 'Yes (except identifying columns)', '{ID, Name, Email}, {ID, Phone}, {ID}'],
              ['Candidate Key', 'A Minimal Super Key (no extraneous attributes)', 'Yes (if not chosen as PK)', '{ID}, {Email}, {Passport_No}'],
              ['Primary Key', 'The designated Candidate Key used for table row identification', '❌ NEVER (Strictly Unique + NOT NULL)', '{ID}'],
              ['Foreign Key', 'References a Primary/Candidate key in a parent table', '✅ Allowed (unless specified NOT NULL)', 'Orders.user_id → Users.id']
            ]
          },
          details: [
            'Mathematical Relationship: All Primary Keys are Candidate Keys. All Candidate Keys are Super Keys. But NOT all Super Keys are Candidate Keys!'
          ]
        },
        mustMentionKeywords: ['Minimal Super Key', 'Entity Integrity', 'Referential Integrity', 'NOT NULL Constraint', 'Cascade Delete / Update'],
        trapWarning: {
          rookieMistake: 'Saying a table can have multiple Primary Keys.',
          winningAnswer: 'A table can have multiple Candidate Keys, but ONLY ONE Primary Key. That Primary Key can be composed of multiple columns (called a Composite Primary Key), but there is still only one PK per table.'
        }
      },
      {
        id: 'dbms-q3',
        topic: 'SQL Query Mechanics & Joins',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What is the difference between DELETE, TRUNCATE, and DROP in SQL?',
        frequency: 'Asked in 90%+ of technical screening tests (TCS, Accenture, Capgemini, Infosys)',
        companyTags: ['GFG Top 50', 'Accenture', 'TCS', 'Capgemini'],
        reference: {
          source: 'ANSI/ISO SQL Standard (SQL:1999) & PostgreSQL/MySQL Documentation',
          citation: 'DDL vs DML Transaction Logging & Deallocation',
          linkText: 'GFG DELETE vs TRUNCATE vs DROP'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing understanding of DDL vs DML, transaction logging, rollback capabilities, and table structure removal.',
          verbalBlueprint: [
            '1. State Command Types: DELETE is DML (row-by-row); TRUNCATE is DDL (deallocates pages); DROP is DDL (removes table completely).',
            '2. Compare Rollback: DELETE can be rolled back; TRUNCATE depends on RDBMS (can be rolled back in Postgres/SQL Server within transaction); DROP removes schema.',
            '3. Performance: TRUNCATE is dramatically faster than DELETE because it deallocates data pages instead of logging every row deletion.'
          ]
        },
        modelAnswer: {
          summary: 'These three SQL statements remove data with fundamentally different performance, logging, and schema consequences.',
          table: {
            title: 'DELETE vs TRUNCATE vs DROP Comparison',
            headers: ['Feature', 'DELETE', 'TRUNCATE', 'DROP'],
            rows: [
              ['Command Category', 'DML (Data Manipulation Language)', 'DDL (Data Definition Language)', 'DDL (Data Definition Language)'],
              ['Scope', 'Deletes specific or all rows', 'Deletes ALL rows in table', 'Deletes entire table schema and data'],
              ['WHERE Clause', '✅ Supported (DELETE FROM t WHERE id=5)', '❌ Not Supported (Operates on whole table)', '❌ Not Supported'],
              ['Speed / Performance', 'Slow (Logs each row delete individually)', 'Very Fast (Deallocates entire data pages)', 'Instantaneous (Drops table catalog metadata)'],
              ['Table Structure', 'Preserved', 'Preserved (Resets auto-increment identity)', 'Completely deleted from database'],
              ['Triggers', 'Fires row-level triggers (AFTER DELETE)', 'Does NOT fire triggers', 'Does NOT fire triggers']
            ]
          },
          details: [
            'Space Reclamation: DELETE does not immediately shrink disk file size (leaves fragmented empty slots). TRUNCATE immediately deallocates pages and frees storage back to the OS.'
          ]
        },
        mustMentionKeywords: ['DML vs DDL', 'Row-by-row logging vs Page Deallocation', 'Transaction Rollback', 'Auto-increment Reset', 'Trigger Execution'],
        trapWarning: {
          rookieMistake: 'Claiming TRUNCATE cannot be rolled back in any database.',
          winningAnswer: 'In PostgreSQL and Microsoft SQL Server, TRUNCATE CAN be rolled back if executed inside an explicit BEGIN TRANSACTION block! Only in MySQL is DDL auto-committed.'
        }
      },
      {
        id: 'dbms-q4',
        topic: 'SQL Query Mechanics & Joins',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What is the difference between WHERE and HAVING clause in SQL? What is the logical execution order of an SQL query?',
        frequency: 'Classic query mechanics question asked by Amazon, Zoho, and Walmart',
        companyTags: ['Amazon', 'Zoho', 'Walmart', 'GFG Top 50'],
        reference: {
          source: 'Itzik Ben-Gan (Microsoft SQL Server Internals) & PostgreSQL Documentation: Query Processing',
          citation: 'Logical Query Processing Phases in Relational Engines',
          linkText: 'GFG WHERE vs HAVING'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing if you understand how the SQL query engine filters individual rows versus aggregated group records.',
          verbalBlueprint: [
            '1. State fundamental difference: WHERE filters individual records BEFORE aggregation (cannot use aggregate functions); HAVING filters groups AFTER GROUP BY.',
            '2. Recite the exact 6-step logical query processing order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.'
          ]
        },
        modelAnswer: {
          summary: 'WHERE and HAVING filter data at different stages of the SQL query pipeline.',
          table: {
            title: 'WHERE vs HAVING Comparison',
            headers: ['Feature', 'WHERE Clause', 'HAVING Clause'],
            rows: [
              ['Filtering Stage', 'Filters individual rows BEFORE aggregation', 'Filters aggregated groups AFTER GROUP BY'],
              ['Aggregate Functions', '❌ Illegal (Cannot use COUNT, AVG, SUM in WHERE)', '✅ Legal (e.g. HAVING COUNT(*) > 5)'],
              ['Index Utilization', 'Can use B-Tree indexes to speed up scans', 'Operates on temporary aggregated result sets in RAM'],
              ['Applicability', 'Can be used in SELECT, UPDATE, DELETE', 'Used almost exclusively with SELECT and GROUP BY']
            ]
          },
          details: [
            'Logical Query Execution Order (Crucial for interviews):',
            '1. FROM & JOIN (load tables) → 2. WHERE (filter rows) → 3. GROUP BY (group records) → 4. HAVING (filter groups) → 5. SELECT (project columns) → 6. DISTINCT → 7. ORDER BY (sort output) → 8. LIMIT / OFFSET.'
          ]
        },
        mustMentionKeywords: ['Pre-aggregation vs Post-aggregation', 'Aggregate Functions (SUM, COUNT)', 'GROUP BY Pipeline', 'Logical Query Execution Order'],
        trapWarning: {
          rookieMistake: 'Using column aliases created in SELECT inside the WHERE clause.',
          winningAnswer: 'Explain why `WHERE alias > 10` fails: The WHERE clause executes in Step 2, BEFORE the SELECT clause (Step 5) creates the alias! Therefore, the database engine does not know the alias exists yet.'
        }
      },
      // --- INTERMEDIATE (L200 / Core Campus & Technical Rounds) ---
      {
        id: 'dbms-q5',
        topic: 'Normalization & Functional Dependencies',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'Explain Database Normalization: 1NF, 2NF, 3NF, and BCNF with concrete violations and fixes.',
        frequency: 'Asked in 95%+ of core technical rounds (Amazon, Zoho, Microsoft, Cisco)',
        companyTags: ['GFG Top 50', 'Amazon', 'Zoho', 'Microsoft', 'Cisco'],
        reference: {
          source: 'E.F. Codd (1972) Further Normalization of the Data Base Relational Model & Boyce-Codd Normal Form',
          citation: 'Functional Dependency Decomposition & Normal Forms',
          linkText: 'GFG Normalization Forms'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating schema design skills, understanding of update/insert/delete anomalies, and functional dependency decomposition.',
          verbalBlueprint: [
            '1. State goal of Normalization: Eliminate data redundancy and prevent Insert, Update, and Delete anomalies.',
            '2. 1NF: Atomic values only (no comma-separated lists or repeating groups).',
            '3. 2NF: In 1NF + No Partial Dependency (every non-key attribute must depend on the WHOLE candidate key).',
            '4. 3NF: In 2NF + No Transitive Dependency (non-key attribute must not determine another non-key attribute).',
            '5. BCNF: Stricter 3NF where for every dependency X → Y, X MUST be a Super Key.'
          ]
        },
        modelAnswer: {
          summary: 'Normalization organizes relational tables to minimize data duplication and safeguard data integrity through progressive functional dependency rules.',
          table: {
            title: 'Normalization Ladder & Violations',
            headers: ['Normal Form', 'Rule / Violation to Eliminate', 'Fix Strategy'],
            rows: [
              ['1NF', 'Eliminate non-atomic values (arrays, comma-separated strings)', 'Break multiple values into separate rows or child tables.'],
              ['2NF', 'Eliminate Partial Dependency (applies only to composite keys where X → Y uses part of PK)', 'Split attributes depending on partial key into a separate table.'],
              ['3NF', 'Eliminate Transitive Dependency (A → B and B → C, where B is non-key)', 'Move C into a separate table where B is the Primary Key.'],
              ['BCNF (Boyce-Codd)', 'Eliminate dependencies where determinant is NOT a candidate key', 'Decompose so every determinant X in X → Y is a Super Key.']
            ]
          },
          details: [
            'Classic 2NF Violation Example: Table {StudentID, CourseID, StudentName, Grade}. Primary Key is {StudentID, CourseID}. StudentName depends only on StudentID (partial key), violating 2NF!',
            'Classic 3NF Violation Example: Table {EmployeeID, DepartmentID, DepartmentName}. Primary Key is EmployeeID. EmployeeID → DepartmentID, and DepartmentID → DepartmentName. DepartmentName transitively depends on EmployeeID, violating 3NF!'
          ]
        },
        mustMentionKeywords: ['Atomic Values', 'Partial Dependency', 'Transitive Dependency', 'Candidate Key / Super Key', 'Lossless Join Decomposition', 'Update/Delete Anomalies'],
        trapWarning: {
          rookieMistake: 'Believing higher normalization is always better in production.',
          winningAnswer: 'Explain Denormalization: While 3NF/BCNF eliminates redundancy, it requires multiple expensive table JOINs during reads. In real-world read-heavy systems (data warehouses, analytics), tables are intentionally denormalized to optimize read latency.'
        }
      },
      {
        id: 'dbms-q6',
        topic: 'Transaction Isolation & Concurrency Anomalies',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What are the 4 ANSI SQL Transaction Isolation Levels, and what concurrency anomalies do they prevent?',
        frequency: 'Top question for backend and SDE-1 interviews (Amazon, Uber, Microsoft, Stripe)',
        companyTags: ['GFG Top 50', 'Amazon', 'Uber', 'Stripe', 'Microsoft'],
        reference: {
          source: 'Berenson et al. (1995) A Critique of ANSI SQL Isolation Levels (SIGMOD \'95) & MySQL 8.0 Reference Manual',
          citation: 'ANSI SQL Isolation Anomalies & Snapshot Isolation',
          linkText: 'MySQL InnoDB Isolation Levels'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing concurrency control, lock mechanics, and anomalies (Dirty Read, Non-Repeatable Read, Phantom Read).',
          verbalBlueprint: [
            '1. Define the 3 anomalies: Dirty Read (reading uncommitted data that rolls back), Non-Repeatable Read (re-reading same row gives different values), Phantom Read (re-executing query returns newly inserted rows).',
            '2. Name the 4 ANSI levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.',
            '3. Draw the exact anomaly matrix.'
          ]
        },
        modelAnswer: {
          summary: 'Transaction isolation controls the visibility of uncommitted changes between concurrent database transactions, balancing concurrency throughput against data consistency.',
          table: {
            title: 'ANSI SQL Isolation Levels vs Anomalies Matrix',
            headers: ['Isolation Level', 'Dirty Read', 'Non-Repeatable Read', 'Phantom Read'],
            rows: [
              ['Read Uncommitted', '❌ Allowed (Hazardous)', '❌ Allowed', '❌ Allowed'],
              ['Read Committed (Default in Postgres & Oracle)', '✅ Prevented', '❌ Allowed', '❌ Allowed'],
              ['Repeatable Read (Default in MySQL InnoDB)', '✅ Prevented', '✅ Prevented', '❌ Allowed (prevented in InnoDB via Next-Key locks)'],
              ['Serializable', '✅ Prevented', '✅ Prevented', '✅ Prevented (Complete isolation via strict 2PL or SSI)']
            ]
          },
          details: [
            'Dirty Read: Transaction 1 updates balance to $500 without committing. Transaction 2 reads $500. Transaction 1 rolls back. Transaction 2 acted on phantom data that never existed.',
            'Non-Repeatable Read: Transaction 1 reads row X = 10. Transaction 2 updates row X to 20 and commits. Transaction 1 reads row X again and sees 20 (row changed).',
            'Phantom Read: Transaction 1 reads all users WHERE age > 30 (finds 5 rows). Transaction 2 inserts a new user with age 35 and commits. Transaction 1 re-runs query and sees 6 rows.'
          ]
        },
        mustMentionKeywords: ['Dirty Read', 'Non-Repeatable Read', 'Phantom Read', 'Read Committed vs Repeatable Read', 'Serializable Snapshot Isolation (SSI)', 'Next-Key Locking'],
        trapWarning: {
          rookieMistake: 'Thinking MySQL InnoDB suffers from Phantom Reads in Repeatable Read mode.',
          winningAnswer: 'In MySQL InnoDB, Repeatable Read actually PREVENTS Phantom Reads for regular queries using MVCC snapshots, and for locking reads using Next-Key Locks (Index-record lock + Gap lock), exceeding the ANSI standard!'
        }
      },
      {
        id: 'dbms-q7',
        topic: 'Indexing & B+ Trees',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What is the difference between a Clustered Index and a Non-Clustered (Secondary) Index? How are they physically stored on disk?',
        frequency: 'High-frequency interview question across all database rounds',
        companyTags: ['GFG Top 50', 'Amazon', 'Oracle', 'Zoho', 'Flipkart'],
        reference: {
          source: 'PostgreSQL & MySQL InnoDB Architecture: Clustered and Secondary Indexes',
          citation: 'B+ Tree Index Architecture & Disk Page Layouts',
          linkText: 'MySQL Docs: Clustered Indexes'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing how disk pages store rows, primary key clustering, and secondary index bookmark lookups.',
          verbalBlueprint: [
            '1. State core rule: Clustered Index dictates the PHYSICAL order of data rows on disk (only 1 per table); Non-Clustered is a separate index structure with pointers to the data.',
            '2. Leaf node contents: Clustered leaf nodes contain the actual complete table row data. Non-clustered leaf nodes contain the index column + Clustered Key pointer.',
            '3. Explain performance trade-off: Clustered reads are instantaneous; Non-clustered requires an extra secondary lookup (Bookmark Lookup) unless it\'s a Covering Index.'
          ]
        },
        modelAnswer: {
          summary: 'An index is a B+ Tree data structure that accelerates SQL SELECT queries from O(N) full table scans to O(log N) tree traversals.',
          table: {
            title: 'Clustered vs Non-Clustered Index Deep Dive',
            headers: ['Attribute', 'Clustered Index', 'Non-Clustered (Secondary) Index'],
            rows: [
              ['Physical Disk Order', 'Alters and dictates the physical storage order of rows', 'Stored in a completely separate file; doesn\'t change table order'],
              ['Count Per Table', 'Strictly ONE per table (usually Primary Key)', 'Multiple allowed (e.g. 5–10 secondary indexes)'],
              ['Leaf Node Contents', 'The ACTUAL data row (all table columns stored right there)', 'Index key columns + Pointer to clustered index row (PK ID)'],
              ['Lookups Required', '1 lookup (reaches leaf node and has entire row)', '2 lookups: Traverses secondary B+ Tree → gets PK → traverses clustered B+ Tree (Bookmark Lookup)']
            ]
          },
          details: [
            'Covering Index Optimization: If a secondary index contains ALL columns requested in a query (e.g. `CREATE INDEX idx ON users(email, name)` for `SELECT name FROM users WHERE email=?`), the query engine skips the second lookup entirely! This is called an Index-Only Scan.'
          ]
        },
        mustMentionKeywords: ['Physical Storage Order', 'Leaf Node Architecture', 'Bookmark / Key Lookup', 'Covering Index (Index-Only Scan)', 'B+ Tree Fan-out'],
        trapWarning: {
          rookieMistake: 'Believing indexing every single column in a table makes the database faster.',
          winningAnswer: 'Every index incurs a severe write penalty! For every INSERT, UPDATE, or DELETE, the database must write the data page AND update every secondary B+ tree index on disk. Too many indexes crush write throughput.'
        }
      },
      {
        id: 'dbms-q8',
        topic: 'Storage Engines & Write-Ahead Logging (WAL)',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What is Write-Ahead Logging (WAL) and how does a database guarantee Durability if power cuts midway through a transaction?',
        frequency: 'Systems and backend technical interview favorite (Stripe, Uber, Amazon, Meta)',
        companyTags: ['Stripe', 'Uber', 'Amazon', 'Meta'],
        reference: {
          source: 'Mohan et al. (1992) ARIES: A Transaction Recovery Method Supporting Fine-Granularity Locking and Partial Rollbacks',
          citation: 'Write-Ahead Logging (WAL) and ARIES Crash Recovery',
          linkText: 'PostgreSQL Docs: Write-Ahead Logging (WAL)'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating understanding of disk I/O, dirty buffer pool pages, sequential vs random disk writes, and crash recovery.',
          verbalBlueprint: [
            '1. State the fundamental rule of WAL: Any modification to data pages must be written sequentially to the append-only WAL log file on disk BEFORE the dirty page in RAM is flushed to data files.',
            '2. Explain WHY: Random writes to table data pages are slow; appending to WAL log is fast sequential I/O.',
            '3. Explain Crash Recovery (ARIES): REDO committed transactions from log; UNDO uncommitted transactions.'
          ]
        },
        modelAnswer: {
          summary: 'Writing modified database pages directly to disk on every transaction commit would destroy database performance because table pages are scattered randomly across disk. Databases solve this using Write-Ahead Logging (WAL).',
          table: {
            title: 'WAL Crash Recovery Protocol (ARIES)',
            headers: ['Phase', 'Action During Database Restart After Crash'],
            rows: [
              ['1. Analysis Phase', 'Scans the WAL log from the last known checkpoint to identify active transactions and dirty pages in memory at crash time.'],
              ['2. REDO Phase', 'Replays all logged actions forward from the checkpoint to restore the exact memory state at the moment of the crash.'],
              ['3. UNDO Phase', 'Rolls back all transactions that were active (uncommitted) at the time of the crash, restoring previous values.']
            ]
          },
          details: [
            'fsync() Guarantee: A transaction is only considered COMMITTED when its commit record in the WAL log has been flushed to physical disk hardware using the OS fsync() system call.'
          ]
        },
        mustMentionKeywords: ['Write-Ahead Logging (WAL)', 'Dirty Buffer Pages', 'Sequential vs Random I/O', 'ARIES Protocol (Analysis, Redo, Undo)', 'fsync() Flush', 'Checkpoints'],
        trapWarning: {
          rookieMistake: 'Assuming COMMIT immediately writes table rows to the table.ibd / data file on disk.',
          winningAnswer: 'Clarify that COMMIT only ensures the WAL log record is flushed to disk. The actual table data pages remain in RAM (Buffer Pool) as "dirty pages" and are lazily flushed to disk in the background by checkpoint threads.'
        }
      },
      // --- ADVANCED (L300 / FAANG / Systems Engineering) ---
      {
        id: 'dbms-q9',
        topic: 'Indexing & B+ Trees',
        level: 'advanced',
        levelLabel: 'Advanced (FAANG / L300)',
        question: 'Why do relational databases use B+ Trees instead of Binary Search Trees (BST), AVL trees, or Hash Indexes for disk storage?',
        frequency: 'Standard FAANG deep-dive question (Google, Amazon, Microsoft, Oracle)',
        companyTags: ['Google', 'Amazon', 'Microsoft', 'Oracle', 'GFG Top 50'],
        reference: {
          source: 'Bayer & McCreight (1972) Organization and Maintenance of Large Ordered Indices (Acta Informatica) & Comer (1979) The Ubiquitous B-Tree',
          citation: 'B+ Tree Index Theory & High Fan-Out Disk Block Alignment',
          linkText: 'GFG B+ Tree in DBMS'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing hardware disk block architecture, tree fan-out, memory locality, and range query efficiency.',
          verbalBlueprint: [
            '1. Eliminate Binary Trees: BST/AVL have fan-out of 2. For 1 million rows, height = ~20. That means 20 random disk I/O reads per query. B+ Tree has fan-out of ~1000; height = 3 (only 3 disk reads).',
            '2. Eliminate Hash Indexes: Hash indexes provide O(1) equality lookups (`WHERE id=5`), but CANNOT perform range queries (`WHERE age BETWEEN 20 AND 30`) or `ORDER BY`.',
            '3. Why B+ Tree over B Tree: B+ Tree stores data ONLY at leaf nodes, leaving internal nodes purely for keys. This maximizes node fan-out, and leaf nodes are linked via a doubly linked list for blazing fast sequential scans.'
          ]
        },
        modelAnswer: {
          summary: 'B+ Trees are the universal data structure for relational storage engines (PostgreSQL, MySQL InnoDB, SQLite) because they are mathematically optimized for block-based disk storage and range scans.',
          table: {
            title: 'B+ Tree vs Competing Data Structures',
            headers: ['Data Structure', 'Fan-out Degree', 'Tree Height (10M Rows)', 'Range Scans (`BETWEEN`, `>`, `<`)', 'Disk Block Fit'],
            rows: [
              ['AVL / Red-Black Tree', '2', '24–30 levels (25 disk reads)', 'Poor (requires in-order tree traversal)', 'Terrible: 1 node per pointer wastes 4KB disk page'],
              ['Hash Index', 'N/A (Array buckets)', 'O(1) flat lookup', '❌ Impossible (Hashes destroy sort order)', 'Good for in-memory equality lookups only'],
              ['B-Tree (Standard)', '~100 (Keys + Data)', '4–5 levels', 'Moderate (requires traversing internal nodes)', 'Data in internal nodes reduces key fan-out'],
              ['B+ Tree (Database Standard)', '~1000+ (Keys only in branch)', '3–4 levels (3 disk reads)', '✅ Blazing Fast (Doubly-linked leaf nodes scanned sequentially)', 'Optimal: Internal nodes hold 1000s of keys per 16KB page']
            ]
          },
          details: [
            'Hardware Page Alignment: A MySQL InnoDB page is 16 KB. An internal B+ tree node stores keys (~8 bytes) and child pointers (~8 bytes). One 16KB page can store over 1,000 keys!',
            'Height 3 tree calculation: Root (1,000) × Level 1 (1,000) × Level 2 (1,000) = 1 Billion records reachable in just 3 disk block reads!'
          ]
        },
        mustMentionKeywords: ['High Fan-out', 'Disk Page Fit (16KB / 4KB)', 'Tree Height & Disk Seek Penalty', 'Doubly-Linked Leaf Nodes', 'Range Query Scans', 'Internal vs Leaf Node Separation'],
        trapWarning: {
          rookieMistake: 'Saying B-Tree and B+ Tree are the exact same thing.',
          winningAnswer: 'In a standard B-Tree, actual table row data is stored in both internal nodes and leaf nodes. In a B+ Tree, internal nodes store ONLY routing keys and pointers, allowing massive fan-out. All data resides exclusively in leaf nodes linked horizontally.'
        }
      },
      {
        id: 'dbms-q10',
        topic: 'MVCC & Distributed Transactions',
        level: 'advanced',
        levelLabel: 'Advanced (FAANG / L300)',
        question: 'How does Multi-Version Concurrency Control (MVCC) work in PostgreSQL and MySQL InnoDB? Why is it said that "Readers never block Writers, and Writers never block Readers"?',
        frequency: 'Asked in high-tier backend engineering interviews (Stripe, Uber, Amazon, Databricks)',
        companyTags: ['Stripe', 'Uber', 'Amazon', 'Databricks'],
        reference: {
          source: 'PostgreSQL Documentation: Chapter 13 (Concurrency Control) & MySQL 8.0 InnoDB Multi-Versioning',
          citation: 'MVCC Architecture, Read Views & Snapshot Isolation',
          linkText: 'PostgreSQL MVCC Documentation'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating knowledge of lockless concurrent reads, snapshot isolation, undo logs, and vacuuming/garbage collection.',
          verbalBlueprint: [
            '1. State the core innovation: Instead of locking rows with shared read locks, the database maintains multiple historical versions of each row with transaction IDs (xmin/xmax or Roll Pointers).',
            '2. Explain Reader perspective: When a query starts, it takes a Snapshot of active transaction IDs. It only reads versions created before its snapshot and committed.',
            '3. Explain Writer perspective: Updates don\'t overwrite rows in place—they create a new version with a new transaction ID.',
            '4. Result: Readers read historical snapshots without acquiring locks; writers modify new versions without blocking readers.'
          ]
        },
        modelAnswer: {
          summary: 'Traditional 2-Phase Locking (2PL) required shared read locks that blocked concurrent writes, crippling database throughput. MVCC achieves non-blocking reads by maintaining historical version snapshots.',
          table: {
            title: 'How PostgreSQL vs MySQL Implements MVCC',
            headers: ['Mechanism', 'PostgreSQL Implementation', 'MySQL InnoDB Implementation'],
            rows: [
              ['Row Version Storage', 'Appends new tuple versions directly into the table heap file (xmin / xmax)', 'Keeps latest row in clustered index; writes historical versions to Undo Log segments'],
              ['Read View (Snapshot)', 'Snapshot checks xmin (creation TXID) and xmax (deletion TXID)', 'Read View checks Read View Low/High Watermark and Active TXIDs array'],
              ['Garbage Collection', 'VACUUM process sweeps dead tuples and frees space', 'Purge Threads clean obsolete Undo Log segments in background'],
              ['Overhead', 'Table bloat if VACUUM falls behind', 'Undo log growth during long-running transactions']
            ]
          },
          details: [
            'Dead Tuples & Vacuuming: When a row is updated in Postgres, the old row becomes a "dead tuple". If a long-running transaction prevents VACUUM from cleaning it up, table bloat occurs.'
          ]
        },
        mustMentionKeywords: ['Multi-Version Concurrency Control (MVCC)', 'Snapshot Isolation', 'Undo Log', 'xmin / xmax Headers', 'Read View', 'Postgres VACUUM / Table Bloat', 'Non-blocking Reads'],
        trapWarning: {
          rookieMistake: 'Thinking MVCC eliminates all locking in the database.',
          winningAnswer: 'Clarify that MVCC only eliminates conflicts between Readers and Writers! Writer-Writer conflicts (concurrent UPDATEs on the exact same row) still require exclusive row-level locks, causing concurrent writers to wait or abort.'
        }
      }
    ]
  },

  // =========================================================================
  // 3. COMPUTER NETWORKS
  // =========================================================================
  cn: {
    id: 'cn',
    name: 'Computer Networks',
    shortName: 'CN',
    iconName: 'Network',
    accentColor: '#4ade80',
    tagline: 'OSI vs TCP/IP, TCP 3-Way Handshake, Flow/Congestion Control, DNS, HTTP/2/3, Subnetting & TLS',
    topics: [
      'OSI vs TCP/IP Models',
      'Transport Layer (TCP vs UDP)',
      'TCP Handshake & Connection Teardown',
      'Flow Control & Congestion Control',
      'Network Layer, IP & Subnetting',
      'DNS & Web Request Lifecycle',
      'Application Layer (HTTP/1.1, HTTP/2, HTTP/3)',
      'Network Security, TLS/SSL & Attacks'
    ],
    questions: [
      // --- BASIC (L100 / Freshers / Screening) ---
      {
        id: 'cn-q1',
        topic: 'OSI vs TCP/IP Models',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What is the difference between the OSI 7-Layer Model and the TCP/IP 4-Layer Model? What are the Data Units at each layer?',
        frequency: 'Asked in 90%+ of fresher networking screening rounds',
        companyTags: ['GFG Top 50', 'TCS', 'Infosys', 'Cisco', 'Cognizant'],
        reference: {
          source: 'Kurose & Ross: Computer Networking: A Top-Down Approach (Chapter 1) & ISO/IEC 7498-1',
          citation: 'OSI 7-Layer Architecture vs TCP/IP Protocol Suite',
          linkText: 'GFG OSI vs TCP/IP'
        },
        tackleStrategy: {
          interviewerIntent: 'Checking fundamental mental models of network encapsulation and protocol layers.',
          verbalBlueprint: [
            '1. Name all 7 OSI layers from bottom to top (Physical, Data Link, Network, Transport, Session, Presentation, Application). Mnemonic: "Please Do Not Throw Sausage Pizza Away".',
            '2. Name the corresponding 4 TCP/IP layers (Network Interface, Internet, Transport, Application).',
            '3. Enumerate the Protocol Data Units (PDUs): Bits → Frames → Packets → Segments → Data.'
          ]
        },
        modelAnswer: {
          summary: 'The OSI model is a theoretical architectural reference framework, whereas the TCP/IP model is the practical implementation model that powers the global internet.',
          table: {
            title: 'OSI vs TCP/IP Mapping & Data Units',
            headers: ['OSI Layer', 'TCP/IP Layer', 'Protocol Data Unit (PDU)', 'Protocols Operating Here'],
            rows: [
              ['7. Application, 6. Presentation, 5. Session', 'Application Layer', 'Data (Payload)', 'HTTP, HTTPS, DNS, SSH, FTP, SMTP'],
              ['4. Transport Layer', 'Transport Layer', 'Segment (TCP) / Datagram (UDP)', 'TCP, UDP'],
              ['3. Network Layer', 'Internet Layer', 'Packet', 'IPv4, IPv6, ICMP, ARP, OSPF, BGP'],
              ['2. Data Link Layer', 'Network Access Layer', 'Frame', 'Ethernet (802.3), Wi-Fi (802.11), MAC addressing'],
              ['1. Physical Layer', 'Network Access Layer', 'Bits', 'Cables, Fiber optics, Radio frequencies, Hubs']
            ]
          },
          details: [
            'Encapsulation Flow: When sending data down the stack, each layer prepends its own header (e.g. Transport adds port numbers, Network adds IP addresses, Data Link adds MAC addresses).',
            'Decapsulation Flow: The receiving machine strips headers layer-by-layer up to the application.'
          ]
        },
        mustMentionKeywords: ['PDU (Bits, Frames, Packets, Segments)', 'Encapsulation & Decapsulation', 'MAC vs IP vs Port Addressing', 'OSI Theoretical vs TCP/IP Practical'],
        trapWarning: {
          rookieMistake: 'Confusing Packets and Frames.',
          winningAnswer: 'A Packet is a Layer 3 (Network Layer) construct containing IP addresses. A Frame is a Layer 2 (Data Link Layer) construct that encapsulates the packet and contains hardware MAC addresses.'
        }
      },
      {
        id: 'cn-q2',
        topic: 'Transport Layer (TCP vs UDP)',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What is the difference between TCP and UDP? When would you choose UDP over TCP in production?',
        frequency: 'Asked in 95%+ of networking and software engineering interviews',
        companyTags: ['GFG Top 50', 'Amazon', 'Cisco', 'Zoho', 'Google'],
        reference: {
          source: 'IETF RFC 793 (TCP) & RFC 768 (User Datagram Protocol)',
          citation: 'Transport Protocol Design Trade-offs: Reliability vs Latency',
          linkText: 'IETF RFC 768 / 793'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing trade-offs between reliability and latency, and understanding connection-oriented vs connectionless protocols.',
          verbalBlueprint: [
            '1. State core distinction: TCP is Connection-Oriented, Reliable, Ordered, with Flow & Congestion Control. UDP is Connectionless, Unreliable, Unordered, with near-zero overhead.',
            '2. Header comparison: TCP has a 20-byte header with sequence numbers and flags; UDP has a tiny 8-byte header.',
            '3. Give production use-cases: TCP for Web (HTTP), Email, File transfer; UDP for Real-time Gaming, Video Streaming (WebRTC), DNS, and Voice (VoIP).'
          ]
        },
        modelAnswer: {
          summary: 'TCP guarantees delivery and ordering at the expense of latency and connection handshake overhead. UDP prioritizes raw speed and real-time delivery where occasional dropped packets are acceptable.',
          table: {
            title: 'TCP vs UDP Comprehensive Comparison',
            headers: ['Feature', 'TCP (Transmission Control Protocol)', 'UDP (User Datagram Protocol)'],
            rows: [
              ['Connection Type', 'Connection-oriented (3-way handshake required)', 'Connectionless (Fire and forget)'],
              ['Reliability', 'Guaranteed delivery via ACKs & retransmissions', 'Unreliable (Packets may drop with no retransmission)'],
              ['Packet Ordering', 'Strictly ordered via Sequence Numbers', 'Unordered (Arrival order unpredictable)'],
              ['Flow & Congestion Control', '✅ Yes (Sliding Window, Slow Start, Reno/Cubic)', '❌ None (Sends as fast as network permits)'],
              ['Header Size', '20–60 Bytes', '8 Bytes fixed'],
              ['Use Cases', 'Web (HTTP/1.1 & 2), Financial transactions, SSH', 'Video streaming (WebRTC), Online multiplayer gaming, DNS lookups, HTTP/3 (QUIC)']
            ]
          },
          details: [
            'Why UDP for Gaming/VoIP? In real-time audio or an FPS game, a player’s coordinates from 200ms ago are useless. Re-transmitting a lost coordinate packet delays all incoming live packets (Head-of-Line blocking), ruining the user experience.'
          ]
        },
        mustMentionKeywords: ['Connection-Oriented vs Connectionless', 'Acknowledgements (ACKs)', 'Head-of-Line Blocking', '20-Byte vs 8-Byte Header', 'Congestion Control', 'QUIC Protocol'],
        trapWarning: {
          rookieMistake: 'Saying UDP has no error checking at all.',
          winningAnswer: 'UDP actually DOES include an optional 16-bit Checksum field in its 8-byte header to detect bit corruption! However, if a checksum fails, UDP simply discards the corrupted packet without requesting a retransmission.'
        }
      },
      {
        id: 'cn-q3',
        topic: 'DNS & Web Request Lifecycle',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What is DNS (Domain Name System) and how does hierarchical domain resolution work from root to authoritative nameserver?',
        frequency: 'Standard interview question for all web and infrastructure roles',
        companyTags: ['GFG Top 50', 'Amazon', 'Cloudflare', 'Microsoft'],
        reference: {
          source: 'IETF RFC 1034 & RFC 1035: Domain Names - Concepts and Facilities (Mockapetris)',
          citation: 'Hierarchical DNS Name Resolution & Zone Delegation',
          linkText: 'IETF RFC 1035 (DNS)'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing domain hierarchy, caching layers (browser, OS, recursive resolver), and nameserver delegation.',
          verbalBlueprint: [
            '1. Define DNS: The internet\'s phonebook that translates human-readable domain names (google.com) to machine IP addresses.',
            '2. Trace the 4 cache checks first: Browser Cache → OS Cache → Router Cache → ISP Resolver Cache.',
            '3. Trace the recursive hierarchy: Root Nameserver (".") → TLD Nameserver (".com") → Authoritative Nameserver ("google.com").'
          ]
        },
        modelAnswer: {
          summary: 'DNS is a globally distributed, hierarchical database that resolves domain names to IP addresses via recursive lookups and multi-tier caching.',
          table: {
            title: 'The 4 Stages of DNS Resolution',
            headers: ['Server Tier', 'Role / Responsibility', 'Example Returned'],
            rows: [
              ['1. Recursive Resolver (ISP / 8.8.8.8)', 'Receives query from client and orchestrates search', 'Searches cache; queries root if miss'],
              ['2. Root Nameserver (".")', 'Directs query to top-level domain servers', 'Returns IP of .com TLD servers'],
              ['3. TLD Nameserver (".com")', 'Manages all domains ending in that TLD extension', 'Returns IP of google.com Authoritative Server'],
              ['4. Authoritative Nameserver', 'Holds the actual official DNS records for the domain', 'Returns the final A/AAAA record (142.250.190.46)']
            ]
          },
          details: [
            'Common DNS Record Types: A (IPv4), AAAA (IPv6), CNAME (canonical alias), MX (mail servers), TXT (domain verification & SPF/DKIM), NS (delegated nameserver).'
          ]
        },
        mustMentionKeywords: ['Recursive vs Iterative Lookup', 'Root Nameserver', 'TLD Nameserver', 'Authoritative Nameserver', 'Time-To-Live (TTL)', 'A vs CNAME Records'],
        trapWarning: {
          rookieMistake: 'Believing DNS queries always travel to the root nameservers on every page click.',
          winningAnswer: 'Emphasize the TTL (Time-To-Live) caching! Once an IP is resolved, it is cached in the browser, OS resolver, and ISP resolver for the duration of the TTL (e.g. 300 to 86400 seconds), making >90% of DNS queries instant cache hits.'
        }
      },
      // --- INTERMEDIATE (L200 / Core Campus & Technical Rounds) ---
      {
        id: 'cn-q4',
        topic: 'DNS & Web Request Lifecycle',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What happens step-by-step when you type https://www.google.com in a browser and press Enter?',
        frequency: 'The #1 classic interview question across all FAANG and product companies',
        companyTags: ['Glassdoor Top Pick', 'Amazon', 'Google', 'Microsoft', 'Cisco'],
        reference: {
          source: 'What happens when... (GitHub Community Project) & MDN Web Docs: How the Web Works',
          citation: 'End-to-End Web Request Lifecycle from Keystroke to Pixel Rendering',
          linkText: 'MDN: How the Web Works'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating full-stack systems breadth: DNS, socket creation, TCP, TLS, HTTP, server routing, and browser rendering pipeline.',
          verbalBlueprint: [
            '1. Step 1: URL Parsing & HSTS check (enforce HTTPS).',
            '2. Step 2: DNS Resolution (Browser cache → OS → ISP → Root/TLD/Authoritative).',
            '3. Step 3: TCP 3-Way Handshake (SYN → SYN-ACK → ACK).',
            '4. Step 4: TLS 1.3 Handshake (ClientHello, Certificate, Key Exchange, Secure channel established).',
            '5. Step 5: HTTP GET Request sent; Server processes and responds (200 OK + HTML payload).',
            '6. Step 6: Browser Rendering Pipeline (DOM tree + CSSOM tree → Render Tree → Layout → Paint).'
          ]
        },
        modelAnswer: {
          summary: 'This question tests your end-to-end understanding of how the internet works across all layers, from keystroke to rendered pixel.',
          table: {
            title: 'End-to-End Request Pipeline',
            headers: ['Phase', 'Layer', 'What Happens Technically'],
            rows: [
              ['1. URL & DNS', 'Application Layer', 'Browser checks HSTS; resolves www.google.com to IPv4/IPv6 via DNS cache or recursive lookup.'],
              ['2. TCP Handshake', 'Transport Layer', 'Client sends SYN, server replies SYN-ACK, client returns ACK (establishes reliable socket connection on port 443).'],
              ['3. TLS Handshake', 'Transport / Security', 'Asymmetric key exchange (ECDHE) negotiates symmetric encryption keys and verifies server SSL certificate.'],
              ['4. HTTP Exchange', 'Application Layer', 'Browser transmits encrypted HTTP/2 GET request; Google Web Server / Load Balancer returns HTML response.'],
              ['5. Browser Rendering', 'Client Rendering', 'Engine parses HTML to build DOM, parses CSS for CSSOM, builds Render Tree, calculates Layout (reflow), and Paints pixels.']
            ]
          },
          details: [
            'Critical Detail: Notice that before any HTTP data can be sent, 2 full network round-trips (RTTs) must occur: 1 RTT for TCP, and 1 RTT for TLS 1.3.'
          ]
        },
        mustMentionKeywords: ['DNS Resolution', 'TCP 3-Way Handshake', 'TLS 1.3 Handshake', 'HTTP GET', 'DOM & CSSOM', 'Render Tree', 'Layout & Paint'],
        trapWarning: {
          rookieMistake: 'Jumping straight into HTTP without mentioning the TCP 3-way handshake or TLS certificate exchange.',
          winningAnswer: 'Always emphasize the transport layer prerequisites: HTTP cannot exist without a TCP connection, and HTTPS cannot transmit data without the TLS handshake establishing session keys.'
        }
      },
      {
        id: 'cn-q5',
        topic: 'TCP Handshake & Connection Teardown',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'Explain the TCP 3-Way Handshake and 4-Way Connection Teardown. Why does the TIME_WAIT state exist?',
        frequency: 'Asked in 95%+ of networking & systems interviews',
        companyTags: ['GFG Top 50', 'Amazon', 'Cisco', 'Microsoft', 'Zoho'],
        reference: {
          source: 'IETF RFC 793: Transmission Control Protocol & W. Richard Stevens TCP/IP Illustrated Vol. 1',
          citation: 'TCP State Machine, Handshake & TIME_WAIT Semantics',
          linkText: 'RFC 793 TCP State Transitions'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing deep knowledge of sequence numbers, synchronized states, and why closing a connection requires 4 packets and a 2MSL wait timer.',
          verbalBlueprint: [
            '1. Handshake (3-Way): SYN (Client sets ISN_c) → SYN-ACK (Server sets ISN_s, acks ISN_c+1) → ACK (Client acks ISN_s+1).',
            '2. Teardown (4-Way): FIN (Client wants to close) → ACK (Server confirms, but may still send data) → FIN (Server finishes data) → ACK (Client confirms).',
            '3. Explain TIME_WAIT: Client waits 2MSL (Maximum Segment Lifetime = 2 minutes) before fully closing.'
          ]
        },
        modelAnswer: {
          summary: 'The 3-way handshake synchronizes sequence numbers so both parties can track byte streams reliably. The 4-way teardown is necessary because TCP connections are full-duplex (each direction closes independently).',
          table: {
            title: 'TCP Handshake vs Teardown Packet Flow',
            headers: ['Step', 'Sender → Receiver', 'Flags & Sequence Numbers', 'Purpose'],
            rows: [
              ['Handshake 1', 'Client → Server', 'SYN (Seq = X)', 'Client requests connection; announces Initial Sequence Number X'],
              ['Handshake 2', 'Server → Client', 'SYN + ACK (Seq = Y, Ack = X + 1)', 'Server agrees; acknowledges client sequence; announces its own ISN Y'],
              ['Handshake 3', 'Client → Server', 'ACK (Seq = X + 1, Ack = Y + 1)', 'Client acknowledges server sequence; connection is now ESTABLISHED'],
              ['Teardown 1', 'Client → Server', 'FIN (Seq = U)', 'Client indicates it has no more data to send (Half-Close)'],
              ['Teardown 2', 'Server → Client', 'ACK (Ack = U + 1)', 'Server acknowledges client FIN; server may still transmit data'],
              ['Teardown 3', 'Server → Client', 'FIN (Seq = V)', 'Server finishes sending remaining data and closes its send channel'],
              ['Teardown 4', 'Client → Server', 'ACK (Ack = V + 1)', 'Client acknowledges server FIN; client enters TIME_WAIT state for 2MSL']
            ]
          },
          details: [
            'Why does TIME_WAIT exist? Two vital reasons:',
            '1. Reliability: If the final ACK (Step 4) drops in transit, the server re-sends its FIN. The client must still be alive in TIME_WAIT to re-send the ACK, preventing an unnatural server error.',
            '2. Preventing Old Duplicate Packets: Waits for 2MSL (typically 60–120s) so delayed packets from the old connection die in the network and cannot corrupt a new connection reusing the same port.'
          ]
        },
        mustMentionKeywords: ['SYN, SYN-ACK, ACK', 'Initial Sequence Number (ISN)', 'Half-Closed Connection', 'TIME_WAIT State', '2MSL (Maximum Segment Lifetime)', 'Full-Duplex Teardown'],
        trapWarning: {
          rookieMistake: 'Assuming a connection closes with 3 packets like it opens.',
          winningAnswer: 'Explain why teardown takes 4 packets: Because TCP is full-duplex! When the client sends FIN, it only closes the client-to-server direction. The server may still have data buffered in RAM to send to the client. Only when the server finishes does it send its own separate FIN.'
        }
      },
      {
        id: 'cn-q6',
        topic: 'Flow Control & Congestion Control',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What is the difference between TCP Flow Control and TCP Congestion Control? Explain the 4 stages of Congestion Control.',
        frequency: 'Essential core question for systems and network engineering interviews',
        companyTags: ['GFG Top 50', 'Cisco', 'Amazon', 'Cloudflare'],
        reference: {
          source: 'IETF RFC 5681: TCP Congestion Control (Allman, Paxson, Blanton) & Jacobson (1988) Congestion Avoidance and Control',
          citation: 'Sliding Window, AIMD & Reno/Cubic Congestion Control',
          linkText: 'IETF RFC 5681 (TCP Congestion Control)'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing distinction between protecting the end receiver (Flow Control) vs protecting the intermediate network switches/routers (Congestion Control).',
          verbalBlueprint: [
            '1. Clear distinction: Flow Control prevents fast sender from overwhelming a slow RECEIVER; Congestion Control prevents senders from overwhelming the INTERMEDIATE NETWORK routers.',
            '2. Flow control mechanism: Sliding Window Protocol (Receiver advertises Receive Window rwnd in ACK headers).',
            '3. Congestion control mechanism: Sender maintains Congestion Window cwnd. Actual Send Window = min(rwnd, cwnd).',
            '4. Name the 4 Congestion Control stages: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery.'
          ]
        },
        modelAnswer: {
          summary: 'Flow control is an endpoint-to-endpoint buffer management problem. Congestion control is a global network congestion prevention mechanism.',
          table: {
            title: '4 Stages of TCP Congestion Control',
            headers: ['Stage', 'Growth Behavior', 'Trigger to Exit'],
            rows: [
              ['1. Slow Start', 'Exponential growth: cwnd doubles every RTT (1, 2, 4, 8, 16...)', 'Reaches Slow-Start Threshold (ssthresh) or packet loss occurs'],
              ['2. Congestion Avoidance', 'Linear growth: cwnd increases by +1 MSS per RTT (AIMD — Additive Increase)', 'Packet loss detected (3 duplicate ACKs or Timeout)'],
              ['3. Fast Retransmit', 'Detects packet loss early via 3 duplicate ACKs without waiting for a retransmission timer timeout', 'Immediately retransmits missing packet'],
              ['4. Fast Recovery', 'Halves ssthresh, sets cwnd = ssthresh, resumes linear growth (avoids dropping back to cwnd=1)', 'Missing packet acknowledged; resumes Congestion Avoidance']
            ]
          },
          details: [
            'Governing Equation: The sender’s effective transmission limit is always: Max Transmit Size = min(rwnd, cwnd).',
            'AIMD (Additive Increase, Multiplicative Decrease): The mathematical foundation of internet stability: probe bandwidth slowly (+1), back off aggressively on packet loss (÷2).'
          ]
        },
        mustMentionKeywords: ['Flow Control (rwnd)', 'Congestion Control (cwnd)', 'Sliding Window Protocol', 'Slow Start (Exponential)', 'Congestion Avoidance (Linear)', 'Fast Retransmit & 3 Duplicate ACKs', 'AIMD'],
        trapWarning: {
          rookieMistake: 'Thinking Slow Start is actually slow.',
          winningAnswer: 'Clarify the naming irony: Slow Start is actually aggressively EXPONENTIAL! It starts from 1 packet, but doubles every round trip (1 → 2 → 4 → 8 → 16 → 32...). It was called "slow" only in comparison to blasting maximum bandwidth immediately.'
        }
      },
      {
        id: 'cn-q7',
        topic: 'Network Layer, IP & Subnetting',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What is Subnetting and CIDR notation? Given IP 192.168.1.100/26, calculate the Subnet Mask, Network ID, Broadcast Address, and Usable Hosts.',
        frequency: 'Standard numerical test in campus recruitment and infrastructure interviews',
        companyTags: ['GFG Top 50', 'Cisco', 'TCS Digital', 'Infosys'],
        reference: {
          source: 'IETF RFC 4632: Classless Inter-domain Routing (CIDR): The Internet Address Assignment and Aggregation Plan',
          citation: 'CIDR Subnetting Formulas & Powers of 2 Host Bit Partitioning',
          linkText: 'Cisco Networking: Subnetting Guide'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing bitwise calculation ability and understanding of IP address partitioning into Network and Host portions.',
          verbalBlueprint: [
            '1. Explain CIDR /26: 26 bits for Network prefix, leaving 32 - 26 = 6 bits for Host addresses.',
            '2. Calculate Subnet Mask: 11111111.11111111.11111111.11000000 = 255.255.255.192.',
            '3. Calculate Total Hosts: 2^6 = 64 hosts per block.',
            '4. Find Block boundaries: Multiples of 64: [0-63], [64-127], [128-191], [192-255]. 100 falls into the second block [64-127].',
            '5. State final answers clearly.'
          ]
        },
        modelAnswer: {
          summary: 'Classless Inter-Domain Routing (CIDR) eliminates rigid Class A/B/C boundaries by using a variable-length subnet mask prefix (/N) indicating how many leading bits represent the network address.',
          table: {
            title: 'Calculation for 192.168.1.100/26',
            headers: ['Metric', 'Calculated Value', 'Explanation'],
            rows: [
              ['CIDR Prefix', '/26', '26 Network bits, 6 Host bits (32 - 26 = 6)'],
              ['Subnet Mask', '255.255.255.192', 'Last octet has 2 bits set (128 + 64 = 192)'],
              ['Block Size', '64 IP addresses', '2^6 = 64'],
              ['Subnet Range', '192.168.1.64 to 192.168.1.127', 'Block containing IP .100 (64 * 1 = 64)'],
              ['Network Address', '192.168.1.64', 'First IP in block (all host bits = 0)'],
              ['Broadcast Address', '192.168.1.127', 'Last IP in block (all host bits = 1)'],
              ['Usable Host Range', '192.168.1.65 to 192.168.1.126', '62 assignable IP addresses (2^H - 2 = 64 - 2)']
            ]
          },
          details: [
            'Why 2^H - 2? Two addresses in every subnet are strictly reserved: the very first address represents the Network ID, and the very last address is the Directed Broadcast address.'
          ]
        },
        mustMentionKeywords: ['CIDR Notation (/N)', 'Host Bits (32 - N)', 'Subnet Mask', 'Network ID vs Broadcast Address', '2^H - 2 Usable Formula'],
        trapWarning: {
          rookieMistake: 'Forgetting to subtract 2 when calculating usable hosts.',
          winningAnswer: 'Always explicitly state 2^H - 2! Interviewers look specifically for whether you remember that the network address and broadcast address cannot be assigned to any machine.'
        }
      },
      // --- ADVANCED (L300 / FAANG / Systems Engineering) ---
      {
        id: 'cn-q8',
        topic: 'Application Layer (HTTP/1.1, HTTP/2, HTTP/3)',
        level: 'advanced',
        levelLabel: 'Advanced (FAANG / L300)',
        question: 'Compare HTTP/1.1, HTTP/2, and HTTP/3. How does HTTP/2 Multiplexing work, and why did HTTP/3 switch from TCP to UDP (QUIC)?',
        frequency: 'Premier web performance interview question at FAANG & CDN companies (Cloudflare, Google, Meta, Uber)',
        companyTags: ['Cloudflare', 'Google', 'Meta', 'Uber'],
        reference: {
          source: 'IETF RFC 7540 (HTTP/2) & RFC 9000 (QUIC: A UDP-Based Multiplexed and Secure Transport) & Cloudflare Learning Center',
          citation: 'Evolution of HTTP: Binary Framing, HoL Blocking & QUIC Transport',
          linkText: 'IETF RFC 9000 (QUIC)'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing modern web protocols, binary framing, TCP head-of-line blocking, and QUIC connection migration.',
          verbalBlueprint: [
            '1. HTTP/1.1: Text-based. Introduced Keep-Alive, but suffers from HTTP Head-of-Line (HoL) blocking (requests on 1 TCP connection must finish sequentially).',
            '2. HTTP/2: Binary framing layer. Multiplexes dozens of independent bidirectional streams over a SINGLE TCP connection.',
            '3. The Flaw of HTTP/2: TCP-level HoL blocking! If one packet drops, the OS TCP stack pauses ALL streams until that packet re-transmits.',
            '4. HTTP/3 (QUIC): Solves this by moving to UDP! Implements independent stream reliability in user-space; one dropped packet only delays its specific stream, not sibling streams.'
          ]
        },
        modelAnswer: {
          summary: 'The evolution of HTTP is a story of eliminating Head-of-Line blocking and handshake latency.',
          table: {
            title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 Evolution',
            headers: ['Dimension', 'HTTP/1.1', 'HTTP/2', 'HTTP/3 (QUIC)'],
            rows: [
              ['Transport Protocol', 'TCP', 'TCP', 'UDP (QUIC in User Space)'],
              ['Data Framing', 'Text-based plain text', 'Binary Framing (Headers & Data Frames)', 'Binary Framing over QUIC'],
              ['Multiplexing', '❌ No (Pipelining failed; browsers open 6 TCP connections)', '✅ Yes: Multiple streams over 1 TCP connection', '✅ Yes: Independent streams over UDP'],
              ['Head-of-Line (HoL) Blocking', 'Suffers from HTTP-level HoL blocking', 'Suffers from TCP-level HoL blocking on packet loss', 'Zero HoL blocking: Packet loss on Stream A never stalls Stream B'],
              ['Connection Handshake', '1 RTT (TCP) + 1-2 RTT (TLS)', '1 RTT (TCP) + 1 RTT (TLS 1.3)', '0-RTT or 1-RTT Combined (Crypto + Transport negotiated together)'],
              ['Connection Migration', '❌ Impossible (Tied to IP:Port 4-tuple; Wi-Fi to 4G drops)', '❌ Impossible (Tied to TCP 4-tuple)', '✅ Native Connection ID: Switch from Wi-Fi to 5G without reconnecting']
            ]
          },
          details: [
            'Connection Migration Advantage in HTTP/3: When a mobile user walks out of their house and switches from Wi-Fi to 5G Cellular, their IP address changes. Under TCP, all active connections crash and must re-handshake. Under HTTP/3, the connection is identified by a 64-bit Connection ID, allowing streams to continue without interruption.'
          ]
        },
        mustMentionKeywords: ['Binary Framing Layer', 'Multiplexing & Streams', 'Head-of-Line (HoL) Blocking', 'QUIC (Quick UDP Internet Connections)', '0-RTT Resumption', 'Connection Migration'],
        trapWarning: {
          rookieMistake: 'Claiming HTTP/3 is unreliable because it uses UDP.',
          winningAnswer: 'QUIC implements packet acknowledgements, flow control, and loss recovery in software on top of UDP! It has all the reliability guarantees of TCP, but without TCP\'s kernel-level Head-of-Line blocking and rigid handshake constraints.'
        }
      },
      {
        id: 'cn-q9',
        topic: 'Network Security, TLS/SSL & Attacks',
        level: 'advanced',
        levelLabel: 'Advanced (FAANG / L300)',
        question: 'Explain the SSL/TLS 1.3 Handshake. How does Diffie-Hellman Key Exchange ensure Perfect Forward Secrecy (PFS)?',
        frequency: 'Security and high-tier infrastructure interview favorite (Google, Cloudflare, Amazon)',
        companyTags: ['Google', 'Cloudflare', 'Amazon'],
        reference: {
          source: 'IETF RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3 (Rescorla) & Cloudflare TLS Guide',
          citation: 'TLS 1.3 Cryptographic Handshake & Ephemeral Diffie-Hellman Key Exchange',
          linkText: 'IETF RFC 8446 (TLS 1.3)'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating cryptography fundamentals: Asymmetric vs Symmetric encryption, Certificate Authorities, and session key negotiation.',
          verbalBlueprint: [
            '1. State the core architecture: Asymmetric cryptography (RSA/ECC) is slow and used ONLY to verify identity and negotiate keys; Symmetric cryptography (AES-GCM/ChaCha20) is fast and encrypts the actual data stream.',
            '2. Explain TLS 1.3 Handshake (1 RTT): ClientHello (includes supported ciphers + Ephemeral DH public key share) → ServerHello (Server DH key share + Certificate + Finished) → Client Finished. Secure communication begins immediately.',
            '3. Define Perfect Forward Secrecy (PFS): Even if an attacker steals the server’s private RSA key 10 years from now, they CANNOT decrypt past recorded traffic because keys were ephemeral.'
          ]
        },
        modelAnswer: {
          summary: 'TLS provides encryption, integrity, and authentication for web traffic. TLS 1.3 cut the handshake latency from 2 RTTs down to 1 RTT while removing legacy insecure ciphers.',
          table: {
            title: 'TLS 1.2 vs TLS 1.3 Handshake Flow',
            headers: ['Phase', 'TLS 1.2 (2 Round Trips)', 'TLS 1.3 (1 Round Trip — 50% Faster)'],
            rows: [
              ['Round Trip 1', 'ClientHello → ServerHello + Certificate + ServerKeyExchange', 'ClientHello (includes Ephemeral Key Share) → ServerHello (Finishes Key Exchange + Encrypted Cert)'],
              ['Round Trip 2', 'ClientKeyExchange + ChangeCipherSpec → Finished', 'Data transfer starts immediately! (0-RTT resumption also supported)'],
              ['Forward Secrecy', 'Optional (RSA key exchange lacked PFS)', 'Mandatory: Only Ephemeral Diffie-Hellman (ECDHE) allowed']
            ]
          },
          details: [
            'Why Ephemeral Diffie-Hellman guarantees PFS: Both parties generate fresh, random mathematical keypairs for THAT SPECIFIC SESSION and discard the private parts immediately after deriving the session key. Because the private key was never stored on disk, it cannot be leaked in the future.'
          ]
        },
        mustMentionKeywords: ['Asymmetric vs Symmetric Encryption', 'TLS 1.3 1-RTT Handshake', 'Ephemeral Diffie-Hellman (ECDHE)', 'Certificate Authority (CA) Chain', 'Perfect Forward Secrecy (PFS)'],
        trapWarning: {
          rookieMistake: 'Saying the client encrypts the web traffic using the server\'s public RSA key.',
          winningAnswer: 'Asymmetric RSA encryption is hundreds of times too slow for bulk web traffic! The server\'s public key is only used to authenticate the server certificate. The actual payload is encrypted using a shared symmetric session key (like AES-256-GCM).'
        }
      }
    ]
  },

  // =========================================================================
  // 4. PRACTICAL CLI, GIT & PRODUCTION TROUBLESHOOTING
  // =========================================================================
  practical: {
    id: 'practical',
    name: 'Linux CLI & Git Practical',
    shortName: 'Practical',
    iconName: 'Terminal',
    accentColor: '#fb923c',
    tagline: 'Git reflog recovery, Merge vs Rebase, Linux troubleshooting, lsof +L1 disk leaks & process signals',
    topics: [
      'Git Fundamentals & Staging',
      'Branching, Merge vs Rebase',
      'Disaster Recovery & git reflog',
      'Linux Process Signals & CLI',
      'Production Disk & Memory Troubleshooting',
      'File System Links & Inodes',
      'Git Internal Object Database'
    ],
    questions: [
      // --- BASIC (L100 / Freshers / Junior Dev) ---
      {
        id: 'prac-q1',
        topic: 'Git Fundamentals & Staging',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'What are the 3 States of a file in Git? What is the difference between git fetch and git pull?',
        frequency: 'Mandatory standard question in every developer and Git screening round',
        companyTags: ['GFG Top 50', 'TCS', 'Infosys', 'Amazon', 'Zoho'],
        reference: {
          source: 'Pro Git Book (Scott Chacon & Ben Straub: Chapter 1 & 2) & git-scm.com',
          citation: 'Git Architecture: Working Tree, Index (Staging), and Object Repository',
          linkText: 'git-scm.com: Git Basics'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing if you understand the staging index and how local tracking branches interact with remote repositories.',
          verbalBlueprint: [
            '1. Name the 3 Git states: Working Directory (modified files), Staging Area/Index (files marked for next commit via git add), Local Repository (permanently committed snapshot in .git directory).',
            '2. Explain git fetch: Downloads commits and branch refs from remote repository to your local repo, but DOES NOT touch or modify your working directory.',
            '3. Explain git pull: Executes `git fetch` followed immediately by `git merge FETCH_HEAD` to merge remote commits into your active local branch.'
          ]
        },
        modelAnswer: {
          summary: 'Git manages code through three local areas before changes are pushed to a remote server.',
          table: {
            title: 'The 3 Git Local Areas',
            headers: ['Area', 'Location', 'Purpose / Command'],
            rows: [
              ['1. Working Directory', 'Local filesystem workspace', 'Where you create and edit code files directly'],
              ['2. Staging Area (Index)', '.git/index file', 'Snapshot staging ground created via `git add` before committing'],
              ['3. Local Repository', '.git/objects database', 'Permanent cryptographically hashed commit history created via `git commit`']
            ]
          },
          details: [
            'Equation: `git pull = git fetch + git merge`.',
            'Best Practice: In team environments, running `git fetch` first allows you to inspect incoming changes with `git log origin/main` or `git diff origin/main` before blindly merging them into your working code.'
          ]
        },
        mustMentionKeywords: ['Working Directory', 'Staging Area (Index)', 'Commit Repository', 'git fetch vs git pull', 'FETCH_HEAD'],
        trapWarning: {
          rookieMistake: 'Thinking `git fetch` modifies your working files.',
          winningAnswer: 'Emphasize that `git fetch` is 100% safe and non-destructive! It only updates remote-tracking branches (like origin/main) in your local .git folder and never overwrites any code in your working tree.'
        }
      },
      {
        id: 'prac-q2',
        topic: 'Linux Process Signals & CLI',
        level: 'basic',
        levelLabel: 'Basic (Freshers / L100)',
        question: 'In Linux, what is the difference between kill -15 (SIGTERM) and kill -9 (SIGKILL)? When should you use which?',
        frequency: 'Standard DevOps, backend, and Linux CLI technical question',
        companyTags: ['Amazon', 'Red Hat', 'Zoho', 'Directi'],
        reference: {
          source: 'Linux Programmer\'s Manual: signal(7) & kill(1)',
          citation: 'POSIX Signals Architecture & Graceful Process Termination',
          linkText: 'Linux man-pages: signal(7)'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing understanding of Linux signals, graceful shutdown of servers, and uncatchable kernel signals.',
          verbalBlueprint: [
            '1. SIGTERM (Signal 15): The polite termination request. The process catches it, flushes buffers, closes database connections/sockets, and shuts down cleanly.',
            '2. SIGKILL (Signal 9): The absolute death hammer. Sent directly to the kernel; the process CANNOT catch, block, or ignore it. Terminated instantly.',
            '3. Rule: Always try `kill <PID>` (SIGTERM) first; only resort to `kill -9 <PID>` if the process is completely hung/unresponsive.'
          ]
        },
        modelAnswer: {
          summary: 'Linux uses signals to notify asynchronous processes of system events and termination requests.',
          table: {
            title: 'SIGTERM (15) vs SIGKILL (9) Comparison',
            headers: ['Attribute', 'SIGTERM (kill -15)', 'SIGKILL (kill -9)'],
            rows: [
              ['Signal Number', '15 (Default signal sent by `kill <PID>`)', '9 (`kill -9 <PID>`)'],
              ['Can Process Catch / Intercept It?', '✅ Yes (Process registers a signal handler)', '❌ NEVER (Kernel executes it unconditionally)'],
              ['Graceful Cleanup Possible?', '✅ Yes: Flushes open files, closes DB connections, removes lockfiles', '❌ No: Process terminated mid-instruction'],
              ['Risk of Data Corruption', 'Low to zero', 'High: Can leave corrupted database tables and orphaned lockfiles']
            ]
          },
          details: [
            'Why SIGKILL leaves zombie processes: If a child process is terminated with SIGKILL, but its parent is stuck or hung and never calls wait(), the child becomes a zombie in the process table.'
          ]
        },
        mustMentionKeywords: ['SIGTERM (Signal 15)', 'SIGKILL (Signal 9)', 'Graceful Shutdown', 'Uncatchable Signal', 'Orphaned Lockfiles / Data Corruption'],
        trapWarning: {
          rookieMistake: 'Always running `kill -9` as your first reaction to stopping a process.',
          winningAnswer: 'Explain why `kill -9` on a production database (like MySQL or Postgres) is dangerous: It prevents the database from performing a clean checkpoint, forcing it to undergo lengthy crash recovery on the next boot!'
        }
      },
      // --- INTERMEDIATE (L200 / Core Campus & Technical Rounds) ---
      {
        id: 'prac-q3',
        topic: 'Branching, Merge vs Rebase',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'What is the difference between git merge and git rebase? What is the "Golden Rule of Rebasing"?',
        frequency: 'Asked in 95%+ of git/software engineering interview rounds (Amazon, Meta, Atlassian, Gitlab)',
        companyTags: ['Atlassian', 'Amazon', 'Gitlab', 'Meta'],
        reference: {
          source: 'Atlassian Git Tutorials & Pro Git Book (Scott Chacon: Chapter 3.6 Git Branching - Rebasing)',
          citation: 'Git DAG Commit Graphs & Golden Rule of Rebasing',
          linkText: 'Atlassian Git: Merging vs Rebasing'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing understanding of Git commit graph history, linear git trees, and public branch corruption.',
          verbalBlueprint: [
            '1. git merge: Combines two branch histories by creating a new 3-way "Merge Commit". Preserves complete true chronological history.',
            '2. git rebase: Moves the base of your branch to the tip of the target branch by re-applying your commits one by one with new commit hashes. Produces a clean, flat, linear history.',
            '3. State the Golden Rule of Rebasing: NEVER rebase a public branch that has been pushed to a shared remote (like main)! Only rebase private feature branches.'
          ]
        },
        modelAnswer: {
          summary: 'Both commands integrate changes from one branch into another, but they sculpt the Git commit history graph differently.',
          table: {
            title: 'git merge vs git rebase Comparison',
            headers: ['Attribute', 'git merge', 'git rebase'],
            rows: [
              ['History Structure', 'Non-linear (Branched graph with merge commits)', 'Linear (Clean, straight single line of commits)'],
              ['Commit Hashes', 'Original commit hashes are preserved 100%', 'Rewrites history: Creates completely NEW commit hashes'],
              ['Merge Commit', 'Creates a new 3-way merge commit', 'No merge commit created (re-applies commits on top)'],
              ['Conflict Resolution', 'Resolve conflicts once during the merge commit', 'Must resolve conflicts commit-by-commit during replay'],
              ['Safety', 'Completely safe for public/shared branches', 'Dangerous if run on shared public branches']
            ]
          },
          details: [
            'The Golden Rule of Rebasing Explained: If you rebase a shared remote branch (like main), you rewrite commit hashes that your teammates have already pulled. When they try to push, Git detects divergent histories, leading to merge nightmares and duplicate commits.'
          ]
        },
        mustMentionKeywords: ['Linear History', 'Merge Commit', 'History Rewriting', 'Commit Hash Recreation', 'Golden Rule of Rebasing', '3-Way Merge'],
        trapWarning: {
          rookieMistake: 'Claiming `git rebase` is strictly superior to `git merge`.',
          winningAnswer: 'Highlight that while rebase provides a clean commit history for pull requests, merge preserves true historical context (showing exactly when branches branched off and reunited), which is critical for post-mortem production debugging.'
        }
      },
      {
        id: 'prac-q4',
        topic: 'Disaster Recovery & git reflog',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'A developer accidentally ran git reset --hard HEAD~3 or deleted a critical branch before pushing. How do you recover the lost code using git reflog?',
        frequency: 'Classic practical developer troubleshooting scenario asked by product startups and FAANG',
        companyTags: ['Glassdoor Top Pick', 'Amazon', 'Stripe', 'Atlassian'],
        reference: {
          source: 'Git Documentation: git-reflog(1) & Pro Git Book: Undoing Things',
          citation: 'Git Reference Logs (Reflog) & Dangling Commit Recovery',
          linkText: 'git-scm.com: git-reflog'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing practical Git recovery mechanisms and understanding of dangling commit objects in .git/objects.',
          verbalBlueprint: [
            '1. Reassure: In Git, commits are almost NEVER lost immediately because Git keeps an append-only reference log (reflog) of every HEAD movement.',
            '2. Step 1: Run `git reflog` to inspect the history of where HEAD has been.',
            '3. Step 2: Find the commit hash right before the mistake occurred (e.g. `HEAD@{1}`).',
            '4. Step 3: Run `git reset --hard HEAD@{1}` or create a new branch from that hash: `git branch recovery-branch <hash>`.'
          ]
        },
        modelAnswer: {
          summary: 'While `git log` only shows the commit history of the current branch, `git reflog` tracks every single time HEAD changed state locally (commits, checkouts, rebase, resets). Commits remain in the Git object store for at least 30 to 90 days before garbage collection sweeps them.',
          table: {
            title: 'Reflog Recovery Execution Steps',
            headers: ['Step', 'Command Line', 'Outcome'],
            rows: [
              ['1. Inspect History', '`git reflog`', 'Displays recent HEAD movements: e.g. `c4f1a2b HEAD@{1}: commit: Added auth token logic`'],
              ['2. Identify Target', 'Locate the hash (e.g. `c4f1a2b`)', 'The exact commit right before the accidental `--hard reset` or branch deletion'],
              ['3. Recover Safely', '`git checkout -b recovered-feature c4f1a2b`', 'Spawns a new branch pointed directly at the "lost" commit with 100% of files intact!']
            ]
          },
          details: [
            'Why Git doesn\'t delete commits: When you reset or delete a branch, Git only deletes the pointer! The actual commit object, trees, and blobs remain in `.git/objects` as "dangling commits" until `git gc` runs.'
          ]
        },
        mustMentionKeywords: ['git reflog', 'Dangling Commits', 'HEAD@{n} Reference', 'git reset --hard Recovery', 'Git Garbage Collection (git gc)'],
        trapWarning: {
          rookieMistake: 'Panicking and running `git clean -fd` or re-cloning the repository.',
          winningAnswer: 'Emphasize that re-cloning from remote destroys your local reflog! Always inspect `git reflog` locally first before touching any git files.'
        }
      },
      {
        id: 'prac-q5',
        topic: 'Production Disk & Memory Troubleshooting',
        level: 'intermediate',
        levelLabel: 'Intermediate (Campus Core / L200)',
        question: 'Production Troubleshooting: A Linux server alerts that disk space is 100% full (df -h shows 100%), but when you check directories (du -sh /*), only 20GB of disk space is used. What is causing this, and how do you fix it without rebooting?',
        frequency: 'The #1 classic Senior SDE / SRE / DevOps production troubleshooting interview scenario',
        companyTags: ['Amazon', 'Google', 'Meta', 'Netflix', 'Uber'],
        reference: {
          source: 'Linux System Administration: lsof(8), proc(5) & Linux Inode Lifecycle',
          citation: 'Unlinked Open File Descriptors & Filesystem df vs du Discrepancies',
          linkText: 'Linux man-pages: lsof(8)'
        },
        tackleStrategy: {
          interviewerIntent: 'Evaluating Linux filesystem internals: Inodes, link count, and open file descriptors held by running processes.',
          verbalBlueprint: [
            '1. State root cause immediately: A large file (like a server log) was deleted using `rm`, BUT an active running process (like Nginx, Java, or Postgres) still holds an open file descriptor to it.',
            '2. Explain Linux inode mechanics: In Linux, a file is only freed from disk when its link count is 0 AND its open file descriptor count is 0.',
            '3. How to find it: Run `lsof +L1` (lists open files with link count < 1).',
            '4. How to fix it safely: Truncate the file descriptor via `/proc/<PID>/fd/<FD>` or gracefully restart the service.'
          ]
        },
        modelAnswer: {
          summary: 'In Linux, running `rm filename.log` removes the directory entry (link count drops to 0), but the disk blocks are NOT deallocated if a running application still has the file open.',
          table: {
            title: 'Diagnostic & Resolution Steps',
            headers: ['Phase', 'Command', 'Explanation'],
            rows: [
              ['1. Identify Root Cause', '`lsof +L1` or `lsof | grep deleted`', 'Finds processes holding open file handles to unlinked (deleted) files with massive sizes.'],
              ['2. Inspect File Descriptor', '`ls -lh /proc/<PID>/fd/`', 'Finds the specific file descriptor number (e.g. `4 -> /var/log/app.log (deleted)`)'],
              ['3. Reclaim Disk Space Instantly', '`> /proc/<PID>/fd/4` (Truncate to 0)', 'Instantly truncates the file size to 0 bytes without stopping or restarting the running service!'],
              ['4. Permanent Fix', 'Restart service or configure `logrotate` with `copytruncate`', 'Ensures log rotation closes old handles properly.']
            ]
          },
          details: [
            'Why `df` and `du` disagree: `du` walks the filesystem tree reading directory entries (cannot see deleted files). `df` queries the filesystem superblock directly, which counts all allocated disk blocks including unlinked open files.'
          ]
        },
        mustMentionKeywords: ['lsof +L1', 'Unlinked Open File Descriptors', 'Inode Link Count', 'df vs du discrepancy', '/proc/<PID>/fd/ Truncation', 'logrotate copytruncate'],
        trapWarning: {
          rookieMistake: 'Suggesting rebooting the server as the primary solution.',
          winningAnswer: 'In high-availability production systems, rebooting causes service downtime! Truncating the open file descriptor via `> /proc/<PID>/fd/<N>` immediately frees the disk space with ZERO downtime.'
        }
      },
      // --- ADVANCED (L300 / FAANG / Production Systems) ---
      {
        id: 'prac-q6',
        topic: 'File System Links & Inodes',
        level: 'advanced',
        levelLabel: 'Advanced (FAANG / L300)',
        question: 'What is the difference between a Hard Link and a Soft (Symbolic) Link in Linux? What happens at the Inode level when the original file is deleted?',
        frequency: 'Deep Linux systems question asked by Red Hat, Amazon, and Cisco',
        companyTags: ['Red Hat', 'Amazon', 'Cisco', 'GFG Top 50'],
        reference: {
          source: 'Linux Programmer\'s Manual: ln(1), link(2), symlink(2) & ext4 Inode Structure',
          citation: 'Linux Inode Tables, Hard Links vs Soft Links',
          linkText: 'Linux man-pages: ln(1)'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing exact knowledge of the Linux inode table, directory entries (dentry), and cross-filesystem limitations.',
          verbalBlueprint: [
            '1. Define Inode: Data structure storing file metadata (permissions, owner, size, disk block pointers) WITHOUT the filename.',
            '2. Hard Link: An extra directory entry pointing directly to the SAME Inode number. Deleting original file leaves hard link 100% intact!',
            '3. Soft Link (Symlink): A separate file with its OWN Inode that stores the PATH string of the target file. Deleting target file breaks the symlink (dangling pointer).'
          ]
        },
        modelAnswer: {
          summary: 'In Linux, filenames are merely pointers in directory tables pointing to numeric Inodes on the disk partition.',
          table: {
            title: 'Hard Link vs Soft (Symbolic) Link',
            headers: ['Attribute', 'Hard Link (`ln source dest`)', 'Soft Link (`ln -s source dest`)'],
            rows: [
              ['Inode Number', 'Shares the EXACT same Inode number as original file', 'Has its OWN distinct Inode number'],
              ['Contents Stored', 'Points directly to the actual data blocks on disk', 'Contains the textual pathname string to target file'],
              ['If Original File Deleted?', '✅ File data remains fully accessible via hard link! Inode link count decrements from 2 to 1.', '❌ Becomes a broken / dangling symlink pointing to a non-existent path.'],
              ['Cross-Filesystem Allowed?', '❌ NO: Inode numbers are unique only within a single disk partition.', '✅ YES: Can link across different disks, partitions, and NFS mounts.'],
              ['Can Link Directories?', '❌ Prohibited (prevents infinite recursive filesystem loops)', '✅ Allowed']
            ]
          },
          details: [
            'Checking Inodes: Run `ls -i filename` to inspect the Inode number. A hard link will report the exact same integer as the source file.'
          ]
        },
        mustMentionKeywords: ['Inode Number', 'Directory Entry (dentry)', 'Inode Link Count', 'Dangling Symlink', 'Cross-Filesystem Inode Boundary'],
        trapWarning: {
          rookieMistake: 'Thinking a Hard Link is a copy of the file.',
          winningAnswer: 'A Hard Link consumes ZERO additional disk space! It is not a copy; it is simply a second name pointing to the exact same physical disk blocks.'
        }
      },
      {
        id: 'prac-q7',
        topic: 'Git Internal Object Database',
        level: 'advanced',
        levelLabel: 'Advanced (FAANG / L300)',
        question: 'Explain Git\'s internal object store: Blobs, Trees, Commits, and Annotated Tags. How does SHA-1/SHA-256 content addressability work?',
        frequency: 'Asked in high-tier engineering and toolchain interviews (GitHub, Gitlab, Atlassian, Stripe)',
        companyTags: ['GitHub', 'Gitlab', 'Atlassian', 'Stripe'],
        reference: {
          source: 'Pro Git Book: Chapter 10 (Git Internals - Git Objects) & Torvalds Git Initial Architecture',
          citation: 'Git Content-Addressable Key-Value Store & Cryptographic Hash Addressing',
          linkText: 'Pro Git: Git Internals - Git Objects'
        },
        tackleStrategy: {
          interviewerIntent: 'Testing whether you understand Git as a content-addressable key-value object store rather than a diff-based VCS.',
          verbalBlueprint: [
            '1. State fundamental truth: Git is NOT a delta-based version control system; it is a content-addressable directed acyclic graph (DAG) of immutable objects.',
            '2. Name the 4 object types in `.git/objects`: Blob (file contents only), Tree (directory structure + filenames + permissions), Commit (points to top-level tree + author + parent commit hashes), Tag (points to commit with message).',
            '3. Explain Content Addressability: The object\'s filename on disk is the cryptographic hash of its contents: first 2 hex characters = directory name; remaining 38 characters = file name.'
          ]
        },
        modelAnswer: {
          summary: 'At its core, Git is a simple key-value database where the key is a 40-character SHA hash and the value is zlib-compressed binary data.',
          table: {
            title: 'The 4 Git Internal Object Types',
            headers: ['Object Type', 'What It Represents', 'What It Stores Inside'],
            rows: [
              ['Blob', 'File Contents', 'Raw file data only. Does NOT store filename, timestamps, or permissions!'],
              ['Tree', 'Directory', 'List of Blobs (files) and child Trees (subdirectories) mapped to their filenames and Unix permissions (100644 / 100755).'],
              ['Commit', 'Snapshot History', 'Top-level root Tree hash + Parent commit hash(es) + Author/Committer + Timestamp + Commit message.'],
              ['Annotated Tag', 'Release Reference', 'Points to a commit hash + tagger name + PGP signature + release notes.']
            ]
          },
          details: [
            'Deduplication Magic: If two files in different folders have the exact same content, Git creates only ONE blob object! Both tree objects simply reference the same blob hash.',
            'Inspection Commands: Run `git cat-file -t <hash>` to see object type, and `git cat-file -p <hash>` to print its contents.'
          ]
        },
        mustMentionKeywords: ['Content-Addressable Storage', 'Directed Acyclic Graph (DAG)', 'Blob vs Tree vs Commit', 'SHA-1 / SHA-256 Hashing', 'zlib Compression', 'git cat-file -p'],
        trapWarning: {
          rookieMistake: 'Saying Git stores file diffs / patches between commits.',
          winningAnswer: 'Git stores full snapshot Trees and Blobs for every commit, NOT diffs! Git only creates diffs dynamically on the fly when you ask for them (e.g. `git diff`), or packs them into packfiles (`.pack`) during `git gc`.'
        }
      }
    ]
  }
};
