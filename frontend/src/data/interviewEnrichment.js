// Interview-Grade Calibration & Elevator Pitch Enrichment — CommitDrive
// Contains 60-Second Spoken Pitch Scripts, Keyword Rubrics, and Interviewer Trap Questions
// for all 30 foundational CS topics across OS, DBMS, and Computer Networks.

export const topicInterviewData = {
  // =========================================================================
  // OPERATING SYSTEMS (os-1 to os-10)
  // =========================================================================
  'os-1': {
    tier: 'L100',
    tierName: 'Foundations (ELI5)',
    frequency: 'Asked in 80%+ of campus & SDE-1 screening rounds',
    targetPrompt: 'When asked: "Explain Dual-Mode Operations and how System Calls work"',
    script: 'Modern CPUs enforce hardware dual-mode operations—User Mode and Kernel Mode—controlled by a hardware mode bit. User applications execute in User Mode without direct hardware or privileged instruction access. When an application needs OS services like disk I/O or memory allocation, it invokes a System Call. This generates a CPU trap or software interrupt, safely flipping the mode bit from 1 to 0 (Kernel Mode) and jumping into a predefined kernel dispatch handler. Once the kernel driver completes the request, it flips the mode bit back to 1 and resumes the user program. This boundary guarantees that a buggy user process cannot corrupt the OS or crash the entire machine.',
    keywords: ['User Mode vs Kernel Mode', 'Hardware Mode Bit', 'CPU Software Trap', 'Privileged Instructions', 'Kernel Dispatch Table', 'Fault Isolation'],
    trapQuestions: [
      {
        id: 'os-1-t1',
        question: 'Does every C library function (like strlen() or printf()) trigger a system call into the kernel?',
        commonMistake: 'Yes, because all standard library functions are provided by the operating system.',
        winningAnswer: 'No. Computational functions like strlen() run purely in User Mode within the process address space without invoking kernel traps. Functions like printf() do their initial string formatting in user space libc buffers, and only issue the sys_write system call when the buffer flushes. Pure computational functions incur zero context-switch overhead.',
        companyTags: ['Amazon', 'Qualcomm', 'Cisco']
      },
      {
        id: 'os-1-t2',
        question: 'Why can\'t the OS simply use a standard CALL instruction instead of a software trap (SYSCALL) to switch modes?',
        commonMistake: 'Because functions in the kernel are written in assembly and use different calling conventions.',
        winningAnswer: 'Security and privilege elevation. A normal CALL instruction jumps to an address while keeping the CPU in the current privilege mode (User Mode). A user program running in User Mode cannot execute privileged CPU instructions. Only a hardware-trapping instruction (like SYSCALL/SYSENTER) can atomically switch the CPU mode bit from 1 to 0 and vector through the Kernel Interrupt Descriptor Table (IDT), preventing rogue user code from jumping into arbitrary kernel memory addresses.',
        companyTags: ['Google', 'Microsoft']
      }
    ]
  },
  'os-2': {
    tier: 'L100',
    tierName: 'Foundations (ELI5)',
    frequency: 'Asked in 90%+ of technical rounds (TCS, Zoho, Cognizant, Amazon)',
    targetPrompt: 'When asked: "What is a Process and what is inside the PCB?"',
    script: 'A program is passive code stored on disk, whereas a process is an active instance of a program in execution with its own dedicated virtual address space. That address space is split into four distinct segments: the compiled code segment, the data segment for global/static variables, the dynamic heap growing upwards for runtime allocations, and the stack growing downwards for function call frames and local variables. The operating system kernel tracks every process using a Process Control Block (PCB). The PCB maintains the Process ID (PID), process state (Ready, Running, Blocked), CPU register snapshots including the Program Counter, memory page table pointers, open file descriptors, and CPU scheduling priority.',
    keywords: ['Code, Data, Heap, Stack', 'Process Control Block (PCB)', 'Program Counter', 'Virtual Address Space', '5-State Lifecycle (New, Ready, Running, Waiting, Terminated)'],
    trapQuestions: [
      {
        id: 'os-2-t1',
        question: 'What is the exact difference between a Zombie process and an Orphan process?',
        commonMistake: 'They are the same thing—a process that has lost its parent.',
        winningAnswer: 'An Orphan process is a running child whose parent terminated early; the Linux kernel re-parents it to init (PID 1 or systemd) to cleanly adopt it. A Zombie process has already finished executing (dead), but its PCB entry remains in the kernel process table because its parent hasn\'t yet called wait() or waitpid() to read its exit status code. Zombies consume zero CPU or RAM, but exhaust available kernel PIDs.',
        companyTags: ['Amazon', 'Zoho', 'Directi']
      }
    ]
  },
  'os-3': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Asked in 95%+ of SDE-1 interviews (Amazon, Microsoft, Cisco, Adobe)',
    targetPrompt: 'When asked: "Explain the difference between a Process and a Thread"',
    script: 'A process is an independent execution unit with its own private virtual address space, memory mappings, and OS resources, isolated by the MMU hardware. A thread is a lightweight dispatchable execution stream within that process that shares the same virtual address space, heap, and open file descriptors with sibling threads, but maintains its own private Program Counter, register set, and call stack. Because threads share memory, context-switching between threads of the same process does not flush the Translation Lookaside Buffer (TLB) or change the CPU page directory base register (CR3), making thread switches ~1-2 microseconds compared to ~10-20 microseconds for processes. The trade-off is stability: memory corruption in one thread can crash the entire process.',
    keywords: ['Shared Heap vs Private Stack', 'TLB Flush Overhead', 'CR3 Register', 'Fault Isolation Boundary', 'Context Switch Latency'],
    trapQuestions: [
      {
        id: 'os-3-t1',
        question: 'Can two threads inside the same process have separate heaps?',
        commonMistake: 'Yes, if each thread initializes its own memory heap.',
        winningAnswer: 'No. By OS architecture, the heap belongs to the process address space and is shared by all threads. Threads only have their own private stacks and Thread Local Storage (TLS). If threads seem to allocate independently, it is only a high-level user-space memory allocator (like jemalloc or TCMalloc) using thread-specific memory pools on top of the shared process heap.',
        companyTags: ['Amazon', 'Microsoft', 'Bloomberg']
      },
      {
        id: 'os-3-t2',
        question: 'Why is a process context switch slower than a thread context switch? Is it just saving CPU registers?',
        commonMistake: 'Yes, saving process registers to the PCB takes more instructions.',
        winningAnswer: 'No. Saving registers takes less than a microsecond. The real hidden cost is the cache invalidation penalty: switching process address spaces invalidates the Translation Lookaside Buffer (TLB) and leaves the CPU L1/L2 data caches cold. The new process immediately experiences a storm of hardware cache misses until its working memory is pulled back from RAM into CPU caches.',
        companyTags: ['Google', 'Meta', 'Oracle']
      }
    ]
  },
  'os-4': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'High in campus recruitment (TCS Digital, Cognizant, Wipro, Infosys DSE)',
    targetPrompt: 'When asked: "Compare CPU Scheduling Algorithms and explain the Convoy Effect"',
    script: 'CPU scheduling arbitrates which ready process gets CPU time. FCFS is non-preemptive and suffers from the Convoy Effect, where short CPU-burst processes are blocked behind one massive CPU-bound job, blowing up average waiting time. Shortest Job First (SJF) is mathematically optimal for minimizing average waiting time, but cannot be implemented perfectly in practice because the next CPU burst length cannot be known in advance. Round Robin (RR) solves starvation and interactive latency by assigning a fixed time quantum. If the quantum is too large, RR degrades into FCFS; if too small, CPU throughput collapses due to context-switch overhead.',
    keywords: ['Convoy Effect', 'Shortest Job First (SJF)', 'Round Robin (RR)', 'Time Quantum Calibration', 'Preemption vs Non-preemption'],
    trapQuestions: [
      {
        id: 'os-4-t1',
        question: 'Can Round Robin scheduling ever have a higher average turnaround time than FCFS?',
        commonMistake: 'No, Round Robin is always fairer and faster than FCFS.',
        winningAnswer: 'Yes! If all processes have nearly identical CPU burst lengths (e.g. 5 processes each needing 10ms with a 1ms time quantum), all 5 processes will finish almost simultaneously at the very end (~50ms), resulting in a terrible average turnaround time compared to FCFS where each finishes sequentially at 10ms, 20ms, 30ms, etc.',
        companyTags: ['Morgan Stanley', 'Infosys']
      }
    ]
  },
  'os-5': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Asked in 90%+ of backend & systems rounds',
    targetPrompt: 'When asked: "Explain Critical Sections, Mutex vs Semaphore, and Priority Inversion"',
    script: 'A critical section is a block of code accessing shared resources (like shared memory or global variables) that must not be concurrently accessed by multiple threads. A Mutex is a binary mutual exclusion lock with ownership: only the thread that locked the mutex can unlock it. A Semaphore is a generalized signaling counter without ownership: any thread can increment (signal/V) or decrement (wait/P) the counter, making it ideal for producer-consumer synchronization and rate limiting. A classic hazard is Priority Inversion, where a high-priority thread is blocked waiting for a mutex held by a low-priority thread, which itself gets preempted by a medium-priority thread. Operating systems resolve this using Priority Inheritance.',
    keywords: ['Critical Section', 'Mutex Ownership', 'Counting Semaphore', 'Priority Inversion', 'Priority Inheritance Protocol'],
    trapQuestions: [
      {
        id: 'os-5-t1',
        question: 'Can a thread unlock a Mutex that was locked by another thread? What about a Binary Semaphore?',
        commonMistake: 'Yes, both can be unlocked by any thread since they both enforce mutual exclusion.',
        winningAnswer: 'A Mutex enforces strict ownership semantics: if Thread A locks a mutex, Thread B attempting to unlock it triggers an illegal operation error or undefined behavior. A Binary Semaphore, however, has no concept of ownership—Thread B can safely signal (post) a semaphore initialized by Thread A. Semaphores are signaling primitives, while Mutexes are locking primitives.',
        companyTags: ['Uber', 'Adobe', 'Samsung']
      }
    ]
  },
  'os-6': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Standard placement question across all company tiers',
    targetPrompt: 'When asked: "What are the 4 conditions for Deadlock and how do we prevent them?"',
    script: 'A deadlock occurs when a set of processes are permanently blocked because each is holding a resource and waiting for another held by another process. For a deadlock to occur, all four Coffman conditions must hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Deadlock Prevention eliminates deadlock by breaking at least one of these conditions by design. The most practical technique in production software is preventing Circular Wait by imposing a strict global total ordering on all resource acquisitions (always acquire Resource 1 before Resource 2). Banker\'s Algorithm is a deadlock avoidance strategy that tests for a "Safe State" using a matrix of Max, Allocation, and Available resources before granting requests.',
    keywords: ['4 Coffman Conditions', 'Circular Wait Elimination', 'Resource Total Ordering', 'Banker\'s Safe State Algorithm', 'Deadlock Detection vs Prevention'],
    trapQuestions: [
      {
        id: 'os-6-t1',
        question: 'Does an "Unsafe State" in Banker\'s Algorithm guarantee that a deadlock will happen?',
        commonMistake: 'Yes, an unsafe state is a deadlocked state.',
        winningAnswer: 'No! An unsafe state is NOT deadlocked; it simply means the operating system can no longer guarantee that all processes will finish if every process simultaneously requests its maximum declared resources. A deadlock might never occur if processes finish without requesting their maximum limits.',
        companyTags: ['Amazon', 'Cisco', 'TCS Digital']
      }
    ]
  },
  'os-7': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Crucial for hardware, systems & SDE-1 interviews',
    targetPrompt: 'When asked: "Explain Paging, Page Tables, and the role of the TLB"',
    script: 'Paging is a memory management scheme that eliminates external fragmentation by dividing a process\'s virtual address space into fixed-size chunks called Pages (typically 4KB), and physical RAM into matching frames. The CPU generates a virtual address split into a Page Number (p) and Page Offset (d). The Memory Management Unit (MMU) uses the Page Table to translate the Page Number into a Physical Frame Number. Because traversing multi-level page tables in RAM takes multiple memory lookups, CPUs include a hardware cache called the Translation Lookaside Buffer (TLB). A TLB hit translates addresses in under 1 nanosecond; a TLB miss forces a hardware page table walk in RAM.',
    keywords: ['Paging vs Segmentation', 'Translation Lookaside Buffer (TLB)', 'Memory Management Unit (MMU)', 'Multi-level Page Tables', 'Internal Fragmentation'],
    trapQuestions: [
      {
        id: 'os-7-t1',
        question: 'Why do modern 64-bit systems use 4-level or 5-level page tables instead of a single flat page table?',
        commonMistake: 'Because multi-level tables make address translation faster.',
        winningAnswer: 'Single flat page tables would require astronomical amounts of RAM. A 64-bit address space with 4KB pages would require a page table of 2^52 entries—petabytes of RAM per process just to store the translation table! Multi-level page tables allow sparse allocation: unallocated address space consumes zero memory for intermediate page tables.',
        companyTags: ['Intel', 'Apple', 'NVIDIA']
      }
    ]
  },
  'os-8': {
    tier: 'L300',
    tierName: 'FAANG & Systems',
    frequency: 'Asked in high-tier product engineering rounds (Google, Amazon, Microsoft)',
    targetPrompt: 'When asked: "Explain Virtual Memory, Thrashing, and Belady\'s Anomaly"',
    script: 'Virtual Memory decouples user logical memory from physical RAM, allowing processes to execute even when only a subset of their pages reside in memory (Demand Paging). When a program accesses a virtual page whose valid-invalid bit is marked 0 in the page table, the CPU triggers a Page Fault trap. The OS kernel retrieves the page from swap space on disk into an available RAM frame and restarts the instruction. If active working sets exceed physical RAM, Thrashing occurs: the CPU spends virtually 100% of its time swapping pages to and from disk rather than executing instructions. Belady\'s Anomaly is a phenomenon in FIFO page replacement where increasing page frames counter-intuitively increases page faults.',
    keywords: ['Demand Paging', 'Page Fault Trap', 'Thrashing', 'Working Set Model', 'Belady\'s Anomaly (FIFO)'],
    trapQuestions: [
      {
        id: 'os-8-t1',
        question: 'Why does Belady\'s Anomaly occur in FIFO, but can NEVER occur in LRU or Optimal replacement?',
        commonMistake: 'Because LRU takes more CPU time to compute recency.',
        winningAnswer: 'Because LRU and Optimal belong to a class of algorithms called "Stack Algorithms". In a stack algorithm, the set of pages resident in an n-frame memory is always a strict subset of the pages resident in an (n+1)-frame memory. FIFO lacks this subset inclusion property, allowing an extra frame to evict a page that is needed immediately afterwards.',
        companyTags: ['Google', 'Microsoft', 'Goldman Sachs']
      }
    ]
  },
  'os-9': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Asked in Linux & backend engineering interviews',
    targetPrompt: 'When asked: "What is an Inode and how do Hard Links vs Soft Links work?"',
    script: 'In Unix-like file systems, an Inode (Index Node) is a kernel data structure that stores all metadata about a file—its file type, byte size, owner permissions, access/modification timestamps, and pointers to the physical disk data blocks—everything EXCEPT the file\'s actual name and data contents. Directory files simply map human-readable filenames to inode numbers. A Hard Link creates a new directory entry pointing directly to the existing file\'s inode number, incrementing its link counter; deleting the original filename does not delete the data blocks until all hard links reach 0. A Soft Link (Symlink) is an independent file whose data content is literally the path string to the target file.',
    keywords: ['Inode Metadata', 'Hard Links (Same Inode)', 'Soft Links (Path Pointer)', 'Link Counter', 'Direct & Indirect Block Pointers'],
    trapQuestions: [
      {
        id: 'os-9-t1',
        question: 'Can you create a Hard Link across two different hard drive partitions or file systems?',
        commonMistake: 'Yes, as long as you have root privileges.',
        winningAnswer: 'No. Inode numbers are unique only within a single physical file system or partition. Inode #42 on partition A has no relationship to Inode #42 on partition B. Cross-device links are strictly blocked by the kernel (returning EXDEV). Soft links (symlinks) must be used across different file systems because they store text path strings.',
        companyTags: ['Red Hat', 'Canonical', 'Amazon']
      }
    ]
  },
  'os-10': {
    tier: 'L300',
    tierName: 'FAANG & Systems',
    frequency: 'Core question in distributed systems & high-throughput backend roles',
    targetPrompt: 'When asked: "Compare Inter-Process Communication (IPC) mechanisms: Pipes vs Sockets vs Shared Memory"',
    script: 'Inter-Process Communication enables isolated processes to exchange data. Anonymous Pipes are unidirectional FIFO byte streams between related parent-child processes via shared file descriptors. Named Pipes (FIFOs) extend this across unrelated processes via the file system. Sockets provide bidirectional communication across network boundaries or locally via Unix Domain Sockets. Shared Memory is the fastest IPC mechanism available: the kernel maps the same physical RAM frames into the virtual address spaces of both processes, allowing zero-copy data exchange at CPU memory bus speeds. However, shared memory requires manual synchronization using mutexes or semaphores to prevent race conditions.',
    keywords: ['Pipes vs Sockets', 'Shared Memory (Zero Copy)', 'Unix Domain Sockets', 'Kernel Buffer Copying Overhead', 'IPC Synchronization'],
    trapQuestions: [
      {
        id: 'os-10-t1',
        question: 'Why are Unix Domain Sockets faster than localhost TCP loopback sockets (127.0.0.1)?',
        commonMistake: 'Because Unix domain sockets don\'t use IP addresses.',
        winningAnswer: 'TCP loopback still traverses the full network stack: computing TCP checksums, generating sequence numbers, segmenting packets, and managing congestion windows. Unix Domain Sockets bypass the entire networking layer, directly copying byte buffers from sender socket buffers to receiver socket buffers in kernel space with zero packet headers or checksum overhead.',
        companyTags: ['Netflix', 'Meta', 'Cloudflare']
      }
    ]
  },

  // =========================================================================
  // DATABASE MANAGEMENT SYSTEMS (dbms-1 to dbms-10)
  // =========================================================================
  'dbms-1': {
    tier: 'L100',
    tierName: 'Foundations (ELI5)',
    frequency: 'Standard introductory placement question',
    targetPrompt: 'When asked: "What is the Three-Schema ANSI-SPARC Architecture and Data Independence?"',
    script: 'The ANSI-SPARC Three-Schema architecture separates the user view from the physical storage: the External Level (individual customized user views), the Conceptual Level (community logical schema showing all entities, attributes, and relationships), and the Internal Level (physical storage structures, indexing, and block allocations). This separation delivers Data Independence. Logical Data Independence allows changing the conceptual schema (like adding an attribute or splitting a table) without breaking external views. Physical Data Independence allows changing physical storage layouts (like adding a B+ tree index or moving to SSDs) without altering conceptual queries or application code.',
    keywords: ['Three-Schema ANSI-SPARC', 'External, Conceptual, Internal Levels', 'Logical Data Independence', 'Physical Data Independence'],
    trapQuestions: [
      {
        id: 'dbms-1-t1',
        question: 'Which is harder to achieve in production: Logical or Physical Data Independence?',
        commonMistake: 'Physical Data Independence, because changing hard disks and database indexes is physically complex.',
        winningAnswer: 'Logical Data Independence is vastly harder. Adding an index or altering disk partition layouts (Physical) requires zero application code changes. But altering tables, splitting relationships, or changing column semantics (Logical) frequently requires updating application ORM models and queries despite view abstractions.',
        companyTags: ['Oracle', 'Cognizant', 'TCS']
      }
    ]
  },
  'dbms-4': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Asked in 95%+ of SQL coding rounds',
    targetPrompt: 'When asked: "Explain SQL Joins, WHERE vs HAVING, and Window Functions"',
    script: 'SQL Joins combine rows from multiple tables based on related columns: INNER JOIN retains matching records, LEFT JOIN retains all left records with NULL for non-matches, and FULL OUTER JOIN retains all records from both sides. WHERE filters individual rows before grouping or aggregation takes place. HAVING filters grouped summary rows after the GROUP BY clause has executed. Window functions (like DENSE_RANK(), ROW_NUMBER(), and LEAD/LAG) perform analytical calculations across a set of table rows related to the current row without collapsing the rows into a single summary output, unlike standard GROUP BY aggregates.',
    keywords: ['INNER vs OUTER Joins', 'WHERE (Row Filter) vs HAVING (Group Filter)', 'DENSE_RANK() vs RANK()', 'PARTITION BY vs GROUP BY', 'Window Frames'],
    trapQuestions: [
      {
        id: 'dbms-4-t1',
        question: 'When finding the 2nd highest salary, why should you use DENSE_RANK() instead of RANK()?',
        commonMistake: 'Both functions give identical ranks for salary rankings.',
        winningAnswer: 'If two employees tie for the highest salary ($100k, $100k), RANK() assigns rank 1 to both and skips to rank 3 for the next person ($90k). Querying for rank 2 returns zero rows! DENSE_RANK() never leaves gaps: ties receive rank 1, and the next highest salary is guaranteed to receive rank 2.',
        companyTags: ['Amazon', 'Microsoft', 'Zoho']
      }
    ]
  },
  'dbms-5': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Must-know for university & product company interviews',
    targetPrompt: 'When asked: "Explain Database Normalization from 1NF up to BCNF"',
    script: 'Normalization minimizes data redundancy and prevents insertion, update, and deletion anomalies. 1NF mandates atomic values and a primary key. 2NF requires 1NF and the elimination of Partial Dependencies: every non-prime attribute must depend on the whole candidate key, not a subset. 3NF requires 2NF and the elimination of Transitive Dependencies: no non-prime attribute can depend on another non-prime attribute (in X -> Y, X is a superkey or Y is prime). BCNF is a stricter version of 3NF: for every functional dependency X -> Y, X MUST be a superkey. While BCNF eliminates redundancy, real-world OLTP systems often stop at 3NF or deliberately denormalize to avoid expensive multi-table joins.',
    keywords: ['1NF (Atomic)', '2NF (No Partial Dependency)', '3NF (No Transitive Dependency)', 'BCNF (X must be Superkey)', 'Lossless Join & Dependency Preservation'],
    trapQuestions: [
      {
        id: 'dbms-5-t1',
        question: 'Can every relational schema be decomposed into BCNF while preserving all functional dependencies?',
        commonMistake: 'Yes, any schema can achieve BCNF with full dependency preservation.',
        winningAnswer: 'No! BCNF decomposition always guarantees Lossless-Join decomposition, but does NOT always guarantee Dependency Preservation. If preserving a functional dependency is mandatory without joining tables across foreign keys, designers must accept 3NF instead of BCNF.',
        companyTags: ['Google', 'Directi', 'Goldman Sachs']
      }
    ]
  },
  'dbms-6': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Asked in 99% of backend & database interviews',
    targetPrompt: 'When asked: "Explain ACID Properties and ANSI SQL Isolation Levels"',
    script: 'ACID guarantees database reliability. Atomicity (all-or-nothing execution), Consistency (maintains integrity constraints), Isolation (concurrent transactions execute without interference), and Durability (committed changes survive system crashes). The ANSI SQL standard defines four Isolation Levels based on three read phenomena: Read Uncommitted allows Dirty Reads. Read Committed prevents Dirty Reads by reading only committed data. Repeatable Read prevents Dirty and Non-Repeatable Reads. Serializable provides total isolation, preventing Dirty Reads, Non-Repeatable Reads, and Phantom Reads. Modern engines like Postgres and MySQL use Multi-Version Concurrency Control (MVCC) so that readers do not block writers and writers do not block readers.',
    keywords: ['Atomicity, Consistency, Isolation, Durability', 'Dirty Read vs Non-Repeatable Read vs Phantom Read', 'MVCC (Multi-Version Concurrency Control)', 'Write-Ahead Logging (Durability)'],
    trapQuestions: [
      {
        id: 'dbms-6-t1',
        question: 'What is the exact difference between a Non-Repeatable Read and a Phantom Read?',
        commonMistake: 'They both mean reading different data when running the same query twice.',
        winningAnswer: 'A Non-Repeatable Read occurs when Transaction A re-reads a specific existing row and sees that its values were MODIFIED or DELETED by Transaction B. A Phantom Read occurs when Transaction A re-runs a range query (e.g. WHERE salary > 50000) and discovers NEW rows INSERTED by Transaction B that match the range criteria. Preventing Non-Repeatable reads requires row locks; preventing Phantom reads requires predicate or Gap Locks.',
        companyTags: ['Amazon', 'Uber', 'Razorpay']
      }
    ]
  },
  'dbms-7': {
    tier: 'L300',
    tierName: 'FAANG & Systems',
    frequency: 'Advanced database engineering & backend systems rounds',
    targetPrompt: 'When asked: "Explain Two-Phase Locking (2PL) and Conflict Serializability"',
    script: 'Concurrency control ensures that interleaved transaction schedules produce identical results to executing transactions serially (Conflict Serializability). Two-Phase Locking (2PL) guarantees conflict serializability through a protocol with two distinct phases: the Growing Phase (transactions acquire locks and cannot release any) and the Shrinking Phase (transactions release locks and cannot acquire any new ones). Strict 2PL requires holding all exclusive locks until transaction commit or abort, which prevents Cascading Aborts. Rigorous 2PL holds both shared and exclusive locks until commit, producing strict serial schedules.',
    keywords: ['Conflict Serializability', 'Two-Phase Locking (2PL)', 'Growing vs Shrinking Phase', 'Cascading Aborts Prevention', 'Precedence (Serialization) Graph'],
    trapQuestions: [
      {
        id: 'dbms-7-t1',
        question: 'Does standard Two-Phase Locking (2PL) prevent deadlocks?',
        commonMistake: 'Yes, 2PL eliminates deadlocks by locking data before writing.',
        winningAnswer: 'No! In fact, 2PL can easily cause deadlocks. If Transaction 1 holds Lock A and requests Lock B, while Transaction 2 holds Lock B and requests Lock A, both enter circular wait. 2PL guarantees serializability, but deadlocks must be handled separately using wait-for graphs, timeouts, or schemes like Wait-Die and Wound-Wait.',
        companyTags: ['Amazon', 'Microsoft', 'Databricks']
      }
    ]
  },
  'dbms-9': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Asked in 95%+ of database design & system scale rounds',
    targetPrompt: 'When asked: "Why do databases use B+ Trees instead of Binary Search Trees or Hash Tables?"',
    script: 'Databases use B+ Trees because they are optimized for disk block I/O and range scans. A Binary Search Tree has a low fanout of 2, resulting in deep trees that require dozens of disk I/O seeks per query. A B+ Tree has a massive fanout (hundreds of keys per 8KB node), keeping the tree height at only 3 to 4 levels even for billions of rows. Furthermore, in a B+ Tree, actual data pointers reside ONLY in leaf nodes, and all leaf nodes are doubly linked sequentially. This allows range queries (like WHERE date BETWEEN A AND B) to find the first key in O(log N) and then perform blazing-fast sequential disk scans along the linked leaves. Hash indexes provide O(1) point lookups, but are completely useless for range queries or ORDER BY sorting.',
    keywords: ['High Fanout & Low Tree Height', 'All Data in Doubly-Linked Leaves', 'Sequential Range Scan Capability', 'B+ Tree vs Hash Index Trade-off', 'Clustered vs Secondary Index'],
    trapQuestions: [
      {
        id: 'dbms-9-t1',
        question: 'If you create a composite index on (department_id, salary), will the database use this index for a query with WHERE salary > 100000?',
        commonMistake: 'Yes, because salary is included in the composite index.',
        winningAnswer: 'No! Composite indexes obey the Leftmost Prefix Rule. The index is ordered first by department_id, and only sub-ordered by salary within identical departments. A query filtering only on salary cannot perform an index seek because salaries are scattered across different department branches. It must revert to a full table scan or index full scan.',
        companyTags: ['Amazon', 'Salesforce', 'Flipkart']
      }
    ]
  },
  'dbms-10': {
    tier: 'L300',
    tierName: 'FAANG & Systems',
    frequency: 'Core question in database internals & backend infrastructure',
    targetPrompt: 'When asked: "Explain Write-Ahead Logging (WAL) and the ARIES recovery algorithm"',
    script: 'Write-Ahead Logging (WAL) ensures Atomicity and Durability without requiring the database to write modified dirty data pages to disk on every commit. The core WAL rule mandates that log records describing a change MUST be flushed to persistent disk storage BEFORE the corresponding dirty data page is written to disk. When a transaction commits, only the small append-only log record is synchronously flushed (fsync), turning slow random disk I/O into fast sequential writes. During crash recovery, the system executes the ARIES protocol: Analysis (identifies dirty pages and active transactions), Redo (repeats history to restore the exact pre-crash state), and Undo (rolls back all uncommitted transactions in reverse).',
    keywords: ['Write-Ahead Logging (WAL)', 'ARIES Recovery (Analysis, Redo, Undo)', 'Checkpointing & Fuzzy Checkpoints', 'Dirty Page Table', 'Sequential Log Flush vs Random Page I/O'],
    trapQuestions: [
      {
        id: 'dbms-10-t1',
        question: 'Why doesn\'t the database just write the actual table data rows directly to disk when committing a transaction?',
        commonMistake: 'Because hard drives don\'t allow writing rows directly without a log.',
        winningAnswer: 'Performance and random I/O latency. Table rows are scattered across random disk pages. Flushing modified pages synchronously on every transaction commit would force expensive random disk head seeks and flash block rewrites, dropping database throughput to hundreds of transactions per second. Appending a lightweight WAL record is pure sequential I/O, enabling tens of thousands of commits per second.',
        companyTags: ['Meta', 'Amazon AWS', 'CockroachDB']
      }
    ]
  },

  // =========================================================================
  // COMPUTER NETWORKS (cn-1 to cn-10)
  // =========================================================================
  'cn-1': {
    tier: 'L100',
    tierName: 'Foundations (ELI5)',
    frequency: 'Universal screening question across all tech roles',
    targetPrompt: 'When asked: "Explain the OSI 7-Layer Model vs TCP/IP 4-Layer Model"',
    script: 'The OSI model is a 7-layer theoretical reference framework: Physical (bits and cables), Data Link (frames and MAC addresses), Network (packets and IP routing), Transport (end-to-end segments and TCP/UDP ports), Session (dialog control), Presentation (encryption and format conversion), and Application (HTTP, DNS). In contrast, TCP/IP is the practical architecture of the real internet, consolidating layers into 4: Network Access, Internet, Transport, and Application. As data moves down the stack, each layer encapsulates the payload with its own protocol header (PDU); as data travels up the destination stack, each layer decapsulates its respective header.',
    keywords: ['7-Layer OSI Reference', '4-Layer TCP/IP Protocol Suite', 'Encapsulation & Decapsulation', 'MAC vs IP vs Port Addressing'],
    trapQuestions: [
      {
        id: 'cn-1-t1',
        question: 'At which OSI layer do switches and routers operate, and why?',
        commonMistake: 'Both operate at the Network Layer because they route internet packets.',
        winningAnswer: 'Standard Ethernet switches operate at Layer 2 (Data Link) using hardware MAC address tables to forward frames within a local network. Routers operate at Layer 3 (Network) using IP addresses and routing protocols (OSPF, BGP) to route packets across disparate networks.',
        companyTags: ['Cisco', 'Juniper', 'TCS']
      }
    ]
  },
  'cn-5': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Asked in 90%+ of networking & infrastructure interviews',
    targetPrompt: 'When asked: "Explain CIDR Subnetting and how to calculate usable host IPs"',
    script: 'Classless Inter-Domain Routing (CIDR) replaced rigid Class A/B/C addressing by using variable-length subnet masking denoted by a slash prefix (/n). The prefix length n represents the number of contiguous leading bits assigned to the Network ID, leaving (32 - n) bits for the Host ID. The total number of IP addresses in a subnet is 2^(32 - n). However, the number of usable host IP addresses is always 2^(32 - n) - 2, because two addresses are permanently reserved: the Network Address (all host bits 0) and the Directed Broadcast Address (all host bits 1). For example, a /24 subnet has 256 total IPs and 254 usable host addresses.',
    keywords: ['CIDR Slash Notation (/n)', 'Network ID vs Host ID', '2^(32-n) - 2 Usable IPs', 'Network & Broadcast Reserved Addresses', 'Subnet Mask Calculation'],
    trapQuestions: [
      {
        id: 'cn-5-t1',
        question: 'Why can a /31 subnet be used on modern point-to-point router links even though 2^(32-31) - 2 = 0 usable hosts?',
        commonMistake: 'It cannot be used; point-to-point links must use /30 with 2 usable IPs.',
        winningAnswer: 'RFC 3021 specifically standardizes /31 for point-to-point links between two routers. Because there are only two endpoints on a point-to-point link, directed broadcast is unnecessary; packets are sent unicast to the opposite peer. This saves billions of precious IPv4 addresses compared to /30 which wastes 50% of allocated IPs.',
        companyTags: ['Arista', 'Cisco', 'Cloudflare']
      }
    ]
  },
  'cn-6': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Core networking interview question',
    targetPrompt: 'When asked: "Explain TCP vs UDP with real-world production use cases"',
    script: 'TCP is a connection-oriented, reliable transport protocol that uses a 3-way handshake, sequence numbers, and acknowledgments to guarantee in-order delivery, retransmitting lost segments, and providing flow and congestion control. Its trade-off is latency and header overhead (20-60 bytes). UDP is a connectionless, lightweight datagram protocol with minimal header overhead (8 bytes) that sends packets fire-and-forget without connection establishment or delivery guarantees. Use TCP for data integrity (HTTP web browsing, file downloads, database queries, email). Use UDP when low latency beats packet loss (VoIP voice calls, live video streaming, multiplayer game physics, DNS lookups, and HTTP/3 QUIC).',
    keywords: ['Connection-Oriented vs Connectionless', 'Reliable In-Order Delivery vs Unordered Datagrams', 'Header Size (20B vs 8B)', 'Head-of-Line Blocking', 'QUIC (UDP with User-Space Reliability)'],
    trapQuestions: [
      {
        id: 'cn-6-t1',
        question: 'Why does DNS primarily use UDP on port 53, but sometimes switches to TCP?',
        commonMistake: 'DNS only uses UDP; it never uses TCP.',
        winningAnswer: 'Standard DNS queries use UDP for speed (sub-millisecond single round-trip without handshake). However, DNS switches to TCP when response payloads exceed the 512-byte UDP limit (indicated by the Truncated bit TC=1 in the DNS header, common with DNSSEC), and for DNS Zone Transfers between primary and secondary name servers where reliability is mandatory.',
        companyTags: ['Google', 'Cloudflare', 'Akamai']
      }
    ]
  },
  'cn-8': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Asked in 95%+ of tech placement rounds',
    targetPrompt: 'When asked: "Explain the TCP 3-Way Handshake and the purpose of the TIME_WAIT state"',
    script: 'TCP establishes a reliable connection using a 3-way handshake: Client sends SYN with an Initial Sequence Number (ISN), Server replies with SYN-ACK acknowledging the client ISN and sending its own ISN, and Client replies with ACK. Both endpoints are now synchronized. Connection teardown uses a 4-step FIN-ACK exchange. When the client sends the final ACK, it enters the TIME_WAIT state for 2 * MSL (Maximum Segment Lifetime, typically 60-120 seconds) before closing the socket. TIME_WAIT serves two critical purposes: ensuring the final ACK was received by the server (resending it if the server retransmits FIN), and allowing lingering duplicate packets from the connection to expire in the network so they don\'t corrupt future connections reusing the same port.',
    keywords: ['SYN, SYN-ACK, ACK', 'Initial Sequence Number (ISN)', 'FIN-ACK Connection Termination', 'TIME_WAIT State (2 * MSL)', 'Delayed Duplicate Packet Drainage'],
    trapQuestions: [
      {
        id: 'cn-8-t1',
        question: 'Why does the TCP Handshake require 3 steps? Why aren\'t 2 steps (SYN and SYN-ACK) enough?',
        commonMistake: 'Because the client needs to send data immediately in the 3rd step.',
        winningAnswer: 'A 2-way handshake fails to prevent duplicate connection setups caused by delayed network packets. If an old duplicate SYN packet arrives at the server after the original connection died, a 2-way handshake would force the server to allocate resources and open a ghost connection, believing the client wants to communicate. With a 3-way handshake, the server waits for the client\'s ACK; the client sees an unexpected SYN-ACK and sends an RST packet, terminating the spurious connection.',
        companyTags: ['Amazon', 'Microsoft', 'Bloomberg']
      }
    ]
  },
  'cn-9': {
    tier: 'L300',
    tierName: 'FAANG & Systems',
    frequency: 'Core question in high-scale web engineering & cloud infrastructure',
    targetPrompt: 'When asked: "Explain Modern Web Protocols: HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)"',
    script: 'HTTP/1.1 introduced persistent TCP connections, but suffered from Head-of-Line (HoL) blocking at the application level: requests on a single TCP connection had to be processed sequentially, forcing browsers to open up to 6 separate TCP connections per domain. HTTP/2 revolutionized web performance by introducing binary framing and true multiplexing: hundreds of concurrent requests and responses stream over a single TCP connection without blocking. However, HTTP/2 still suffered from TCP-level HoL blocking: if a single packet drops on the network, the TCP socket pauses all multiplexed streams until that packet retransmits. HTTP/3 completely eliminates HoL blocking by replacing TCP with QUIC over UDP, providing native independent stream reliability and 0-RTT connection resumption.',
    keywords: ['Application HoL Blocking', 'Binary Framing & Multiplexing', 'TCP-Level HoL Blocking', 'QUIC over UDP', '0-RTT Handshake (TLS 1.3 Integrated)'],
    trapQuestions: [
      {
        id: 'cn-9-t1',
        question: 'Why didn\'t the IETF just modify TCP to fix Head-of-Line blocking instead of inventing QUIC over UDP?',
        commonMistake: 'Because TCP was too old and deprecated.',
        winningAnswer: 'Protocol ossification. Middleboxes, firewalls, and enterprise NAT routers across the internet inspect TCP headers. If the IETF changed TCP wire formats or options, millions of middleboxes would drop the packets as invalid. UDP payloads are completely opaque to middleboxes, allowing QUIC to innovate at the application transport layer in user space while traversing existing internet hardware without interference.',
        companyTags: ['Google', 'Cloudflare', 'Meta']
      }
    ]
  },
  'cn-10': {
    tier: 'L200',
    tierName: 'Placement Core',
    frequency: 'Standard security question for web developers & SDE-1',
    targetPrompt: 'When asked: "Explain the TLS/HTTPS Handshake and Public Key Infrastructure (PKI)"',
    script: 'HTTPS secures web traffic by wrapping HTTP in Transport Layer Security (TLS). The TLS 1.3 handshake establishes encryption in a single round trip (1-RTT). The client sends ClientHello with supported cryptographic ciphers and a Diffie-Hellman key share. The server replies with ServerHello, its chosen cipher, its Diffie-Hellman share, and its digital Certificate signed by a trusted Certificate Authority (CA). The client verifies the certificate against root CAs stored in its operating system, preventing Man-in-the-Middle attacks. Both parties use the asymmetric Diffie-Hellman exchange to derive identical symmetric session keys, switching to blazing-fast symmetric AES-GCM encryption for all subsequent application data transfer.',
    keywords: ['Asymmetric vs Symmetric Encryption', 'TLS 1.3 1-RTT Handshake', 'Certificate Authority (CA) Chain of Trust', 'Diffie-Hellman Key Exchange', 'Forward Secrecy'],
    trapQuestions: [
      {
        id: 'cn-10-t1',
        question: 'Why doesn\'t HTTPS use asymmetric RSA encryption for the entire session instead of switching to symmetric encryption?',
        commonMistake: 'Because asymmetric encryption isn\'t secure enough for long sessions.',
        winningAnswer: 'CPU performance and throughput. Asymmetric algorithms (like RSA) rely on modular exponentiation of 2048-bit numbers, which is hundreds of times more CPU-intensive than symmetric ciphers (like AES-GCM) that execute in hardware CPU registers (AES-NI). HTTPS uses asymmetric cryptography solely to authenticate identity and safely agree on a symmetric session key.',
        companyTags: ['Amazon', 'Google', 'PayPal']
      }
    ]
  }
};

// Helper: Get enriched interview data for a topic
export function getTopicInterviewData(topicId) {
  return topicInterviewData[topicId] || null;
}
