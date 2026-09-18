const express = require('express');
const pool = require('./db');

const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');

const auteursRoutes = require('./routes/auteurs.routes');
const adherentsRoutes = require('./routes/adherents.routes');
const livresRoutes = require('./routes/livres.routes');
const empruntsRoutes = require('./routes/emprunts.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// =========================================================
// MIDDLEWARES
// =========================================================

app.use(express.json());
app.use(express.static('public'));
app.use(logger);

app.use((req, res, next) => {
    res.setHeader(
        'Content-Type',
        'application/json; charset=utf-8'
    );
    next();
});

// =========================================================
// ROUTES
// =========================================================

app.use('/api/auteurs', auteursRoutes);
app.use('/api/adherents', adherentsRoutes);
app.use('/api/livres', livresRoutes);
app.use('/api/emprunts', empruntsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// =========================================================
// ROUTE D'ACCUEIL
// =========================================================

app.get('/', (req, res) => {
    res.json({
        message: 'API Bibliothèque opérationnelle'
    });
});

// =========================================================
// TEST POSTGRESQL
// =========================================================

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            message: 'Connexion PostgreSQL réussie',
            date: result.rows[0].now
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur de connexion à PostgreSQL'
        });
    }
});


// =========================================================
// MIDDLEWARE DE GESTION DES ERREURS
// =========================================================

app.use(errorHandler);

// =========================================================
// DÉMARRAGE DU SERVEUR
// =========================================================

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});