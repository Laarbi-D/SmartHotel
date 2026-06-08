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


// Route de redirection pour les QR codes des transats
app.get("/scan", (req, res) => {
  // On récupère le numéro de transat. 
  // On gère à la fois "?transat=1" et "?/transat=1" (au cas où il y a un slash dans le QR code)
  const transatId = req.query.transat || req.query['/transat'] || "";

  // On renvoie une page web minimaliste qui lance le "deep link"
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ouverture de Smart Hotel</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f0f9ff; color: #0369a1; }
            .btn { display: inline-block; margin-top: 20px; padding: 15px 25px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
        </style>
    </head>
    <body>
        <h2>Redirection vers votre application...</h2>
        <p>Veuillez patienter.</p>
        
        <div id="fallback" style="display: none; margin-top: 30px;">
            <p>L'application ne s'est pas ouverte ?</p>
            <a href="/images/app.apk" class="btn">Télécharger l'application Android</a>
        </div>

        <script>
            // 1. Définition du lien profond vers l'appli mobile
            const appUrl = "appmobilenew://scan?transat=${transatId}";
            
            // 2. On tente de forcer l'ouverture de l'application
            window.location.replace(appUrl);

            // 3. Si l'application ne s'ouvre pas après 2.5 secondes (non installée), on affiche le bouton de secours
            setTimeout(() => {
                document.getElementById('fallback').style.display = 'block';
            }, 2500);
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => console.log(`🏨 Smart Hotel API → http://localhost:${PORT}`));

