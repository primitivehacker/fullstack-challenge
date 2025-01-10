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

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM organizations").all();
  res.json({ message: "Welcome to the server! 🎉", rows });
});

app.get("/api/organizations/:orgId/deals", (req, res) => {
  const orgId = req.params.orgId;
  const { status, year } = req.query;

  let query = `
    SELECT d.*, a.name AS account_name, o.name AS organization_name
    FROM deals d
    JOIN accounts a ON d.account_id = a.id
    JOIN organizations o ON a.organization_id = o.id
    WHERE o.id = ?
  `;

  const params = [orgId];

  // Add filters for status and year
  if (status && typeof status === 'string') {
    query += ` AND d.status = ?`;
    params.push(status);
  }
  if (year && typeof year === 'string') {
    query += ` AND strftime('%Y', d.start_date) = ?`;
    params.push(year);
  }

  const deals = db.prepare(query).all(...params);

  // Calculate the total value of all deals
  const totalValue = deals.reduce<number>(
    (acc: number, deal: any) => acc + parseFloat(deal.value),
    0
  );

  res.json({ deals, totalValue });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
