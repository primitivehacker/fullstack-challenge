import express from "express";
import cors from "cors";
import initializeDatabase from "./db";
const app = express();
const port = process.env.PORT || 3000;

/**
 * Welcome to the Fullstack Challenge for the Server!
 *
 * This is a basic express server.
 * You can customize and organize it to your needs.
 * Good luck!
 */
const db = initializeDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM organizations").all();
  res.json({ message: "Welcome to the server! 🎉", rows });
});

app.get("/api/organizations/:organizationId/deals", (req, res) => {
  const { organizationId } = req.params;

  try {
    const deals = db
      .prepare(
        `
      SELECT deals.id, accounts.name AS accountName, deals.status, 
             deals.start_date AS startDate, deals.end_date AS endDate, deals.value
      FROM deals
      JOIN accounts ON deals.account_id = accounts.id
      WHERE accounts.organization_id = ?
    `
      )
      .all(organizationId);

    res.json({ deals });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
