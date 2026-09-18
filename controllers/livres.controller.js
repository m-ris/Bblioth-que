const pool = require('../db');

// GET /api/livres
// Liste des livres + recherche + pagination
const getLivres = async (req, res) => {
    try {
        const { recherche } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const offset = (page - 1) * limit;

        let whereClause = '';
        const values = [];

        // Recherche par titre ou par auteur
        if (recherche) {
            whereClause = `
                WHERE livres.titre ILIKE $1
                OR auteurs.nom ILIKE $1
            `;

            values.push(`%${recherche}%`);
        }

        // Compter le nombre total de livres
        const countQuery = `
            SELECT COUNT(*)
            FROM livres
            JOIN auteurs ON livres.auteur_id = auteurs.id
            ${whereClause}
        `;

        const countResult = await pool.query(
            countQuery,
            values
        );

        const total = parseInt(countResult.rows[0].count);

        // Récupérer les livres de la page
        const booksQuery = `
            SELECT livres.*, auteurs.nom AS auteur
            FROM livres
            JOIN auteurs ON livres.auteur_id = auteurs.id
            ${whereClause}
            ORDER BY livres.id
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        const booksResult = await pool.query(
            booksQuery,
            [...values, limit, offset]
        );

        res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            livres: booksResult.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la récupération des livres'
        });
    }
};


// GET /api/livres/:id
const getLivreById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT livres.*, auteurs.nom AS auteur
             FROM livres
             JOIN auteurs ON livres.auteur_id = auteurs.id
             WHERE livres.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Livre introuvable'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la récupération du livre'
        });
    }
};


// POST /api/livres
const createLivre = async (req, res) => {
    try {
        const {
            titre,
            auteur_id,
            annee_publication
        } = req.body;

        if (!titre || !auteur_id) {
            return res.status(400).json({
                message: 'Le titre et l’auteur sont obligatoires'
            });
        }

        const result = await pool.query(
            `INSERT INTO livres
                (titre, auteur_id, annee_publication)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                titre,
                auteur_id,
                annee_publication || null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la création du livre'
        });
    }
};


// PUT /api/livres/:id
const updateLivre = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            titre,
            auteur_id,
            annee_publication,
            statut
        } = req.body;

        if (!titre || !auteur_id) {
            return res.status(400).json({
                message: 'Le titre et l’auteur sont obligatoires'
            });
        }

        const result = await pool.query(
            `UPDATE livres
             SET titre = $1,
                 auteur_id = $2,
                 annee_publication = $3,
                 statut = $4
             WHERE id = $5
             RETURNING *`,
            [
                titre,
                auteur_id,
                annee_publication || null,
                statut || 'disponible',
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Livre introuvable'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la modification du livre'
        });
    }
};


// DELETE /api/livres/:id
const deleteLivre = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM livres WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Livre introuvable'
            });
        }

        res.json({
            message: 'Livre supprimé avec succès',
            livre: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la suppression du livre'
        });
    }
};


module.exports = {
    getLivres,
    getLivreById,
    createLivre,
    updateLivre,
    deleteLivre
};