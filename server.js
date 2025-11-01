import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 5500;

// ES Modules için __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Statik dosyaları sun
app.use(express.static(path.join(__dirname, "public")));

// Tüm bilinmeyen URL’leri index.html’e yönlendir
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(port, () => {
  console.log(`SPA sunucu çalışıyor: http://localhost:${port}`);
});
