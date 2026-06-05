const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();



app.use(cors({
  origin: process.env.CORS_ORIGIN === "*" ? "*" : process.env.CORS_ORIGIN,
}));
app.use(express.json());

const path = require('path');
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));

app.use("/api/auth",      require("./routes/auth"));
app.use("/api/commandes", require("./routes/commandes"));
app.use("/api/produits",  require("./routes/produits"));
app.use("/api/employes",  require("./routes/employes"));
app.use("/api/clients",   require("./routes/clients"));

app.get("/api/ping", (_, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🏨 Smart Hotel API → http://localhost:${PORT}`));

