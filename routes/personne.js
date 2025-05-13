const express = require('express');
const router = express.Router();
const { Personne, Contact, Personnel } = require('../models');

// GET - Liste de toutes les personnes
router.get('/', async (req, res, next) => {
    try {
        const personnes = await Personne.findAll({
            attributes: ['id', 'nom', 'prenom'],
            order: [['nom', 'ASC'], ['prenom', 'ASC']]
        });

        res.render('personne/index', {  // Changé de personnes/liste à personne/index
            title: 'Liste des personnes',
            personnes: personnes
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des personnes:', error);
        next(error);
    }
});

// GET - Détails d'une personne spécifique
router.get('/:id', async (req, res, next) => {
    try {
        const personneId = req.params.id;
        const personne = await Personne.findByPk(personneId, {
            include: [
                {
                    model: Contact,
                    as: 'contact'
                },
                {
                    model: Personnel,
                    as: 'personnel'
                }
            ]
        });

        if (!personne) {
            return res.status(404).render('error', {
                title: 'Personne non trouvée',
                message: `La personne avec l'ID ${personneId} n'existe pas.`
            });
        }

        res.render('personnes/details', {
            title: `${personne.prenom} ${personne.nom}`,
            personne: personne
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération de la personne (ID: ${req.params.id}):`, error);
        next(error);
    }
});

module.exports = router;