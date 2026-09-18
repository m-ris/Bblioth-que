const express = require('express');

const {
    getAuteurs,
    getAuteurById,
    createAuteur,
    updateAuteur,
    deleteAuteur
} = require('../controllers/auteurs.controller');

const { validateRequired } = require('../middlewares/validation.middleware');

const router = express.Router();

router.get('/', getAuteurs);
router.get('/:id', getAuteurById);

router.post(
    '/',
    validateRequired(['nom']),
    createAuteur
);

router.put(
    '/:id',
    validateRequired(['nom']),
    updateAuteur
);

router.delete('/:id', deleteAuteur);

module.exports = router;