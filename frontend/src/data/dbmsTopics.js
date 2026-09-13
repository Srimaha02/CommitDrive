// Database Management Systems Curriculum — 10 Topics (Calibrated Beginner -> Intermediate -> Advanced)
// Review Candidate: Draft v1.0 — Structured for editorial fact-checking against standard references

export const dbmsTopics = [
  {
    id: 'dbms-1',
    subjectId: 'dbms',
    order: 1,
    title: 'DBMS Architecture, 3-Schema Model & Data Independence',
    difficulty: 'Beginner',
    readTime: '8 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Think of a high-rise condominium building. The Physical Level is the hidden structural foundation underground—the concrete pillars, steel rebar, and water pipes (how data is physically stored in magnetic bits and disk blocks). The Conceptual Level is the official architectural floor plan—defining where walls stand, how many rooms each unit has, and what each room is called (the overall database tables and columns). The External Level is what individual residents see and customize: a tenant in apartment 4B paints their walls blue and puts up a curtain, while a tenant in 4C sets up a home gym (custom SQL views tailored for different end users). Changing the plumbing pipes underground doesn\'t force residents to repaint their living rooms.',
    what: 'A Database Management System (DBMS) is specialized system software designed to define, construct, manipulate, and share databases among multiple users and applications. Unlike primitive flat-file storage (such as saving data in simple CSV or text files), a DBMS provides structured data integrity, multi-user concurrency control, crash resilience, and declarative querying.\n\nTo decouple how applications interact with data from how that data is physically represented on storage drives, the ANSI/SPARC architecture introduced the 3-Schema Architecture: Physical, Conceptual, and External.\n\n1. Physical (Internal) Level: Describes the physical storage structures, disk block allocations, compression codecs, and access paths (such as B+ tree indexes and hash partitions) used to store raw records on hardware.\n2. Conceptual (Logical) Level: Describes the community-wide logical structure of the entire database—entities, data types, relationships, constraints, and security rules—without referencing physical storage.\n3. External (View) Level: Consists of individual user views. Different departments see only the data relevant to their job (e.g. the customer service team sees customer phone numbers, but the payroll team sees salary figures).',
    why: 'In early software systems, application code was tightly coupled to physical disk files. If a database administrator added a new column or migrated data from magnetic tape to a hard drive, thousands of lines of application code had to be rewritten and recompiled.\n\nThe 3-Schema model creates Data Independence:\n• Physical Data Independence: The ability to modify physical storage structures (e.g. changing indexes, splitting tables across SSDs, or reorganizing disk clusters) without having to alter the conceptual schema or rewrite application queries.\n• Logical Data Independence: The ability to modify the conceptual schema (e.g. adding a new table or column, or splitting an existing entity) without requiring existing user views and unchanged application programs to be modified.',
    useCase: 'Consider a banking application like JPMorgan Chase or Stripe. Thousands of microservices access the same central database cluster. The mobile banking app queries an External View that exposes only checking account balances and transaction history, intentionally omitting private risk scores and internal fraud flags.\n\nSimultaneously, database administrators can add clustered B-tree indexes or partition historical audit records across cost-effective cold cloud storage (Physical Level) at 2:00 AM on Sunday. Because of Physical Data Independence, the mobile banking app continues executing standard SQL queries without dropping a single connection or needing a code deployment.',
    example: `-- Example: Implementing External Views to provide Logical Data Independence
-- Conceptual Table: Contains full employee profile and private compensation data
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    ssn_tax_id VARCHAR(15) UNIQUE
);

-- External View for Project Managers: Excludes sensitive salary and SSN tax data
CREATE VIEW v_project_staff AS
SELECT 
    emp_id, 
    first_name, 
    last_name, 
    department
FROM employees;

-- Application query interacting with the External View safely
SELECT * FROM v_project_staff WHERE department = 'Engineering';`,
    exampleExplanation: [
      'Line 2-9: We define the Conceptual Schema table `employees`. It stores both public employee details and confidential information (`salary`, `ssn_tax_id`).',
      'Line 12-18: We create an External View `v_project_staff`. This defines an abstraction layer that selects only the non-sensitive columns needed by project managers.',
      'Data Security: End users querying `v_project_staff` cannot view or accidentally leak employee salaries or social security numbers.',
      'Logical Independence: If the database administrator later adds a new column `performance_bonus` to the underlying table, `v_project_staff` remains 100% stable without code breaks.',
      'Line 21: Application queries interact with the view as if it were a physical table, completely isolated from schema modifications.'
    ],
    interviewQuestions: [
      {
        id: 'dbms-1-q1',
        question: 'What is the 3-Schema Architecture (ANSI/SPARC) in DBMS, and what are its three levels?',
        companyTags: ['Amazon', 'Oracle', 'TCS'],
        frequency: 'High',
        answer: 'The 3-Schema Architecture organizes a database into three abstraction tiers to separate user views from physical storage:\n1. Physical (Internal) Level: Describes physical storage representation, disk block structures, compression, and indexes.\n2. Conceptual (Logical) Level: Describes the global structure of the entire database (entities, relationships, data types, constraints).\n3. External (View) Level: Custom views tailored for specific user groups, hiding unnecessary or confidential data.'
      },
      {
        id: 'dbms-1-q2',
        question: 'What is the difference between Physical Data Independence and Logical Data Independence?',
        companyTags: ['Microsoft', 'Infosys', 'Cognizant'],
        frequency: 'Very High',
        answer: '• Physical Data Independence: The capacity to modify physical storage schemas (e.g. changing indexes, compression, file organizations, or storage devices) without altering the conceptual schema or application code.\n• Logical Data Independence: The capacity to modify the conceptual schema (e.g. adding new tables, columns, or relationships) without breaking existing external views or applications that do not use the changed data.\n• Difficulty: Logical data independence is significantly harder to achieve than physical data independence.'
      },
      {
        id: 'dbms-1-q3',
        question: 'Why is a DBMS preferred over traditional File Processing Systems?',
        companyTags: ['Google', 'Wipro', 'Accenture'],
        frequency: 'High',
        answer: 'Traditional file systems suffer from:\n1. Data Redundancy and Inconsistency: Duplicate copies of data in different files lead to contradictory records.\n2. Difficulty in Accessing Data: New ad-hoc queries require writing new custom programs.\n3. Concurrency Anomalies: Lack of ACID transaction isolation causes race conditions.\n4. Integrity Problems: Constraints cannot be enforced globally.\nA DBMS resolves all these with centralized schemas, declarative SQL, ACID transactions, and access control.'
      },
      {
        id: 'dbms-1-q4',
        question: 'What is the difference between a Database Schema and a Database Instance?',
        companyTags: ['Oracle', 'TCS', 'Capgemini'],
        frequency: 'High',
        answer: '• Database Schema: The overall structural blueprint and design of the database (table names, column types, constraints). It is defined during database design and rarely changes.\n• Database Instance: The actual collection of information and records stored in the database at a specific moment in time (the snapshot of data). The instance changes frequently as rows are inserted, updated, and deleted.'
      },
      {
        id: 'dbms-1-q5',
        question: 'What is a Database View, and does it consume physical disk storage for data rows?',
        companyTags: ['Amazon', 'Flipkart'],
        frequency: 'Medium',
        answer: 'A standard View is a virtual table defined by a stored SQL query. It does not store actual data rows on disk; instead, whenever an application queries the view, the DBMS dynamically executes the underlying SQL query against base tables.\n\nException — Materialized Views: A materialized view does store precomputed query results physically on disk to accelerate expensive analytical queries, requiring periodic refreshes when underlying tables change.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-1-fc1',
        front: 'What are the three tiers of the ANSI/SPARC 3-Schema Architecture?',
        back: 'Physical (Internal) Level, Conceptual (Logical) Level, and External (View) Level.',
        keyTakeaway: 'The 3-schema model decouples user queries from physical disk layouts.'
      },
      {
        id: 'dbms-1-fc2',
        front: 'What is Physical Data Independence?',
        back: 'The ability to change physical storage structures (e.g. adding B-tree indexes) without altering the logical schema or queries.',
        keyTakeaway: 'Physical data independence protects applications from storage-layer refactoring.'
      },
      {
        id: 'dbms-1-fc3',
        front: 'What is Logical Data Independence?',
        back: 'The ability to modify conceptual tables and attributes without breaking existing external views or user queries.',
        keyTakeaway: 'Logical data independence ensures application stability during schema expansion.'
      },
      {
        id: 'dbms-1-fc4',
        front: 'What is the difference between a database schema and a database instance?',
        back: 'The schema is the static structural design/definition; the instance is the dynamic snapshot of data rows at a specific time.',
        keyTakeaway: 'Schema = architectural design; Instance = live data snapshot.'
      },
      {
        id: 'dbms-1-fc5',
        front: 'Does a standard SQL View duplicate data rows on disk?',
        back: 'No; standard views are virtual tables representing stored queries that execute on-the-fly against base tables.',
        keyTakeaway: 'Standard views provide security and abstraction without duplicating data storage.'
      }
    ]
  },
  {
    id: 'dbms-2',
    subjectId: 'dbms',
    order: 2,
    title: 'Relational Model, Keys & Relational Algebra Operators',
    difficulty: 'Beginner',
    readTime: '8 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine a school administration office using spreadsheets. A Relation is simply a single spreadsheet tab (a Table). Each horizontal row across the sheet represents one specific student (a Tuple). Each vertical column has a specific heading like "Date of Birth" or "Email" (an Attribute). To ensure no two students get mixed up, the school issues a unique Student ID badge number that no other student in history can ever hold—that is the Primary Key. When the school tracks which student borrowed a library book, the library spreadsheet simply records the student\'s badge number—that is a Foreign Key connecting the two sheets.',
    what: 'Introduced by Edgar F. Codd in 1970, the Relational Model represents database data as a collection of two-dimensional Relations (Tables). Mathematically, a relation is a subset of the Cartesian product of a list of domains. In database terminology, a table consists of Tuples (horizontal rows representing individual records), Attributes (vertical columns representing named properties), and Domains (the set of allowable atomic data values for an attribute).\n\nIntegrity constraints enforce database correctness:\n1. Entity Integrity: In any base relation, no primary key attribute value can be NULL, ensuring every tuple can always be uniquely identified.\n2. Referential Integrity: A foreign key value in a referencing relation must either match a valid primary key value in the referenced relation, or be NULL.\n3. Domain Integrity: Every column value must belong to the declared data type and value range.\n\nKeys are fundamental to the relational model:\n• Super Key: Any set of one or more attributes that uniquely identifies a tuple within a relation.\n• Candidate Key: A minimal Super Key (a super key from which no attribute can be removed without losing uniqueness).\n• Primary Key: The single candidate key officially chosen by the database architect to uniquely identify tuples.\n• Alternate Key: Candidate keys that were not chosen as the primary key.\n• Foreign Key: An attribute in one table that references the primary key of another table to establish relationships.\n\nRelational Algebra is the formal procedural mathematical query language underlying SQL. Its core operators include: Selection ($\\sigma$, filtering rows), Projection ($\\pi$, selecting columns), Cartesian Product ($\\times$), Union ($\\cup$), Set Difference ($-$), and Natural Join ($\\bowtie$).',
    why: 'Before the relational model, databases used Hierarchical or Network models that stored records as complex physical pointers and graph trees on disk. Querying data required writing procedural traversal loops following physical disk pointers. If a pointer broke or the database structure changed, all navigation code failed.\n\nThe Relational Model revolutionized data processing by separating the mathematical logical relationship between data from the underlying physical storage pointers, enabling declarative querying where users state *what* data they want, leaving the query engine to decide *how* to fetch it.',
    useCase: 'Consider an e-commerce platform like Shopify or Amazon. The platform maintains an `orders` table and a `customers` table. The `orders` table includes a `customer_id` Foreign Key referencing `customers(customer_id)`. Referential integrity enforced by the database engine guarantees that an order can never be recorded for a non-existent customer.\n\nWhen a customer deletes their account, the database engine enforces referential rules (such as `ON DELETE CASCADE` to delete associated records, or `ON DELETE RESTRICT` to reject deletion if pending orders exist), preventing corrupted orphaned records.',
    example: `-- Example: Enforcing Primary Keys, Candidate Keys, and Foreign Key Constraints
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL UNIQUE -- Candidate key / Alternate key
);

CREATE TABLE professors (
    prof_id INT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,   -- Candidate key / Alternate key
    full_name VARCHAR(100) NOT NULL,
    dept_id INT,
    -- Referential Integrity: Foreign Key constraint
    CONSTRAINT fk_dept 
        FOREIGN KEY (dept_id) 
        REFERENCES departments(dept_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Relational Algebra conceptual query:
-- Find the names of all professors in department 101:
-- Expression: \\pi_{full_name} ( \\sigma_{dept_id = 101} (professors) )`,
    exampleExplanation: [
      'Line 2-5: `departments` table defines `dept_id` as the Primary Key and `dept_name` as a UNIQUE Candidate Key.',
      'Line 7-18: `professors` table defines `prof_id` as Primary Key and `email` as an Alternate Key.',
      'Line 13-17: The Foreign Key `fk_dept` enforces referential integrity: any `dept_id` inserted into `professors` must exist in `departments`.',
      'Referential Action: `ON DELETE RESTRICT` prevents deleting a department if professors are currently assigned to it.',
      'Relational Algebra: `\\sigma_{dept_id=101}` filters rows (Selection), and `\\pi_{full_name}` extracts the name column (Projection).'
    ],
    interviewQuestions: [
      {
        id: 'dbms-2-q1',
        question: 'What is the difference between a Super Key, Candidate Key, and Primary Key?',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: '• Super Key: Any set of one or more attributes that uniquely identifies a row in a relation. May contain redundant attributes.\n• Candidate Key: A minimal super key; no proper subset of its attributes can uniquely identify a row.\n• Primary Key: The single candidate key selected by the database designer to uniquely identify tuples in the table. Primary keys cannot contain NULL values.\n• Alternate Key: Any candidate key not selected as the primary key.'
      },
      {
        id: 'dbms-2-q2',
        question: 'What is the Referential Integrity Constraint, and what are the standard ON DELETE actions?',
        companyTags: ['Oracle', 'TCS', 'Infosys'],
        frequency: 'High',
        answer: 'Referential Integrity dictates that a Foreign Key attribute must either match an existing Primary Key value in the referenced relation or be NULL, preventing orphaned records.\n\nStandard ON DELETE actions:\n1. CASCADE: Automatically deletes all child rows referencing the deleted parent row.\n2. RESTRICT / NO ACTION: Rejects the deletion of the parent row if any child rows reference it.\n3. SET NULL: Sets the foreign key column in child rows to NULL upon parent deletion.\n4. SET DEFAULT: Sets the foreign key column to a default predefined value.'
      },
      {
        id: 'dbms-2-q3',
        question: 'What are the basic operators in Relational Algebra?',
        companyTags: ['Microsoft', 'Cisco', 'Wipro'],
        frequency: 'High',
        answer: 'Fundamental Relational Algebra operators:\n1. Selection ($\\\\sigma$): Selects a subset of tuples that satisfy a given predicate condition (horizontal filtering).\n2. Projection ($\\\\pi$): Selects specified attributes and eliminates all others (vertical filtering).\n3. Union ($\\\\cup$): Combines tuples from two union-compatible relations, removing duplicates.\n4. Set Difference ($-$): Finds tuples in relation $R$ that are not present in relation $S$.\n5. Cartesian Product ($\\\\times$): Combines every tuple of $R$ with every tuple of $S$.\n6. Rename ($\\\\rho$): Renames an output relation or attributes.'
      },
      {
        id: 'dbms-2-q4',
        question: 'What is the difference between a Natural Join and an Equi-Join in relational algebra?',
        companyTags: ['Apple', 'Uber', 'Qualcomm'],
        frequency: 'High',
        answer: '• Equi-Join: A theta join where the join condition uses exclusively the equality operator ($=$) between specified columns (e.g. $R \\\\bowtie_{R.A = S.B} S$). Both columns appear in the result, even if they have identical values.\n• Natural Join ($R \\\\bowtie S$): An equi-join performed automatically over all attributes that have the same name in both relations. In the output, duplicate common columns are eliminated (projected out).'
      },
      {
        id: 'dbms-2-q5',
        question: 'Can a table have multiple candidate keys? Can a primary key contain NULL values?',
        companyTags: ['Amazon', 'Cognizant', 'Flipkart'],
        frequency: 'High',
        answer: '• Yes, a table can have multiple Candidate Keys (e.g. `employee_id`, `ssn`, `work_email` can all uniquely identify an employee).\n• No, a Primary Key can NEVER contain NULL values due to the Entity Integrity Constraint. If a primary key attribute contained NULL, the tuple could not be uniquely identified or referenced by foreign keys.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-2-fc1',
        front: 'What is a Candidate Key in relational databases?',
        back: 'A minimal super key—a set of columns that uniquely identifies a row with zero redundant attributes.',
        keyTakeaway: 'Candidate keys are minimal super keys; one is chosen as the Primary Key.'
      },
      {
        id: 'dbms-2-fc2',
        front: 'What does the Entity Integrity Constraint state?',
        back: 'No attribute participating in a Primary Key can have a NULL value.',
        keyTakeaway: 'Entity integrity guarantees that every row has a unique, non-null identifier.'
      },
      {
        id: 'dbms-2-fc3',
        front: 'What does the Selection operator ($\\sigma$) do in relational algebra?',
        back: 'Filters tuples (rows) that satisfy a specific boolean condition.',
        keyTakeaway: 'Selection ($\\sigma$) filters rows; Projection ($\\pi$) filters columns.'
      },
      {
        id: 'dbms-2-fc4',
        front: 'What happens with ON DELETE CASCADE in a foreign key relationship?',
        back: 'Deleting a parent row automatically deletes all corresponding child rows referencing that parent.',
        keyTakeaway: 'CASCADE propagates deletions to prevent orphaned records.'
      },
      {
        id: 'dbms-2-fc5',
        front: 'What is the Cartesian Product (Cross Join) of two tables with $M$ and $N$ rows?',
        back: 'A relation containing $M \\times N$ rows pairing every row of the first table with every row of the second.',
        keyTakeaway: 'Cartesian Product produces all combinations of tuples from both tables.'
      }
    ]
  },
  {
    id: 'dbms-3',
    subjectId: 'dbms',
    order: 3,
    title: 'SQL Fundamentals, Query Execution Order & Grouping',
    difficulty: 'Beginner',
    readTime: '8 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Think of ordering food at a busy sandwich deli. The written menu (the SQL syntax) lists items in a familiar order: Sandwich Name (SELECT), Ingredients (FROM), Customizations (WHERE), Extras (GROUP BY). However, the deli chef in the kitchen does not prepare your sandwich in that order! The chef first pulls bread from the pantry (FROM), discards stale bread (WHERE), batches similar orders together (GROUP BY), checks if the batch meets order minimums (HAVING), plates the sandwich (SELECT), removes duplicate crumbs (DISTINCT), sorts the finished trays (ORDER BY), and hands the top 5 trays to the counter (LIMIT). The order you write SQL is not the order the database executes it.',
    what: 'Structured Query Language (SQL) is the standard declarative language for interacting with relational database management systems. SQL commands are traditionally categorized into sub-languages:\n• Data Definition Language (DDL): Statements that define and modify schema structures (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`).\n• Data Manipulation Language (DML): Statements that insert, modify, and delete data rows (`INSERT`, `UPDATE`, `DELETE`).\n• Data Query Language (DQL): Statements that retrieve data (`SELECT`).\n• Data Control Language (DCL): Statements that manage permissions and access (`GRANT`, `REVOKE`).\n• Transaction Control Language (TCL): Statements that manage transactions (`COMMIT`, `ROLLBACK`, `SAVEPOINT`).\n\nWhile a standard SQL query is syntactically written starting with `SELECT`, the database query engine executes the clauses in a strictly defined logical sequence:\n1. `FROM` and `JOIN`: Identifies source tables and builds the Cartesian/join working set.\n2. `WHERE`: Filters individual rows before grouping (cannot use aggregate functions).\n3. `GROUP BY`: Aggregates the remaining rows into distinct summary buckets.\n4. `HAVING`: Filters aggregated group buckets (evaluates aggregate conditions like `COUNT(*) > 5`).\n5. `SELECT`: Computes column expressions and assigns column aliases.\n6. `DISTINCT`: Eliminates duplicate output rows.\n7. `ORDER BY`: Sorts the final output rows.\n8. `LIMIT` / `OFFSET`: Restricts the final number of returned rows.',
    why: 'Understanding the logical query execution order is the single most important skill for writing bug-free SQL queries. Beginning developers frequently encounter perplexing errors like "column alias not found in WHERE clause" or "aggregate functions not allowed in WHERE clause".\n\nThese errors occur because the `WHERE` clause executes at Step 2, long before the `SELECT` clause computes aliases at Step 5. Similarly, `WHERE` evaluates row-by-row before groups are formed, making aggregate calculations like `WHERE AVG(salary) > 50000` syntactically impossible. Using `HAVING` at Step 4 correctly filters aggregated group statistics.',
    useCase: 'In financial analytics dashboards (like analyzing credit card transactions), queries constantly aggregate millions of swipe records. An analyst needs to find "departments with more than 10 employees whose average project budget exceeds $100,000".\n\nThe query filters out inactive employees first in the `WHERE` clause (reducing millions of rows to thousands), groups by `department_id`, applies `HAVING COUNT(*) > 10 AND AVG(budget) > 100000`, and sorts by budget in descending order with an `ORDER BY` clause, returning clean aggregated executive intelligence in milliseconds.',
    example: `-- Example: Aggregating Department Salaries with WHERE, GROUP BY, and HAVING
SELECT 
    department,
    COUNT(emp_id) AS total_staff,
    ROUND(AVG(salary), 2) AS avg_salary,
    MAX(salary) AS highest_salary
FROM employees
WHERE is_active = TRUE               -- Step 1: Filter individual rows BEFORE grouping
GROUP BY department                  -- Step 2: Group remaining rows by department
HAVING COUNT(emp_id) >= 5            -- Step 3: Filter groups with 5 or more staff
   AND AVG(salary) > 60000           -- Step 3b: Filter groups with avg salary > 60k
ORDER BY avg_salary DESC             -- Step 4: Sort aggregated result
LIMIT 3;                             -- Step 5: Return top 3 highest paying departments;`,
    exampleExplanation: [
      'Step 1 (FROM & WHERE): The database reads `employees` and filters rows where `is_active = TRUE`. Inactive employees are dropped immediately.',
      'Step 2 (GROUP BY): The remaining active employees are partitioned into distinct buckets based on their `department`.',
      'Step 3 (HAVING): Evaluates group statistics: departments with fewer than 5 active staff or an average salary under 60,000 are pruned.',
      'Step 4 (SELECT): Only for the surviving departments, the engine computes column aliases (`total_staff`, `avg_salary`, `highest_salary`).',
      'Step 5 (ORDER BY & LIMIT): Sorts the surviving departments from highest average salary to lowest and returns the top 3 rows.'
    ],
    interviewQuestions: [
      {
        id: 'dbms-3-q1',
        question: 'What is the exact logical execution order of an SQL query?',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: 'The logical query processing order is:\n1. FROM & JOIN (load tables and join data)\n2. WHERE (filter rows)\n3. GROUP BY (aggregate into groups)\n4. HAVING (filter groups)\n5. SELECT (evaluate expressions & aliases)\n6. DISTINCT (remove duplicate rows)\n7. ORDER BY (sort output rows)\n8. LIMIT / OFFSET (slice final row count)'
      },
      {
        id: 'dbms-3-q2',
        question: 'What is the difference between the WHERE clause and the HAVING clause?',
        companyTags: ['Oracle', 'TCS', 'Infosys'],
        frequency: 'Very High',
        answer: '• WHERE Clause: Filters individual rows BEFORE grouping and aggregation occur. Cannot contain aggregate functions (like `SUM()`, `AVG()`).\n• HAVING Clause: Filters groups of rows AFTER the `GROUP BY` clause has formed group buckets. Can contain aggregate conditions (e.g. `HAVING COUNT(*) > 5`).'
      },
      {
        id: 'dbms-3-q3',
        question: 'Why can\'t you use a column alias defined in the SELECT clause inside the WHERE clause?',
        companyTags: ['Microsoft', 'Goldman Sachs', 'Adobe'],
        frequency: 'High',
        answer: 'Because of the logical query execution order: the `WHERE` clause is evaluated at Step 2, while the `SELECT` clause (where the alias is defined) is evaluated at Step 5. When the query engine filters rows in the `WHERE` clause, the alias does not exist yet. However, you CAN use the alias in the `ORDER BY` clause (Step 7).'
      },
      {
        id: 'dbms-3-q4',
        question: 'What is the difference between DELETE, TRUNCATE, and DROP?',
        companyTags: ['Amazon', 'Wipro', 'Cognizant'],
        frequency: 'Very High',
        answer: '• DELETE: DML command. Deletes specific rows matching a `WHERE` clause. Generates undo logs row-by-row; can be rolled back inside a transaction. Fires database triggers.\n• TRUNCATE: DDL command. Rapidly deallocates all data pages in a table. Does not log individual row deletions; cannot be filtered with `WHERE`. Resets identity counters. Extremely fast.\n• DROP: DDL command. Completely removes the entire table data and its schema definition from the database catalog.'
      },
      {
        id: 'dbms-3-q5',
        question: 'How does SQL handle NULL in arithmetic operations and boolean logic (Three-Valued Logic)?',
        companyTags: ['Apple', 'Uber', 'TCS'],
        frequency: 'High',
        answer: '• Arithmetic: Any arithmetic operation involving NULL results in NULL (e.g. `salary + NULL = NULL`).\n• Boolean Logic: SQL uses Three-Valued Logic: `TRUE`, `FALSE`, and `UNKNOWN`. Comparisons like `col = NULL` or `col != NULL` evaluate to `UNKNOWN`, not `TRUE` or `FALSE`! This is why queries must use `IS NULL` and `IS NOT NULL`.\n• Aggregate Functions: Aggregates like `AVG()` and `SUM()` ignore NULL values, whereas `COUNT(*)` counts all rows including NULLs.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-3-fc1',
        front: 'What is the logical order of execution for SQL SELECT, WHERE, FROM, GROUP BY, and HAVING?',
        back: '1. FROM, 2. WHERE, 3. GROUP BY, 4. HAVING, 5. SELECT.',
        keyTakeaway: 'FROM runs first; SELECT runs after grouping and filtering.'
      },
      {
        id: 'dbms-3-fc2',
        front: 'Can aggregate functions like `SUM()` or `COUNT()` be used in a WHERE clause?',
        back: 'No; WHERE filters rows before aggregation occurs. Aggregate filtering belongs in HAVING.',
        keyTakeaway: 'Use WHERE for individual rows and HAVING for aggregated group metrics.'
      },
      {
        id: 'dbms-3-fc3',
        front: 'Why does `WHERE status = NULL` fail to return rows with NULL values in SQL?',
        back: 'NULL is an unknown state, not a value; equality comparisons evaluate to UNKNOWN. You must use `IS NULL`.',
        keyTakeaway: 'Always use IS NULL and IS NOT NULL to test for missing data.'
      },
      {
        id: 'dbms-3-fc4',
        front: 'What is the key performance difference between TRUNCATE and DELETE?',
        back: 'TRUNCATE deallocates data pages as a DDL operation without row-by-row logging, making it orders of magnitude faster.',
        keyTakeaway: 'TRUNCATE is fast page-level deallocation; DELETE is row-by-row DML.'
      },
      {
        id: 'dbms-3-fc5',
        front: 'Does the `COUNT(column_name)` aggregate function include NULL values?',
        back: 'No; `COUNT(column)` ignores NULL values, whereas `COUNT(*)` counts total rows regardless of NULLs.',
        keyTakeaway: 'COUNT(col) counts non-null values; COUNT(*) counts all physical rows.'
      }
    ]
  },
  {
    id: 'dbms-4',
    subjectId: 'dbms',
    order: 4,
    title: 'Advanced SQL: Subqueries, CTEs & Window Functions',
    difficulty: 'Intermediate',
    readTime: '9 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine an Olympic marathon leaderboard. A standard `GROUP BY` query is like taking all runners from Kenya and replacing them with a single summary card saying "Average time: 2 hours 10 minutes"—individual runner rows vanish. A Window Function is like letting every runner keep their individual finish line photo and runner bib, while printing an overlay ribbon across their chest showing "Rank: 2nd place overall, 45 seconds behind the leader". You get both fine-grained row details and calculated group analytics simultaneously.',
    what: 'Advanced SQL expands relational data retrieval beyond simple filtering and grouping through Subqueries, Common Table Expressions (CTEs), and Window Functions.\n\nA Subquery is an SQL query nested inside another query (in `SELECT`, `FROM`, or `WHERE`). Subqueries are categorized as Non-Correlated (the inner query executes once independently and hands its result to the outer query) or Correlated (the inner query references a column from the outer query, evaluating once for every single candidate row in the outer query).\n\nA Common Table Expression (CTE), defined using the `WITH` clause, creates a named temporary result set valid only within the execution scope of a single statement. CTEs vastly improve query readability compared to messy nested subqueries and enable Recursive Queries (essential for traversing hierarchical org charts and graph trees).\n\nWindow Functions perform calculations across a set of table rows that are related to the current row, without collapsing the rows into a single summary output like `GROUP BY`. Using the `OVER (PARTITION BY ... ORDER BY ...)` clause, window functions provide analytical ranking (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`), value offset analysis (`LEAD()`, `LAG()`), and running totals/moving averages (`SUM() OVER (...)`).',
    why: 'In real-world engineering, business analytics questions frequently require comparing an individual row against a summary metric—such as finding the top 3 highest-paid employees in *each* department, calculating monthly revenue growth percentages, or detecting duplicate login events.\n\nWithout window functions, engineers had to write complex multi-table self-joins or nested correlated subqueries that executed in $O(N^2)$ quadratic time. Window functions allow the database engine to perform ranking and running calculations in a single optimized $O(N \\log N)$ scan across memory partitions.',
    useCase: 'In financial banking and fintech transaction monitoring, fraud detection algorithms use the `LAG()` window function to inspect the time gap between consecutive card swipes. If a card was swiped in New York, and the `LAG(swipe_time, 1) OVER (PARTITION BY card_id ORDER BY swipe_time)` reveals a swipe in London only 15 minutes earlier, the engine flags an impossible travel fraud alert.\n\nIn subscription billing platforms like Stripe, analysts calculate month-over-month revenue retention using recursive CTEs to generate continuous calendar date series and aggregate active subscriber cohorts.',
    example: `-- Example: Department Ranking and Running Totals using Window Functions
WITH RankedEmployees AS (
    SELECT 
        emp_id,
        first_name,
        department,
        salary,
        -- 1. Rank employees within each department by salary
        DENSE_RANK() OVER (
            PARTITION BY department 
            ORDER BY salary DESC
        ) AS salary_rank_in_dept,
        -- 2. Calculate running total of department salary budget
        SUM(salary) OVER (
            PARTITION BY department 
            ORDER BY salary DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS dept_running_salary_total
    FROM employees
)
-- Fetch top 2 highest earners from every department
SELECT 
    department, 
    salary_rank_in_dept, 
    first_name, 
    salary, 
    dept_running_salary_total
FROM RankedEmployees
WHERE salary_rank_in_dept <= 2
ORDER BY department, salary_rank_in_dept;`,
    exampleExplanation: [
      'Line 2: `WITH RankedEmployees AS (...)` defines a clean Common Table Expression (CTE) for readability.',
      'Line 8-11: `DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)` partitions data by department and assigns ranks without gaps.',
      'Line 13-17: `SUM(salary) OVER (...)` computes an accumulated running salary budget for each department as rows are processed.',
      'Line 21-27: The outer query references the CTE and applies `WHERE salary_rank_in_dept <= 2` to extract the top 2 earners per department.',
      'Efficiency: The entire ranking and running sum were computed in a single pass without any self-joins!'
    ],
    interviewQuestions: [
      {
        id: 'dbms-4-q1',
        question: 'What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: 'When ranking tied values (e.g. two employees tied with a salary of $100,000):\n• ROW_NUMBER(): Assigns a unique sequential integer to each row regardless of ties (1, 2, 3, 4).\n• RANK(): Assigns the same rank to tied rows, but skips subsequent rank numbers (1, 2, 2, 4).\n• DENSE_RANK(): Assigns the same rank to tied rows, but does NOT skip any rank numbers (1, 2, 2, 3).'
      },
      {
        id: 'dbms-4-q2',
        question: 'What is the difference between a Correlated Subquery and a Non-Correlated Subquery?',
        companyTags: ['Oracle', 'Apple', 'Infosys'],
        frequency: 'High',
        answer: '• Non-Correlated Subquery: Operates independently of the outer query. It executes exactly once, produces a result, and passes it to the outer query. Runs in $O(N)$ time.\n• Correlated Subquery: References columns from the outer query table in its `WHERE` clause. It must be evaluated repeatedly once for every single row examined by the outer query, resulting in potential $O(N \\times M)$ performance bottlenecks.'
      },
      {
        id: 'dbms-4-q3',
        question: 'What is a Common Table Expression (CTE), and when is a Recursive CTE needed?',
        companyTags: ['Uber', 'Meta', 'Goldman Sachs'],
        frequency: 'High',
        answer: 'A CTE is a named temporary result set defined with the `WITH` clause that exists only during query execution, enhancing modularity and readability.\n\nA Recursive CTE references itself. It consists of an Anchor Member (base query) and a Recursive Member joined by `UNION ALL`. It is required for querying hierarchical or graph structures, such as organizational manager-employee hierarchies, category trees, and bill-of-materials networks.'
      },
      {
        id: 'dbms-4-q4',
        question: 'What do the LEAD() and LAG() window functions do?',
        companyTags: ['Salesforce', 'Flipkart', 'TCS'],
        frequency: 'High',
        answer: '• LAG(column, offset, default): Accesses data from a preceding row at a specified physical offset within the partition without a self-join. Ideal for calculating growth compared to the previous month.\n• LEAD(column, offset, default): Accesses data from a subsequent row at a specified physical offset within the partition. Ideal for computing the time elapsed until the next user action.'
      },
      {
        id: 'dbms-4-q5',
        question: 'How do Window Functions differ from GROUP BY in terms of row preservation?',
        companyTags: ['Microsoft', 'Cisco', 'Cognizant'],
        frequency: 'High',
        answer: '• GROUP BY: Collapses multiple individual rows into a single summary output row per group. All original row-level details (such as individual IDs and timestamps) are lost unless included in the group key or aggregated.\n• Window Functions: Compute aggregate and ranking calculations across a partition while preserving all original individual input rows intact in the output.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-4-fc1',
        front: 'What is the difference between RANK() and DENSE_RANK() on ties?',
        back: 'RANK() skips subsequent rank numbers after a tie (1, 2, 2, 4); DENSE_RANK() never skips numbers (1, 2, 2, 3).',
        keyTakeaway: 'DENSE_RANK leaves no gaps in numbering.'
      },
      {
        id: 'dbms-4-fc2',
        front: 'What is a Correlated Subquery?',
        back: 'A nested query that references values from the outer query and must re-execute for each outer row.',
        keyTakeaway: 'Correlated subqueries execute once per outer row, impacting performance.'
      },
      {
        id: 'dbms-4-fc3',
        front: 'What does the LAG() window function allow you to do?',
        back: 'Access data from a previous row in the partition without writing a complex self-join.',
        keyTakeaway: 'LAG() enables simple period-over-period comparisons.'
      },
      {
        id: 'dbms-4-fc4',
        front: 'Does a Window Function collapse rows like GROUP BY does?',
        back: 'No; window functions preserve all individual row records while calculating aggregate metrics.',
        keyTakeaway: 'Window functions retain row granularity with partition calculations.'
      },
      {
        id: 'dbms-4-fc5',
        front: 'What clause defines the partitioning and ordering in a Window Function?',
        back: 'The OVER (PARTITION BY ... ORDER BY ...) clause.',
        keyTakeaway: 'The OVER clause establishes the analytical window frame.'
      }
    ]
  },
  {
    id: 'dbms-5',
    subjectId: 'dbms',
    order: 5,
    title: 'ER Modeling & Relational Schema Mapping',
    difficulty: 'Intermediate',
    readTime: '9 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine an architect drawing blueprints for a hospital. The architect sketches rectangles for Doctors and Patients, diamonds for "Treats", and double ovals for emergency contact phone numbers. This conceptual diagram is an Entity-Relationship (ER) model. When construction workers actually build the physical hospital, they don\'t build abstract drawings; they pour concrete walls, lay electrical wires, and build patient admission desks. Translating the blueprint into actual tables, primary keys, and foreign-key junction tables is Relational Schema Mapping.',
    what: 'Entity-Relationship (ER) Modeling is a high-level conceptual data modeling methodology developed by Peter Chen in 1976. It represents the enterprise schema visually as entities, attributes, and relationships before physical database design begins.\n\nKey ER concepts include:\n• Entity: An identifiable real-world object or concept (e.g. `Student`, `Course`).\n• Weak Entity: An entity that lacks a primary key and cannot exist without an identifying owner entity (e.g. `Dependent` of an `Employee`). Identified via an Identifying Relationship and a Partial Key (discriminator).\n• Attributes: Characteristics of entities (Simple, Composite like `FullName(First, Last)`, Single-Valued, Multi-Valued like `{PhoneNumbers}`, and Derived like `Age` computed from `DOB`).\n• Cardinality Ratios: 1:1 (One-to-One), 1:N (One-to-Many), and M:N (Many-to-Many).\n• Participation Constraints: Total Participation (every entity instance must be involved in the relationship, indicated by double lines) vs Partial Participation.\n\nRelational Schema Mapping converts ER diagrams into concrete relational tables:\n1. 1:1 Relationship: Merges tables or places the primary key of one table as a foreign key in the other with a UNIQUE constraint.\n2. 1:N Relationship: Places the primary key of the "1" side as a foreign key on the "N" side.\n3. M:N Relationship: Must be mapped into a separate Junction (Associative) Table containing foreign keys referencing both participating entities as a composite primary key.\n4. Multi-Valued Attribute: Mapped into a new separate table with foreign key reference back to the owner.',
    why: 'Directly creating database tables without formal conceptual ER modeling leads to terrible database designs: missing foreign keys, circular dependencies, duplicated data columns, and unmanageable many-to-many relationship traps.\n\nER modeling provides a common communication bridge between non-technical business stakeholders (who understand domain rules like "a doctor can treat many patients") and database architects, ensuring the data schema faithfully mirrors real-world business rules before writing code.',
    useCase: 'Consider designing a university course enrollment system. A `Student` can enroll in many `Courses`, and a `Course` has many `Students` (an M:N relationship). If a naive developer tried to store an array of course IDs in a single column in the student table, searching for course enrollments would be disastrously slow and violate relational 1NF.\n\nBy following ER mapping rules, the engineer creates an `enrollments` junction table with `student_id` and `course_id` forming a composite primary key, along with relationship attributes like `enrollment_date` and `final_grade`.',
    example: `-- Example: Mapping an M:N Relationship (Students <-> Courses) into a Junction Table
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credits INT CHECK (credits > 0)
);

-- Junction Table mapping the M:N "Enrolls" Relationship
CREATE TABLE enrollments (
    student_id INT,
    course_id VARCHAR(10),
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    grade CHAR(2),
    -- Composite Primary Key: A student can enroll in a specific course only once
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);`,
    exampleExplanation: [
      'Line 2-7 & 9-13: Independent entity tables `students` and `courses` are created with their own primary keys.',
      'Line 16-26: The M:N relationship requires the `enrollments` junction table.',
      'Composite Primary Key: `PRIMARY KEY (student_id, course_id)` guarantees uniqueness—a student cannot accidentally enroll in CS101 twice in the same semester.',
      'Relationship Attributes: Attributes of the enrollment itself (`enrollment_date`, `grade`) are cleanly stored in the junction table.',
      'Cascade Deletes: If a course is canceled, all enrollment records for that course are cleanly cascaded.'
    ],
    interviewQuestions: [
      {
        id: 'dbms-5-q1',
        question: 'How do you map a Many-to-Many (M:N) relationship into relational database tables?',
        companyTags: ['Amazon', 'Google', 'TCS'],
        frequency: 'Very High',
        answer: 'An M:N relationship cannot be represented with a single foreign key in either participating entity. It must be mapped into a separate Junction (Associative / Bridge) Table:\n1. The junction table includes foreign keys referencing the primary keys of both participating entity tables.\n2. The composite primary key of the junction table is formed by combining both foreign keys.\n3. Any descriptive attributes of the relationship (e.g. `enrollment_date`, `score`) become columns in this junction table.'
      },
      {
        id: 'dbms-5-q2',
        question: 'What is a Weak Entity, and how is it mapped to a relational schema?',
        companyTags: ['Oracle', 'Microsoft', 'Infosys'],
        frequency: 'High',
        answer: 'A Weak Entity is an entity that does not possess a primary key of its own and depends on the existence of an identifying strong entity (e.g. `Dependents` of an `Employee`). It has a Partial Key (discriminator).\n\nMapping: Create a table for the weak entity. Its primary key is formed by combining the partial key with the primary key of the identifying strong entity (as a foreign key with `ON DELETE CASCADE`).'
      },
      {
        id: 'dbms-5-q3',
        question: 'How do you map a Multi-Valued Attribute (such as multiple phone numbers) into relational tables?',
        companyTags: ['Cisco', 'Wipro', 'Cognizant'],
        frequency: 'High',
        answer: 'A multi-valued attribute cannot remain as a list in a single column because it violates First Normal Form (1NF).\n\nMapping: Create a new separate table. Include a foreign key referencing the primary key of the owner entity, and include a column for the attribute value. The primary key of the new table is the composite combination of the foreign key and the attribute value.'
      },
      {
        id: 'dbms-5-q4',
        question: 'What is the difference between Total Participation and Partial Participation in an ER diagram?',
        companyTags: ['Apple', 'Qualcomm', 'TCS'],
        frequency: 'Medium',
        answer: '• Total Participation (Existence Dependency): Every entity instance in the entity set MUST participate in at least one relationship instance. Represented by a double line. In relational tables, the foreign key column is marked `NOT NULL`.\n• Partial Participation: Some entity instances may not participate in the relationship (e.g. not every employee manages a department). Represented by a single line; the foreign key column allows NULL values.'
      },
      {
        id: 'dbms-5-q5',
        question: 'How do you map a 1:1 relationship between two entities?',
        companyTags: ['Goldman Sachs', 'Uber'],
        frequency: 'Medium',
        answer: 'There are two common strategies:\n1. Foreign Key Approach: Choose one relation (ideally the one with Total Participation) and place the primary key of the other relation as a foreign key with a UNIQUE constraint (to prevent duplicate 1:1 assignments).\n2. Merged Relation Approach: If both entities have Total Participation, merge both entities into a single combined table.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-5-fc1',
        front: 'How is an M:N relationship represented in relational database design?',
        back: 'Using a separate Junction (Bridge) table containing foreign keys to both participating entity tables.',
        keyTakeaway: 'M:N relationships always require an intermediate junction table.'
      },
      {
        id: 'dbms-5-fc2',
        front: 'What identifies a Weak Entity in an ER model?',
        back: 'It lacks a complete primary key and relies on an identifying strong entity plus a partial key (discriminator).',
        keyTakeaway: 'Weak entities depend on strong entities for complete identification.'
      },
      {
        id: 'dbms-5-fc3',
        front: 'Why must Multi-Valued attributes be moved to a separate table?',
        back: 'To comply with First Normal Form (1NF), which requires all attribute values to be atomic.',
        keyTakeaway: 'Multi-valued attributes require dedicated child tables.'
      },
      {
        id: 'dbms-5-fc4',
        front: 'What does a double line between an entity and a relationship indicate in Chen ER notation?',
        back: 'Total Participation (every entity instance must participate in the relationship).',
        keyTakeaway: 'Total participation maps to a NOT NULL foreign key constraint.'
      },
      {
        id: 'dbms-5-fc5',
        front: 'What forms the Primary Key of a Junction table?',
        back: 'A composite key formed by the foreign keys referencing both participating parent tables.',
        keyTakeaway: 'Composite keys in junction tables prevent duplicate pair relationships.'
      }
    ]
  },
  {
    id: 'dbms-6',
    subjectId: 'dbms',
    order: 6,
    title: 'Database Normalization: Functional Dependencies & BCNF',
    difficulty: 'Intermediate',
    readTime: '9 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine keeping all your company records in a single giant Excel spreadsheet with columns for Employee, Department, Manager, and Department Budget. If 50 employees work in Accounting, you write "Manager: Alice, Budget: $500k" 50 separate times! If Accounting gets a new budget, you must find and update all 50 rows (Update Anomaly); if you update only 49, your database is corrupted. If you hire someone whose department is not yet assigned, you cannot insert them (Insert Anomaly); if you fire the last person in Marketing, the entire Marketing department and its budget vanish from existence (Delete Anomaly). Normalization is the mathematical process of splitting that giant spreadsheet into clean, focused tables to eliminate redundancy and prevent anomalies.',
    what: 'Database Normalization is the formal mathematical technique of organizing relational database schemas to minimize data redundancy, prevent modification anomalies, and preserve data integrity. Developed by Edgar F. Codd, normalization decomposes unnormalized relations into progressively higher Normal Forms based on Functional Dependencies (FDs).\n\nA Functional Dependency $X \\rightarrow Y$ (X determines Y) is a constraint between two attribute sets: whenever two tuples agree on the values of $X$, they must agree on the values of $Y$.\n\nThe standard Normal Forms are:\n• First Normal Form (1NF): Every attribute value must be atomic (indivisible single values; no repeating groups, arrays, or comma-separated lists).\n• Second Normal Form (2NF): Must be in 1NF, and must have No Partial Dependencies (no non-prime attribute can be functionally dependent on a proper subset of any candidate key). Applies to tables with composite primary keys.\n• Third Normal Form (3NF): Must be in 2NF, and must have No Transitive Dependencies (no non-prime attribute can be determined by another non-prime attribute: if $X \\rightarrow Y$ and $Y \\rightarrow Z$, then $Z$ must be separated).\n• Boyce-Codd Normal Form (BCNF): A stricter version of 3NF. For every non-trivial functional dependency $X \\rightarrow Y$, $X$ must be a Super Key.',
    why: 'Unnormalized database designs lead to three severe Modification Anomalies:\n1. Insertion Anomaly: Inability to insert legitimate facts because some other unrelated data is currently missing (e.g. cannot record a new course until a student enrolls).\n2. Deletion Anomaly: Deleting one piece of data accidentally wipes out completely unrelated critical information (e.g. deleting the last student enrolled in a course deletes the course title and syllabus).\n3. Update Anomaly: Storing the same data value in 100 rows requires 100 updates; if a network glitch or query timeout interrupts the update, data becomes inconsistent.\n\nNormalization eliminates these anomalies by ensuring that every table represents exactly one concept: "Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key, so help me Codd."',
    useCase: 'Consider designing an enterprise payroll system. An unnormalized table might store `(emp_id, project_id, emp_name, project_budget, hours_worked)`. Here, the composite key is `(emp_id, project_id)`.\n\nIn 1NF, this suffers from a Partial Dependency: `emp_id -> emp_name` (employee name depends only on part of the key). It also suffers from `project_id -> project_budget`. Normalizing to 2NF and 3NF splits this into three clean relations: `employees(emp_id, emp_name)`, `projects(project_id, project_budget)`, and `assignments(emp_id, project_id, hours_worked)`.\n\nHowever, in high-throughput read-heavy data warehouses (OLAP), engineers deliberately Denormalize data back into dimensional star schemas to avoid expensive multi-table joins during complex analytical aggregation queries.',
    example: `-- Example: Decomposing an unnormalized relation into 3NF / BCNF
-- BAD UNNORMALIZED TABLE (Suffers from Partial and Transitive Dependencies):
-- emp_projects(emp_id, project_id, emp_name, dept_id, dept_name, hours)

-- STEP 1: Normalize to 2NF (Eliminate Partial Dependencies on composite key)
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50) NOT NULL,
    dept_id INT NOT NULL -- Transitive dependency remains: dept_id -> dept_name
);

-- STEP 2: Normalize to 3NF / BCNF (Eliminate Transitive Dependency dept_id -> dept_name)
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL
);

-- STEP 3: Pure Assignment Relation (Composite Key with fully dependent attributes)
CREATE TABLE project_assignments (
    emp_id INT,
    project_id INT,
    hours_allocated INT NOT NULL,
    PRIMARY KEY (emp_id, project_id),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);`,
    exampleExplanation: [
      'Original Flaw: In `(emp_id, project_id)`, `emp_name` depended only on `emp_id` (Partial Dependency violating 2NF).',
      'Step 1 (2NF): Employee details are extracted into `employees`.',
      'Transitive Flaw in Step 1: In `employees`, `dept_id -> dept_name` is a non-prime attribute determining another non-prime attribute (violating 3NF).',
      'Step 2 (3NF/BCNF): `departments` is separated into its own table where `dept_id` is the primary super key.',
      'Step 3: `project_assignments` retains only attributes that depend on the full composite key (`hours_allocated`). All anomalies are eliminated!'
    ],
    interviewQuestions: [
      {
        id: 'dbms-6-q1',
        question: 'Explain 1NF, 2NF, 3NF, and BCNF with their specific requirements.',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: '• 1NF: All column values must be atomic (no arrays, sets, or nested records).\n• 2NF: In 1NF and contains No Partial Dependencies (every non-prime attribute must depend on the entire candidate key, not a proper subset).\n• 3NF: In 2NF and contains No Transitive Dependencies (no non-prime attribute determines another non-prime attribute; for $X \\rightarrow Y$, either $X$ is a super key or $Y$ is a prime attribute).\n• BCNF: In 3NF and for EVERY non-trivial dependency $X \\rightarrow Y$, $X$ MUST be a super key.'
      },
      {
        id: 'dbms-6-q2',
        question: 'What is the difference between 3NF and BCNF?',
        companyTags: ['Oracle', 'Apple', 'Infosys'],
        frequency: 'High',
        answer: 'In 3NF, for any functional dependency $X \\rightarrow Y$, the condition holds if $X$ is a super key OR if $Y$ is a prime attribute (part of any candidate key).\n\nBCNF is stricter: it removes the exception for prime attributes. In BCNF, $X$ MUST be a super key for every functional dependency, with zero exceptions. BCNF eliminates all redundancy based on functional dependencies, but decomposing to BCNF does not always guarantee preservation of all functional dependencies.'
      },
      {
        id: 'dbms-6-q3',
        question: 'What are Insertion, Deletion, and Update Anomalies?',
        companyTags: ['TCS', 'Wipro', 'Cognizant'],
        frequency: 'High',
        answer: '• Insertion Anomaly: Inability to insert valid data because an unrelated attribute value is unavailable (e.g. cannot add a department without adding an employee).\n• Deletion Anomaly: Deleting one fact unintentionally destroys unrelated critical data (e.g. deleting the last employee in a department deletes department details).\n• Update Anomaly: Duplicate copies of data across rows lead to inconsistency if some rows are updated while others are missed.'
      },
      {
        id: 'dbms-6-q4',
        question: 'What is Lossless-Join Decomposition, and why is it mandatory?',
        companyTags: ['Microsoft', 'Uber', 'Qualcomm'],
        frequency: 'High',
        answer: 'A decomposition of relation $R$ into $R_1$ and $R_2$ is Lossless-Join if joining $R_1$ and $R_2$ via natural join ($R_1 \\bowtie R_2$) reproduces the exact original relation $R$ without generating false spurious tuples.\n\nMathematical Rule: $R_1 \\cap R_2$ must functionally determine either $R_1$ or $R_2$ (i.e. the common attribute must be a candidate key in at least one decomposed table).'
      },
      {
        id: 'dbms-6-q5',
        question: 'What is Denormalization, and when is it intentionally used in industry?',
        companyTags: ['Amazon', 'Flipkart', 'Goldman Sachs'],
        frequency: 'High',
        answer: 'Denormalization is the intentional introduction of redundancy into a normalized schema by merging tables or storing pre-aggregated fields.\n\nWhen Used: In read-intensive analytical systems (OLAP data warehouses, Elasticsearch, reporting dashboards) where joining 10 normalized tables across billions of rows causes unacceptable query latency. Adding controlled redundancy improves read throughput at the expense of write overhead.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-6-fc1',
        front: 'What condition does 2NF eliminate?',
        back: 'Partial Dependencies: non-prime attributes depending on only part of a composite candidate key.',
        keyTakeaway: '2NF requires full functional dependency on the complete candidate key.'
      },
      {
        id: 'dbms-6-fc2',
        front: 'What condition does 3NF eliminate?',
        back: 'Transitive Dependencies: non-prime attributes determining other non-prime attributes.',
        keyTakeaway: '3NF ensures non-key columns depend only on candidate keys.'
      },
      {
        id: 'dbms-6-fc3',
        front: 'What is the strict requirement for Boyce-Codd Normal Form (BCNF)?',
        back: 'For every functional dependency X -> Y, X must be a Super Key.',
        keyTakeaway: 'In BCNF, the left-hand determinant must always be a super key.'
      },
      {
        id: 'dbms-6-fc4',
        front: 'What is a Spurious Tuple in database decomposition?',
        back: 'A false, invalid row created when joining lossy decomposed tables that lacked a proper common key.',
        keyTakeaway: 'Decompositions must be Lossless-Join to prevent generating false data.'
      },
      {
        id: 'dbms-6-fc5',
        front: 'Why do OLAP data warehouses use denormalized schemas?',
        back: 'To eliminate expensive multi-table joins and dramatically accelerate read-heavy analytical queries.',
        keyTakeaway: 'Denormalization trades storage and write speed for ultra-fast read queries.'
      }
    ]
  },
  {
    id: 'dbms-7',
    subjectId: 'dbms',
    order: 7,
    title: 'Transactions, ACID Properties & Isolation Anomalies',
    difficulty: 'Intermediate',
    readTime: '9 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine wiring $500 from your bank account to a friend\'s account. Two operations must occur: 1. Subtract $500 from your account, and 2. Add $500 to your friend\'s account. If a power outage or server crash hits the bank after step 1 but before step 2, your $500 vanishes into thin air! A Transaction bundles both operations into a single indivisible unit: either BOTH operations succeed completely, or if anything fails halfway through, the entire transaction is rolled back as if it never started. That is Atomicity.',
    what: 'A Database Transaction is a logical unit of database processing that includes one or more database access operations (reading, inserting, updating, or deleting data). To maintain database integrity under concurrent execution and system failures, every enterprise RDBMS guarantees the Four ACID Properties:\n\n1. Atomicity (All-or-Nothing): A transaction is treated as an indivisible atomic unit. Either all its operations are permanently executed, or in the event of a failure, all partial updates are undone (rolled back).\n2. Consistency: A transaction must transform the database from one valid state satisfying all integrity constraints (primary keys, foreign keys, check constraints) to another valid state.\n3. Isolation: The intermediate operations of a concurrently executing transaction must be invisible to other concurrent transactions until committed. Concurrently running transactions appear to run sequentially.\n4. Durability: Once a transaction is committed, its changes are permanent and will survive any subsequent system crash or power outage, guaranteed via Write-Ahead Logging (WAL).\n\nUnder concurrent execution, different levels of Transaction Isolation protect against standard Read Anomalies:\n• Dirty Read: Transaction A reads uncommitted data written by Transaction B; Transaction B then rolls back, leaving Transaction A with phantom data.\n• Non-Repeatable Read: Transaction A reads a row, Transaction B modifies or deletes that row and commits; Transaction A re-reads the row and sees changed values.\n• Phantom Read: Transaction A reads a set of rows satisfying a range condition (e.g. `WHERE salary > 50000`), Transaction B inserts a new row matching that condition and commits; Transaction A re-executes the query and discovers a "phantom" row that was not there before.\n\nThe ANSI SQL standard defines Four Isolation Levels to trade performance against isolation: Read Uncommitted (allows dirty reads), Read Committed (default in PostgreSQL/Oracle; prevents dirty reads), Repeatable Read (default in MySQL InnoDB; prevents dirty and non-repeatable reads), and Serializable (strict sequential isolation; prevents all anomalies).',
    why: 'Without ACID guarantees, enterprise databases could not exist. Concurrent flight seat bookings, stock trades, and credit card payments would suffer double-spending, negative balances, and data corruption.\n\nConfiguring transaction isolation levels represents an essential architectural trade-off: strict Serializable isolation eliminates all anomalies but throttles throughput due to extensive locking, while Read Committed maximizes multi-user concurrency while accepting minor repeatable-read discrepancies.',
    useCase: 'In e-commerce flash sales, inventory management requires strict transaction boundaries. When a customer clicks "Buy Now", the application starts a transaction: it verifies stock availability (`SELECT stock FROM products WHERE id = 10 FOR UPDATE`), decrements inventory, creates an order record, and commits.\n\nThe `FOR UPDATE` clause issues an exclusive row lock, preventing a race condition where 100 simultaneous shoppers all see 1 remaining iPhone and buy it simultaneously.',
    example: `-- Example: Transferring Funds Atomically with Transaction Control
BEGIN TRANSACTION;

-- Step 1: Deduct $500 from Account A
UPDATE accounts 
SET balance = balance - 500.00 
WHERE account_number = 'ACC_1001' AND balance >= 500.00;

-- Step 2: Ensure deduction succeeded (simulating application check)
-- In case Account A had insufficient funds, we ROLLBACK immediately:
-- IF balance check fails THEN ROLLBACK;

-- Step 3: Credit $500 to Account B
UPDATE accounts 
SET balance = balance + 500.00 
WHERE account_number = 'ACC_2002';

-- Step 4: Record audit log entry
INSERT INTO transfer_audit_log (from_acc, to_acc, amount, transfer_time)
VALUES ('ACC_1001', 'ACC_2002', 500.00, NOW());

-- Commit: Changes become permanently durable on disk via Write-Ahead Log
COMMIT;`,
    exampleExplanation: [
      'Line 2: `BEGIN TRANSACTION` establishes an atomic boundary. The database engine begins tracking all subsequent writes in memory buffers and the transaction log.',
      'Line 5-7: Account A balance is decremented with a safeguard check `balance >= 500.00`.',
      'Atomicity Guard: If the database server crashes or a foreign-key check fails at Line 13, the engine automatically rolls back all changes.',
      'Line 19: `COMMIT` flushes the transaction commit record to the persistent Write-Ahead Log (WAL) on disk.',
      'Durability Guaranteed: Once `COMMIT` returns success, the bank balance is guaranteed to survive any immediate power failure.'
    ],
    interviewQuestions: [
      {
        id: 'dbms-7-q1',
        question: 'What are the ACID properties in DBMS, and how does the database engine enforce each?',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: '• Atomicity: Enforced by the Recovery Manager using the Undo Log. If a transaction aborts, uncommitted writes are undone.\n• Consistency: Enforced by application logic and database schema constraints (foreign keys, CHECK constraints).\n• Isolation: Enforced by the Concurrency Control Manager using Locking protocols (2PL) or Multiversion Concurrency Control (MVCC).\n• Durability: Enforced by the Recovery Manager using the Write-Ahead Log (WAL) and Redo logs flushed to non-volatile disk.'
      },
      {
        id: 'dbms-7-q2',
        question: 'Name and explain the Four ANSI SQL Isolation Levels and the anomalies they prevent.',
        companyTags: ['Microsoft', 'Oracle', 'Goldman Sachs'],
        frequency: 'Very High',
        answer: '1. Read Uncommitted: Allows Dirty Reads, Non-Repeatable Reads, and Phantom Reads. Lowest isolation, highest concurrency.\n2. Read Committed: Prevents Dirty Reads. Allows Non-Repeatable Reads and Phantom Reads. Reads only committed data (default in PostgreSQL, Oracle).\n3. Repeatable Read: Prevents Dirty Reads and Non-Repeatable Reads. Allows Phantom Reads (default in MySQL InnoDB, which prevents phantoms via Next-Key locking).\n4. Serializable: Prevents ALL anomalies (Dirty, Non-Repeatable, and Phantom Reads). Highest isolation, lowest concurrency.'
      },
      {
        id: 'dbms-7-q3',
        question: 'What is a Dirty Read, and why is it dangerous?',
        companyTags: ['Apple', 'Uber', 'TCS'],
        frequency: 'High',
        answer: 'A Dirty Read occurs when Transaction A reads data updated by Transaction B that has NOT yet been committed. If Transaction B subsequently aborts and executes a `ROLLBACK`, the data read by Transaction A never officially existed in the database.\n\nDanger: If Transaction A uses that uncommitted phantom value to make financial decisions or generate customer invoices, the business state is corrupted.'
      },
      {
        id: 'dbms-7-q4',
        question: 'What is the difference between a Non-Repeatable Read and a Phantom Read?',
        companyTags: ['Salesforce', 'Infosys', 'Wipro'],
        frequency: 'High',
        answer: '• Non-Repeatable Read: Involves modifying or deleting existing rows. Transaction A reads a specific row; Transaction B modifies that row and commits; Transaction A re-reads the row and finds different column values.\n• Phantom Read: Involves inserting new rows satisfying a range query. Transaction A executes `SELECT WHERE age > 30` getting 5 rows; Transaction B inserts a new 35-year-old user and commits; Transaction A re-executes the query and gets 6 rows.'
      },
      {
        id: 'dbms-7-q5',
        question: 'What is Multiversion Concurrency Control (MVCC), and why is it used instead of pure locking?',
        companyTags: ['PostgreSQL', 'Amazon', 'Meta'],
        frequency: 'Very High',
        answer: 'MVCC is a concurrency control technique where the database maintains multiple physical versions of a data row. When a transaction updates a row, the engine does not overwrite the old row; it creates a new version with a transaction timestamp.\n\nBenefit: "Readers never block Writers, and Writers never block Readers." A read query reads the consistent snapshot of data as it existed when the query started, without acquiring read locks, dramatically increasing throughput.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-7-fc1',
        front: 'What does the Atomicity property guarantee in a transaction?',
        back: 'All operations inside the transaction complete successfully, or all changes are rolled back completely (All-or-Nothing).',
        keyTakeaway: 'Atomicity prevents partial updates during failures.'
      },
      {
        id: 'dbms-7-fc2',
        front: 'What is a Dirty Read anomaly?',
        back: 'A transaction reading uncommitted data written by another transaction that might later roll back.',
        keyTakeaway: 'Read Committed isolation prevents dirty reads.'
      },
      {
        id: 'dbms-7-fc3',
        front: 'What is the difference between Non-Repeatable Read and Phantom Read?',
        back: 'Non-Repeatable Read affects existing rows (modifications); Phantom Read affects range queries (new inserted rows).',
        keyTakeaway: 'Row locks prevent non-repeatable reads; range locks prevent phantom reads.'
      },
      {
        id: 'dbms-7-fc4',
        front: 'What is the default isolation level in PostgreSQL and Oracle?',
        back: 'Read Committed (prevents dirty reads, allows non-repeatable reads).',
        keyTakeaway: 'Read Committed balances concurrency and safety for general OLTP workloads.'
      },
      {
        id: 'dbms-7-fc5',
        front: 'How does MVCC enable high concurrency?',
        back: 'By maintaining multiple row versions so read operations never block write operations, and writes never block reads.',
        keyTakeaway: 'MVCC eliminates read-write lock contention.'
      }
    ]
  },
  {
    id: 'dbms-8',
    subjectId: 'dbms',
    order: 8,
    title: 'Concurrency Control, Serializability & Two-Phase Locking (2PL)',
    difficulty: 'Advanced',
    readTime: '10 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine a high school chemistry lab with limited glass beakers and Bunsen burners. Two-Phase Locking (2PL) is a strict rule enforced by the teacher: During Phase 1 (The Growing Phase), a student can only pick up and borrow equipment from the supply cabinet—they cannot return anything yet. Once the student returns their very first piece of equipment to the cabinet, they immediately enter Phase 2 (The Shrinking Phase), where they can ONLY return remaining equipment and are strictly forbidden from picking up any new tools. This guarantees no student can borrow a beaker modified by another student mid-experiment, preventing chaotic lab accidents.',
    what: 'Concurrency Control is the database management subsystem responsible for coordinating concurrent transaction execution to prevent data corruption while maximizing execution throughput. The theoretical golden standard of correctness for concurrent execution is Serializability: a concurrent schedule of transactions is considered correct if and only if its final outcome is equivalent to some serial execution where transactions ran one after another without interleaving.\n\nA schedule is Conflict Serializable if it can be transformed into a serial schedule by swapping non-conflicting adjacent operations. Two operations $I_i$ and $I_j$ conflict if they belong to different transactions, access the exact same data item $Q$, and at least one of them is a write operation ($W(Q)$). Conflict serializability is proven mathematically using a Precedence Graph (Serialization Graph): a directed graph where transactions are nodes and directed edges $T_i \\rightarrow T_j$ represent conflicting operations where $T_i$ accessed the item before $T_j$. If the precedence graph contains No Directed Cycles, the schedule is provably conflict serializable.\n\nTwo-Phase Locking (2PL) is the classic pessimistic concurrency control protocol that guarantees conflict serializability. Under basic 2PL, each transaction executes in two distinct phases:\n1. Growing Phase: The transaction may acquire locks (Shared `S` locks for reading, Exclusive `X` locks for writing), but cannot release any locks.\n2. Shrinking Phase: Once the transaction releases its first lock, it enters the shrinking phase; it may release locks, but can NEVER acquire any new locks.\n\nTo prevent Cascading Aborts (where rolling back transaction $T_1$ forces the rollback of dozens of dependent transactions that read $T_1$\'s uncommitted data), modern database engines use Strict 2PL: all Exclusive (X) locks must be held until the transaction officially commits or aborts.',
    why: 'Without concurrency control, simultaneous transactions produce classic race conditions: Lost Updates (two transactions read balance $1000 and concurrently write $1100 and $1200, overwriting one update), Inconsistent Analysis (reading account balances mid-transfer), and Uncommitted Dependency anomalies.\n\nStrict 2PL guarantees both serializable execution and strict schedules with zero cascading rollbacks, ensuring absolute data integrity in mission-critical financial applications.',
    useCase: 'Relational database engines like MySQL InnoDB and Microsoft SQL Server use Two-Phase Locking internally when transactions run under the Serializable isolation level. In MySQL InnoDB, row-level locks and Next-Key Locks (locking a row index and the gap preceding it) enforce 2PL to prevent concurrent transactions from inserting phantom rows into an active range query.\n\nIf two transactions acquire locks in opposing orders ($T_1$ locks Row A and requests Row B, while $T_2$ locks Row B and requests Row A), a Deadlock occurs. The database engine\'s background deadlock detector traverses the waits-for graph, detects the cycle, and terminates one transaction with a rollback.',
    example: `-- Example: Implementing Strict Two-Phase Locking with Explicit Row Locks
BEGIN TRANSACTION;

-- Growing Phase: Acquiring Exclusive (X) Locks using SELECT ... FOR UPDATE
-- Lock Row 101 exclusively
SELECT balance FROM accounts 
WHERE account_id = 101 
FOR UPDATE;

-- Lock Row 202 exclusively
SELECT balance FROM accounts 
WHERE account_id = 202 
FOR UPDATE;

-- Perform updates while holding exclusive locks
UPDATE accounts SET balance = balance - 100 WHERE account_id = 101;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 202;

-- Shrinking Phase: Under Strict 2PL, ALL locks are held until COMMIT!
-- No locks are released until the transaction officially commits here:
COMMIT; -- All exclusive locks on Row 101 and Row 202 are atomically released`,
    exampleExplanation: [
      'Line 2: Transaction begins. The transaction enters the Growing Phase.',
      'Line 5-8: `FOR UPDATE` acquires an Exclusive (X) lock on Row 101. Other transactions attempting to read or write Row 101 are blocked.',
      'Line 11-14: Acquires a second Exclusive lock on Row 202. Both locks were acquired during the Growing Phase.',
      'Line 17-18: Data modifications execute safely with guaranteed mutual exclusion.',
      'Line 22: `COMMIT` marks the end of the transaction. Under Strict 2PL, all locks are held until commit, preventing any cascading aborts.'
    ],
    interviewQuestions: [
      {
        id: 'dbms-8-q1',
        question: 'What is Conflict Serializability, and how do you test for it using a Precedence Graph?',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: 'A schedule is Conflict Serializable if it can be transformed into a serial schedule by swapping non-conflicting adjacent operations.\n\nPrecedence Graph Test:\n1. Create a node for each active transaction $T_i$.\n2. Draw a directed edge $T_i \\rightarrow T_j$ if $T_i$ executes a conflicting operation ($R(X)-W(X)$, $W(X)-R(X)$, or $W(X)-W(X)$) on the same item $X$ before $T_j$ executes its conflicting operation.\n3. Cycle Check: If the precedence graph contains a directed cycle, the schedule is NOT conflict serializable. If it is acyclic, topological sort gives the equivalent serial schedule.'
      },
      {
        id: 'dbms-8-q2',
        question: 'Explain the Two-Phase Locking (2PL) protocol and the difference between Basic 2PL and Strict 2PL.',
        companyTags: ['Oracle', 'Apple', 'Qualcomm'],
        frequency: 'Very High',
        answer: '• Basic 2PL: A transaction has two phases: Growing Phase (can acquire locks, cannot release any) and Shrinking Phase (can release locks, cannot acquire any). Guarantees conflict serializability, but vulnerable to cascading aborts.\n• Strict 2PL: All Exclusive (X) write locks acquired by the transaction must be held until the transaction commits or aborts. Guarantees serializability AND prevents cascading rollbacks.'
      },
      {
        id: 'dbms-8-q3',
        question: 'Does Two-Phase Locking (2PL) prevent deadlocks?',
        companyTags: ['Microsoft', 'Goldman Sachs', 'Uber'],
        frequency: 'High',
        answer: 'NO, Two-Phase Locking does NOT prevent deadlocks! In fact, 2PL introduces the possibility of deadlocks because transactions hold locks while waiting to acquire additional locks (satisfying the Hold-and-Wait condition).\n\nDeadlock Resolution: Databases use timeout limits or periodic Waits-For Graph cycle detection algorithms to identify deadlocks and abort one victim transaction.'
      },
      {
        id: 'dbms-8-q4',
        question: 'What are Shared (S) locks and Exclusive (X) locks, and how do they interact?',
        companyTags: ['TCS', 'Infosys', 'Wipro'],
        frequency: 'High',
        answer: '• Shared (S) Lock: Requested for read-only operations. Multiple transactions can hold shared locks on the same data item simultaneously (Shared-Shared is compatible).\n• Exclusive (X) Lock: Requested for write operations (insert, update, delete). Only one transaction can hold an exclusive lock; all other lock requests (S or X) are blocked.\n• Lock Compatibility Matrix: S and S are compatible; S and X conflict; X and X conflict.'
      },
      {
        id: 'dbms-8-q5',
        question: 'What is a Cascading Abort (Cascading Rollback), and how does Strict 2PL eliminate it?',
        companyTags: ['Amazon', 'Cisco'],
        frequency: 'High',
        answer: 'A Cascading Abort occurs when transaction $T_1$ updates data item $X$ and releases its lock before committing; transaction $T_2$ reads the uncommitted value of $X$; then $T_1$ aborts. Because $T_2$ read an uncommitted phantom value, $T_2$ must also be forcibly aborted, potentially triggering a cascade across dozens of transactions.\n\nStrict 2PL prevents this by holding all exclusive locks until commit, ensuring no other transaction can read uncommitted updates.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-8-fc1',
        front: 'What does a cycle in a Precedence (Serialization) Graph indicate?',
        back: 'The concurrent execution schedule is NOT conflict serializable (it cannot be safely reordered into a serial schedule).',
        keyTakeaway: 'Acyclic precedence graphs prove conflict serializability.'
      },
      {
        id: 'dbms-8-fc2',
        front: 'What are the two phases of the Two-Phase Locking (2PL) protocol?',
        back: 'Growing Phase (can acquire locks, cannot release) and Shrinking Phase (can release locks, cannot acquire).',
        keyTakeaway: '2PL guarantees conflict serializability but does not prevent deadlocks.'
      },
      {
        id: 'dbms-8-fc3',
        front: 'What is the primary advantage of Strict 2PL over Basic 2PL?',
        back: 'Strict 2PL holds all Exclusive locks until commit, completely eliminating cascading rollbacks.',
        keyTakeaway: 'Strict 2PL prevents cascading aborts in production databases.'
      },
      {
        id: 'dbms-8-fc4',
        front: 'Can two transactions hold Shared (S) locks on the same row simultaneously?',
        back: 'Yes; Shared locks are compatible with other Shared locks for concurrent reads.',
        keyTakeaway: 'Multiple transactions can read the same row concurrently.'
      },
      {
        id: 'dbms-8-fc5',
        front: 'Does 2PL prevent deadlocks?',
        back: 'No; 2PL can lead to deadlocks when transactions acquire locks in conflicting orders.',
        keyTakeaway: '2PL requires deadlock detection or prevention mechanisms.'
      }
    ]
  },
  {
    id: 'dbms-9',
    subjectId: 'dbms',
    order: 9,
    title: 'Database Indexing, B+ Trees & Query Optimization',
    difficulty: 'Advanced',
    readTime: '10 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine searching for a topic in a 1,000-page medical textbook. A Full Table Scan is like flipping through every single page from page 1 to 1000 one-by-one—excruciatingly slow ($O(N)$). A B+ Tree Index is like the alphabetical index at the back of the book: you flip straight to the letter "C" in half a second, find "Cardiology: page 412", and jump directly to that exact page ($O(\\log N)$). A Clustered Index is like arranging the actual chapters of the book by date, so all events from 1950 sit physically next to each other on consecutive paper pages.',
    what: 'Database Indexing is a physical data structure technique used to rapidly locate and access data records without having to scan every row in a table. In relational databases, the standard production indexing structure is the B+ Tree (a self-balancing multi-way search tree).\n\nA B+ Tree differs from a standard B-Tree in three crucial architectural aspects:\n1. Data records (or record pointers) are stored exclusively in Leaf Nodes. Internal nodes store only search keys and child page pointers as navigational routers.\n2. Leaf nodes are linked sequentially as a Doubly-Linked List, enabling high-performance range scans (e.g. `WHERE age BETWEEN 20 AND 30`) without tree traversals.\n3. High Fan-out: Internal nodes typically store hundreds of keys per 8KB/16KB page, meaning a tree of height 3 or 4 can index hundreds of millions of records, requiring only 3 or 4 disk I/O reads to find any record.\n\nIndexes are categorized by storage layout:\n• Clustered Index: Determines the physical storage order of rows on disk. A table can have only ONE clustered index (typically on the Primary Key). In MySQL InnoDB, the table IS the clustered index (an Index-Organized Table).\n• Non-Clustered (Secondary) Index: A separate B+ tree structure where leaf nodes store the indexed key and the clustered key pointer. Lookups on non-clustered indexes may require a secondary bookmark lookup (Table Lookup) unless a Covering Index satisfies the entire query from the index tree directly.\n\nThe Cost-Based Query Optimizer (CBO) evaluates query execution plans, estimating disk I/O and CPU costs to decide whether to use an index scan, index range scan, or full table scan.',
    why: 'On a table with 10 million rows, a query without an index executes a Full Table Scan (`Seq Scan`), reading gigabytes of raw data from disk into memory buffers, taking several seconds. A B+ tree index finds the target row in 3 page reads (sub-millisecond).\n\nHowever, indexes are not free: every `INSERT`, `UPDATE`, and `DELETE` must update the secondary index trees, incurring write amplification and page splits. Strategic indexing balances read acceleration against write overhead.',
    useCase: 'In high-scale SaaS architectures, Composite Indexes (multi-column indexes) must follow the Leftmost Prefix Rule. For an index on `(tenant_id, status, created_at)`:\n• Queries filtering by `WHERE tenant_id = 5` or `WHERE tenant_id = 5 AND status = \'ACTIVE\'` will use the index.\n• Queries filtering ONLY by `WHERE status = \'ACTIVE\'` CANNOT use the index because the leftmost column is omitted.\n\nEngineers use `EXPLAIN ANALYZE` in PostgreSQL or MySQL to inspect query execution plans, ensuring queries utilize Index Only Scans (covering indexes) for high-frequency API endpoints.',
    example: `-- Example: Creating B+ Tree Indexes and Optimizing with a Covering Index
CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY, -- Clustered Index in MySQL InnoDB
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);

-- 1. Composite Secondary Index on (customer_id, order_date)
-- Follows Leftmost Prefix Rule: Accelerates queries filtering by customer_id
CREATE INDEX idx_orders_customer_date 
ON orders (customer_id, order_date);

-- 2. Covering Index Example (Includes total_amount):
-- Allows index-only scans without touching the physical table pages!
CREATE INDEX idx_orders_covering 
ON orders (customer_id, order_date, total_amount);

-- Query fully satisfied by idx_orders_covering (Zero table heap lookups):
EXPLAIN ANALYZE
SELECT order_date, total_amount 
FROM orders 
WHERE customer_id = 45201 AND order_date >= '2026-01-01';`,
    exampleExplanation: [
      'Line 3: `PRIMARY KEY (order_id)` forms the clustered B+ tree index holding full row data in leaf nodes.',
      'Line 11-12: Composite index on `(customer_id, order_date)` accelerates lookups where `customer_id` is supplied.',
      'Leftmost Rule: A query filtering only on `order_date` cannot use `idx_orders_customer_date`.',
      'Line 16-17: Covering Index: Notice that `total_amount` is added to the leaf index nodes.',
      'Line 20-23: Because `order_date` and `total_amount` are both in the index tree, the database executes an Index-Only Scan, retrieving results without touching the main table heap.'
    ],
    interviewQuestions: [
      {
        id: 'dbms-9-q1',
        question: 'Why are B+ Trees preferred over Binary Search Trees (BST) and Hash Indexes for database storage engines?',
        companyTags: ['Amazon', 'Google', 'Microsoft'],
        frequency: 'Very High',
        answer: '• Over BST/AVL: Binary trees have a fan-out of only 2, resulting in deep trees ($O(\\log_2 N)$). For 10 million rows, height is ~24, requiring 24 random disk I/Os. B+ Trees have large fan-out ($100+$), keeping tree height to 3 or 4, requiring only 3-4 disk accesses.\n• Over Hash Indexes: Hash indexes provide $O(1)$ point lookups, but CANNOT perform range queries (`WHERE age BETWEEN 20 AND 30`) or prefix sorting (`ORDER BY`). B+ tree leaf nodes form a doubly-linked list, making range scans blazing fast.'
      },
      {
        id: 'dbms-9-q2',
        question: 'What is the difference between a Clustered Index and a Non-Clustered (Secondary) Index?',
        companyTags: ['Microsoft', 'Oracle', 'TCS'],
        frequency: 'Very High',
        answer: '• Clustered Index: Dictates the physical storage order of data rows on disk. Leaf nodes contain the actual data rows. A table can have only ONE clustered index (usually primary key).\n• Non-Clustered (Secondary) Index: A separate search tree whose leaf nodes store only the index key and a pointer (bookmark/primary key) to the physical row. A table can have multiple secondary indexes.'
      },
      {
        id: 'dbms-9-q3',
        question: 'What is a Covering Index, and why does it significantly boost query performance?',
        companyTags: ['Uber', 'Meta', 'Goldman Sachs'],
        frequency: 'High',
        answer: 'A Covering Index is an index that contains all the columns requested in the `SELECT`, `WHERE`, `JOIN`, and `ORDER BY` clauses of a query.\n\nPerformance Boost: The query engine performs an Index-Only Scan, extracting all required data directly from the B+ tree leaf pages without performing secondary bookmark lookups on the main table heap, eliminating random disk I/O.'
      },
      {
        id: 'dbms-9-q4',
        question: 'What is the Leftmost Prefix Rule in composite B+ tree indexes?',
        companyTags: ['Amazon', 'Apple', 'Infosys'],
        frequency: 'High',
        answer: 'In a composite index on multiple columns `(A, B, C)`, the index can only be used by queries that filter by the leftmost leading columns in order:\n• Can use index: `WHERE A = 1`, `WHERE A = 1 AND B = 2`, `WHERE A = 1 AND B = 2 AND C = 3`.\n• Cannot use index: `WHERE B = 2`, `WHERE C = 3`, `WHERE B = 2 AND C = 3` (because the index is sorted by A first, then B, then C).'
      },
      {
        id: 'dbms-9-q5',
        question: 'What is a B+ Tree Page Split, and what causes write amplification?',
        companyTags: ['Qualcomm', 'Salesforce'],
        frequency: 'Medium',
        answer: 'A Page Split occurs when inserting a new key into a B+ tree leaf or internal node that is already 100% full (e.g. 16KB limit reached). The database must allocate a new page, move 50% of the keys to the new page, update linked-list pointers, and insert a new routing key into the parent node.\n\nWrite Amplification: A single small row insert can trigger multiple recursive page splits and disk I/O writes up the tree.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-9-fc1',
        front: 'Why are B+ Tree leaf nodes connected as a doubly-linked list?',
        back: 'To allow rapid sequential range scans (e.g. BETWEEN conditions) without re-traversing the tree from the root.',
        keyTakeaway: 'Leaf-level linked lists optimize range queries.'
      },
      {
        id: 'dbms-9-fc2',
        front: 'How many Clustered Indexes can a table have, and why?',
        back: 'Exactly ONE, because physical table rows on disk can only be sorted in one physical order.',
        keyTakeaway: 'A table can only have one physical sort order.'
      },
      {
        id: 'dbms-9-fc3',
        front: 'What is an Index-Only Scan (Covering Index)?',
        back: 'A query satisfied entirely from the index tree without reading any physical table heap pages.',
        keyTakeaway: 'Covering indexes avoid table lookups entirely.'
      },
      {
        id: 'dbms-9-fc4',
        front: 'Can a composite index on (A, B, C) be used for a query filtering only on B?',
        back: 'No; composite indexes require the leftmost leading column (A) to be present in the filter condition.',
        keyTakeaway: 'The Leftmost Prefix rule governs multi-column index utilization.'
      },
      {
        id: 'dbms-9-fc5',
        front: 'Why do B+ trees have high fan-out compared to binary trees?',
        back: 'To keep tree height minimal (3-4 levels), minimizing the number of disk I/O page reads required per lookup.',
        keyTakeaway: 'High fan-out keeps tree depth shallow for fast disk lookups.'
      }
    ]
  },
  {
    id: 'dbms-10',
    subjectId: 'dbms',
    order: 10,
    title: 'Crash Recovery, Logging Architecture & ARIES Protocol',
    difficulty: 'Advanced',
    readTime: '10 min read',
    draftStatus: 'Draft v1.0 — Review Candidate',
    analogy: 'Imagine an airplane\'s flight black box. Pilots don\'t wait until the plane safely lands to write a summary report; the black box continuously records every flap movement, throttle setting, and altitude change in real time to an indestructible tape recorder. If the plane experiences turbulence or electrical failure, investigators recover the black box tape to replay the exact sequence of events leading up to the incident. The Write-Ahead Log (WAL) is the database\'s black box: before any data page is modified on disk, the exact change is committed to the append-only log tape.',
    what: 'Crash Recovery is the database engine subsystem that guarantees transaction Atomicity and Durability in the presence of operating system crashes, hardware power failures, or software exceptions. The engine must ensure that all committed transactions survive the crash (Durability) and all uncommitted partial transactions are completely undone (Atomicity).\n\nBecause writing random 8KB/16KB data pages directly to disk on every update would destroy performance, database engines use an in-memory Buffer Pool. Management policies dictate buffer persistence:\n• Steal vs No-Steal: A Steal policy allows the buffer manager to write uncommitted dirty pages to disk to free memory frames. Requires an UNDO logging mechanism.\n• Force vs No-Force: A Force policy requires all pages updated by a transaction to be flushed to disk before committing. Modern databases use a No-Force policy (pages stay dirty in RAM after commit) for high throughput, requiring a REDO logging mechanism.\n\nThe foundational protocol governing crash recovery is the Write-Ahead Logging (WAL) Protocol: before a dirty data page can be written to disk, the log record describing the update must be flushed to non-volatile disk. Every log record is assigned a monotonically increasing Log Sequence Number (LSN). Each data page header stores a `pageLSN` recording the LSN of the last update applied to that page.\n\nThe industry-standard recovery algorithm is C. Mohan\'s ARIES (Algorithm for Recovery and Isolation Exploiting Semantics), which executes in Three Sequential Phases upon reboot after a crash:\n1. Analysis Phase: Scans the log forward from the last Checkpoint to reconstruct the Transaction Table (identifying active "loser" transactions) and the Dirty Page Table (identifying unwritten pages).\n2. Redo Phase: Replays all logged operations forward from the earliest unwritten page (`recLSN`) to bring the database to the exact state it was in at the instant of the crash ("Repeating History").\n3. Undo Phase: Scans backward, undoing the changes of all active uncommitted transactions using Compensation Log Records (CLRs) to ensure idempotence if another crash occurs during recovery.',
    why: 'Without Write-Ahead Logging and ARIES recovery, recovering from an unexpected power outage would require a full table audit and could result in permanent data corruption: committed bank transfers could vanish, or partially updated records could leave accounts in impossible states.\n\nWAL transforms expensive random disk writes into high-speed sequential disk appends, allowing database engines to achieve tens of thousands of transactions per second while guaranteeing mathematical durability.',
    useCase: 'PostgreSQL, SQLite, and MySQL InnoDB all rely on Write-Ahead Logging. In PostgreSQL, the WAL directory (`pg_wal`) stores 16MB log segments. When a client issues `COMMIT`, PostgreSQL flushes only the WAL buffer to disk (`fsync`), while the actual table heap pages remain dirty in memory until the background Checkpointer process writes them to disk periodically.\n\nWAL is also the foundational technology behind Database Replication: read-replicas stream the primary node\'s WAL log over the network and continuously execute the Redo phase to maintain an identical, up-to-date copy of the database.',
    example: `-- Conceptual ARIES Log Record Structure and Checkpoint Mechanism
-- (Simulated Log Sequence Records in Database Recovery Engine)

-- LSN 101: Transaction T1 begins
-- [LSN: 101, PrevLSN: 0,   TxID: T1, Type: BEGIN]

-- LSN 102: T1 updates Account 5 (Old: $1000, New: $800)
-- [LSN: 102, PrevLSN: 101, TxID: T1, Type: UPDATE, PageID: P42, Offset: 16, Old: 1000, New: 800]

-- LSN 103: Transaction T2 begins
-- [LSN: 103, PrevLSN: 0,   TxID: T2, Type: BEGIN]

-- LSN 104: CHECKPOINT RECORD (Fuzzy Checkpoint)
-- [LSN: 104, Type: CHECKPOINT, ActiveTx: {T1: 102, T2: 103}, DirtyPages: {P42: 102}]

-- LSN 105: T1 commits (Flushed to disk!)
-- [LSN: 105, PrevLSN: 102, TxID: T1, Type: COMMIT]

-- *** CRASH OCCURS HERE! (Power Failure) ***
-- On Reboot, ARIES recovers:
-- Phase 1 (Analysis): Reads LSN 104 -> Identifies T1 as committed, T2 as uncommitted loser.
-- Phase 2 (Redo): Replays LSN 102 (repeats history).
-- Phase 3 (Undo): Rolls back T2 writes using Compensation Log Records (CLRs).`,
    exampleExplanation: [
      'LSN 101-102: Log records are appended sequentially with unique LSNs, recording both Old value (for Undo) and New value (for Redo).',
      'PrevLSN: Each transaction\'s log records form a backward-linked list, allowing fast reverse traversal during the Undo phase.',
      'LSN 104: Fuzzy Checkpoint records dirty pages and active transactions without freezing database activity.',
      'LSN 105: `COMMIT` record is appended and flushed to disk.',
      'Crash Recovery: The Analysis phase identifies that T1 committed (its changes are kept) while T2 was uncommitted (its changes are undone).',
      'CLR: If another crash happens while undoing T2, Compensation Log Records ensure the undo operation is never repeated twice.'
    ],
    interviewQuestions: [
      {
        id: 'dbms-10-q1',
        question: 'What is the Write-Ahead Logging (WAL) protocol, and why is it essential for database durability?',
        companyTags: ['Amazon', 'Google', 'PostgreSQL'],
        frequency: 'Very High',
        answer: 'The Write-Ahead Logging (WAL) protocol dictates that any change to a data item must be written to the append-only log on non-volatile storage BEFORE the modified data page can be written to disk.\n\nWhy Essential: Disk I/O to append sequential log records is orders of magnitude faster than random writes to data files. WAL allows transactions to commit durably as soon as the small log record is flushed to disk (`fsync`), while postponing expensive dirty data page writes to asynchronous background checkpointers.'
      },
      {
        id: 'dbms-10-q2',
        question: 'Explain the Steal/No-Steal and Force/No-Force buffer pool management policies.',
        companyTags: ['Oracle', 'Microsoft', 'Qualcomm'],
        frequency: 'Very High',
        answer: '• Steal Policy: The buffer pool can write dirty pages modified by uncommitted transactions to disk to free memory frames. Requires UNDO logging to roll back changes on abort. (Used in modern DBs).\n• No-Steal Policy: Uncommitted pages cannot be written to disk; requires holding all dirty pages in RAM until commit.\n• Force Policy: Requires all pages modified by a transaction to be flushed to disk before committing. Highly inefficient (too many random writes).\n• No-Force Policy: Transactions commit without flushing modified data pages to disk. Requires REDO logging to reconstruct committed data after a crash. (Used in modern DBs).'
      },
      {
        id: 'dbms-10-q3',
        question: 'What are the Three Phases of the ARIES recovery algorithm, and what does each accomplish?',
        companyTags: ['IBM', 'Amazon', 'Google'],
        frequency: 'Very High',
        answer: '1. Analysis Phase: Scans forward from the most recent Checkpoint to reconstruct the Dirty Page Table (pages dirty in memory at crash) and the Transaction Table (identifying "loser" transactions that were uncommitted).\n2. Redo Phase: Scans forward from the smallest `recLSN` in the Dirty Page Table, replaying all logged actions ("repeating history") to restore the database to the exact state at the time of the crash.\n3. Undo Phase: Scans backward through the log, rolling back the actions of all uncommitted loser transactions and writing Compensation Log Records (CLRs).'
      },
      {
        id: 'dbms-10-q4',
        question: 'What is a Checkpoint in DBMS, and how does a Fuzzy Checkpoint work?',
        companyTags: ['Microsoft', 'Apple', 'TCS'],
        frequency: 'High',
        answer: 'A Checkpoint is a recovery landmark that bounds how far back in the log the recovery process must scan upon a crash.\n\nFuzzy Checkpointing: Rather than freezing the entire database to flush all dirty pages to disk (which causes severe latency spikes), a fuzzy checkpoint writes a checkpoint record containing snapshots of the active Transaction Table and Dirty Page Table while normal transactions continue reading and writing.'
      },
      {
        id: 'dbms-10-q5',
        question: 'What is a Compensation Log Record (CLR) in ARIES, and why is it critical if the system crashes during recovery?',
        companyTags: ['Google', 'Meta'],
        frequency: 'High',
        answer: 'A Compensation Log Record (CLR) is a special log record written during the Undo phase to log the undoing of an action. A CLR contains an `UndoNextLSN` field pointing to the next operation of the transaction that must be undone.\n\nImportance: If the database crashes again while executing the Undo phase, reboot recovery does not re-undo already undone operations; it reads the CLR and resumes undoing from `UndoNextLSN`, guaranteeing that recovery itself is strictly idempotent and cannot loop indefinitely.'
      }
    ],
    flashcards: [
      {
        id: 'dbms-10-fc1',
        front: 'What is the golden rule of Write-Ahead Logging (WAL)?',
        back: 'Log records describing a change must be flushed to disk before the actual modified data page can be written to disk.',
        keyTakeaway: 'Log writes must precede data page writes.'
      },
      {
        id: 'dbms-10-fc2',
        front: 'What buffer management policy combination do modern databases use?',
        back: 'Steal (requires UNDO) and No-Force (requires REDO).',
        keyTakeaway: 'Steal/No-Force maximizes buffer throughput while relying on WAL for recovery.'
      },
      {
        id: 'dbms-10-fc3',
        front: 'What are the 3 phases of the ARIES recovery algorithm in order?',
        back: '1. Analysis Phase, 2. Redo Phase (repeat history), 3. Undo Phase (rollback losers).',
        keyTakeaway: 'Analysis discovers state; Redo repeats history; Undo rolls back losers.'
      },
      {
        id: 'dbms-10-fc4',
        front: 'What is the purpose of a Database Checkpoint?',
        back: 'To limit how far back the recovery engine must scan the WAL log after a system crash.',
        keyTakeaway: 'Checkpoints prevent infinite log replay on reboot.'
      },
      {
        id: 'dbms-10-fc5',
        front: 'What is a Compensation Log Record (CLR) in ARIES?',
        back: 'A log record written when undoing an operation, ensuring recovery is idempotent even if interrupted by another crash.',
        keyTakeaway: 'CLRs prevent infinite recovery loops if crashes recur.'
      }
    ]
  }
];
