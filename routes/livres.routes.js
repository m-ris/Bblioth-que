const express = require('express');

const {
    getLivres,
    getLivreById,
    createLivre,
    updateLivre,
    deleteLivre
} = require('../controllers/livres.controller');

const { validateRequired } = require('../middlewares/validation.middleware');

const router = express.Router();

router.get('/', getLivres);
router.get('/:id', getLivreById);

router.post(
    '/',
    validateRequired(['titre', 'auteur_id']),
    createLivre
);

router.put(
    '/:id',
    validateRequired(['titre', 'auteur_id']),
    updateLivre
);

router.delete('/:id', deleteLivre);

module.exports = router;