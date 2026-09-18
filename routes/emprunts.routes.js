const express = require('express');

const {
    getEmprunts,
    getEmpruntsEnRetard,
    getEmpruntById,
    createEmprunt,
    retournerLivre
} = require('../controllers/emprunts.controller');

const { validateRequired } = require('../middlewares/validation.middleware');

const router = express.Router();

// Liste de tous les emprunts
router.get('/', getEmprunts);

// Liste des emprunts en retard
router.get('/retard', getEmpruntsEnRetard);

// Créer un emprunt
router.post(
    '/',
    validateRequired([
        'adherent_id',
        'livre_id',
        'date_retour_prevue'
    ]),
    createEmprunt
);

// Retourner un livre
router.put('/:id/retour', retournerLivre);

// Récupérer un emprunt par son ID
router.get('/:id', getEmpruntById);

module.exports = router;