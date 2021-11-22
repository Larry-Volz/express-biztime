DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS industry_company;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry_name text NOT NULL UNIQUE
);

CREATE TABLE industry_company (
    id serial PRIMARY KEY,
    indust_code text NOT NULL,
    comp_code text NOT NULL
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO industries (code, industry_name)
  VALUES ('act','accounting'),
         ('ent','entertainment'),
         ('hr','human resources');

INSERT INTO industry_company (indust_code, comp_code)
  VALUES ('act','apple'),
         ('act','ibm'),
         ('ent', 'ibm'),
         ('hr','apple'),
         ('hr','ibm');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);
