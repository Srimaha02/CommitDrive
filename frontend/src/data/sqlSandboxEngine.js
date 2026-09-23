import initSqlJs from 'sql.js';

let dbInstance = null;
let SQL = null;

// Initial schema and placement interview seed data
export const SEED_SQL = `
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

-- 1. Departments Table
CREATE TABLE departments (
  dept_id INTEGER PRIMARY KEY,
  dept_name TEXT NOT NULL,
  budget INTEGER NOT NULL,
  location TEXT NOT NULL
);

INSERT INTO departments (dept_id, dept_name, budget, location) VALUES
(1, 'Software Engineering', 1200000, 'Bangalore'),
(2, 'Marketing & Growth', 450000, 'Mumbai'),
(3, 'Sales & Enterprise', 600000, 'Delhi'),
(4, 'Product Management', 550000, 'Bangalore'),
(5, 'Human Resources', 300000, 'Hyderabad');

-- 2. Employees Table
CREATE TABLE employees (
  emp_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  dept_id INTEGER,
  salary REAL NOT NULL,
  manager_id INTEGER,
  hire_date TEXT NOT NULL,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

INSERT INTO employees (emp_id, first_name, last_name, email, department, dept_id, salary, manager_id, hire_date) VALUES
(101, 'Sarah', 'Chen', 'sarah.c@commitdrive.dev', 'Engineering', 1, 95000, 109, '2022-03-15'),
(102, 'Alex', 'Rivera', 'alex.r@commitdrive.dev', 'Engineering', 1, 88000, 109, '2023-01-10'),
(103, 'Marcus', 'Vance', 'marcus.v@commitdrive.dev', 'Marketing', 2, 78000, 108, '2021-11-20'),
(104, 'Ananya', 'Sharma', 'ananya.s@commitdrive.dev', 'Marketing', 2, 72000, 108, '2023-06-01'),
(105, 'David', 'Kim', 'david.k@commitdrive.dev', 'Sales', 3, 68000, 107, '2022-09-12'),
(106, 'Elena', 'Rostova', 'elena.r@commitdrive.dev', 'Sales', 3, 71000, 107, '2021-04-18'),
(107, 'Vikram', 'Singh', 'vikram.s@commitdrive.dev', 'Sales', 3, 92000, NULL, '2020-02-01'),
(108, 'Jessica', 'Taylor', 'jessica.t@commitdrive.dev', 'Marketing', 2, 85000, NULL, '2020-05-15'),
(109, 'Priya', 'Patel', 'priya.p@commitdrive.dev', 'Engineering', 1, 105000, 110, '2021-08-01'),
(110, 'Michael', 'Scott', 'michael.s@commitdrive.dev', 'Management', 4, 145000, NULL, '2019-10-01'),
(111, 'Karthik', 'Raja', 'karthik.r@commitdrive.dev', 'Engineering', 1, 82000, 109, '2023-08-15'),
(112, 'Sneha', 'Reddy', 'sneha.r@commitdrive.dev', 'Product', 4, 98000, 110, '2022-01-20');

-- 3. Orders Table (E-commerce Transactions)
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  order_date TEXT NOT NULL
);

INSERT INTO orders (order_id, customer_name, amount, status, order_date) VALUES
(5001, 'Tata Consultancy Services', 45000.00, 'COMPLETED', '2026-08-10'),
(5002, 'Infosys Technologies', 62000.50, 'COMPLETED', '2026-08-12'),
(5003, 'Wipro Enterprises', 18500.00, 'PENDING', '2026-08-15'),
(5004, 'Razorpay Software', 95000.00, 'COMPLETED', '2026-08-18'),
(5005, 'Swiggy Logistics', 34200.75, 'CANCELLED', '2026-08-20'),
(5006, 'Zomato Media', 78900.00, 'COMPLETED', '2026-08-22');
`;

/**
 * Initializes the SQLite WebAssembly database in browser memory
 */
