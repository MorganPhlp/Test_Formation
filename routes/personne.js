const express = require('express');
const router = express.Router();
const { Personne, Contact, Personnel } = require('../models');

// GET - Liste de toutes les personnes
router.get('/', async (req, res, next) => {
    try {
        const personnes = await Personne.findAll({
            attributes: ['id', 'nom', 'prenom', 'date_adhesion'],
            order: [['nom', 'ASC'], ['prenom', 'ASC']]
        });

        res.render('personne/index', {
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

        res.render('personne/details', { // Modifié de personnes/details à personne/details
            title: `${personne.prenom} ${personne.nom}`,
            personne: personne
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération de la personne (ID: ${req.params.id}):`, error);
        next(error);
    }
});

// GET - Affiche le formulaire pour modifier la date d'adhésion
router.get('/:id/edit-date', async (req, res, next) => {
    try {
        const personneId = req.params.id;
        const personne = await Personne.findByPk(personneId);

        if (!personne) {
            return res.status(404).render('error', {
                title: 'Personne non trouvée',
                message: `La personne avec l'ID ${personneId} n'existe pas.`
            });
        }

        res.render('personne/edit-date', {
            title: `Modifier la date d'adhésion de ${personne.prenom} ${personne.nom}`,
            personne: personne
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération de la personne (ID: ${req.params.id}):`, error);
        next(error);
    }
});

// POST - Traite la modification de la date d'adhésion
router.post('/:id/edit-date', async (req, res, next) => {
    try {
        const personneId = req.params.id;
        const { date_adhesion } = req.body;
        
        const personne = await Personne.findByPk(personneId);

        if (!personne) {
            return res.status(404).render('error', {
                title: 'Personne non trouvée',
                message: `La personne avec l'ID ${personneId} n'existe pas.`
            });
        }

        // Mise à jour de la date d'adhésion
        await personne.update({ 
            date_adhesion: date_adhesion || null 
        });

        // Redirection vers la liste des personnes
        res.redirect('/personnes');
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la date d'adhésion (ID: ${req.params.id}):`, error);
        next(error);
    }
});

module.exports = router;

