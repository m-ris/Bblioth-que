const express = require('express');

const {
    getAdherents,
    getAdherentById,
    createAdherent,
    updateAdherent,
    deleteAdherent
} = require('../controllers/adherents.controller');

const { validateRequired } = require('../middlewares/validation.middleware');

const router = express.Router();

router.get('/', getAdherents);
router.get('/:id', getAdherentById);

router.post(
    '/',
    validateRequired(['nom', 'contact']),
    createAdherent
);

router.put(
    '/:id',
    validateRequired(['nom', 'contact']),
    updateAdherent
);

router.delete('/:id', deleteAdherent);

module.exports = router;