export async function getSqlDatabase() {
  if (dbInstance) return dbInstance;

  try {
    if (!SQL) {
      SQL = await initSqlJs({
        locateFile: (file) => `/${file}`
      });
    }

    dbInstance = new SQL.Database();
    dbInstance.run(SEED_SQL);
    return dbInstance;
  } catch (err) {
    console.error('Failed to initialize SQLite WASM:', err);
    throw err;
  }
}

/**
 * Resets the in-memory database to its initial clean seeded state
 */
export async function resetSqlDatabase() {
  const db = await getSqlDatabase();
  db.run(SEED_SQL);
  return db;
}

/**
 * Executes arbitrary SQL query from the candidate and measures execution time
 */
export async function executeSqlQuery(queryString) {
  const cleanQuery = queryString.trim();
  if (!cleanQuery) {
    return {
      success: false,
      error: 'Query cannot be empty. Enter a valid SQL command.',
      columns: [],
      values: [],
      rowCount: 0,
      executionTimeMs: 0
    };
  }

  const startTime = performance.now();
  try {
    const db = await getSqlDatabase();
    const results = db.exec(cleanQuery);
    const executionTimeMs = (performance.now() - startTime).toFixed(2);

    if (results.length === 0) {
      // Query was a DDL/DML statement like CREATE, INSERT, UPDATE, or empty result
      return {
        success: true,
        isStatement: true,
        message: 'Query executed successfully with 0 rows returned (or table modified).',
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs
      };
    }

    const firstResult = results[0];
    return {
      success: true,
      isStatement: false,
      columns: firstResult.columns || [],
      values: firstResult.values || [],
      rowCount: firstResult.values?.length || 0,
      executionTimeMs
    };
  } catch (err) {
    const executionTimeMs = (performance.now() - startTime).toFixed(2);
    return {
      success: false,
      error: err.message || String(err),
      columns: [],
      values: [],
      rowCount: 0,
      executionTimeMs
    };
  }
}

/**
 * Normalizes values for comparison (handles float precision, trimmed strings)
 */
function normalizeVal(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return Number(val.toFixed(2));
  return String(val).trim().toLowerCase();
}

/**
 * Validates candidate's query against the reference query by executing both on a fresh sandbox
 * LeetCode-style data comparison:
 * Passes regardless of alias names, casing, whitespace, or whether JOIN or Subquery was used!
 */
export async function validateCandidateChallenge(candidateQuery, referenceQuery, options = { orderSensitive: false }) {
  if (!candidateQuery || !candidateQuery.trim()) {
    return {
      passed: false,
      reason: 'Please enter a SQL query before submitting for evaluation.'
    };
  }

  try {
    if (!SQL) {
      SQL = await initSqlJs({ locateFile: (file) => `/${file}` });
    }

    // Run reference query on fresh DB
    const refDb = new SQL.Database();
    refDb.run(SEED_SQL);
    const refResults = refDb.exec(referenceQuery);
    refDb.close();

    if (!refResults.length || !refResults[0].values) {
      throw new Error('Reference solution failed to produce results.');
    }

    const expectedCols = refResults[0].columns;
    const expectedValues = refResults[0].values;

    // Run candidate query on fresh DB
    const candDb = new SQL.Database();
    candDb.run(SEED_SQL);
    const candResults = candDb.exec(candidateQuery);
    candDb.close();

    if (!candResults.length || !candResults[0].values) {
      return {
        passed: false,
        reason: 'Your query returned 0 rows. Expected data matching the problem criteria.',
        expectedRowCount: expectedValues.length,
        actualRowCount: 0
      };
    }

    const actualCols = candResults[0].columns;
    const actualValues = candResults[0].values;

    // Check column count
    if (actualCols.length !== expectedCols.length) {
      return {
        passed: false,
        reason: `Column count mismatch: Expected ${expectedCols.length} column(s) (${expectedCols.join(', ')}), but your query returned ${actualCols.length} column(s).`,
        expectedRowCount: expectedValues.length,
        actualRowCount: actualValues.length
      };
    }

    // Check row count
    if (actualValues.length !== expectedValues.length) {
      return {
        passed: false,
        reason: `Row count mismatch: Expected ${expectedValues.length} row(s), but your query returned ${actualValues.length} row(s).`,
        expectedRowCount: expectedValues.length,
        actualRowCount: actualValues.length
      };
    }

    // Compare data rows
    if (options.orderSensitive) {
      for (let r = 0; r < expectedValues.length; r++) {
        for (let c = 0; c < expectedCols.length; c++) {
          if (normalizeVal(actualValues[r][c]) !== normalizeVal(expectedValues[r][c])) {
            return {
              passed: false,
              reason: `Data mismatch at row ${r + 1}, column ${actualCols[c] || c + 1}. Expected: "${expectedValues[r][c]}", Got: "${actualValues[r][c]}".`,
              expectedRowCount: expectedValues.length,
              actualRowCount: actualValues.length
            };
          }
        }
      }
    } else {
      // Sort rows by string representation before comparing to allow flexible row ordering
      const sortRows = (rows) => [...rows].map(row => row.map(normalizeVal)).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      const sortedExpected = sortRows(expectedValues);
      const sortedActual = sortRows(actualValues);

      for (let r = 0; r < sortedExpected.length; r++) {
        for (let c = 0; c < expectedCols.length; c++) {
          if (sortedActual[r][c] !== sortedExpected[r][c]) {
            return {
              passed: false,
              reason: `Data mismatch: Row values do not match expected result set. Check your WHERE filter or aggregation calculation.`,
              expectedRowCount: expectedValues.length,
              actualRowCount: actualValues.length
            };
          }
        }
      }
    }

    return {
      passed: true,
      rowCount: actualValues.length,
      columns: actualCols,
      values: actualValues
    };
  } catch (err) {
    return {
      passed: false,
      reason: `SQL Execution Error: ${err.message || String(err)}`
    };
  }
}

