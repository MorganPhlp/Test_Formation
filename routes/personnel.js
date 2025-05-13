const express = require('express');
const router = express.Router();
const { Personnel, Personne } = require('../models');
const { convertToMeters } = require('../utils');

// GET - Afficher les informations personnelles d'une personne
router.get('/:id', async (req, res, next) => {
    try {
        const personnelId = req.params.id;
        const personnel = await Personnel.findByPk(personnelId, {
            include: [{
                model: Personne,
                attributes: ['id', 'nom', 'prenom']
            }]
        });

        if (!personnel) {
            return res.status(404).render('error', {
                title: 'Informations personnelles non trouvées',
                message: `Les informations personnelles avec l'ID ${personnelId} n'existent pas.`
            });
        }

        res.render('personnel/show', {
            title: `Informations personnelles de ${personnel.Personne.prenom} ${personnel.Personne.nom}`,
            personnel: personnel
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération des informations personnelles (ID: ${req.params.id}):`, error);
        next(error);
    }
});

// GET - Formulaire de modification des informations personnelles
router.get('/:id/edit', async (req, res, next) => {
    try {
        const personnelId = req.params.id;
        const personnel = await Personnel.findByPk(personnelId, {
            include: [{
                model: Personne,
                attributes: ['id', 'nom', 'prenom']
            }]
        });

        if (!personnel) {
            return res.status(404).render('error', {
                title: 'Informations personnelles non trouvées',
                message: `Les informations personnelles avec l'ID ${personnelId} n'existent pas.`
            });
        }

        res.render('personnel/edit', {
            title: `Modifier les informations personnelles de ${personnel.Personne.prenom} ${personnel.Personne.nom}`,
            personnel: personnel
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération des informations personnelles pour modification (ID: ${req.params.id}):`, error);
        next(error);
    }
});

// POST - Traiter la modification des informations personnelles
router.post('/:id', async (req, res, next) => {
    try {
        const personnelId = req.params.id;
        const { age, taille, poids } = req.body;
        let tailleEnMetres = parseFloat(taille);

        const personnel = await Personnel.findByPk(personnelId, {
            include: [{ model: Personne }]
        });
        
        if (!personnel) {
            return res.status(404).render('error', {
                title: 'Informations personnelles non trouvées',
                message: `Les informations personnelles avec l'ID ${personnelId} n'existent pas.`
            });
        }

        // Conversion de la taille avec la fonction utils
        try {
            if (tailleEnMetres) {
                tailleEnMetres = convertToMeters(tailleEnMetres);
            }
        } catch (error) {
            return res.render('personnel/edit', {
                title: `Modifier les informations personnelles de ${personnel.Personne.prenom} ${personnel.Personne.nom}`,
                personnel: {
                    ...personnel.get({ plain: true }),
                    age,
                    taille,
                    poids
                },
                errors: [error.message]
            });
        }

        // Mise à jour des informations
        await personnel.update({
            age: Number(age) || null,
            taille: tailleEnMetres || null,
            poids: Number(poids) || null
        });

        // Redirection vers la page de détails après modification
        res.redirect(`/personnels/${personnelId}`);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour des informations personnelles (ID: ${req.params.id}):`, error);

        // Si c'est une erreur de validation, retourner au formulaire avec les erreurs
        if (error.name === 'SequelizeValidationError') {
            const personnelId = req.params.id;
            const personnel = await Personnel.findByPk(personnelId, {
                include: [{
                    model: Personne,
                    attributes: ['id', 'nom', 'prenom']
                }]
            });

            return res.render('personnel/edit', {
                title: `Modifier les informations personnelles de ${personnel.Personne.prenom} ${personnel.Personne.nom}`,
                personnel: {
                    ...personnel.get({ plain: true }),
                    ...req.body
                },
                errors: error.errors.map(e => e.message)
            });
        }

        next(error);
    }
});

// Création de nouvelles informations personnelles (pour une personne qui n'en a pas encore)
router.get('/new/:personneId', async (req, res, next) => {
    try {
        const personneId = req.params.personneId;
        const personne = await Personne.findByPk(personneId);

        if (!personne) {
            return res.status(404).render('error', {
                title: 'Personne non trouvée',
                message: `La personne avec l'ID ${personneId} n'existe pas.`
            });
        }

        res.render('personnel/new', {
            title: `Ajouter des informations personnelles pour ${personne.prenom} ${personne.nom}`,
            personne: personne
        });
    } catch (error) {
        console.error(`Erreur lors de la préparation du formulaire pour nouvelles informations personnelles:`, error);
        next(error);
    }
});

// POST - Traiter la création de nouvelles informations personnelles
router.post('/new/:personneId', async (req, res, next) => {
    try {
        const personneId = req.params.personneId;
        const { age, taille, poids } = req.body;

        // Vérifier si la personne existe
        const personne = await Personne.findByPk(personneId);
        if (!personne) {
            return res.status(404).render('error', {
                title: 'Personne non trouvée',
                message: `La personne avec l'ID ${personneId} n'existe pas.`
            });
        }

        // Vérifier si la personne a déjà des informations personnelles
        const existingPersonnel = await Personnel.findOne({ where: { personneId } });
        if (existingPersonnel) {
            return res.status(400).render('error', {
                title: 'Informations personnelles existantes',
                message: `Cette personne possède déjà des informations personnelles. Veuillez les modifier à la place.`
            });
        }

        // Création des nouvelles informations personnelles
        const newPersonnel = await Personnel.create({
            personneId,
            age: Number(age),
            taille: Number(taille),
            poids: Number(poids)
        });

        // Redirection vers la page de détails des nouvelles informations personnelles
        res.redirect(`/personnels/${newPersonnel.id}`);
    } catch (error) {
        console.error(`Erreur lors de la création des informations personnelles:`, error);

        // Si c'est une erreur de validation, retourner au formulaire avec les erreurs
        if (error.name === 'SequelizeValidationError') {
            const personneId = req.params.personneId;
            const personne = await Personne.findByPk(personneId);

            return res.render('personnel/new', {
                title: `Ajouter des informations personnelles pour ${personne.prenom} ${personne.nom}`,
                personne: personne,
                errors: error.errors.map(e => e.message),
                formData: req.body
            });
        }

        next(error);
    }
});

module.exports = router;
