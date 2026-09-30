// Interview-Grade Calibration & Elevator Pitch Enrichment — CommitDrive
// Contains 60-Second Spoken Pitch Scripts, Keyword Rubrics, and Interviewer Trap Questions
// for all 30 foundational CS topics across OS, DBMS, and Computer Networks.
// Graded into L100 Foundations (ELI5), L200 Placement Core, and L300 FAANG Systems.

export const topicInterviewData = {
  'os-1': {
    tier: "L100",
    tierName: "Foundations (ELI5)",
    frequency: "Asked in 80%+ of campus & SDE-1 screening rounds",
    targetPrompt: "When asked: \"Explain Dual-Mode Operations and how System Calls work\"",
    script: "Hardware Dual-Mode: Modern CPUs enforce User Mode (mode bit 1) and Kernel Mode (mode bit 0) for hardware protection. Restricted Execution: User apps run in User Mode without direct hardware, disk, or privileged instruction access. System Call Trigger: When apps need I/O or RAM, they execute a syscall instruction generating an atomic CPU trap. Privilege Transition: The trap flips the mode bit from 1 to 0 and jumps directly to the kernel dispatch table. Safe Return: The kernel completes the operation, resets mode bit to 1, and resumes the user program. Core Value: Fault isolation ensures buggy user code cannot corrupt OS memory or crash the entire machine.",
    scriptPoints: [
          "Hardware Dual-Mode: Modern CPUs enforce User Mode (mode bit 1) and Kernel Mode (mode bit 0) for hardware protection.",
          "Restricted Execution: User apps run in User Mode without direct hardware, disk, or privileged instruction access.",
          "System Call Trigger: When apps need I/O or RAM, they execute a syscall instruction generating an atomic CPU trap.",
          "Privilege Transition: The trap flips the mode bit from 1 to 0 and jumps directly to the kernel dispatch table.",
          "Safe Return: The kernel completes the operation, resets mode bit to 1, and resumes the user program.",
          "Core Value: Fault isolation ensures buggy user code cannot corrupt OS memory or crash the entire machine."
    ],
    keywords: [
          "User Mode vs Kernel Mode",
          "Hardware Mode Bit",
          "CPU Software Trap",
          "Privileged Instructions",
          "Kernel Dispatch Table",
          "Fault Isolation"
    ],
    trapQuestions: [
          {
                "id": "os-1-t1",
                "question": "Does every C library function (like strlen() or printf()) trigger a system call into the kernel?",
                "commonMistake": "Yes, because all standard library functions are provided by the operating system.",
                "winningAnswer": "No. Computational functions like strlen() run purely in User Mode within the process address space without invoking kernel traps. Functions like printf() do their initial string formatting in user space libc buffers, and only issue the sys_write system call when the buffer flushes. Pure computational functions incur zero context-switch overhead.",
                "companyTags": [
                      "Amazon",
                      "Qualcomm",
                      "Cisco"
                ]
          },
          {
                "id": "os-1-t2",
                "question": "Why can't the OS simply use a standard CALL instruction instead of a software trap (SYSCALL) to switch modes?",
                "commonMistake": "Because functions in the kernel are written in assembly and use different calling conventions.",
                "winningAnswer": "Security and privilege elevation. A normal CALL instruction jumps to an address while keeping the CPU in the current privilege mode (User Mode). A user program running in User Mode cannot execute privileged CPU instructions. Only a hardware-trapping instruction (like SYSCALL/SYSENTER) can atomically switch the CPU mode bit from 1 to 0 and vector through the Kernel Interrupt Descriptor Table (IDT), preventing rogue user code from jumping into arbitrary kernel memory addresses.",
                "companyTags": [
                      "Google",
                      "Microsoft"
                ]
          }
    ]
  },
  'os-2': {
    tier: "L100",
    tierName: "Foundations (ELI5)",
    frequency: "Asked in 90%+ of technical rounds (TCS, Zoho, Cognizant, Amazon)",
    targetPrompt: "When asked: \"What is a Process and what is inside the PCB?\"",
    script: "Program vs Process: A program is passive code on disk; a process is an active executing instance with virtual memory. Address Space Layout: Process memory is divided into Code, Data (globals), dynamic Heap (upwards), and Stack (downwards). Process Control Block (PCB): The kernel data structure tracking PID, state, Program Counter, registers, and open file descriptors. 5-State Lifecycle: Transitions through New → Ready (in queue) → Running (on CPU) → Waiting (I/O block) → Terminated. Context Switch Cost: CPU saves current registers into outgoing PCB and reloads new process PCB registers (~1–2 µs). Zombie vs Orphan: Orphans are adopted by init (PID 1); Zombies finished executing but retain PCB until parent calls wait().",
    scriptPoints: [
          "Program vs Process: A program is passive code on disk; a process is an active executing instance with virtual memory.",
          "Address Space Layout: Process memory is divided into Code, Data (globals), dynamic Heap (upwards), and Stack (downwards).",
          "Process Control Block (PCB): The kernel data structure tracking PID, state, Program Counter, registers, and open file descriptors.",
          "5-State Lifecycle: Transitions through New → Ready (in queue) → Running (on CPU) → Waiting (I/O block) → Terminated.",
          "Context Switch Cost: CPU saves current registers into outgoing PCB and reloads new process PCB registers (~1–2 µs).",
          "Zombie vs Orphan: Orphans are adopted by init (PID 1); Zombies finished executing but retain PCB until parent calls wait()."
    ],
    keywords: [
          "Code, Data, Heap, Stack",
          "Process Control Block (PCB)",
          "Program Counter",
          "Virtual Address Space",
          "5-State Lifecycle (New, Ready, Running, Waiting, Terminated)"
    ],
    trapQuestions: [
          {
                "id": "os-2-t1",
                "question": "What is the exact difference between a Zombie process and an Orphan process?",
                "commonMistake": "They are the same thing—a process that has lost its parent.",
                "winningAnswer": "An Orphan process is a running child whose parent terminated early; the Linux kernel re-parents it to init (PID 1 or systemd) to cleanly adopt it. A Zombie process has already finished executing (dead), but its PCB entry remains in the kernel process table because its parent hasn't yet called wait() or waitpid() to read its exit status code. Zombies consume zero CPU or RAM, but exhaust available kernel PIDs.",
                "companyTags": [
                      "Amazon",
                      "Zoho",
                      "Directi"
                ]
          }
    ]
  },
  'os-3': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Asked in 95%+ of SDE-1 interviews (Amazon, Microsoft, Cisco, Adobe)",
    targetPrompt: "When asked: \"Explain the difference between a Process and a Thread\"",
    script: "Process vs Thread: Process is an isolated memory space; threads are lightweight execution units inside that shared space. Shared vs Private: Threads share Code, Data, Heap, and Files, but keep private Program Counters, registers, and Stacks. Context Switch Speed: Thread switch avoids flushing TLB and CR3 page directory, running in ~1-2 µs vs ~10-20 µs for processes. Concurrency Hazards: Shared memory without locks causes Race Conditions and data corruption. Fault Isolation Trade-off: High throughput and instant memory sharing at the cost of shared failure risk. System API: Created via clone(2) with shared memory flags in Linux, or pthread_create() in POSIX.",
    scriptPoints: [
          "Process vs Thread: Process is an isolated memory space; threads are lightweight execution units inside that shared space.",
          "Shared vs Private: Threads share Code, Data, Heap, and Files, but keep private Program Counters, registers, and Stacks.",
          "Context Switch Speed: Thread switch avoids flushing TLB and CR3 page directory, running in ~1-2 µs vs ~10-20 µs for processes.",
          "Concurrency Hazards: Shared memory without locks causes Race Conditions and data corruption.",
          "Fault Isolation Trade-off: High throughput and instant memory sharing at the cost of shared failure risk.",
          "System API: Created via clone(2) with shared memory flags in Linux, or pthread_create() in POSIX."
    ],
    keywords: [
          "Shared Heap vs Private Stack",
          "TLB Flush Overhead",
          "CR3 Register",
          "Fault Isolation Boundary",
          "Context Switch Latency"
    ],
    trapQuestions: [
          {
                "id": "os-3-t1",
                "question": "Can two threads inside the same process have separate heaps?",
                "commonMistake": "Yes, if each thread initializes its own memory heap.",
                "winningAnswer": "No. By OS architecture, the heap belongs to the process address space and is shared by all threads. Threads only have their own private stacks and Thread Local Storage (TLS). If threads seem to allocate independently, it is only a high-level user-space memory allocator (like jemalloc or TCMalloc) using thread-specific memory pools on top of the shared process heap.",
                "companyTags": [
                      "Amazon",
                      "Microsoft",
                      "Bloomberg"
                ]
          },
          {
                "id": "os-3-t2",
                "question": "Why is a process context switch slower than a thread context switch? Is it just saving CPU registers?",
                "commonMistake": "Yes, saving process registers to the PCB takes more instructions.",
                "winningAnswer": "No. Saving registers takes less than a microsecond. The real hidden cost is the cache invalidation penalty: switching process address spaces invalidates the Translation Lookaside Buffer (TLB) and leaves the CPU L1/L2 data caches cold. The new process immediately experiences a storm of hardware cache misses until its working memory is pulled back from RAM into CPU caches.",
                "companyTags": [
                      "Google",
                      "Meta",
                      "Oracle"
                ]
          }
    ]
  },
  'os-4': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "High in campus recruitment (TCS Digital, Cognizant, Wipro, Infosys DSE)",
    targetPrompt: "When asked: \"Compare CPU Scheduling Algorithms and explain the Convoy Effect\"",
    script: "Core Goal: CPU scheduling picks which Ready process receives CPU time to maximize throughput and minimize latency. FCFS & Convoy Effect: Non-preemptive; short I/O jobs get trapped behind a massive CPU job, tanking responsiveness. SJF / SRTF Optimality: Mathematically yields minimum average waiting time, but impossible to know future burst lengths. Round Robin (RR): Time-sliced preemption using a fixed quantum; balances interactive responsiveness and fairness. Quantum Tuning Trade-off: Too large degenerates into FCFS; too small wastes CPU cycles on constant context switches. Production Standard: Multilevel Feedback Queues (MLFQ) dynamically adjust priorities based on CPU vs I/O behavior.",
    scriptPoints: [
          "Core Goal: CPU scheduling picks which Ready process receives CPU time to maximize throughput and minimize latency.",
          "FCFS & Convoy Effect: Non-preemptive; short I/O jobs get trapped behind a massive CPU job, tanking responsiveness.",
          "SJF / SRTF Optimality: Mathematically yields minimum average waiting time, but impossible to know future burst lengths.",
          "Round Robin (RR): Time-sliced preemption using a fixed quantum; balances interactive responsiveness and fairness.",
          "Quantum Tuning Trade-off: Too large degenerates into FCFS; too small wastes CPU cycles on constant context switches.",
          "Production Standard: Multilevel Feedback Queues (MLFQ) dynamically adjust priorities based on CPU vs I/O behavior."
    ],
    keywords: [
          "Convoy Effect",
          "Shortest Job First (SJF)",
          "Round Robin (RR)",
          "Time Quantum Calibration",
          "Preemption vs Non-preemption"
    ],
    trapQuestions: [
          {
                "id": "os-4-t1",
                "question": "Can Round Robin scheduling ever have a higher average turnaround time than FCFS?",
                "commonMistake": "No, Round Robin is always fairer and faster than FCFS.",
                "winningAnswer": "Yes! If all processes have nearly identical CPU burst lengths (e.g. 5 processes each needing 10ms with a 1ms time quantum), all 5 processes will finish almost simultaneously at the very end (~50ms), resulting in a terrible average turnaround time compared to FCFS where each finishes sequentially at 10ms, 20ms, 30ms, etc.",
                "companyTags": [
                      "Morgan Stanley",
                      "Infosys"
                ]
          }
    ]
  },
  'os-5': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Asked in 90%+ of backend & systems rounds",
    targetPrompt: "When asked: \"Explain Critical Sections, Mutex vs Semaphore, and Priority Inversion\"",
    script: "Critical Section: Code accessing shared data where concurrent execution can cause race conditions. 3 Core Requirements: Must satisfy Mutual Exclusion, Progress, and Bounded Waiting. Mutex (Locking): A binary lock with strict ownership; only the locking thread can unlock it. Semaphore (Signaling): An integer counter without ownership; any thread can signal/post or wait, ideal for producer-consumer. Priority Inversion Hazard: A low-priority thread holding a lock gets preempted by a medium job, blocking a high job. Resolution: Priority Inheritance temporarily promotes the lock-holding thread to high priority until it unlocks.",
    scriptPoints: [
          "Critical Section: Code accessing shared data where concurrent execution can cause race conditions.",
          "3 Core Requirements: Must satisfy Mutual Exclusion, Progress, and Bounded Waiting.",
          "Mutex (Locking): A binary lock with strict ownership; only the locking thread can unlock it.",
          "Semaphore (Signaling): An integer counter without ownership; any thread can signal/post or wait, ideal for producer-consumer.",
          "Priority Inversion Hazard: A low-priority thread holding a lock gets preempted by a medium job, blocking a high job.",
          "Resolution: Priority Inheritance temporarily promotes the lock-holding thread to high priority until it unlocks."
    ],
    keywords: [
          "Critical Section",
          "Mutex Ownership",
          "Counting Semaphore",
          "Priority Inversion",
          "Priority Inheritance Protocol"
    ],
    trapQuestions: [
          {
                "id": "os-5-t1",
                "question": "Can a thread unlock a Mutex that was locked by another thread? What about a Binary Semaphore?",
                "commonMistake": "Yes, both can be unlocked by any thread since they both enforce mutual exclusion.",
                "winningAnswer": "A Mutex enforces strict ownership semantics: if Thread A locks a mutex, Thread B attempting to unlock it triggers an illegal operation error or undefined behavior. A Binary Semaphore, however, has no concept of ownership—Thread B can safely signal (post) a semaphore initialized by Thread A. Semaphores are signaling primitives, while Mutexes are locking primitives.",
                "companyTags": [
                      "Uber",
                      "Adobe",
                      "Samsung"
                ]
          }
    ]
  },
  'os-6': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Standard placement question across all company tiers",
    targetPrompt: "When asked: \"What are the 4 conditions for Deadlock and how do we prevent them?\"",
    script: "Deadlock Definition: A state where processes are permanently frozen, each holding a resource and waiting for another. 4 Coffman Conditions: Must hold simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Deadlock Prevention: Eliminating Circular Wait via global total ordering of resources is the most practical strategy. Banker's Algorithm: Deadlock avoidance testing if granting a request leaves the system in a provably Safe State. Deadlock Recovery: Database engines use Waits-For Graphs to detect cycles and abort one victim transaction. Ostrich Algorithm: Consumer OSs ignore rare deadlocks because runtime cycle detection overhead outweighs benefits.",
    scriptPoints: [
          "Deadlock Definition: A state where processes are permanently frozen, each holding a resource and waiting for another.",
          "4 Coffman Conditions: Must hold simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.",
          "Deadlock Prevention: Eliminating Circular Wait via global total ordering of resources is the most practical strategy.",
          "Banker's Algorithm: Deadlock avoidance testing if granting a request leaves the system in a provably Safe State.",
          "Deadlock Recovery: Database engines use Waits-For Graphs to detect cycles and abort one victim transaction.",
          "Ostrich Algorithm: Consumer OSs ignore rare deadlocks because runtime cycle detection overhead outweighs benefits."
    ],
    keywords: [
          "4 Coffman Conditions",
          "Circular Wait Elimination",
          "Resource Total Ordering",
          "Banker's Safe State Algorithm",
          "Deadlock Detection vs Prevention"
    ],
    trapQuestions: [
          {
                "id": "os-6-t1",
                "question": "Does an \"Unsafe State\" in Banker's Algorithm guarantee that a deadlock will happen?",
                "commonMistake": "Yes, an unsafe state is a deadlocked state.",
                "winningAnswer": "No! An unsafe state is NOT deadlocked; it simply means the operating system can no longer guarantee that all processes will finish if every process simultaneously requests its maximum declared resources. A deadlock might never occur if processes finish without requesting their maximum limits.",
                "companyTags": [
                      "Microsoft",
                      "Goldman Sachs"
                ]
          }
    ]
  },
  'os-7': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Asked in 85%+ of systems & core engineering rounds (Qualcomm, Intel, Nvidia)",
    targetPrompt: "When asked: \"How does Paging and Virtual Address Translation work?\"",
    script: "Paging Mechanism: Virtual memory is broken into Pages (4 KB) mapped to physical RAM Frames via a Page Table. Fragmentation Elimination: Paging completely eliminates external fragmentation by allowing non-contiguous RAM allocation. Hardware Translation: CPU MMU splits logical address into Page Number (directory lookup) and Offset (exact byte). TLB Acceleration: Translation Lookaside Buffer caches recent translations, speeding lookups from ~100ns to ~1ns. Effective Memory Access Time: EMAT = Hit Rate × (TLB + RAM) + Miss Rate × (TLB + 2 × RAM). Multi-Level Paging: 64-bit systems use 4-level hierarchical tables so unused memory address spaces consume zero RAM.",
    scriptPoints: [
          "Paging Mechanism: Virtual memory is broken into Pages (4 KB) mapped to physical RAM Frames via a Page Table.",
          "Fragmentation Elimination: Paging completely eliminates external fragmentation by allowing non-contiguous RAM allocation.",
          "Hardware Translation: CPU MMU splits logical address into Page Number (directory lookup) and Offset (exact byte).",
          "TLB Acceleration: Translation Lookaside Buffer caches recent translations, speeding lookups from ~100ns to ~1ns.",
          "Effective Memory Access Time: EMAT = Hit Rate × (TLB + RAM) + Miss Rate × (TLB + 2 × RAM).",
          "Multi-Level Paging: 64-bit systems use 4-level hierarchical tables so unused memory address spaces consume zero RAM."
    ],
    keywords: [
          "Page vs Frame",
          "Page Table Base Register (CR3)",
          "Translation Lookaside Buffer (TLB)",
          "Page Offset vs VPN",
          "Multi-Level Paging"
    ],
    trapQuestions: [
          {
                "id": "os-7-t1",
                "question": "Why doesn't a 64-bit CPU simply use a flat 1-level Page Table?",
                "commonMistake": "Because 64-bit memory addresses are too wide to calculate in one step.",
                "winningAnswer": "A flat page table for a 64-bit address space with 4KB pages would contain 2^52 Page Table Entries. At 8 bytes per entry, that single page table would consume 36 Petabytes of physical RAM per process! Multi-level paging forms a sparse hierarchical tree where unused address regions require zero allocated page tables.",
                "companyTags": [
                      "Intel",
                      "Apple",
                      "Nvidia"
                ]
          }
    ]
  },
  'os-8': {
    tier: "L300",
    tierName: "FAANG Systems",
    frequency: "High-frequency in systems design & platform rounds",
    targetPrompt: "When asked: \"What is Belady's Anomaly and how does Thrashing occur?\"",
    script: "Virtual Memory & Demand Paging: Programs execute with more virtual memory than physical RAM by loading pages on-demand. Page Fault Sequence: Accessing an unmapped page triggers a trap, allocates a frame, fetches from disk, and restarts instruction. Belady's Anomaly: FIFO replacement can paradoxically increase page faults when adding RAM frames. Stack Algorithms: LRU and Optimal are immune to Belady's anomaly because N-frame memory is a strict subset of N+1 frames. Memory Thrashing: Occurs when degree of multiprogramming exceeds RAM, causing continuous swapping and CPU collapse. Working Set Model: The OS monitors working sets W(t, Δ) and suspends processes if total active working sets exceed RAM.",
    scriptPoints: [
          "Virtual Memory & Demand Paging: Programs execute with more virtual memory than physical RAM by loading pages on-demand.",
          "Page Fault Sequence: Accessing an unmapped page triggers a trap, allocates a frame, fetches from disk, and restarts instruction.",
          "Belady's Anomaly: FIFO replacement can paradoxically increase page faults when adding RAM frames.",
          "Stack Algorithms: LRU and Optimal are immune to Belady's anomaly because N-frame memory is a strict subset of N+1 frames.",
          "Memory Thrashing: Occurs when degree of multiprogramming exceeds RAM, causing continuous swapping and CPU collapse.",
          "Working Set Model: The OS monitors working sets W(t, Δ) and suspends processes if total active working sets exceed RAM."
    ],
    keywords: [
          "Belady's Anomaly",
          "Stack Algorithms (LRU & OPT)",
          "Page Fault Servicing",
          "Thrashing & Working Set Model",
          "Clock (Second-Chance) Algorithm"
    ],
    trapQuestions: [
          {
                "id": "os-8-t1",
                "question": "Why can't operating systems simply use pure Least Recently Used (LRU) page replacement in practice?",
                "commonMistake": "Because LRU is patented and proprietary.",
                "winningAnswer": "Pure LRU requires either updating a hardware timestamp in the Page Table Entry or moving a node in a doubly-linked list on every single memory access (billions of times per second), creating an unacceptable CPU and memory bus bottleneck. Modern operating systems use the Clock (Second-Chance) algorithm, which approximates LRU with near-zero overhead using a single hardware Reference Bit.",
                "companyTags": [
                      "Google",
                      "Meta",
                      "Amazon"
                ]
          }
    ]
  },
  'os-9': {
    tier: "L300",
    tierName: "FAANG Systems",
    frequency: "Frequently asked in Linux systems engineering & cloud infra interviews",
    targetPrompt: "When asked: \"How do Inodes work and what is the difference between Hard Links and Soft Links?\"",
    script: "Inode Architecture: Index Nodes store all file metadata (permissions, owner, size, block pointers) on disk, excluding the filename. Decoupled Filenames: Filenames exist only as directory mappings pointing to Inode numbers, enabling Hard Links. Hard Link vs Soft Link: Hard link shares the same Inode (cannot cross partitions); Soft link is an independent file containing a path. Physical Deletion Rule: File blocks are freed only when link count (st_nlink) reaches 0 AND all open file descriptors close. Journaling Crash Protection: ext4 logs metadata updates to a journal before disk writes, enabling instant recovery without long fsck scans. Production Issue: A deleted log file still held open by a running daemon keeps disk 100% full (df 100% vs du low).",
    scriptPoints: [
          "Inode Architecture: Index Nodes store all file metadata (permissions, owner, size, block pointers) on disk, excluding the filename.",
          "Decoupled Filenames: Filenames exist only as directory mappings pointing to Inode numbers, enabling Hard Links.",
          "Hard Link vs Soft Link: Hard link shares the same Inode (cannot cross partitions); Soft link is an independent file containing a path.",
          "Physical Deletion Rule: File blocks are freed only when link count (st_nlink) reaches 0 AND all open file descriptors close.",
          "Journaling Crash Protection: ext4 logs metadata updates to a journal before disk writes, enabling instant recovery without long fsck scans.",
          "Production Issue: A deleted log file still held open by a running daemon keeps disk 100% full (df 100% vs du low)."
    ],
    keywords: [
          "Inode Metadata Table",
          "Hard Link vs Symbolic Link",
          "st_nlink Reference Counter",
          "Unlinked Open File Descriptors",
          "Journaling (ext4 / XFS)"
    ],
    trapQuestions: [
          {
                "id": "os-9-t1",
                "question": "If you run `rm app.log` on a Linux server and the link count drops to 0, why might `df -h` still report that the disk is 100% full?",
                "commonMistake": "The Linux kernel is slow to update disk free block tables.",
                "winningAnswer": "A running process (like Nginx or Java) still has the file open via an active file descriptor! Linux only deallocates physical disk blocks when the inode link count drops to 0 AND all open file descriptors are closed. Run `lsof +L1` to find the process holding the unlinked file descriptor, and restart it or truncate via `/proc/<PID>/fd/<FD>` to reclaim disk space without rebooting.",
                "companyTags": [
                      "Netflix",
                      "Meta",
                      "Stripe"
                ]
          }
    ]
  },
  'os-10': {
    tier: "L300",
    tierName: "FAANG Systems",
    frequency: "Top-tier question in High-Scale Systems, Kafka, and FinTech infrastructure",
    targetPrompt: "When asked: \"How does Linux Zero-Copy work and why does traditional I/O hurt throughput?\"",
    script: "Traditional I/O Bottleneck: read() + write() forces 4 context switches and 4 copies (2 DMA + 2 CPU copies). User Buffer Inefficiency: Data is redundantly copied from Kernel Page Cache to User Memory, then back to Socket Buffer. Zero-Copy Solution: Linux sendfile() streams data directly from Page Cache to the network card via Scatter-Gather DMA. Zero CPU Overhead: Zero-Copy requires only 2 context switches and 0 CPU data copy, maximizing network throughput. Real-World Scale: Used by Kafka and Nginx to saturate 100 Gbps network cards without burning server CPU. Polling vs Interrupt: Polling wastes CPU unless device latency is under 1µs (DPDK/HFT); Interrupt-driven is standard for general I/O.",
    scriptPoints: [
          "Traditional I/O Bottleneck: read() + write() forces 4 context switches and 4 copies (2 DMA + 2 CPU copies).",
          "User Buffer Inefficiency: Data is redundantly copied from Kernel Page Cache to User Memory, then back to Socket Buffer.",
          "Zero-Copy Solution: Linux sendfile() streams data directly from Page Cache to the network card via Scatter-Gather DMA.",
          "Zero CPU Overhead: Zero-Copy requires only 2 context switches and 0 CPU data copy, maximizing network throughput.",
          "Real-World Scale: Used by Kafka and Nginx to saturate 100 Gbps network cards without burning server CPU.",
          "Polling vs Interrupt: Polling wastes CPU unless device latency is under 1µs (DPDK/HFT); Interrupt-driven is standard for general I/O."
    ],
    keywords: [
          "4 Context Switches & 4 Copies",
          "sendfile() & splice()",
          "Page Cache to Socket Buffer",
          "Scatter-Gather DMA",
          "Kafka High Throughput Architecture"
    ],
    trapQuestions: [
          {
                "id": "os-10-t1",
                "question": "Does Linux `sendfile()` completely bypass system RAM when reading from an NVMe SSD and sending over a 10Gbps NIC?",
                "commonMistake": "Yes, data flows straight through the PCIe bus from disk directly to the network card.",
                "winningAnswer": "No! The data still travels into system RAM (the Kernel Page Cache) via DMA. What `sendfile()` eliminates is CPU copying between kernel memory and user-space memory, and with Scatter-Gather DMA, avoids copying between the page cache and socket buffer. System RAM is still used, but the CPU never touches a single byte of the payload.",
                "companyTags": [
                      "Confluent",
                      "LinkedIn",
                      "Uber"
                ]
          }
    ]
  },
  'dbms-1': {
    tier: "L100",
    tierName: "Foundations (ELI5)",
    frequency: "Common fresher and campus placement screening question",
    targetPrompt: "When asked: \"What is DBMS Architecture and Data Independence?\"",
    script: "DBMS Architecture: 3-Schema model isolates External views, Conceptual logical tables, and Internal disk storage. Physical Data Independence: Storage indexes or file layouts can change without altering logical schemas or queries. Logical Data Independence: Conceptual tables can expand or restructure without breaking user view queries. Core Advantage: Replaces fragile raw file I/O with centralized concurrency, ACID guarantees, and security rules. Key Engine Components: Query Optimizer, Storage Engine, Buffer Pool Manager, and Write-Ahead Log (WAL). ACID Contract: Ensures transactions execute reliably without data corruption or partial writes.",
    scriptPoints: [
          "DBMS Architecture: 3-Schema model isolates External views, Conceptual logical tables, and Internal disk storage.",
          "Physical Data Independence: Storage indexes or file layouts can change without altering logical schemas or queries.",
          "Logical Data Independence: Conceptual tables can expand or restructure without breaking user view queries.",
          "Core Advantage: Replaces fragile raw file I/O with centralized concurrency, ACID guarantees, and security rules.",
          "Key Engine Components: Query Optimizer, Storage Engine, Buffer Pool Manager, and Write-Ahead Log (WAL).",
          "ACID Contract: Ensures transactions execute reliably without data corruption or partial writes."
    ],
    keywords: [
          "3-Schema Architecture",
          "Physical Data Independence",
          "Logical Data Independence",
          "ACID Contract",
          "Buffer Pool & Storage Engine"
    ],
    trapQuestions: [
          {
                "id": "dbms-1-t1",
                "question": "Why is Logical Data Independence harder to achieve than Physical Data Independence?",
                "commonMistake": "Because hard drives are simpler to program than relational databases.",
                "winningAnswer": "Physical data independence only requires decoupling the disk file format and index structures from the table schema. Logical data independence requires rewriting and re-mapping user queries and views whenever underlying entities are split, merged, or restructured, which frequently alters query semantics.",
                "companyTags": [
                      "Oracle",
                      "TCS Digital",
                      "Infosys"
                ]
          }
    ]
  },
  'dbms-2': {
    tier: "L100",
    tierName: "Foundations (ELI5)",
    frequency: "Core placement question across 85%+ of technical screening rounds",
    targetPrompt: "When asked: \"Explain Relational Keys: Super, Candidate, Primary, and Foreign Keys\"",
    script: "Relational Abstraction: Represents data as mathematical Relations (tables) composed of Tuples (rows) and Attributes (columns). Super Key vs Candidate Key: Super Key uniquely identifies rows; Candidate Key is a minimal Super Key with zero redundant columns. Primary & Alternate Keys: Primary Key is the chosen candidate key (cannot be NULL); remaining candidates are Alternate Keys. Foreign Key Integrity: Enforces referential integrity by pointing to a valid primary key in a referenced parent relation. Referential Actions: Supports CASCADE, SET NULL, and RESTRICT on parent row updates or deletions. Relational Algebra Primitives: Selection (σ), Projection (π), Cartesian Product (×), and Join (⋈) form the query foundation.",
    scriptPoints: [
          "Relational Abstraction: Represents data as mathematical Relations (tables) composed of Tuples (rows) and Attributes (columns).",
          "Super Key vs Candidate Key: Super Key uniquely identifies rows; Candidate Key is a minimal Super Key with zero redundant columns.",
          "Primary & Alternate Keys: Primary Key is the chosen candidate key (cannot be NULL); remaining candidates are Alternate Keys.",
          "Foreign Key Integrity: Enforces referential integrity by pointing to a valid primary key in a referenced parent relation.",
          "Referential Actions: Supports CASCADE, SET NULL, and RESTRICT on parent row updates or deletions.",
          "Relational Algebra Primitives: Selection (σ), Projection (π), Cartesian Product (×), and Join (⋈) form the query foundation."
    ],
    keywords: [
          "Super Key vs Candidate Key",
          "Primary Key Uniqueness",
          "Referential Integrity & Foreign Keys",
          "ON DELETE CASCADE vs RESTRICT",
          "Relational Algebra (σ, π, ⋈)"
    ],
    trapQuestions: [
          {
                "id": "dbms-2-t1",
                "question": "Can a table have multiple Candidate Keys? Can a Primary Key contain NULL in standard SQL?",
                "commonMistake": "A table can only have one candidate key, and primary keys can contain NULL if specified.",
                "winningAnswer": "A table can have multiple Candidate Keys (any minimal attribute set that uniquely identifies rows). However, exactly one is chosen as the Primary Key. By relational theory (Entity Integrity rule) and ANSI SQL standard, Primary Keys strictly forbid NULL values because NULL represents unknown identity, violating unique entity identification.",
                "companyTags": [
                      "Amazon",
                      "Cognizant",
                      "Wipro"
                ]
          }
    ]
  },
  'dbms-3': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Asked in 90%+ of SQL technical interviews (Goldman Sachs, Microsoft, Intuit)",
    targetPrompt: "When asked: \"Explain the Logical Query Execution Order of an SQL Query\"",
    script: "SQL Declarative Model: Users specify what data to retrieve, leaving the query planner to determine how to fetch it. Logical Execution Order: FROM/JOIN → ON → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. WHERE vs HAVING: WHERE filters individual rows before aggregation; HAVING filters aggregated group buckets after grouping. No Aliases in WHERE: Because WHERE executes before SELECT, column aliases defined in SELECT cannot be filtered in WHERE. NULL Three-Valued Logic: Comparing with NULL using = produces UNKNOWN; queries must explicitly use IS NULL or IS NOT NULL. Aggregate Filtering Trap: Writing WHERE AVG(salary) > 50000 causes a syntax error; it must be placed in HAVING.",
    scriptPoints: [
          "SQL Declarative Model: Users specify what data to retrieve, leaving the query planner to determine how to fetch it.",
          "Logical Execution Order: FROM/JOIN → ON → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.",
          "WHERE vs HAVING: WHERE filters individual rows before aggregation; HAVING filters aggregated group buckets after grouping.",
          "No Aliases in WHERE: Because WHERE executes before SELECT, column aliases defined in SELECT cannot be filtered in WHERE.",
          "NULL Three-Valued Logic: Comparing with NULL using = produces UNKNOWN; queries must explicitly use IS NULL or IS NOT NULL.",
          "Aggregate Filtering Trap: Writing WHERE AVG(salary) > 50000 causes a syntax error; it must be placed in HAVING."
    ],
    keywords: [
          "Logical Execution Order",
          "FROM → WHERE → GROUP BY → HAVING → SELECT",
          "WHERE vs HAVING",
          "Three-Valued Logic (TRUE, FALSE, UNKNOWN)",
          "IS NULL vs = NULL"
    ],
    trapQuestions: [
          {
                "id": "dbms-3-t1",
                "question": "Why does `SELECT name, salary * 12 AS annual_sal FROM employees WHERE annual_sal > 50000;` fail with an error?",
                "commonMistake": "Because arithmetic operations are not allowed in SQL aliases.",
                "winningAnswer": "Logical query processing order! The `WHERE` clause executes in Phase 3, while `SELECT` (which defines the alias `annual_sal`) executes later in Phase 6. At the time `WHERE` filters rows, the alias `annual_sal` does not yet exist. You must repeat the expression `WHERE salary * 12 > 50000` or use a CTE/subquery.",
                "companyTags": [
                      "Goldman Sachs",
                      "Intuit",
                      "Morgan Stanley"
                ]
          }
    ]
  },
  'dbms-4': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Standard SDE-1 coding & problem-solving rounds (LeetCode SQL, HackerRank)",
    targetPrompt: "When asked: \"What is the difference between Correlated Subqueries, CTEs, and Window Functions?\"",
    script: "Subquery Classification: Scalar subqueries return 1 value; Multi-row return lists (IN/EXISTS); Correlated evaluate per outer row. Correlated Subquery Cost: Inner query references outer columns, forcing re-execution for each candidate outer row (O(N × M)). Common Table Expressions (CTEs): WITH clause creates readable, modular temporary result sets within a single execution scope. Window Functions: Compute running totals and rankings over partitions without collapsing rows into a single GROUP BY summary. Ranking Differences: ROW_NUMBER() is strictly unique (1, 2, 3, 4); RANK() skips on ties (1, 2, 2, 4); DENSE_RANK() never skips (1, 2, 2, 3). Interview Pattern: Finding the Nth highest salary in each department using DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC).",
    scriptPoints: [
          "Subquery Classification: Scalar subqueries return 1 value; Multi-row return lists (IN/EXISTS); Correlated evaluate per outer row.",
          "Correlated Subquery Cost: Inner query references outer columns, forcing re-execution for each candidate outer row (O(N × M)).",
          "Common Table Expressions (CTEs): WITH clause creates readable, modular temporary result sets within a single execution scope.",
          "Window Functions: Compute running totals and rankings over partitions without collapsing rows into a single GROUP BY summary.",
          "Ranking Differences: ROW_NUMBER() is strictly unique (1, 2, 3, 4); RANK() skips on ties (1, 2, 2, 4); DENSE_RANK() never skips (1, 2, 2, 3).",
          "Interview Pattern: Finding the Nth highest salary in each department using DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)."
    ],
    keywords: [
          "Correlated Subquery O(N×M)",
          "Common Table Expressions (WITH)",
          "Window Functions OVER (PARTITION BY)",
          "ROW_NUMBER vs RANK vs DENSE_RANK",
          "Nth Highest Salary Pattern"
    ],
    trapQuestions: [
          {
                "id": "dbms-4-t1",
                "question": "How do `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()` handle duplicates in salaries: [100k, 90k, 90k, 80k]?",
                "commonMistake": "They all produce ranks 1, 2, 3, 4.",
                "winningAnswer": "For ties: `ROW_NUMBER()` assigns strictly unique sequential integers: 1, 2, 3, 4. `RANK()` gives ties the same number but leaves gaps: 1, 2, 2, 4 (skips 3). `DENSE_RANK()` gives ties the same number without gaps: 1, 2, 2, 3. To find the 2nd highest distinct salary, always use `DENSE_RANK()`.",
                "companyTags": [
                      "Amazon",
                      "Bloomberg",
                      "Cisco"
                ]
          }
    ]
  },
  'dbms-5': {
    tier: "L100",
    tierName: "Foundations (ELI5)",
    frequency: "Common in systems design & database modeling rounds",
    targetPrompt: "When asked: \"How do you map ER Diagrams to a Relational Database Schema?\"",
    script: "Conceptual Modeling: Entity-Relationship (ER) diagrams visually model business domains before physical schema implementation. Entities & Attributes: Strong entities have primary keys; Weak entities depend on identifying relationships with partial keys. Cardinality Constraints: Defines relationship mapping ratios (1:1, 1:N, M:N) and Participation (Total vs Partial). Relational Mapping Rules: 1:N puts foreign key on the 'N' side; M:N relationships strictly require a separate junction/bridge table. 1:1 Schema Mapping: Place foreign key on the entity with Total participation to minimize NULL column waste. Production Value: Prevents structural schema design flaws and normalization violations before code deployment.",
    scriptPoints: [
          "Conceptual Modeling: Entity-Relationship (ER) diagrams visually model business domains before physical schema implementation.",
          "Entities & Attributes: Strong entities have primary keys; Weak entities depend on identifying relationships with partial keys.",
          "Cardinality Constraints: Defines relationship mapping ratios (1:1, 1:N, M:N) and Participation (Total vs Partial).",
          "Relational Mapping Rules: 1:N puts foreign key on the 'N' side; M:N relationships strictly require a separate junction/bridge table.",
          "1:1 Schema Mapping: Place foreign key on the entity with Total participation to minimize NULL column waste.",
          "Production Value: Prevents structural schema design flaws and normalization violations before code deployment."
    ],
    keywords: [
          "Entity-Relationship (ER) Model",
          "Cardinality (1:1, 1:N, M:N)",
          "Total vs Partial Participation",
          "M:N Junction Table Mapping",
          "Weak Entities & Identifying Relationships"
    ],
    trapQuestions: [
          {
                "id": "dbms-5-t1",
                "question": "Why can't a Many-to-Many (M:N) relationship between Students and Courses be represented with a Foreign Key in either table?",
                "commonMistake": "You can, by storing comma-separated IDs in an array column.",
                "winningAnswer": "Storing comma-separated IDs violates First Normal Form (1NF non-atomic values) and prevents database index lookups. Adding fixed columns (course1, course2) limits enrollment artificially. An M:N relationship mathematically requires a separate Junction (Bridge) Table containing composite foreign keys (student_id, course_id) pointing to both parent tables.",
                "companyTags": [
                      "Adobe",
                      "Walmart",
                      "Oracle"
                ]
          }
    ]
  },
  'dbms-6': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Mandatory topic tested in 95%+ of CS placement interviews",
    targetPrompt: "When asked: \"Explain Normalization: 1NF, 2NF, 3NF, and BCNF with concrete violations\"",
    script: "Normalization Purpose: Progressive mathematical rules to eliminate redundancy and avoid insertion, deletion, and update anomalies. 1NF (Atomic Values): All column values must be atomic—no comma-separated lists, JSON arrays, or nested tables. 2NF (No Partial Key Dependencies): In 1NF and every non-prime attribute depends on the entire composite candidate key. 3NF (No Transitive Dependencies): In 2NF and no non-prime attribute determines another non-prime attribute. BCNF (Boyce-Codd): Stricter than 3NF; for every functional dependency X → Y, X must be a Super Key. Lossless-Join Guarantee: Decomposition must ensure natural join restores original data without generating spurious tuples.",
    scriptPoints: [
          "Normalization Purpose: Progressive mathematical rules to eliminate redundancy and avoid insertion, deletion, and update anomalies.",
          "1NF (Atomic Values): All column values must be atomic—no comma-separated lists, JSON arrays, or nested tables.",
          "2NF (No Partial Key Dependencies): In 1NF and every non-prime attribute depends on the entire composite candidate key.",
          "3NF (No Transitive Dependencies): In 2NF and no non-prime attribute determines another non-prime attribute.",
          "BCNF (Boyce-Codd): Stricter than 3NF; for every functional dependency X → Y, X must be a Super Key.",
          "Lossless-Join Guarantee: Decomposition must ensure natural join restores original data without generating spurious tuples."
    ],
    keywords: [
          "1NF (Atomicity)",
          "2NF (No Partial Dependencies)",
          "3NF (No Transitive Dependencies)",
          "BCNF (X is Super Key)",
          "Lossless-Join Decomposition"
    ],
    trapQuestions: [
          {
                "id": "dbms-6-t1",
                "question": "Can decomposing a table into BCNF ever result in a loss of dependency preservation?",
                "commonMistake": "No, BCNF is the best normal form so it preserves all dependencies and lossless joins.",
                "winningAnswer": "Yes! While 3NF always guarantees both Lossless-Join and Dependency Preservation, BCNF guarantees Lossless-Join but CANNOT always preserve all functional dependencies. In enterprise systems where checking cross-table dependencies is computationally prohibitive, engineers deliberately stop at 3NF.",
                "companyTags": [
                      "Amazon",
                      "Google",
                      "Directi"
                ]
          }
    ]
  },
  'dbms-7': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Asked in 95%+ of backend engineering rounds (FinTech, FAANG, Startups)",
    targetPrompt: "When asked: \"Explain ACID Properties and ANSI SQL Transaction Isolation Levels\"",
    script: "ACID Guarantees: Atomicity (all-or-nothing), Consistency (integrity rules), Isolation (concurrency boundaries), Durability (persisted). Dirty Read Hazard: Transaction reads uncommitted data written by another transaction that later rolls back. Non-Repeatable Read: Reading the same row twice yields different column values because another transaction committed an update. Phantom Read: Re-running a range query returns newly inserted rows committed by a concurrent transaction. 4 ANSI Isolation Levels: Read Uncommitted, Read Committed (default Postgres), Repeatable Read (default MySQL), and Serializable. Engine Protection: MySQL InnoDB prevents phantoms in Repeatable Read using Next-Key Locks; Postgres uses MVCC snapshots.",
    scriptPoints: [
          "ACID Guarantees: Atomicity (all-or-nothing), Consistency (integrity rules), Isolation (concurrency boundaries), Durability (persisted).",
          "Dirty Read Hazard: Transaction reads uncommitted data written by another transaction that later rolls back.",
          "Non-Repeatable Read: Reading the same row twice yields different column values because another transaction committed an update.",
          "Phantom Read: Re-running a range query returns newly inserted rows committed by a concurrent transaction.",
          "4 ANSI Isolation Levels: Read Uncommitted, Read Committed (default Postgres), Repeatable Read (default MySQL), and Serializable.",
          "Engine Protection: MySQL InnoDB prevents phantoms in Repeatable Read using Next-Key Locks; Postgres uses MVCC snapshots."
    ],
    keywords: [
          "ACID Properties",
          "Dirty Read vs Non-Repeatable Read vs Phantom Read",
          "Read Committed vs Repeatable Read",
          "Serializable Snapshot Isolation",
          "Next-Key Locking"
    ],
    trapQuestions: [
          {
                "id": "dbms-7-t1",
                "question": "Does MySQL InnoDB at Repeatable Read isolation level allow Phantom Reads as defined by standard ANSI SQL-92?",
                "commonMistake": "Yes, because ANSI SQL specifies that Repeatable Read allows Phantom Reads.",
                "winningAnswer": "In theoretical ANSI SQL-92, Repeatable Read allows Phantom Reads. However, MySQL InnoDB overcomes this ANSI limitation! In InnoDB, Repeatable Read prevents Phantom Reads for consistent reads using MVCC snapshots, and for locking reads (SELECT ... FOR UPDATE) using Next-Key Locking (Record Lock + Gap Lock) to freeze inserts into the range.",
                "companyTags": [
                      "Stripe",
                      "Paypal",
                      "Uber"
                ]
          }
    ]
  },
  'dbms-8': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Tested in 90%+ of core database and transaction processing interviews",
    targetPrompt: "When asked: \"Explain Conflict Serializability and Two-Phase Locking (2PL)\"",
    script: "Concurrency Control Goal: Maximizes concurrent transaction execution while guaranteeing Conflict Serializability. Conflict Serializability Test: Tested by building a Precedence (Serialization) Graph; the schedule is serializable if and only if acyclic. Two-Phase Locking (2PL): Growing Phase (acquires locks, releases none) followed by Shrinking Phase (releases locks, acquires none). Strict 2PL Standard: Holds all exclusive write locks until commit/abort, completely eliminating cascading rollbacks. Deadlock Reality: 2PL guarantees serializability but does NOT prevent deadlocks; engines use Waits-For Graphs to detect and abort victims. Lock Compatibility: Shared (S) locks allow concurrent reads; Exclusive (X) locks block all other reads and writes.",
    scriptPoints: [
          "Concurrency Control Goal: Maximizes concurrent transaction execution while guaranteeing Conflict Serializability.",
          "Conflict Serializability Test: Tested by building a Precedence (Serialization) Graph; the schedule is serializable if and only if acyclic.",
          "Two-Phase Locking (2PL): Growing Phase (acquires locks, releases none) followed by Shrinking Phase (releases locks, acquires none).",
          "Strict 2PL Standard: Holds all exclusive write locks until commit/abort, completely eliminating cascading rollbacks.",
          "Deadlock Reality: 2PL guarantees serializability but does NOT prevent deadlocks; engines use Waits-For Graphs to detect and abort victims.",
          "Lock Compatibility: Shared (S) locks allow concurrent reads; Exclusive (X) locks block all other reads and writes."
    ],
    keywords: [
          "Conflict Serializability",
          "Precedence Graph Cycle Test",
          "Two-Phase Locking (Growing & Shrinking)",
          "Strict 2PL & Cascading Rollbacks",
          "Waits-For Graph Deadlocks"
    ],
    trapQuestions: [
          {
                "id": "dbms-8-t1",
                "question": "Does Two-Phase Locking (2PL) eliminate deadlocks in a relational database engine?",
                "commonMistake": "Yes, 2PL ensures transactions take locks in proper phases, preventing deadlocks.",
                "winningAnswer": "No! 2PL guarantees Conflict Serializability, but it does NOT prevent deadlocks. In fact, 2PL introduces deadlocks because transactions hold acquired locks while waiting to acquire additional locks (satisfying Coffman Hold-and-Wait). Databases resolve this using timeout thresholds or background Waits-For Graph cycle detectors that abort a victim transaction.",
                "companyTags": [
                      "Oracle",
                      "Microsoft",
                      "Goldman Sachs"
                ]
          }
    ]
  },
  'dbms-9': {
    tier: "L300",
    tierName: "FAANG Systems",
    frequency: "Standard FAANG & High-Scale Systems question (Uber, Amazon, Swiggy)",
    targetPrompt: "When asked: \"Why do Databases use B+ Trees instead of Binary Trees or Hash Indexes?\"",
    script: "Indexing Rationale: Physical search trees that speed up row lookup from full table scans (O(N)) to logarithmic time (O(log N)). Clustered Index: Determines the physical on-disk sort order of rows; leaf nodes contain actual data tuples (max 1 per table). Non-Clustered (Secondary) Index: Separate B+ tree storing index keys and pointers (bookmarks/PKs) to main table rows. B+ Tree Advantages: High fan-out (100+) keeps height to 3-4 levels; leaf nodes form a sorted doubly-linked list for fast range scans. Hash Index Limitation: Hash indexes offer O(1) point lookups but cannot perform range scans (WHERE age BETWEEN 20 AND 30) or ORDER BY. Covering Index Optimization: Index containing all query columns allows Index-Only Scans, eliminating table heap lookups.",
    scriptPoints: [
          "Indexing Rationale: Physical search trees that speed up row lookup from full table scans (O(N)) to logarithmic time (O(log N)).",
          "Clustered Index: Determines the physical on-disk sort order of rows; leaf nodes contain actual data tuples (max 1 per table).",
          "Non-Clustered (Secondary) Index: Separate B+ tree storing index keys and pointers (bookmarks/PKs) to main table rows.",
          "B+ Tree Advantages: High fan-out (100+) keeps height to 3-4 levels; leaf nodes form a sorted doubly-linked list for fast range scans.",
          "Hash Index Limitation: Hash indexes offer O(1) point lookups but cannot perform range scans (WHERE age BETWEEN 20 AND 30) or ORDER BY.",
          "Covering Index Optimization: Index containing all query columns allows Index-Only Scans, eliminating table heap lookups."
    ],
    keywords: [
          "Clustered vs Secondary Index",
          "B+ Tree High Fan-Out (100+)",
          "Leaf Node Doubly-Linked List",
          "Index-Only Covering Scan",
          "Leftmost Prefix Rule"
    ],
    trapQuestions: [
          {
                "id": "dbms-9-t1",
                "question": "If you have a composite index on (department_id, employee_id, hire_date), can it accelerate `WHERE hire_date > '2023-01-01'`?",
                "commonMistake": "Yes, because hire_date is part of the index.",
                "winningAnswer": "No! By the Leftmost Prefix Rule of B+ trees, the composite index is sorted hierarchically starting with department_id, then employee_id, then hire_date. Querying hire_date without providing department_id cannot leverage the B+ tree index range navigation and will result in a full table scan or full index scan.",
                "companyTags": [
                      "Amazon",
                      "Uber",
                      "Salesforce"
                ]
          }
    ]
  },
  'dbms-10': {
    tier: "L300",
    tierName: "FAANG Systems",
    frequency: "High-frequency in database internals, backend infrastructure, and storage systems",
    targetPrompt: "When asked: \"Explain Write-Ahead Logging (WAL) and the ARIES Crash Recovery Algorithm\"",
    script: "Durability & Crash Recovery: Guarantees committed transactions persist even if power fails midway through writes. Write-Ahead Logging (WAL): Log records must be flushed to disk (fsync) before dirty memory pages are written to data files. Steal / No-Force Policy: Modern DBs allow dirty pages to write early (Steal ⇒ Undo) and commit before data writes (No-Force ⇒ Redo). Fuzzy Checkpointing: Periodically records active transaction and dirty page snapshots without freezing database operations. ARIES 3-Phase Recovery: Analysis (finds dirty pages/losers), Redo (repeats history forward), Undo (rolls back losers with CLRs). Idempotent Recovery: Compensation Log Records (CLRs) ensure that if a crash occurs during recovery, the engine resumes cleanly without loop.",
    scriptPoints: [
          "Durability & Crash Recovery: Guarantees committed transactions persist even if power fails midway through writes.",
          "Write-Ahead Logging (WAL): Log records must be flushed to disk (fsync) before dirty memory pages are written to data files.",
          "Steal / No-Force Policy: Modern DBs allow dirty pages to write early (Steal ⇒ Undo) and commit before data writes (No-Force ⇒ Redo).",
          "Fuzzy Checkpointing: Periodically records active transaction and dirty page snapshots without freezing database operations.",
          "ARIES 3-Phase Recovery: Analysis (finds dirty pages/losers), Redo (repeats history forward), Undo (rolls back losers with CLRs).",
          "Idempotent Recovery: Compensation Log Records (CLRs) ensure that if a crash occurs during recovery, the engine resumes cleanly without loop."
    ],
    keywords: [
          "Write-Ahead Logging (WAL)",
          "Steal / No-Force Buffer Policy",
          "Log Sequence Number (LSN)",
          "ARIES (Analysis, Redo, Undo)",
          "Compensation Log Records (CLR)"
    ],
    trapQuestions: [
          {
                "id": "dbms-10-t1",
                "question": "Why does ARIES Redo phase replay actions of uncommitted \"loser\" transactions that are destined to be undone anyway?",
                "commonMistake": "It is a bug in the recovery algorithm that wastefully redoes dead transactions.",
                "winningAnswer": "To enforce the \"Repeating History\" paradigm! Replaying all logged operations up to the exact crash point reconstructs the precise page states in memory and preserves the physiological LSN invariants. This guarantees that concurrent multi-transaction page updates and partial writes are in an internally consistent state before the Undo phase cleanly rolls back loser transactions.",
                "companyTags": [
                      "Microsoft",
                      "Amazon",
                      "Snowflake"
                ]
          }
    ]
  },
  'cn-1': {
    tier: "L100",
    tierName: "Foundations (ELI5)",
    frequency: "Common fresher screening question in networking & cloud roles",
    targetPrompt: "When asked: \"Explain Network Delays (Transmission vs Propagation) and Packet Switching\"",
    script: "Network Architectures: Topologies include Star (isolated faults, standard for LANs), Mesh (redundancy), Bus, and Ring. Packet Switching vs Circuit: Packet switching uses Statistical Multiplexing to share links on-demand, supporting 3-5x more active users. 4 Nodal Delays: Transmission (L/R, pushing bits), Propagation (d/s, physical travel), Queuing (buffer wait), and Processing (routing). Bottleneck Dominance: For cross-continent links, propagation delay dominates; for slow links, transmission delay dominates. Bandwidth-Delay Product (BDP): Bandwidth × RTT; measures the volume of in-flight data the network pipe can hold. Toll Booth Analogy: Transmission is ticket-stamping time; Propagation is driving time down the highway.",
    scriptPoints: [
          "Network Architectures: Topologies include Star (isolated faults, standard for LANs), Mesh (redundancy), Bus, and Ring.",
          "Packet Switching vs Circuit: Packet switching uses Statistical Multiplexing to share links on-demand, supporting 3-5x more active users.",
          "4 Nodal Delays: Transmission (L/R, pushing bits), Propagation (d/s, physical travel), Queuing (buffer wait), and Processing (routing).",
          "Bottleneck Dominance: For cross-continent links, propagation delay dominates; for slow links, transmission delay dominates.",
          "Bandwidth-Delay Product (BDP): Bandwidth × RTT; measures the volume of in-flight data the network pipe can hold.",
          "Toll Booth Analogy: Transmission is ticket-stamping time; Propagation is driving time down the highway."
    ],
    keywords: [
          "Transmission Delay (L/R) vs Propagation Delay (d/s)",
          "Statistical Multiplexing",
          "Queuing Delay & Buffer Overflow",
          "Bandwidth-Delay Product (BDP)",
          "Star vs Mesh Topology"
    ],
    trapQuestions: [
          {
                "id": "cn-1-t1",
                "question": "If you upgrade a fiber optic connection from 10 Mbps to 10 Gbps, does the round-trip ping time (propagation latency) decrease by 1000x?",
                "commonMistake": "Yes, because the network is 1000 times faster.",
                "winningAnswer": "No! Bandwidth (10 Gbps) only decreases Transmission Delay (L/R - the time to push bits onto the glass). Propagation delay depends strictly on physical distance and the speed of light in fiber (~200,000 km/s). Pinging a server 10,000 km away will always take at least 50ms propagation time, regardless of whether your bandwidth is 10 Mbps or 100 Gbps.",
                "companyTags": [
                      "Cisco",
                      "Cloudflare",
                      "Juniper"
                ]
          }
    ]
  },
  'cn-2': {
    tier: "L100",
    tierName: "Foundations (ELI5)",
    frequency: "Asked in 90%+ of fresher CS placement interviews",
    targetPrompt: "When asked: \"Compare the OSI 7-Layer Model vs TCP/IP 4-Layer Suite and their Data Units\"",
    script: "Layered Architecture: Modularity allows protocols at any layer to evolve independently without rewriting the entire stack. OSI 7-Layer Hierarchy: Physical → Data Link → Network → Transport → Session → Presentation → Application. TCP/IP 4-Layer Suite: The practical Internet model: Network Access (Link) → Internet → Transport → Application. Protocol Data Units (PDUs): Bits at Physical → Frames at Layer 2 → Packets at Layer 3 → Segments at Layer 4 → Data. Encapsulation / Decapsulation: Senders wrap headers at each descending layer; receivers peel headers on ascending delivery. Practical Role: OSI provides a conceptual educational framework; TCP/IP represents real-world running Internet protocols.",
    scriptPoints: [
          "Layered Architecture: Modularity allows protocols at any layer to evolve independently without rewriting the entire stack.",
          "OSI 7-Layer Hierarchy: Physical → Data Link → Network → Transport → Session → Presentation → Application.",
          "TCP/IP 4-Layer Suite: The practical Internet model: Network Access (Link) → Internet → Transport → Application.",
          "Protocol Data Units (PDUs): Bits at Physical → Frames at Layer 2 → Packets at Layer 3 → Segments at Layer 4 → Data.",
          "Encapsulation / Decapsulation: Senders wrap headers at each descending layer; receivers peel headers on ascending delivery.",
          "Practical Role: OSI provides a conceptual educational framework; TCP/IP represents real-world running Internet protocols."
    ],
    keywords: [
          "OSI 7 Layers vs TCP/IP 4 Layers",
          "Protocol Data Units (Bits, Frames, Packets, Segments)",
          "Encapsulation & Decapsulation",
          "Layer 2 vs Layer 3 Addressing",
          "End-to-End Transport vs Hop-by-Hop Link"
    ],
    trapQuestions: [
          {
                "id": "cn-2-t1",
                "question": "At which OSI layer do switches and routers operate, and what addresses do they inspect?",
                "commonMistake": "Both operate at Layer 3 and inspect IP addresses.",
                "winningAnswer": "Standard Layer 2 Ethernet switches operate at the Data Link Layer, inspecting physical 48-bit MAC addresses to forward frames between local switch ports. Routers operate at Layer 3 (Network Layer), inspecting logical 32-bit/128-bit IP addresses to route packets across separate interconnected networks.",
                "companyTags": [
                      "Cisco",
                      "TCS Digital",
                      "Wipro"
                ]
          }
    ]
  },
  'cn-3': {
    tier: "L100",
    tierName: "Foundations (ELI5)",
    frequency: "Core networking interview question on Data Link layer protocols",
    targetPrompt: "When asked: \"Explain Framing, Bit Stuffing, and CRC Error Detection\"",
    script: "Data Link Layer (Layer 2): Responsible for node-to-node (hop-to-hop) frame delivery across a single physical link. Framing & Bit Stuffing: Bounded by flag 01111110; senders inject a 0 after five consecutive 1s so payload never mimics the flag. MAC Hardware Addressing: 48-bit physical address burned into the NIC; first 24 bits identify vendor (OUI), last 24 bits the device. Error Detection via CRC-32: Treats bitstream as a polynomial and divides modulo-2 by generator polynomial using bitwise XOR. CRC Superiority: Detects all single-bit, double-bit, odd-numbered, and burst errors up to 32 bits, far outperforming additive checksums. Minimum Ethernet Frame: 64 bytes (512 bits) required so sender detects collisions before transmission finishes.",
    scriptPoints: [
          "Data Link Layer (Layer 2): Responsible for node-to-node (hop-to-hop) frame delivery across a single physical link.",
          "Framing & Bit Stuffing: Bounded by flag 01111110; senders inject a 0 after five consecutive 1s so payload never mimics the flag.",
          "MAC Hardware Addressing: 48-bit physical address burned into the NIC; first 24 bits identify vendor (OUI), last 24 bits the device.",
          "Error Detection via CRC-32: Treats bitstream as a polynomial and divides modulo-2 by generator polynomial using bitwise XOR.",
          "CRC Superiority: Detects all single-bit, double-bit, odd-numbered, and burst errors up to 32 bits, far outperforming additive checksums.",
          "Minimum Ethernet Frame: 64 bytes (512 bits) required so sender detects collisions before transmission finishes."
    ],
    keywords: [
          "Framing & Bit Stuffing (01111110)",
          "CRC-32 Modulo-2 Division",
          "Frame Check Sequence (FCS)",
          "Minimum Frame Size (64 Bytes)",
          "MAC Address OUI Structure"
    ],
    trapQuestions: [
          {
                "id": "cn-3-t1",
                "question": "Why does CRC use modulo-2 binary arithmetic (XOR) instead of standard integer division?",
                "commonMistake": "Because modulo-2 arithmetic produces larger prime numbers.",
                "winningAnswer": "Hardware simplicity and speed! Modulo-2 addition and subtraction are identical to bitwise XOR with zero carries and zero borrows. This allows high-speed network interface cards (NICs) to calculate 32-bit CRC checksums in hardware at 100 Gbps wire speed using simple shift registers and XOR logic gates with zero CPU overhead.",
                "companyTags": [
                      "Qualcomm",
                      "Intel",
                      "Cisco"
                ]
          }
    ]
  },
  'cn-4': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "High-frequency question in campus tests and networking rounds",
    targetPrompt: "When asked: \"Explain CSMA/CD, Binary Exponential Backoff, and why Wi-Fi uses CSMA/CA\"",
    script: "Medium Access Control (MAC): Coordinates shared broadcast media access to resolve simultaneous transmission collisions. Pure vs Slotted ALOHA: Pure ALOHA transmits anytime (18.4% max efficiency); Slotted ALOHA uses time slots (36.8% efficiency). CSMA/CD ('Listen Before Talk'): Ethernet stations detect collisions, halt immediately, broadcast a 32-bit Jamming Signal, and back off. Binary Exponential Backoff: Stations choose random wait multiplier r ∈ [0, 2^k - 1], doubling collision wait windows up to 10 attempts. Wi-Fi CSMA/CA & RTS/CTS: Wireless cannot detect collisions while transmitting; Wi-Fi uses collision avoidance and RTS/CTS to solve Hidden Terminals. Switched Ethernet: Modern full-duplex switches dedicate separate wire pairs for TX and RX, making collisions physically impossible.",
    scriptPoints: [
          "Medium Access Control (MAC): Coordinates shared broadcast media access to resolve simultaneous transmission collisions.",
          "Pure vs Slotted ALOHA: Pure ALOHA transmits anytime (18.4% max efficiency); Slotted ALOHA uses time slots (36.8% efficiency).",
          "CSMA/CD ('Listen Before Talk'): Ethernet stations detect collisions, halt immediately, broadcast a 32-bit Jamming Signal, and back off.",
          "Binary Exponential Backoff: Stations choose random wait multiplier r ∈ [0, 2^k - 1], doubling collision wait windows up to 10 attempts.",
          "Wi-Fi CSMA/CA & RTS/CTS: Wireless cannot detect collisions while transmitting; Wi-Fi uses collision avoidance and RTS/CTS to solve Hidden Terminals.",
          "Switched Ethernet: Modern full-duplex switches dedicate separate wire pairs for TX and RX, making collisions physically impossible."
    ],
    keywords: [
          "CSMA/CD Collision Detection",
          "Binary Exponential Backoff (2^k - 1)",
          "Jamming Signal",
          "Wi-Fi CSMA/CA & RTS/CTS Handshake",
          "Hidden Terminal Problem"
    ],
    trapQuestions: [
          {
                "id": "cn-4-t1",
                "question": "Why don't modern office and home wired Ethernet networks experience collisions anymore?",
                "commonMistake": "Because modern computers have faster CPUs that predict collisions.",
                "winningAnswer": "Modern Ethernet uses full-duplex twisted-pair or fiber-optic links connected to dedicated switches, completely replacing legacy shared coaxial buses and hubs. In full-duplex switched Ethernet, transmitting (TX) and receiving (RX) occur on independent physical electrical channels, and each device has a private collision domain, making collisions physically impossible.",
                "companyTags": [
                      "Cisco",
                      "Broadcom",
                      "Juniper"
                ]
          }
    ]
  },
  'cn-5': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Tested in 90%+ of networking & infrastructure screening rounds",
    targetPrompt: "When asked: \"Explain IPv4 Subnetting, CIDR notation, and Private IP Ranges\"",
    script: "Network Layer (Layer 3): Responsible for host-to-host logical routing across diverse interconnected networks globally. IPv4 Header Essentials: 20-byte minimum; includes TTL (decremented per hop to stop loops), Protocol (6=TCP, 17=UDP), and IPs. CIDR Subnetting Math: Subnet prefix /N specifies network bits; 32 - N gives host bits (2^H - 2 usable assignable addresses). IPv4 vs IPv6: IPv4 has 32-bit addresses (~4.3B); IPv6 provides 128-bit addresses, fixed 40-byte headers, and eliminates broadcast. Private IPs & NAT (RFC 1918): Private subnets (10.x, 172.16.x, 192.168.x) multiplex over one public IP using Network Address Port Translation (NAPT). Calculation Example: /26 leaves 6 host bits ⇒ 64 block size, 62 usable hosts, mask 255.255.255.192.",
    scriptPoints: [
          "Network Layer (Layer 3): Responsible for host-to-host logical routing across diverse interconnected networks globally.",
          "IPv4 Header Essentials: 20-byte minimum; includes TTL (decremented per hop to stop loops), Protocol (6=TCP, 17=UDP), and IPs.",
          "CIDR Subnetting Math: Subnet prefix /N specifies network bits; 32 - N gives host bits (2^H - 2 usable assignable addresses).",
          "IPv4 vs IPv6: IPv4 has 32-bit addresses (~4.3B); IPv6 provides 128-bit addresses, fixed 40-byte headers, and eliminates broadcast.",
          "Private IPs & NAT (RFC 1918): Private subnets (10.x, 172.16.x, 192.168.x) multiplex over one public IP using Network Address Port Translation (NAPT).",
          "Calculation Example: /26 leaves 6 host bits ⇒ 64 block size, 62 usable hosts, mask 255.255.255.192."
    ],
    keywords: [
          "CIDR Subnetting (/26, /27)",
          "2^H - 2 Usable Hosts",
          "Time to Live (TTL) & traceroute",
          "RFC 1918 Private Ranges",
          "Network Address Port Translation (NAT/NAPT)"
    ],
    trapQuestions: [
          {
                "id": "cn-5-t1",
                "question": "For an IP block `192.168.1.0/27`, why are there 30 usable hosts instead of 32?",
                "commonMistake": "Two IPs are reserved for the router gateway.",
                "winningAnswer": "By RFC standard, the very first address where all host bits are 0 (`192.168.1.0`) is strictly reserved as the Network ID. The very last address where all host bits are 1 (`192.168.1.31`) is strictly reserved as the Directed Broadcast Address. Hence, usable host addresses are always $2^H - 2 = 32 - 2 = 30$.",
                "companyTags": [
                      "Amazon",
                      "Cisco",
                      "Cognizant"
                ]
          }
    ]
  },
  'cn-6': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Standard systems & networks interview topic",
    targetPrompt: "When asked: \"Compare Distance-Vector vs Link-State Routing and explain BGP\"",
    script: "Routing Architecture: Graph algorithms build Forwarding Tables (FIB) to select the optimal path from source to destination. Distance-Vector (RIP): Bellman-Ford algorithm; routers exchange full tables with immediate neighbors; vulnerable to Count-to-Infinity. Link-State (OSPF): Dijkstra algorithm; routers flood LSAs so all nodes build an identical network topology graph, converging instantly. OSPF Hierarchical Areas: Divides networks into localized areas connected via Area 0 (Backbone Area) to scale Dijkstra computations. BGP-4 (Exterior Routing): Sole inter-AS Internet protocol; Path-Vector protocol advertising AS-Paths to enforce policy and prevent loops. RIB vs FIB: RIB is software control-plane routing table; FIB is hardware data-plane memory (TCAM) forwarding packets at wire speed.",
    scriptPoints: [
          "Routing Architecture: Graph algorithms build Forwarding Tables (FIB) to select the optimal path from source to destination.",
          "Distance-Vector (RIP): Bellman-Ford algorithm; routers exchange full tables with immediate neighbors; vulnerable to Count-to-Infinity.",
          "Link-State (OSPF): Dijkstra algorithm; routers flood LSAs so all nodes build an identical network topology graph, converging instantly.",
          "OSPF Hierarchical Areas: Divides networks into localized areas connected via Area 0 (Backbone Area) to scale Dijkstra computations.",
          "BGP-4 (Exterior Routing): Sole inter-AS Internet protocol; Path-Vector protocol advertising AS-Paths to enforce policy and prevent loops.",
          "RIB vs FIB: RIB is software control-plane routing table; FIB is hardware data-plane memory (TCAM) forwarding packets at wire speed."
    ],
    keywords: [
          "Distance-Vector (Bellman-Ford) vs Link-State (Dijkstra)",
          "Count-to-Infinity & Split Horizon",
          "OSPF Area 0 Backbone",
          "BGP Path-Vector (AS-Path)",
          "Routing Table (RIB) vs Forwarding Table (FIB)"
    ],
    trapQuestions: [
          {
                "id": "cn-6-t1",
                "question": "How does BGP prevent routing loops across the global Internet?",
                "commonMistake": "BGP uses Dijkstra's algorithm to verify shortest paths without loops.",
                "winningAnswer": "BGP is a Path-Vector protocol that includes the entire list of Autonomous System numbers (the AS-Path attribute) in every route advertisement. If an AS router receives an advertisement and sees its own AS number in the AS-Path, it immediately rejects the route, making inter-domain routing loops mathematically impossible.",
                "companyTags": [
                      "Cloudflare",
                      "Google",
                      "Cisco"
                ]
          }
    ]
  },
  'cn-7': {
    tier: "L100",
    tierName: "Foundations (ELI5)",
    frequency: "Frequently asked in backend and streaming engineering interviews",
    targetPrompt: "When asked: \"Explain UDP, its Header structure, and when to choose it over TCP\"",
    script: "UDP Protocol (RFC 768): Lightweight, connectionless, unreliable transport protocol with minimal latency overhead. 8-Byte Fixed Header: Composed of 4 16-bit fields: Source Port, Destination Port, Total Length, and Checksum. Zero Handshake Latency: Sends datagrams instantly without connection setup or teardown round-trips. Zero Head-of-Line Blocking: Packets are independent; dropping packet 1 never delays delivery of packet 2. Ideal Use Cases: Real-time gaming, VoIP, DNS queries, live video streaming, and modern transport protocols like QUIC. Checksum Verification: Uses a 16-bit 1's complement checksum over a pseudo-header containing IP addresses.",
    scriptPoints: [
          "UDP Protocol (RFC 768): Lightweight, connectionless, unreliable transport protocol with minimal latency overhead.",
          "8-Byte Fixed Header: Composed of 4 16-bit fields: Source Port, Destination Port, Total Length, and Checksum.",
          "Zero Handshake Latency: Sends datagrams instantly without connection setup or teardown round-trips.",
          "Zero Head-of-Line Blocking: Packets are independent; dropping packet 1 never delays delivery of packet 2.",
          "Ideal Use Cases: Real-time gaming, VoIP, DNS queries, live video streaming, and modern transport protocols like QUIC.",
          "Checksum Verification: Uses a 16-bit 1's complement checksum over a pseudo-header containing IP addresses."
    ],
    keywords: [
          "8-Byte Header Structure",
          "Connectionless & Datagram-Oriented",
          "Zero Handshake Overhead",
          "Zero Head-of-Line Blocking",
          "UDP Pseudo-Header Checksum"
    ],
    trapQuestions: [
          {
                "id": "cn-7-t1",
                "question": "Is the UDP Checksum mandatory in IPv4? What about IPv6?",
                "commonMistake": "It is always mandatory in both protocols.",
                "winningAnswer": "In IPv4, the UDP checksum is optional (can be set to 0 to disable error checking for maximum speed). In IPv6, however, the IPv6 base header eliminated the IP-level checksum to accelerate router forwarding, making the UDP checksum strictly MANDATORY to prevent undetected packet corruption.",
                "companyTags": [
                      "Riot Games",
                      "Twitch",
                      "Cloudflare"
                ]
          }
    ]
  },
  'cn-8': {
    tier: "L200",
    tierName: "Placement Core",
    frequency: "Asked in 95%+ of software engineering interviews across FAANG & FinTech",
    targetPrompt: "When asked: \"Explain the TCP 3-Way Handshake, 4-Way Teardown, and TIME_WAIT state\"",
    script: "TCP Foundation (RFC 793): Connection-oriented, full-duplex, reliable byte-stream transport protocol. 3-Way Handshake: Synchronizes sequence numbers: Client SYN(X) → Server SYN(Y)+ACK(X+1) → Client ACK(Y+1). 4-Way Connection Teardown: Each direction closes independently: FIN(U) → ACK(U+1) → FIN(V) → ACK(V+1). TIME_WAIT State (2MSL): Client waits 60–120s to ensure final ACK was received and prevent old duplicate packets from corrupting new sessions. Flow Control vs Congestion: Flow control uses Receive Window (rwnd) to protect receiver buffer; Nagle's algorithm prevents tiny packets. SYN Flood Mitigation: SYN Cookies encode connection state cryptographically in sequence numbers without allocating memory.",
    scriptPoints: [
          "TCP Foundation (RFC 793): Connection-oriented, full-duplex, reliable byte-stream transport protocol.",
          "3-Way Handshake: Synchronizes sequence numbers: Client SYN(X) → Server SYN(Y)+ACK(X+1) → Client ACK(Y+1).",
          "4-Way Connection Teardown: Each direction closes independently: FIN(U) → ACK(U+1) → FIN(V) → ACK(V+1).",
          "TIME_WAIT State (2MSL): Client waits 60–120s to ensure final ACK was received and prevent old duplicate packets from corrupting new sessions.",
          "Flow Control vs Congestion: Flow control uses Receive Window (rwnd) to protect receiver buffer; Nagle's algorithm prevents tiny packets.",
          "SYN Flood Mitigation: SYN Cookies encode connection state cryptographically in sequence numbers without allocating memory."
    ],
    keywords: [
          "SYN, SYN-ACK, ACK Handshake",
          "4-Way FIN Teardown",
          "TIME_WAIT & 2MSL Semantics",
          "Silly Window Syndrome (Nagle & Clark)",
          "SYN Flood Attack & SYN Cookies"
    ],
    trapQuestions: [
          {
                "id": "cn-8-t1",
                "question": "Why doesn't TCP simply use a 2-way handshake to establish a connection?",
                "commonMistake": "Because the server needs to send its password to the client.",
                "winningAnswer": "A 2-way handshake cannot safely handle delayed or duplicated SYN packets! If an old delayed SYN arrives at the server from an abandoned connection, a 2-way handshake would force the server into ESTABLISHED state, allocating memory and waiting for data that will never arrive. The 3-way handshake ensures the client explicitly acknowledges the server's ISN before any resources are committed.",
                "companyTags": [
                      "Amazon",
                      "Microsoft",
                      "Goldman Sachs"
                ]
          }
    ]
  },
  'cn-9': {
    tier: "L300",
    tierName: "FAANG Systems",
    frequency: "High-frequency in systems, cloud, and infrastructure interviews",
    targetPrompt: "When asked: \"Explain TCP Congestion Control (AIMD, Reno, Tahoe) and Bufferbloat\"",
    script: "Congestion Control Principle: Senders infer network capacity by dynamically modulating the Congestion Window (cwnd). Slow Start Phase: Starts at 1-10 MSS and doubles cwnd every RTT (exponential growth) until reaching ssthresh. Congestion Avoidance (AIMD): Increases cwnd linearly by 1 MSS per RTT (Additive Increase) to safely probe maximum bandwidth. Fast Retransmit & Recovery (Reno): 3 duplicate ACKs trigger instant retransmit; halves ssthresh and resumes linear increase without dropping to 1 MSS. Bufferbloat & Modern BBR: Massive router buffers cause severe latency spikes without drops; Google BBR paces traffic by measuring bottleneck bandwidth. AIMD Fairness Proof: Linear increase (+1) and multiplicative halving (-50%) mathematically converges to the 45° line of fairness.",
    scriptPoints: [
          "Congestion Control Principle: Senders infer network capacity by dynamically modulating the Congestion Window (cwnd).",
          "Slow Start Phase: Starts at 1-10 MSS and doubles cwnd every RTT (exponential growth) until reaching ssthresh.",
          "Congestion Avoidance (AIMD): Increases cwnd linearly by 1 MSS per RTT (Additive Increase) to safely probe maximum bandwidth.",
          "Fast Retransmit & Recovery (Reno): 3 duplicate ACKs trigger instant retransmit; halves ssthresh and resumes linear increase without dropping to 1 MSS.",
          "Bufferbloat & Modern BBR: Massive router buffers cause severe latency spikes without drops; Google BBR paces traffic by measuring bottleneck bandwidth.",
          "AIMD Fairness Proof: Linear increase (+1) and multiplicative halving (-50%) mathematically converges to the 45° line of fairness."
    ],
    keywords: [
          "Slow Start & Exponential Doubling",
          "Additive Increase Multiplicative Decrease (AIMD)",
          "Fast Retransmit (3 Dup ACKs)",
          "TCP Reno vs Tahoe",
          "Bufferbloat & Google BBR"
    ],
    trapQuestions: [
          {
                "id": "cn-9-t1",
                "question": "Why does TCP Reno treat 3 Duplicate ACKs differently from an RTO (Retransmission Timeout)?",
                "commonMistake": "Because timeouts happen in hardware, while duplicate ACKs happen in software.",
                "winningAnswer": "3 Duplicate ACKs indicate mild loss with network continuity: segments are still successfully arriving at the receiver to trigger ACKs (the \"packet clock\" is ticking), so Reno enters Fast Recovery (halving cwnd). A Timeout indicates catastrophic loss: nothing is getting through, so Reno collapses cwnd to 1 MSS and restarts in Slow Start.",
                "companyTags": [
                      "Google",
                      "Meta",
                      "Netflix"
                ]
          }
    ]
  },
  'cn-10': {
    tier: "L300",
    tierName: "FAANG Systems",
    frequency: "Asked in 90%+ of web platform, cloud architecture, and frontend/fullstack interviews",
    targetPrompt: "When asked: \"Compare HTTP/1.1, HTTP/2, and HTTP/3 and explain TLS 1.3 Forward Secrecy\"",
    script: "Application Layer (Layer 7): High-level communication protocols interacting directly with end-user software applications. DNS Resolution Flow: Hierarchical resolution traversing Recursive Resolver → Root (.) → TLD (.com) → Authoritative nameserver. HTTP/1.1 vs HTTP/2: HTTP/1.1 is plain text with HoL blocking; HTTP/2 uses binary framing and multiplexes multiple streams over 1 TCP connection. HTTP/3 & QUIC over UDP: Replaces TCP with QUIC, completely eliminating transport head-of-line blocking and enabling 0-RTT handshakes. TLS 1.3 & Forward Secrecy: Reduces handshake to 1-RTT and mandates Ephemeral Diffie-Hellman (ECDHE) so compromised private keys cannot decrypt past sessions. Connection Migration: HTTP/3 uses a 64-bit Connection ID, allowing sessions to survive network changes (Wi-Fi to 5G) without reconnecting.",
    scriptPoints: [
          "Application Layer (Layer 7): High-level communication protocols interacting directly with end-user software applications.",
          "DNS Resolution Flow: Hierarchical resolution traversing Recursive Resolver → Root (.) → TLD (.com) → Authoritative nameserver.",
          "HTTP/1.1 vs HTTP/2: HTTP/1.1 is plain text with HoL blocking; HTTP/2 uses binary framing and multiplexes multiple streams over 1 TCP connection.",
          "HTTP/3 & QUIC over UDP: Replaces TCP with QUIC, completely eliminating transport head-of-line blocking and enabling 0-RTT handshakes.",
          "TLS 1.3 & Forward Secrecy: Reduces handshake to 1-RTT and mandates Ephemeral Diffie-Hellman (ECDHE) so compromised private keys cannot decrypt past sessions.",
          "Connection Migration: HTTP/3 uses a 64-bit Connection ID, allowing sessions to survive network changes (Wi-Fi to 5G) without reconnecting."
    ],
    keywords: [
          "HTTP/2 Binary Framing & Multiplexing",
          "HTTP/3 QUIC over UDP",
          "Head-of-Line (HoL) Blocking Elimination",
          "TLS 1.3 1-RTT Handshake",
          "Perfect Forward Secrecy (ECDHE)"
    ],
    trapQuestions: [
          {
                "id": "cn-10-t1",
                "question": "Why does HTTP/2 still suffer from Head-of-Line (HoL) blocking even though it multiplexes multiple streams?",
                "commonMistake": "Because web browsers only allocate 6 concurrent threads for rendering.",
                "winningAnswer": "Because HTTP/2 still runs on top of a single TCP connection! TCP enforces strict in-order byte delivery. If a single packet belonging to Stream A drops on a lossy Wi-Fi network, the TCP receiver stack stalls ALL subsequent streams (Stream B, Stream C) until the missing packet is retransmitted. HTTP/3 resolves this by running QUIC over UDP, making streams truly independent at the transport layer.",
                "companyTags": [
                      "Cloudflare",
                      "Google",
                      "Meta"
                ]
          }
    ]
  },
};

export function getTopicInterviewData(topicId) {
  return topicInterviewData[topicId] || null;
}
