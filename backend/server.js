import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const urls = {};

app.post("/shorten", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const id = Math.random().toString(36).substring(2, 8);
  const shortUrl = `http://localhost:${PORT}/${id}`;
  urls[id] = { original: url, clicks: [] };

  res.json({ shortUrl, original: url });
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!urls[id]) return res.status(404).send("URL not found");

  if (!Array.isArray(urls[id].clicks)) urls[id].clicks = [];
  urls[id].clicks.push({ timestamp: new Date().toISOString(), referrer: req.get("Referrer") || "direct" });

  res.redirect(urls[id].original);
});

app.get("/stats/:id", (req, res) => {
  const { id } = req.params;
  if (!urls[id]) return res.status(404).json({ error: "URL not found" });

  res.json({
    id,
    original: urls[id].original,
    totalClicks: urls[id].clicks.length,
    clicks: urls[id].clicks || [],
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
