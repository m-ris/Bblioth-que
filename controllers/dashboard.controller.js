const pool = require('../db');

// GET /api/dashboard
const getDashboard = async (req, res) => {
    try {

        // =====================================================
        // 1. Nombre total de livres
        // =====================================================
        const livresResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM livres
        `);


        // =====================================================
        // 2. Nombre total d'adhérents
        // =====================================================
        const adherentsResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM adherents
        `);


        // =====================================================
        // 3. Nombre d'emprunts en cours
        // =====================================================
        const empruntsEnCoursResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM emprunts
            WHERE date_retour IS NULL
            AND date_retour_prevue >= CURRENT_DATE
        `);


        // =====================================================
        // 4. Nombre d'emprunts en retard
        // =====================================================
        const empruntsEnRetardResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM emprunts
            WHERE date_retour IS NULL
            AND date_retour_prevue < CURRENT_DATE
        `);


        // =====================================================
        // 5. Livre le plus emprunté
        // =====================================================
        const livrePlusEmprunteResult = await pool.query(`
            SELECT
                livres.id,
                livres.titre,
                COUNT(emprunts.id) AS nombre_emprunts
            FROM livres
            JOIN emprunts
                ON livres.id = emprunts.livre_id
            GROUP BY livres.id, livres.titre
            ORDER BY nombre_emprunts DESC
            LIMIT 1
        `);


        // =====================================================
        // 6. Adhérent le plus actif
        // =====================================================
        const adherentPlusActifResult = await pool.query(`
            SELECT
                adherents.id,
                adherents.nom,
                COUNT(emprunts.id) AS nombre_emprunts
            FROM adherents
            JOIN emprunts
                ON adherents.id = emprunts.adherent_id
            GROUP BY adherents.id, adherents.nom
            ORDER BY nombre_emprunts DESC
            LIMIT 1
        `);


        // =====================================================
        // Réponse du Dashboard
        // =====================================================
        res.json({
            totalLivres: parseInt(livresResult.rows[0].total),

            totalAdherents: parseInt(
                adherentsResult.rows[0].total
            ),

            empruntsEnCours: parseInt(
                empruntsEnCoursResult.rows[0].total
            ),

            empruntsEnRetard: parseInt(
                empruntsEnRetardResult.rows[0].total
            ),

            livrePlusEmprunte:
                livrePlusEmprunteResult.rows.length > 0
                    ? {
                        id: livrePlusEmprunteResult.rows[0].id,
                        titre: livrePlusEmprunteResult.rows[0].titre,
                        nombreEmprunts: parseInt(
                            livrePlusEmprunteResult.rows[0].nombre_emprunts
                        )
                    }
                    : null,

            adherentPlusActif:
                adherentPlusActifResult.rows.length > 0
                    ? {
                        id: adherentPlusActifResult.rows[0].id,
                        nom: adherentPlusActifResult.rows[0].nom,
                        nombreEmprunts: parseInt(
                            adherentPlusActifResult.rows[0].nombre_emprunts
                        )
                    }
                    : null
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
};


module.exports = {
    getDashboard
};