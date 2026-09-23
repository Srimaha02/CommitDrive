// Curated Further Reading & Verification Resources for all 30 Topics
// Covering Operating Systems (10), DBMS (10), and Computer Networks (10)
// High-authority references: GeeksforGeeks, Gate Smashers, Neso Academy, Abdul Bari, MDN, IETF RFCs, Linux man-pages & PostgreSQL/MySQL Docs

export const furtherReadingData = {
  // ==========================================
  // OPERATING SYSTEMS (os-1 to os-10)
  // ==========================================
  'os-1': {
    article: {
      title: 'GeeksforGeeks: Dual Mode Operations in Operating Systems',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Dual%20Mode%20Operations%20in%20Operating%20Systems',
      desc: 'Deep-dive into User Mode vs Kernel Mode, privilege rings, mode bit transitions, and hardware protection.'
    },
    video: {
      title: 'Gate Smashers: Dual Mode in Operating System & System Calls',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20Dual%20Mode%20in%20Operating%20System%20%26%20System%20Calls',
      desc: 'Visual lecture explaining how hardware traps switch CPU execution from unprivileged ring 3 to privileged ring 0.'
    },
    docs: {
      title: 'Linux Manual: syscalls(2) Architecture Reference',
      source: 'Linux Programmer\'s Manual',
      url: 'https://man7.org/linux/man-pages/man2/syscalls.2.html',
      desc: 'Official Linux kernel system call entry mechanism, register conventions, and error handling specifications.'
    }
  },

  'os-2': {
    article: {
      title: 'GeeksforGeeks: Introduction of Process Management & PCB',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Introduction%20of%20Process%20Management%20%26%20PCB',
      desc: 'Comprehensive breakdown of process states (New, Ready, Running, Waiting, Terminated) and PCB layout.'
    },
    video: {
      title: 'Neso Academy: Process States & Context Switching',
      source: 'Neso Academy (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Neso%20Academy%20Process%20States%20%26%20Context%20Switching',
      desc: 'Step-by-step state transition diagrams, PCB register swapping, and context switch latency animations.'
    },
    docs: {
      title: 'Linux Manual: fork(2) & Process Creation',
      source: 'Linux Programmer\'s Manual',
      url: 'https://man7.org/linux/man-pages/man2/fork.2.html',
      desc: 'Standard POSIX process creation semantics, Copy-on-Write (COW) memory behavior, and return values.'
    }
  },

  'os-3': {
    article: {
      title: 'GeeksforGeeks: Threads and Threading Models in OS',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Threads%20and%20Threading%20Models%20in%20OS',
      desc: 'Comparison of User-Level Threads vs Kernel-Level Threads, Many-to-One, One-to-One, and Many-to-Many models.'
    },
    video: {
      title: 'Gate Smashers: Process vs Thread & Multithreading Architecture',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20Process%20vs%20Thread%20%26%20Multithreading%20Architecture',
      desc: 'Clear visual comparison explaining why thread context switching is faster than full process context switching.'
    },
    docs: {
      title: 'POSIX Threads Specification: pthreads(7)',
      source: 'Linux Programmer\'s Manual',
      url: 'https://man7.org/linux/man-pages/man7/pthreads.7.html',
      desc: 'Standard POSIX threading API guidelines, thread stacks, mutex locking, and cancellation semantics.'
    }
  },

  'os-4': {
    article: {
      title: 'GeeksforGeeks: CPU Scheduling in Operating Systems',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=CPU%20Scheduling%20in%20Operating%20Systems',
      desc: 'Formulas and Gantt chart calculations for FCFS, SJF, SRTF, Priority Scheduling, and Round Robin.'
    },
    video: {
      title: 'Gate Smashers: CPU Scheduling Algorithms Comparison',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20CPU%20Scheduling%20Algorithms%20Comparison',
      desc: 'Solved numerical problems calculating Average Waiting Time and Turnaround Time for campus placements.'
    },
    docs: {
      title: 'Linux Kernel Documentation: Completely Fair Scheduler (CFS)',
      source: 'Linux Kernel Documentation',
      url: 'https://www.kernel.org/doc/html/latest/scheduler/sched-design-CFS.html',
      desc: 'Design rationale behind Linux\'s red-black tree based CFS scheduler and virtual runtime tracking.'
    }
  },

  'os-5': {
    article: {
      title: 'GeeksforGeeks: Process Synchronization & Critical Section',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Process%20Synchronization%20%26%20Critical%20Section',
      desc: 'Mutual Exclusion, Progress, Bounded Waiting conditions, Peterson\'s Algorithm, and Counting Semaphores.'
    },
    video: {
      title: 'Neso Academy: Introduction to Process Synchronization & Semaphores',
      source: 'Neso Academy (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Neso%20Academy%20Introduction%20to%20Process%20Synchronization%20%26%20Semaphores',
      desc: 'Race conditions explained visually with shared balance counters and wait()/signal() semaphore mechanics.'
    },
    docs: {
      title: 'Linux Manual: sem_overview(7) POSIX Semaphores',
      source: 'Linux Programmer\'s Manual',
      url: 'https://man7.org/linux/man-pages/man7/sem_overview.7.html',
      desc: 'POSIX named and unnamed semaphores, memory sharing requirements, and atomic operations.'
    }
  },

  'os-6': {
    article: {
      title: 'GeeksforGeeks: Banker\'s Algorithm in Operating System',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Banker%5C',
      desc: 'The 4 Coffman conditions for Deadlock, Resource Allocation Graphs, and Safety/Request algorithm matrices.'
    },
    video: {
      title: 'Abdul Bari: Banker\'s Algorithm Deadlock Avoidance',
      source: 'Abdul Bari (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Abdul%20Bari%20Banker%5C',
      desc: 'Clear, step-by-step whiteboard walkthrough solving Banker\'s Algorithm matrices with multiple resource instances.'
    },
    docs: {
      title: 'OSTEP: Concurrency Bugs & Deadlock Elimination',
      source: 'Operating Systems: Three Easy Pieces (Univ. Wisconsin)',
      url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf',
      desc: 'Classic reference chapter on non-deadlock and deadlock concurrency bugs with real software examples.'
    }
  },

  'os-7': {
    article: {
      title: 'GeeksforGeeks: Paging in Operating System & Address Translation',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Paging%20in%20Operating%20System%20%26%20Address%20Translation',
      desc: 'Logical vs Physical Address space, Page Table entry layout, Frame allocation, and Translation Lookaside Buffer (TLB).'
    },
    video: {
      title: 'Gate Smashers: Paging in Operating System Explained',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20Paging%20in%20Operating%20System%20Explained',
      desc: 'Animation showing how MMU and TLB map virtual page numbers (VPN) to physical page frame numbers (PFN).'
    },
    docs: {
      title: 'OSTEP: Paging Architecture & Multi-Level Page Tables',
      source: 'Operating Systems: Three Easy Pieces',
      url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf',
      desc: 'Textbook chapter detailing internal fragmentation, page table size overhead, and multi-level paging schemes.'
    }
  },

  'os-8': {
    article: {
      title: 'GeeksforGeeks: Page Replacement Algorithms (FIFO, LRU, Optimal)',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Page%20Replacement%20Algorithms%20(FIFO%2C%20LRU%2C%20Optimal)',
      desc: 'Demand paging, page fault handling flow, Belady\'s Anomaly in FIFO, and LRU hardware implementation techniques.'
    },
    video: {
      title: 'Neso Academy: Page Replacement Algorithms Numerical Practice',
      source: 'Neso Academy (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Neso%20Academy%20Page%20Replacement%20Algorithms%20Numerical%20Practice',
      desc: 'Solved page reference string examples computing hit ratio and page fault counts across LRU, FIFO, and Optimal.'
    },
    docs: {
      title: 'Linux Manual: mmap(2) & Virtual Memory Allocation',
      source: 'Linux Programmer\'s Manual',
      url: 'https://man7.org/linux/man-pages/man2/mmap.2.html',
      desc: 'Creating anonymous and file-backed virtual memory mappings and demand page fault invocation in the Linux kernel.'
    }
  },

  'os-9': {
    article: {
      title: 'GeeksforGeeks: File Systems, Inodes & Allocation Methods',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=File%20Systems%2C%20Inodes%20%26%20Allocation%20Methods',
      desc: 'Contiguous, Linked, and Indexed allocation, Unix Inode structure (direct, single indirect, double indirect blocks).'
    },
    video: {
      title: 'Gate Smashers: File System in Operating System & Inodes',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20File%20System%20in%20Operating%20System%20%26%20Inodes',
      desc: 'Visual explanation of directory hard links vs symbolic soft links and inode pointer indexing.'
    },
    docs: {
      title: 'Linux Kernel: Ext4 Filesystem & Journaling Architecture',
      source: 'Linux Kernel Documentation',
      url: 'https://www.kernel.org/doc/html/latest/filesystems/ext4/index.html',
      desc: 'Ext4 filesystem internals, write-ahead journaling modes (data, ordered, writeback), and crash consistency.'
    }
  },

  'os-10': {
    article: {
      title: 'GeeksforGeeks: DMA (Direct Memory Access) Controller Architecture',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=DMA%20(Direct%20Memory%20Access)%20Controller%20Architecture',
      desc: 'Burst mode vs Cycle Stealing, DMA bus arbitration, interrupt generation, and CPU offloading.'
    },
    video: {
      title: 'Knowledge Gate: Direct Memory Access (DMA) & Zero-Copy',
      source: 'Knowledge Gate (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Knowledge%20Gate%20Direct%20Memory%20Access%20(DMA)%20%26%20Zero-Copy',
      desc: 'Comparison of Programmed I/O, Interrupt-Driven I/O, and Direct Memory Access data transfer pipelines.'
    },
    docs: {
      title: 'Linux Manual: sendfile(2) & Kernel Zero-Copy Transfer',
      source: 'Linux Programmer\'s Manual',
      url: 'https://man7.org/linux/man-pages/man2/sendfile.2.html',
      desc: 'Eliminating context switches and user-space buffer copies for high-throughput network and file streaming.'
    }
  },

  // ==========================================
  // DATABASE MANAGEMENT SYSTEMS (dbms-1 to dbms-10)
  // ==========================================
  'dbms-1': {
    article: {
      title: 'GeeksforGeeks: Three-Tier Schema Architecture in DBMS',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Three-Tier%20Schema%20Architecture%20in%20DBMS',
      desc: 'Physical, Conceptual, and External schema levels; Logical vs Physical Data Independence principles.'
    },
    video: {
      title: 'Gate Smashers: 3-Schema Architecture & Data Independence',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%203-Schema%20Architecture%20%26%20Data%20Independence',
      desc: 'Intuitive real-world analogies explaining schema decoupling and views in modern database systems.'
    },
    docs: {
      title: 'PostgreSQL Architecture Fundamentals',
      source: 'PostgreSQL Official Documentation',
      url: 'https://www.postgresql.org/docs/current/overview.html',
      desc: 'The client/server process model, catalog schemas, and storage subsystem organization in PostgreSQL.'
    }
  },

  'dbms-2': {
    article: {
      title: 'GeeksforGeeks: Relational Algebra Operators in DBMS',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Relational%20Algebra%20Operators%20in%20DBMS',
      desc: 'Selection, Projection, Cartesian Product, Joins, Set Difference, and fundamental key classifications.'
    },
    video: {
      title: 'Knowledge Gate: Keys in DBMS (Super, Candidate, Primary, Foreign)',
      source: 'Knowledge Gate (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Knowledge%20Gate%20Keys%20in%20DBMS%20(Super%2C%20Candidate%2C%20Primary%2C%20Foreign)',
      desc: 'Mathematical method to determine candidate keys from functional dependencies with placement exam tricks.'
    },
    docs: {
      title: 'PostgreSQL Documentation: DDL Constraints & Referential Integrity',
      source: 'PostgreSQL Documentation',
      url: 'https://www.postgresql.org/docs/current/ddl-constraints.html',
      desc: 'Primary keys, foreign keys, CHECK constraints, and ON DELETE CASCADE/SET NULL behavior.'
    }
  },

  'dbms-3': {
    article: {
      title: 'GeeksforGeeks: SQL Query Order of Execution & Aggregations',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=SQL%20Query%20Order%20of%20Execution%20%26%20Aggregations',
      desc: 'Logical query processing order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.'
    },
    video: {
      title: 'Alex The Analyst: SQL Group By and Having Tutorial',
      source: 'Alex The Analyst (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Alex%20The%20Analyst%20SQL%20Group%20By%20and%20Having%20Tutorial',
      desc: 'Hands-on live queries demonstrating the difference between WHERE filtering and HAVING post-aggregate filtering.'
    },
    docs: {
      title: 'PostgreSQL Documentation: Queries & Aggregate Functions',
      source: 'PostgreSQL Documentation',
      url: 'https://www.postgresql.org/docs/current/queries.html',
      desc: 'Official SQL query syntax, join clauses, group by aggregations, and subquery semantics.'
    }
  },

  'dbms-4': {
    article: {
      title: 'GeeksforGeeks: Window Functions in SQL (ROW_NUMBER, RANK, DENSE_RANK)',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Window%20Functions%20in%20SQL%20(ROW_NUMBER%2C%20RANK%2C%20DENSE_RANK)',
      desc: 'OVER(), PARTITION BY, ORDER BY, running totals, lead/lag functions, and Common Table Expressions (CTEs).'
    },
    video: {
      title: 'Luke Barousse: SQL Window Functions in 10 Minutes',
      source: 'Luke Barousse (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Luke%20Barousse%20SQL%20Window%20Functions%20in%2010%20Minutes',
      desc: 'Visual animations illustrating how partition windows differ from GROUP BY row collapsing.'
    },
    docs: {
      title: 'PostgreSQL Documentation: WITH Queries (Common Table Expressions)',
      source: 'PostgreSQL Documentation',
      url: 'https://www.postgresql.org/docs/current/queries-with.html',
      desc: 'Writing readable complex analytical queries and recursive hierarchical CTE queries.'
    }
  },

  'dbms-5': {
    article: {
      title: 'GeeksforGeeks: Introduction to ER Model & Cardinality Ratios',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Introduction%20to%20ER%20Model%20%26%20Cardinality%20Ratios',
      desc: 'Entities, Weak Entities, Attributes, Relationships, and step-by-step mapping rules from ER Diagrams to Relational Tables.'
    },
    video: {
      title: 'Gate Smashers: ER Model in DBMS & Schema Reduction',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20ER%20Model%20in%20DBMS%20%26%20Schema%20Reduction',
      desc: 'Min-max cardinality notation, 1:1, 1:N, M:N relationship reduction into minimal tables.'
    },
    docs: {
      title: 'MySQL Documentation: Foreign Key Constraints & Relationship Models',
      source: 'MySQL Documentation',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html',
      desc: 'Enforcing many-to-many junction tables, cascading updates, and indexing foreign key columns.'
    }
  },

  'dbms-6': {
    article: {
      title: 'GeeksforGeeks: Database Normalization (1NF, 2NF, 3NF, BCNF)',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Database%20Normalization%20(1NF%2C%202NF%2C%203NF%2C%20BCNF)',
      desc: 'Lossless join decomposition, dependency preservation, functional dependency closure, and canonical cover.'
    },
    video: {
      title: 'Gate Smashers: Normalization in DBMS Masterclass',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20Normalization%20in%20DBMS%20Masterclass',
      desc: 'Practical examples identifying Partial Dependencies (2NF) and Transitive Dependencies (3NF vs BCNF).'
    },
    docs: {
      title: 'Boyce-Codd Normal Form (BCNF) Formal Mathematical Proof',
      source: 'Computer Science Reference',
      url: 'https://en.wikipedia.org/wiki/Boyce%E2%80%93Codd_normal_form',
      desc: 'The strict definition: for every non-trivial functional dependency X -> Y, X must be a superkey.'
    }
  },

  'dbms-7': {
    article: {
      title: 'GeeksforGeeks: ACID Properties & Concurrency Anomalies',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=ACID%20Properties%20%26%20Concurrency%20Anomalies',
      desc: 'Atomicity, Consistency, Isolation, Durability, Dirty Read, Non-Repeatable Read, and Phantom Read phenomena.'
    },
    video: {
      title: 'Gate Smashers: ACID Properties in DBMS with Bank Transfer Demo',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20ACID%20Properties%20in%20DBMS%20with%20Bank%20Transfer%20Demo',
      desc: 'Visual bank transaction breakdown showing how rollbacks ensure Atomicity and Durability during crashes.'
    },
    docs: {
      title: 'PostgreSQL Documentation: Transaction Isolation Levels',
      source: 'PostgreSQL Documentation',
      url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
      desc: 'ANSI SQL vs PostgreSQL snapshot isolation, MVCC, and repeatable read behavior.'
    }
  },

  'dbms-8': {
    article: {
      title: 'GeeksforGeeks: Two-Phase Locking (2PL) Concurrency Protocol',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Two-Phase%20Locking%20(2PL)%20Concurrency%20Protocol',
      desc: 'Growing phase vs Shrinking phase, Strict 2PL, Rigorous 2PL, Conflict Serializability, and Precedence Graphs.'
    },
    video: {
      title: 'Gate Smashers: Two Phase Locking Protocol (2PL)',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20Two%20Phase%20Locking%20Protocol%20(2PL)',
      desc: 'Animation showing how 2PL guarantees serializable schedules and prevents cascading aborts.'
    },
    docs: {
      title: 'MySQL Documentation: InnoDB Locking Architecture',
      source: 'MySQL Documentation',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html',
      desc: 'Shared (S) locks, Exclusive (X) locks, Intention locks, Record locks, Gap locks, and Next-Key locking.'
    }
  },

  'dbms-9': {
    article: {
      title: 'GeeksforGeeks: B-Tree and B+ Tree Indexing in Databases',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=B-Tree%20and%20B%2B%20Tree%20Indexing%20in%20Databases',
      desc: 'Why B+ Trees are superior to binary search trees for disk storage: high fan-out, shallow depth, and linked leaf nodes for range scans.'
    },
    video: {
      title: 'Abdul Bari: B-Trees and B+ Trees Insertion & Search',
      source: 'Abdul Bari (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Abdul%20Bari%20B-Trees%20and%20B%2B%20Trees%20Insertion%20%26%20Search',
      desc: 'The definitive lecture on node splitting, disk block alignment, and logarithmic search complexity.'
    },
    docs: {
      title: 'PostgreSQL Documentation: Index Types (B-Tree, Hash, GIN, GiST)',
      source: 'PostgreSQL Documentation',
      url: 'https://www.postgresql.org/docs/current/indexes-types.html',
      desc: 'Choosing optimal index types, multi-column compound indexes, and evaluating queries with EXPLAIN ANALYZE.'
    }
  },

  'dbms-10': {
    article: {
      title: 'GeeksforGeeks: Log-Based Recovery & Checkpointing in DBMS',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Log-Based%20Recovery%20%26%20Checkpointing%20in%20DBMS',
      desc: 'Deferred update vs Immediate update, Write-Ahead Logging (WAL), REDO and UNDO log lists, and ARIES recovery.'
    },
    video: {
      title: 'Gate Smashers: Checkpoint in DBMS Recovery Algorithm',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20Checkpoint%20in%20DBMS%20Recovery%20Algorithm',
      desc: 'How fuzzy checkpoints prevent scanning millions of historical log records from the beginning of time.'
    },
    docs: {
      title: 'PostgreSQL Documentation: Write-Ahead Logging (WAL) & Crash Resilience',
      source: 'PostgreSQL Documentation',
      url: 'https://www.postgresql.org/docs/current/wal-intro.html',
      desc: 'The fundamental WAL rule: changes to data pages must be flushed to disk log before the dirty pages hit disk.'
    }
  },

  // ==========================================
  // COMPUTER NETWORKS (cn-1 to cn-10)
  // ==========================================
  'cn-1': {
    article: {
      title: 'GeeksforGeeks: Packet Switching, Circuit Switching & Delays',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Packet%20Switching%2C%20Circuit%20Switching%20%26%20Delays',
      desc: 'Transmission Delay (L/R), Propagation Delay (d/s), Queuing Delay, Processing Delay, and Star/Mesh network topologies.'
    },
    video: {
      title: 'Gate Smashers: Delays in Computer Networks Formulas & Problems',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20Delays%20in%20Computer%20Networks%20Formulas%20%26%20Problems',
      desc: 'Solved numerical examples for campus screening exams calculating total end-to-end latency.'
    },
    docs: {
      title: 'IETF RFC 791: Internet Protocol Specification',
      source: 'IETF RFC 791',
      url: 'https://www.ietf.org/rfc/rfc791.txt',
      desc: 'The foundational standard defining packet fragmentation, hop-by-hop delivery, and TTL decrements.'
    }
  },

  'cn-2': {
    article: {
      title: 'GeeksforGeeks: Layers of the OSI 7-Layer Reference Model',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Layers%20of%20the%20OSI%207-Layer%20Reference%20Model',
      desc: 'Physical, Data Link, Network, Transport, Session, Presentation, Application layers; Data Encapsulation and PDU names.'
    },
    video: {
      title: 'NetworkChuck: OSI Model Explained Step-by-Step',
      source: 'NetworkChuck (YouTube)',
      url: 'https://www.youtube.com/results?search_query=NetworkChuck%20OSI%20Model%20Explained%20Step-by-Step',
      desc: 'Engaging real-world packet journey trace demonstrating headers added and stripped across every layer.'
    },
    docs: {
      title: 'IETF RFC 1122: Requirements for Internet Hosts — Layer Architecture',
      source: 'IETF RFC 1122',
      url: 'https://datatracker.ietf.org/doc/html/rfc1122',
      desc: 'The engineering specification of the practical 4-layer TCP/IP protocol stack governing all internet hosts.'
    }
  },

  'cn-3': {
    article: {
      title: 'GeeksforGeeks: Cyclic Redundancy Check (CRC) & Error Detection',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Cyclic%20Redundancy%20Check%20(CRC)%20%26%20Error%20Detection',
      desc: 'Binary polynomial division, checksum generation, parity bits, and Hamming distance error correction.'
    },
    video: {
      title: 'Gate Smashers: CRC (Cyclic Redundancy Check) Solved Example',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20CRC%20(Cyclic%20Redundancy%20Check)%20Solved%20Example',
      desc: 'Step-by-step modulo-2 arithmetic example generating CRC remainder bits for data transmission.'
    },
    docs: {
      title: 'IEEE 802.3: Ethernet Standard & Frame Format Specifications',
      source: 'IEEE Standards Association',
      url: 'https://standards.ieee.org/ieee/802.3/',
      desc: 'Preamble, SFD, Destination/Source MAC addresses, EtherType, Payload, and Frame Check Sequence (FCS).'
    }
  },

  'cn-4': {
    article: {
      title: 'GeeksforGeeks: Multiple Access Protocols: CSMA/CD & CSMA/CA',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Multiple%20Access%20Protocols%3A%20CSMA%2FCD%20%26%20CSMA%2FCA',
      desc: 'Pure ALOHA vs Slotted ALOHA throughput, 1-Persistent CSMA, Binary Exponential Backoff, and Collision Domains.'
    },
    video: {
      title: 'Gate Smashers: CSMA/CD Protocol Animation & Backoff Time',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20CSMA%2FCD%20Protocol%20Animation%20%26%20Backoff%20Time',
      desc: 'Why minimum packet size is required (2 * Propagation Delay * Bandwidth) to detect collisions before finishing transmission.'
    },
    docs: {
      title: 'Wi-Fi Alliance: IEEE 802.11 Wireless Medium Access Standards',
      source: 'Wi-Fi Alliance',
      url: 'https://www.wi-fi.org/discover-wi-fi/specifications',
      desc: 'Carrier sense with collision avoidance (CSMA/CA), RTS/CTS handshaking, and overcoming the Hidden Terminal problem.'
    }
  },

  'cn-5': {
    article: {
      title: 'GeeksforGeeks: Introduction to Subnetting and CIDR Notation',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Introduction%20to%20Subnetting%20and%20CIDR%20Notation',
      desc: 'Classful IPv4 vs CIDR slash notation, Subnet Masks, Network ID, Broadcast Address, and VLSM allocation.'
    },
    video: {
      title: 'Sunny Classroom: Subnetting Mastery for Beginners',
      source: 'Sunny Classroom (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Sunny%20Classroom%20Subnetting%20Mastery%20for%20Beginners',
      desc: 'Lightning-fast shortcut mental math tricks to calculate valid host ranges and broadcast IPs in seconds.'
    },
    docs: {
      title: 'IETF RFC 4632: Classless Inter-domain Routing (CIDR) Architecture',
      source: 'IETF RFC 4632',
      url: 'https://datatracker.ietf.org/doc/html/rfc4632',
      desc: 'The global routing table aggregation specification that solved routing table exhaustion on the early Internet.'
    }
  },

  'cn-6': {
    article: {
      title: 'GeeksforGeeks: Distance-Vector vs Link-State Routing Algorithms',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=Distance-Vector%20vs%20Link-State%20Routing%20Algorithms',
      desc: 'Bellman-Ford algorithm, Count-to-Infinity problem, Split Horizon, Poison Reverse, and Dijkstra\'s Shortest Path algorithm.'
    },
    video: {
      title: 'Gate Smashers: Link State Routing Protocol (Dijkstra Walkthrough)',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20Link%20State%20Routing%20Protocol%20(Dijkstra%20Walkthrough)',
      desc: 'Flooding Link State Advertisements (LSA) and running Dijkstra to construct routing tables in OSPF.'
    },
    docs: {
      title: 'IETF RFC 2328: OSPF Version 2 Specification',
      source: 'IETF RFC 2328',
      url: 'https://datatracker.ietf.org/doc/html/rfc2328',
      desc: 'Interior Gateway Protocol standard describing designated routers, area boundaries, and shortest path tree computation.'
    }
  },

  'cn-7': {
    article: {
      title: 'GeeksforGeeks: User Datagram Protocol (UDP) Architecture & Header',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=User%20Datagram%20Protocol%20(UDP)%20Architecture%20%26%20Header',
      desc: '8-byte header layout, port multiplexing, 16-bit pseudo-header checksum computation, and low-latency streaming use cases.'
    },
    video: {
      title: 'PowerCert: TCP vs UDP Comparison & Port Numbers Explained',
      source: 'PowerCert Animated (YouTube)',
      url: 'https://www.youtube.com/results?search_query=PowerCert%20Animated%20TCP%20vs%20UDP%20Comparison%20%26%20Port%20Numbers%20Explained',
      desc: 'Crystal-clear animations contrasting connectionless unreliable UDP against connection-oriented reliable TCP.'
    },
    docs: {
      title: 'IETF RFC 768: User Datagram Protocol (UDP)',
      source: 'IETF RFC 768',
      url: 'https://datatracker.ietf.org/doc/html/rfc768',
      desc: 'The original 1980 RFC specification for UDP socket transmission by David P. Reed.'
    }
  },

  'cn-8': {
    article: {
      title: 'GeeksforGeeks: TCP 3-Way Handshake & Connection Teardown',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=TCP%203-Way%20Handshake%20%26%20Connection%20Teardown',
      desc: 'SYN, SYN-ACK, ACK sequence numbers, FIN / TIME_WAIT state machine, Sliding Window flow control, and Silly Window syndrome.'
    },
    video: {
      title: 'Hussein Nasser: TCP 3-Way Handshake & State Machine Deep Dive',
      source: 'Hussein Nasser (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Hussein%20Nasser%20TCP%203-Way%20Handshake%20%26%20State%20Machine%20Deep%20Dive',
      desc: 'Wireshark packet capture inspecting ISN randomization, ACK acknowledgment numbers, and connection states.'
    },
    docs: {
      title: 'IETF RFC 9293: Transmission Control Protocol (TCP) Consolidated Standard',
      source: 'IETF RFC 9293',
      url: 'https://datatracker.ietf.org/doc/html/rfc9293',
      desc: 'The modern consolidated specification of TCP protocol operation, state transitions, and reliability mechanisms.'
    }
  },

  'cn-9': {
    article: {
      title: 'GeeksforGeeks: TCP Congestion Control (Slow Start, AIMD, Fast Retransmit)',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/?s=TCP%20Congestion%20Control%20(Slow%20Start%2C%20AIMD%2C%20Fast%20Retransmit)',
      desc: 'Congestion Window (cwnd), Slow Start Threshold (ssthresh), Additive Increase Multiplicative Decrease (AIMD), and Fast Recovery.'
    },
    video: {
      title: 'Gate Smashers: TCP Congestion Control Masterclass',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Gate%20Smashers%20TCP%20Congestion%20Control%20Masterclass',
      desc: 'Graph plotting Congestion Window over transmission rounds for TCP Tahoe vs TCP Reno after 3 duplicate ACKs or timeouts.'
    },
    docs: {
      title: 'IETF RFC 5681: TCP Congestion Control Algorithms',
      source: 'IETF RFC 5681',
      url: 'https://datatracker.ietf.org/doc/html/rfc5681',
      desc: 'Formal algorithmic definitions of Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.'
    }
  },

  'cn-10': {
    article: {
      title: 'MDN Web Docs: An Overview of HTTP Protocols (HTTP/1.1 vs HTTP/2 vs HTTP/3)',
      source: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
      desc: 'Stateless request/response cycle, DNS recursive resolution, head-of-line blocking, multiplexed binary framing, and QUIC UDP transport.'
    },
    video: {
      title: 'Computerphile: How DNS Root Servers & Resolvers Work',
      source: 'Computerphile (YouTube)',
      url: 'https://www.youtube.com/results?search_query=Computerphile%20How%20DNS%20Root%20Servers%20%26%20Resolvers%20Work',
      desc: 'Hierarchical delegation from root name servers (.) to TLD (.com) to authoritative nameservers, plus caching TTLs.'
    },
    docs: {
      title: 'IETF RFC 9114: HTTP/3 Protocol Specification (over QUIC)',
      source: 'IETF RFC 9114',
      url: 'https://datatracker.ietf.org/doc/html/rfc9114',
      desc: 'The official standard for HTTP/3 mapping HTTP semantics directly over QUIC UDP streams to eliminate TCP head-of-line blocking.'
    }
  }
};

/**
 * Helper to fetch verified further reading resource bundle for any topic ID
 * @param {string} topicId - e.g., 'os-1', 'dbms-6', 'cn-10'
 * @returns {object|null}
 */
export const getFurtherReadingForTopic = (topicId) => {
  return furtherReadingData[topicId] || null;
};
