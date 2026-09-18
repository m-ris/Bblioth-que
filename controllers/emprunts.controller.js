const pool = require('../db');

// =========================================================
// GET /api/emprunts
// Liste de tous les emprunts
// =========================================================
const getEmprunts = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                emprunts.*,
                adherents.nom AS adherent_nom,
                livres.titre AS livre_titre,
                CASE
                    WHEN emprunts.date_retour IS NOT NULL THEN 'retourne'
                    WHEN emprunts.date_retour_prevue < CURRENT_DATE THEN 'en_retard'
                    ELSE 'en_cours'
                END AS statut_emprunt
            FROM emprunts
            JOIN adherents
                ON emprunts.adherent_id = adherents.id
            JOIN livres
                ON emprunts.livre_id = livres.id
            ORDER BY emprunts.id DESC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la récupération des emprunts'
        });
    }
};


// =========================================================
// GET /api/emprunts/retard
// Liste des emprunts en retard
// =========================================================
const getEmpruntsEnRetard = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                emprunts.*,
                adherents.nom AS adherent_nom,
                livres.titre AS livre_titre,
                'en_retard' AS statut_emprunt
            FROM emprunts
            JOIN adherents
                ON emprunts.adherent_id = adherents.id
            JOIN livres
                ON emprunts.livre_id = livres.id
            WHERE emprunts.date_retour_prevue < CURRENT_DATE
            AND emprunts.date_retour IS NULL
            ORDER BY emprunts.date_retour_prevue ASC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la récupération des emprunts en retard'
        });
    }
};


// =========================================================
// GET /api/emprunts/:id
// Récupérer un emprunt par son ID
// =========================================================
const getEmpruntById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                emprunts.*,
                adherents.nom AS adherent_nom,
                livres.titre AS livre_titre,
                CASE
                    WHEN emprunts.date_retour IS NOT NULL THEN 'retourne'
                    WHEN emprunts.date_retour_prevue < CURRENT_DATE THEN 'en_retard'
                    ELSE 'en_cours'
                END AS statut_emprunt
            FROM emprunts
            JOIN adherents
                ON emprunts.adherent_id = adherents.id
            JOIN livres
                ON emprunts.livre_id = livres.id
            WHERE emprunts.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Emprunt introuvable'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la récupération de l’emprunt'
        });
    }
};


// =========================================================
// POST /api/emprunts
// Créer un emprunt
// =========================================================
const createEmprunt = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            adherent_id,
            livre_id,
            date_retour_prevue
        } = req.body;

        if (!adherent_id || !livre_id || !date_retour_prevue) {
            return res.status(400).json({
                message: 'L’adhérent, le livre et la date de retour prévue sont obligatoires'
            });
        }

        await client.query('BEGIN');

        // Vérifier que le livre existe et qu'il est disponible
        const livreResult = await client.query(
            `SELECT * FROM livres
             WHERE id = $1
             FOR UPDATE`,
            [livre_id]
        );

        if (livreResult.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(404).json({
                message: 'Livre introuvable'
            });
        }

        if (livreResult.rows[0].statut !== 'disponible') {
            await client.query('ROLLBACK');

            return res.status(400).json({
                message: 'Ce livre est déjà emprunté'
            });
        }

        // Vérifier que l'adhérent existe
        const adherentResult = await client.query(
            'SELECT * FROM adherents WHERE id = $1',
            [adherent_id]
        );

        if (adherentResult.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(404).json({
                message: 'Adhérent introuvable'
            });
        }

        // Créer l'emprunt
        const empruntResult = await client.query(
            `INSERT INTO emprunts
                (adherent_id, livre_id, date_retour_prevue)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                adherent_id,
                livre_id,
                date_retour_prevue
            ]
        );

        // Passer le livre en statut emprunté
        await client.query(
            `UPDATE livres
             SET statut = 'emprunte'
             WHERE id = $1`,
            [livre_id]
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Emprunt créé avec succès',
            emprunt: empruntResult.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');

        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la création de l’emprunt'
        });

    } finally {
        client.release();
    }
};


// =========================================================
// PUT /api/emprunts/:id/retour
// Retourner un livre
// =========================================================
const retournerLivre = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Vérifier que l'emprunt existe et n'est pas déjà retourné
        const empruntResult = await client.query(
            `SELECT * FROM emprunts
             WHERE id = $1
             FOR UPDATE`,
            [id]
        );

        if (empruntResult.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(404).json({
                message: 'Emprunt introuvable'
            });
        }

        const emprunt = empruntResult.rows[0];

        if (emprunt.date_retour !== null) {
            await client.query('ROLLBACK');

            return res.status(400).json({
                message: 'Ce livre a déjà été retourné'
            });
        }

        // Enregistrer la date de retour
        await client.query(
            `UPDATE emprunts
             SET date_retour = CURRENT_DATE
             WHERE id = $1`,
            [id]
        );

        // Remettre le livre disponible
        await client.query(
            `UPDATE livres
             SET statut = 'disponible'
             WHERE id = $1`,
            [emprunt.livre_id]
        );

        await client.query('COMMIT');

        res.json({
            message: 'Livre retourné avec succès'
        });

    } catch (error) {
        await client.query('ROLLBACK');

        console.error(error);

        res.status(500).json({
            message: 'Erreur lors du retour du livre'
        });

    } finally {
        client.release();
    }
};


// =========================================================
// EXPORTS
// =========================================================
module.exports = {
    getEmprunts,
    getEmpruntsEnRetard,
    getEmpruntById,
    createEmprunt,
    retournerLivre
};