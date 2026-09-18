const pool = require('../db');

// GET /api/auteurs
const getAuteurs = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM auteurs ORDER BY id'
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des auteurs'
        });
    }
};

// GET /api/auteurs/:id
const getAuteurById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM auteurs WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Auteur introuvable'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de l’auteur'
        });
    }
};

// POST /api/auteurs
const createAuteur = async (req, res) => {
    try {
        const { nom, nationalite } = req.body;

        if (!nom) {
            return res.status(400).json({
                message: 'Le nom de l’auteur est obligatoire'
            });
        }

        const result = await pool.query(
            `INSERT INTO auteurs (nom, nationalite)
             VALUES ($1, $2)
             RETURNING *`,
            [nom, nationalite || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la création de l’auteur'
        });
    }
};

// PUT /api/auteurs/:id
const updateAuteur = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, nationalite } = req.body;

        if (!nom) {
            return res.status(400).json({
                message: 'Le nom de l’auteur est obligatoire'
            });
        }

        const result = await pool.query(
            `UPDATE auteurs
             SET nom = $1, nationalite = $2
             WHERE id = $3
             RETURNING *`,
            [nom, nationalite || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Auteur introuvable'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la modification de l’auteur'
        });
    }
};

// DELETE /api/auteurs/:id
const deleteAuteur = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM auteurs WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Auteur introuvable'
            });
        }

        res.json({
            message: 'Auteur supprimé avec succès',
            auteur: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de l’auteur'
        });
    }
};

module.exports = {
    getAuteurs,
    getAuteurById,
    createAuteur,
    updateAuteur,
    deleteAuteur
};