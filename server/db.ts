import Database from "better-sqlite3";

function initializeDatabase() {
  const db = new Database("./database.sqlite", { verbose: console.log });

  // Creating organizations table
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `
  ).run();

  // Creating accounts table (belongs to an organization)
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations (id)
    );
  `
  ).run();

  // Creating deals table (belongs to an account)
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      value DECIMAL(10, 2) NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES accounts (id)
    );
  `
  ).run();

  // Seed the database with some sample data
  seedDatabase(db);
  return db;
}

function seedDatabase(db: any) {
  // Insert organizations
  const org1 = db
    .prepare("INSERT INTO organizations (name) VALUES (?)")
    .run("SponsorCX");
  const org2 = db
    .prepare("INSERT INTO organizations (name) VALUES (?)")
    .run("TechCorp");

  // Insert accounts
  const account1 = db
    .prepare("INSERT INTO accounts (organization_id, name) VALUES (?, ?)")
    .run(org1.lastInsertRowid, "Account A");
  const account2 = db
    .prepare("INSERT INTO accounts (organization_id, name) VALUES (?, ?)")
    .run(org1.lastInsertRowid, "Account B");
  const account3 = db
    .prepare("INSERT INTO accounts (organization_id, name) VALUES (?, ?)")
    .run(org2.lastInsertRowid, "Account X");

  // Insert deals
  db.prepare(
    "INSERT INTO deals (account_id, start_date, end_date, value, status) VALUES (?, ?, ?, ?, ?)"
  ).run(
    account1.lastInsertRowid,
    "2023-01-01",
    "2023-12-31",
    50000.0,
    "active"
  );

  db.prepare(
    "INSERT INTO deals (account_id, start_date, end_date, value, status) VALUES (?, ?, ?, ?, ?)"
  ).run(
    account2.lastInsertRowid,
    "2024-01-01",
    "2024-12-31",
    75000.0,
    "completed"
  );

  db.prepare(
    "INSERT INTO deals (account_id, start_date, end_date, value, status) VALUES (?, ?, ?, ?, ?)"
  ).run(
    account3.lastInsertRowid,
    "2023-06-01",
    "2024-06-01",
    60000.0,
    "pending"
  );
}

export default initializeDatabase;
