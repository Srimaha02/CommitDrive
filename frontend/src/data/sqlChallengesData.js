// Curated Real Placement SQL Challenges — CommitDrive
// Categorized by Company Tiers (TCS/Infosys, FinTech/Tier-1, FAANG/Amazon)

export const SQL_CHALLENGES = [
  {
    id: 'tcs-high-earners',
    tier: 'Service Tier (TCS / Infosys / Wipro)',
    level: 'L100 (Foundational)',
    badgeColor: '#16a34a',
    title: 'Filter High-Earning Software Engineers',
    companyTags: ['TCS NQT', 'Infosys DSE', 'Wipro Turbo'],
    description: 'Find the `first_name`, `last_name`, and `salary` of all employees in the "Engineering" department who earn more than $85,000 annually. Sort the results in descending order of salary.',
    starterQuery: "SELECT first_name, last_name, salary \nFROM employees \nWHERE department = 'Engineering' AND salary > 85000\nORDER BY salary DESC;",
    expectedQuery: "SELECT first_name, last_name, salary FROM employees WHERE department = 'Engineering' AND salary > 85000 ORDER BY salary DESC;",
    orderSensitive: true,
    hint: 'Use `WHERE department = \'Engineering\' AND salary > 85000` combined with `ORDER BY salary DESC`.',
    concept: 'Filtering tuples using compound Boolean predicates (`AND`) and single-column sorting.'
  },
  {
    id: 'tcs-payroll-by-dept',
    tier: 'Service Tier (TCS / Infosys / Wipro)',
    level: 'L100 (Foundational)',
    badgeColor: '#16a34a',
    title: 'Department Headcount & Payroll Summary',
    companyTags: ['TCS Digital', 'Accenture', 'Cognizant GenC'],
    description: 'Management needs an organizational audit. For each `department`, calculate the total number of employees (`total_employees`) and the sum of all salaries in that department (`total_payroll`). Sort departments alphabetically by name.',
    starterQuery: "SELECT department, COUNT(*) AS total_employees, SUM(salary) AS total_payroll\nFROM employees\nGROUP BY department\nORDER BY department ASC;",
    expectedQuery: "SELECT department, COUNT(*) AS total_employees, SUM(salary) AS total_payroll FROM employees GROUP BY department ORDER BY department ASC;",
    orderSensitive: true,
    hint: 'Combine `GROUP BY department` with the aggregate functions `COUNT(*)` and `SUM(salary)`.',
    concept: 'Aggregate computation across categorical buckets with multi-row projection.'
  },
  {
    id: 'fintech-dept-having',
    tier: 'FinTech / Tier-1 (Razorpay / CRED / Swiggy)',
    level: 'L200 (Core Engineering)',
    badgeColor: '#ea580c',
    title: 'High-Budget Departments with HAVING Filter',
    companyTags: ['Razorpay', 'PhonePe', 'CRED'],
    description: 'Identify all departments that have 3 or more employees AND an average salary strictly greater than $70,000. Return `department`, the total headcount (`headcount`), and the average salary (`avg_salary`).',
    starterQuery: "SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING COUNT(*) >= 3 AND AVG(salary) > 70000;",
    expectedQuery: "SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING COUNT(*) >= 3 AND AVG(salary) > 70000;",
    orderSensitive: false,
    hint: 'Remember that aggregate constraints (`COUNT(*) >= 3` and `AVG(salary) > 70000`) must be placed in `HAVING`, not `WHERE`.',
    concept: 'Post-aggregation partition pruning via the `HAVING` clause.'
  },
  {
    id: 'fintech-inner-join',
    tier: 'FinTech / Tier-1 (Razorpay / CRED / Swiggy)',
    level: 'L200 (Core Engineering)',
    badgeColor: '#ea580c',
    title: 'Relational Join: Employee Location Directory',
    companyTags: ['Swiggy', 'Zomato', 'Paytm'],
    description: 'Produce a corporate directory report joining `employees` with `departments`. Return the employee\'s `first_name`, `last_name`, their human-readable department title `dept_name`, and corporate `location`. Only include employees with an assigned `dept_id`.',
    starterQuery: "SELECT e.first_name, e.last_name, d.dept_name, d.location\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.dept_id;",
    expectedQuery: "SELECT e.first_name, e.last_name, d.dept_name, d.location FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id;",
    orderSensitive: false,
    hint: 'Use `INNER JOIN departments d ON e.dept_id = d.dept_id` to link foreign keys to primary keys.',
    concept: 'Relational equijoin matching foreign keys with primary keys using hash or index lookup.'
  },
  {
    id: 'faang-second-highest-salary',
    tier: 'FAANG / Product (Amazon / Microsoft / Uber)',
    level: 'L300 (FAANG Mastery)',
    badgeColor: '#9333ea',
    title: 'Second Highest Salary in Company (Classic FAANG)',
    companyTags: ['Amazon SDE-1', 'Microsoft', 'Oracle OCI'],
    description: 'Find the second highest salary among all employees in the company. Return a single row with the column named `second_highest_salary`. Do not hardcode numbers.',
    starterQuery: "SELECT MAX(salary) AS second_highest_salary\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);",
    expectedQuery: "SELECT MAX(salary) AS second_highest_salary FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);",
    orderSensitive: false,
    hint: 'A subquery `(SELECT MAX(salary) FROM employees)` gets the top salary ($145,000). The outer query finds the `MAX(salary)` that is less than that benchmark.',
    concept: 'Scalar subquery filtering for non-correlated N-th order ranking.'
  },
  {
    id: 'faang-dense-rank-window',
    tier: 'FAANG / Product (Amazon / Microsoft / Uber)',
    level: 'L300 (FAANG Mastery)',
    badgeColor: '#9333ea',
    title: 'Department-Wise Salary Ranking (Window Function)',
    companyTags: ['Amazon', 'Google', 'Uber'],
    description: 'Rank all employees within their respective departments based on their salary from highest to lowest. Return `first_name`, `department`, `salary`, and their rank as `salary_rank` using `DENSE_RANK() OVER (...)`. Sort output by `department` ascending and `salary_rank` ascending.',
    starterQuery: "SELECT first_name, department, salary,\n       DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank\nFROM employees\nORDER BY department ASC, salary_rank ASC;",
    expectedQuery: "SELECT first_name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM employees ORDER BY department ASC, salary_rank ASC;",
    orderSensitive: true,
    hint: 'Use `DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank`. Then order the final query by `department ASC, salary_rank ASC`.',
    concept: 'Analytical window partition framing preserving individual tuple identity without collapse.'
  },
  {
    id: 'faang-earn-more-than-manager',
    tier: 'FAANG / Product (Amazon / Microsoft / Uber)',
    level: 'L300 (FAANG Mastery)',
    badgeColor: '#9333ea',
    title: 'Employees Earning More Than Their Manager (Self-Join)',
    companyTags: ['Bloomberg', 'Amazon', 'Goldman Sachs'],
    description: 'Write a self-join query to find all employees who earn more than their direct manager. Return the employee\'s `first_name` (as `employee_name`), their salary (`employee_salary`), and their manager\'s salary (`manager_salary`).',
    starterQuery: "SELECT e.first_name AS employee_name, e.salary AS employee_salary, m.salary AS manager_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nWHERE e.salary > m.salary;",
    expectedQuery: "SELECT e.first_name AS employee_name, e.salary AS employee_salary, m.salary AS manager_salary FROM employees e JOIN employees m ON e.manager_id = m.emp_id WHERE e.salary > m.salary;",
    orderSensitive: false,
    hint: 'Self-join `employees` as `e` with `employees` as `m` on `e.manager_id = m.emp_id`, then filter `WHERE e.salary > m.salary`.',
    concept: 'Self-referencing hierarchical graph traversal via table aliasing.'
  }
];
