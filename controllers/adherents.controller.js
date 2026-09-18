const pool = require('../db');

// GET /api/adherents
const getAdherents = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM adherents ORDER BY id'
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des adhérents'
        });
    }
};

// GET /api/adherents/:id
const getAdherentById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM adherents WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Adhérent introuvable'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de l’adhérent'
        });
    }
};

// POST /api/adherents
const createAdherent = async (req, res) => {
    try {
        const { nom, contact } = req.body;

        if (!nom || !contact) {
            return res.status(400).json({
                message: 'Le nom et le contact sont obligatoires'
            });
        }

        const result = await pool.query(
            `INSERT INTO adherents (nom, contact)
             VALUES ($1, $2)
             RETURNING *`,
            [nom, contact]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la création de l’adhérent'
        });
    }
};

// PUT /api/adherents/:id
const updateAdherent = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, contact } = req.body;

        if (!nom || !contact) {
            return res.status(400).json({
                message: 'Le nom et le contact sont obligatoires'
            });
        }

        const result = await pool.query(
            `UPDATE adherents
             SET nom = $1, contact = $2
             WHERE id = $3
             RETURNING *`,
            [nom, contact, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Adhérent introuvable'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la modification de l’adhérent'
        });
    }
};

// DELETE /api/adherents/:id
const deleteAdherent = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM adherents WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Adhérent introuvable'
            });
        }

        res.json({
            message: 'Adhérent supprimé avec succès',
            adherent: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de l’adhérent'
        });
    }
};
const getHistoriqueEmprunts = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                emprunts.id,
                emprunts.date_emprunt,
                emprunts.date_retour_prevue,
                emprunts.date_retour,
                livres.titre AS livre_titre,
                CASE
                    WHEN emprunts.date_retour IS NOT NULL THEN 'retourne'
                    WHEN emprunts.date_retour_prevue < CURRENT_DATE THEN 'en_retard'
                    ELSE 'en_cours'
                END AS statut_emprunt
            FROM emprunts
            JOIN livres
                ON emprunts.livre_id = livres.id
            WHERE emprunts.adherent_id = $1
            ORDER BY emprunts.date_emprunt DESC
        `, [id]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de l’historique des emprunts'
        });
    }
};

module.exports = {
    getAdherents,
    getAdherentById,
    createAdherent,
    updateAdherent,
    deleteAdherent,
    getHistoriqueEmprunts
};