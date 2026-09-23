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
      url: 'https://www.geeksforgeeks.org/dual-mode-operations-in-os/',
      desc: 'Deep-dive into User Mode vs Kernel Mode, privilege rings, mode bit transitions, and hardware protection.'
    },
    video: {
      title: 'Gate Smashers: Dual Mode in Operating System & System Calls',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=5akmJgZ2xEE',
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
      url: 'https://www.geeksforgeeks.org/introduction-of-process-management/',
      desc: 'Comprehensive breakdown of process states (New, Ready, Running, Waiting, Terminated) and PCB layout.'
    },
    video: {
      title: 'Neso Academy: Process States & Context Switching',
      source: 'Neso Academy (YouTube)',
      url: 'https://www.youtube.com/watch?v=2i2EFqL9wS4',
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
      url: 'https://www.geeksforgeeks.org/thread-in-operating-system/',
      desc: 'Comparison of User-Level Threads vs Kernel-Level Threads, Many-to-One, One-to-One, and Many-to-Many models.'
    },
    video: {
      title: 'Gate Smashers: Process vs Thread & Multithreading Architecture',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=LOfGJcVnvAk',
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
      url: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/',
      desc: 'Formulas and Gantt chart calculations for FCFS, SJF, SRTF, Priority Scheduling, and Round Robin.'
    },
    video: {
      title: 'Gate Smashers: CPU Scheduling Algorithms Comparison',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=ewabbnyXzrk',
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
      url: 'https://www.geeksforgeeks.org/introduction-of-process-synchronization/',
      desc: 'Mutual Exclusion, Progress, Bounded Waiting conditions, Peterson\'s Algorithm, and Counting Semaphores.'
    },
    video: {
      title: 'Neso Academy: Introduction to Process Synchronization & Semaphores',
      source: 'Neso Academy (YouTube)',
      url: 'https://www.youtube.com/watch?v=ph2hz7t_g_U',
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
      url: 'https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/',
      desc: 'The 4 Coffman conditions for Deadlock, Resource Allocation Graphs, and Safety/Request algorithm matrices.'
    },
    video: {
      title: 'Abdul Bari: Banker\'s Algorithm Deadlock Avoidance',
      source: 'Abdul Bari (YouTube)',
      url: 'https://www.youtube.com/watch?v=T0FXvTHcYi4',
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
      url: 'https://www.geeksforgeeks.org/paging-in-operating-system/',
      desc: 'Logical vs Physical Address space, Page Table entry layout, Frame allocation, and Translation Lookaside Buffer (TLB).'
    },
    video: {
      title: 'Gate Smashers: Paging in Operating System Explained',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=pJ6qrCB8pDw',
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
      url: 'https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/',
      desc: 'Demand paging, page fault handling flow, Belady\'s Anomaly in FIFO, and LRU hardware implementation techniques.'
    },
    video: {
      title: 'Neso Academy: Page Replacement Algorithms Numerical Practice',
      source: 'Neso Academy (YouTube)',
      url: 'https://www.youtube.com/watch?v=dYIoWGoNdio',
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
      url: 'https://www.geeksforgeeks.org/file-allocation-methods/',
      desc: 'Contiguous, Linked, and Indexed allocation, Unix Inode structure (direct, single indirect, double indirect blocks).'
    },
    video: {
      title: 'Gate Smashers: File System in Operating System & Inodes',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=tT8q5k3xL6w',
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
      url: 'https://www.geeksforgeeks.org/direct-memory-access-dma-controller-in-computer-architecture/',
      desc: 'Burst mode vs Cycle Stealing, DMA bus arbitration, interrupt generation, and CPU offloading.'
    },
    video: {
      title: 'Knowledge Gate: Direct Memory Access (DMA) & Zero-Copy',
      source: 'Knowledge Gate (YouTube)',
      url: 'https://www.youtube.com/watch?v=XwtX_x6qC3Y',
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
      url: 'https://www.geeksforgeeks.org/three-tier-architecture-in-dbms/',
      desc: 'Physical, Conceptual, and External schema levels; Logical vs Physical Data Independence principles.'
    },
    video: {
      title: 'Gate Smashers: 3-Schema Architecture & Data Independence',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=9_qAwb_dCqE',
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
      url: 'https://www.geeksforgeeks.org/relational-algebra-in-dbms/',
      desc: 'Selection, Projection, Cartesian Product, Joins, Set Difference, and fundamental key classifications.'
    },
    video: {
      title: 'Knowledge Gate: Keys in DBMS (Super, Candidate, Primary, Foreign)',
      source: 'Knowledge Gate (YouTube)',
      url: 'https://www.youtube.com/watch?v=G4u3T4eJ8oU',
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
      url: 'https://www.geeksforgeeks.org/sql-group-by/',
      desc: 'Logical query processing order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.'
    },
    video: {
      title: 'Alex The Analyst: SQL Group By and Having Tutorial',
      source: 'Alex The Analyst (YouTube)',
      url: 'https://www.youtube.com/watch?v=BHwzD8E977Y',
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
      url: 'https://www.geeksforgeeks.org/window-functions-in-sql/',
      desc: 'OVER(), PARTITION BY, ORDER BY, running totals, lead/lag functions, and Common Table Expressions (CTEs).'
    },
    video: {
      title: 'Luke Barousse: SQL Window Functions in 10 Minutes',
      source: 'Luke Barousse (YouTube)',
      url: 'https://www.youtube.com/watch?v=Ww71knvhQ-s',
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
      url: 'https://www.geeksforgeeks.org/introduction-of-er-model/',
      desc: 'Entities, Weak Entities, Attributes, Relationships, and step-by-step mapping rules from ER Diagrams to Relational Tables.'
    },
    video: {
      title: 'Gate Smashers: ER Model in DBMS & Schema Reduction',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=gbvquyd9K4o',
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
      url: 'https://www.geeksforgeeks.org/database-normalization/',
      desc: 'Lossless join decomposition, dependency preservation, functional dependency closure, and canonical cover.'
    },
    video: {
      title: 'Gate Smashers: Normalization in DBMS Masterclass',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=5hsECqY_yE8',
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
      url: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/',
      desc: 'Atomicity, Consistency, Isolation, Durability, Dirty Read, Non-Repeatable Read, and Phantom Read phenomena.'
    },
    video: {
      title: 'Gate Smashers: ACID Properties in DBMS with Bank Transfer Demo',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=ga3b_Q_mS3U',
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
      url: 'https://www.geeksforgeeks.org/two-phase-locking-protocol/',
      desc: 'Growing phase vs Shrinking phase, Strict 2PL, Rigorous 2PL, Conflict Serializability, and Precedence Graphs.'
    },
    video: {
      title: 'Gate Smashers: Two Phase Locking Protocol (2PL)',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=1F_4-K98K_w',
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
      url: 'https://www.geeksforgeeks.org/b-tree-in-dbms/',
      desc: 'Why B+ Trees are superior to binary search trees for disk storage: high fan-out, shallow depth, and linked leaf nodes for range scans.'
    },
    video: {
      title: 'Abdul Bari: B-Trees and B+ Trees Insertion & Search',
      source: 'Abdul Bari (YouTube)',
      url: 'https://www.youtube.com/watch?v=aZjYr87r1b8',
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
      url: 'https://www.geeksforgeeks.org/log-based-recovery/',
      desc: 'Deferred update vs Immediate update, Write-Ahead Logging (WAL), REDO and UNDO log lists, and ARIES recovery.'
    },
    video: {
      title: 'Gate Smashers: Checkpoint in DBMS Recovery Algorithm',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=F3_6e_Y82Lw',
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
      url: 'https://www.geeksforgeeks.org/packet-switching-and-delays-in-computer-network/',
      desc: 'Transmission Delay (L/R), Propagation Delay (d/s), Queuing Delay, Processing Delay, and Star/Mesh network topologies.'
    },
    video: {
      title: 'Gate Smashers: Delays in Computer Networks Formulas & Problems',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=sO7C12_nQ9M',
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
      url: 'https://www.geeksforgeeks.org/layers-of-osi-model/',
      desc: 'Physical, Data Link, Network, Transport, Session, Presentation, Application layers; Data Encapsulation and PDU names.'
    },
    video: {
      title: 'NetworkChuck: OSI Model Explained Step-by-Step',
      source: 'NetworkChuck (YouTube)',
      url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8',
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
      url: 'https://www.geeksforgeeks.org/cyclic-redundancy-check-python-code/',
      desc: 'Binary polynomial division, checksum generation, parity bits, and Hamming distance error correction.'
    },
    video: {
      title: 'Gate Smashers: CRC (Cyclic Redundancy Check) Solved Example',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=A9g6rTMblz4',
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
      url: 'https://www.geeksforgeeks.org/carrier-sense-multiple-access-csma/',
      desc: 'Pure ALOHA vs Slotted ALOHA throughput, 1-Persistent CSMA, Binary Exponential Backoff, and Collision Domains.'
    },
    video: {
      title: 'Gate Smashers: CSMA/CD Protocol Animation & Backoff Time',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=7u3Q5d0fCrs',
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
      url: 'https://www.geeksforgeeks.org/introduction-to-subnetting-and-cidr/',
      desc: 'Classful IPv4 vs CIDR slash notation, Subnet Masks, Network ID, Broadcast Address, and VLSM allocation.'
    },
    video: {
      title: 'Sunny Classroom: Subnetting Mastery for Beginners',
      source: 'Sunny Classroom (YouTube)',
      url: 'https://www.youtube.com/watch?v=s_Ntt6eTn94',
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
      url: 'https://www.geeksforgeeks.org/difference-between-distance-vector-routing-and-link-state-routing/',
      desc: 'Bellman-Ford algorithm, Count-to-Infinity problem, Split Horizon, Poison Reverse, and Dijkstra\'s Shortest Path algorithm.'
    },
    video: {
      title: 'Gate Smashers: Link State Routing Protocol (Dijkstra Walkthrough)',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=1_Ew1TqXqZ8',
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
      url: 'https://www.geeksforgeeks.org/user-datagram-protocol-udp-in-computer-network/',
      desc: '8-byte header layout, port multiplexing, 16-bit pseudo-header checksum computation, and low-latency streaming use cases.'
    },
    video: {
      title: 'PowerCert: TCP vs UDP Comparison & Port Numbers Explained',
      source: 'PowerCert Animated (YouTube)',
      url: 'https://www.youtube.com/watch?v=uwoD5YsGACg',
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
      url: 'https://www.geeksforgeeks.org/tcp-3-way-handshake-process/',
      desc: 'SYN, SYN-ACK, ACK sequence numbers, FIN / TIME_WAIT state machine, Sliding Window flow control, and Silly Window syndrome.'
    },
    video: {
      title: 'Hussein Nasser: TCP 3-Way Handshake & State Machine Deep Dive',
      source: 'Hussein Nasser (YouTube)',
      url: 'https://www.youtube.com/watch?v=bW_W1W712vI',
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
      url: 'https://www.geeksforgeeks.org/tcp-congestion-control/',
      desc: 'Congestion Window (cwnd), Slow Start Threshold (ssthresh), Additive Increase Multiplicative Decrease (AIMD), and Fast Recovery.'
    },
    video: {
      title: 'Gate Smashers: TCP Congestion Control Masterclass',
      source: 'Gate Smashers (YouTube)',
      url: 'https://www.youtube.com/watch?v=0qT7e7F3tYk',
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
      url: 'https://www.youtube.com/watch?v=27r4Bzuj5OI',
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