/**
 * Returns table schema metadata for the Schema Explorer
 */
export const SCHEMA_METADATA = [
  {
    tableName: 'employees',
    description: 'Corporate employee roster with salaries, manager links, and department keys.',
    rowCount: 12,
    columns: [
      { name: 'emp_id', type: 'INTEGER (PK)', desc: 'Unique employee ID' },
      { name: 'first_name', type: 'TEXT', desc: 'First name' },
      { name: 'last_name', type: 'TEXT', desc: 'Last name' },
      { name: 'email', type: 'TEXT', desc: 'Corporate email' },
      { name: 'department', type: 'TEXT', desc: 'Department name string' },
      { name: 'dept_id', type: 'INTEGER (FK)', desc: 'Foreign key to departments' },
      { name: 'salary', type: 'REAL', desc: 'Annual base salary ($)' },
      { name: 'manager_id', type: 'INTEGER', desc: 'Self-referencing manager emp_id' },
      { name: 'hire_date', type: 'TEXT', desc: 'Date hired (YYYY-MM-DD)' }
    ],
    sampleQuery: 'SELECT emp_id, first_name, last_name, salary, department FROM employees LIMIT 5;'
  },
  {
    tableName: 'departments',
    description: 'Organizational divisions with allocated annual operational budgets.',
    rowCount: 5,
    columns: [
      { name: 'dept_id', type: 'INTEGER (PK)', desc: 'Department ID' },
      { name: 'dept_name', type: 'TEXT', desc: 'Full human-readable department title' },
      { name: 'budget', type: 'INTEGER', desc: 'Annual operational budget ($)' },
      { name: 'location', type: 'TEXT', desc: 'Corporate branch city' }
    ],
    sampleQuery: 'SELECT * FROM departments;'
  },
  {
    tableName: 'orders',
    description: 'E-commerce platform business transaction ledgers.',
    rowCount: 6,
    columns: [
      { name: 'order_id', type: 'INTEGER (PK)', desc: 'Order tracking ID' },
      { name: 'customer_name', type: 'TEXT', desc: 'Client enterprise account name' },
      { name: 'amount', type: 'REAL', desc: 'Transaction valuation in USD' },
      { name: 'status', type: 'TEXT', desc: 'COMPLETED | PENDING | CANCELLED' },
      { name: 'order_date', type: 'TEXT', desc: 'Order placed date' }
    ],
    sampleQuery: "SELECT * FROM orders WHERE status = 'COMPLETED';"
  }
];
