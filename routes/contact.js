const express = require('express');
const router = express.Router();
const { Contact, Personne } = require('../models');

// GET - Afficher les informations de contact d'une personne
router.get('/:id', async (req, res, next) => {
    try {
        const contactId = req.params.id;
        const contact = await Contact.findByPk(contactId, {
            include: [{
                model: Personne,
                attributes: ['id', 'nom', 'prenom']
            }]
        });

        if (!contact) {
            return res.status(404).render('error', {
                title: 'Contact non trouvé',
                message: `Le contact avec l'ID ${contactId} n'existe pas.`
            });
        }

        res.render('contact/show', {
            title: `Contact de ${contact.Personne.prenom} ${contact.Personne.nom}`,
            contact: contact
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération du contact (ID: ${req.params.id}):`, error);
        next(error);
    }
});

// GET - Formulaire de modification du contact
router.get('/:id/edit', async (req, res, next) => {
    try {
        const contactId = req.params.id;
        const contact = await Contact.findByPk(contactId, {
            include: [{
                model: Personne,
                attributes: ['id', 'nom', 'prenom']
            }]
        });

        if (!contact) {
            return res.status(404).render('error', {
                title: 'Contact non trouvé',
                message: `Le contact avec l'ID ${contactId} n'existe pas.`
            });
        }

        res.render('contact/edit', {
            title: `Modifier le contact de ${contact.Personne.prenom} ${contact.Personne.nom}`,
            contact: contact
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération du contact pour modification (ID: ${req.params.id}):`, error);
        next(error);
    }
});

// POST - Traiter la modification du contact
router.post('/:id/edit', async (req, res, next) => {
    try {
        const contactId = req.params.id;
        const { adresse, ville, pays, telephone } = req.body;

        const contact = await Contact.findByPk(contactId);
        if (!contact) {
            return res.status(404).render('error', {
                title: 'Contact non trouvé',
                message: `Le contact avec l'ID ${contactId} n'existe pas.`
            });
        }

        // Mise à jour des informations
        await contact.update({
            adresse,
            ville,
            pays,
            telephone
        });

        // Redirection vers la page de détails après modification
        res.redirect(`/contacts/${contactId}`);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du contact (ID: ${req.params.id}):`, error);

        // Si c'est une erreur de validation, retourner au formulaire avec les erreurs
        if (error.name === 'SequelizeValidationError') {
            const contactId = req.params.id;
            const contact = await Contact.findByPk(contactId, {
                include: [{
                    model: Personne,
                    attributes: ['id', 'nom', 'prenom']
                }]
            });

            return res.render('contact/edit', {
                title: `Modifier le contact de ${contact.Personne.prenom} ${contact.Personne.nom}`,
                contact: contact,
                errors: error.errors.map(e => e.message),
                formData: req.body
            });
        }

        next(error);
    }
});

// Création d'un nouveau contact (pour une personne qui n'en a pas encore)
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

        res.render('contact/new', {
            title: `Ajouter un contact pour ${personne.prenom} ${personne.nom}`,
            personne: personne
        });
    } catch (error) {
        console.error(`Erreur lors de la préparation du formulaire de nouveau contact:`, error);
        next(error);
    }
});

// POST - Traiter la création d'un nouveau contact
router.post('/new/:personneId', async (req, res, next) => {
    try {
        const personneId = req.params.personneId;
        const { adresse, ville, pays, telephone } = req.body;

        // Vérifier si la personne existe
        const personne = await Personne.findByPk(personneId);
        if (!personne) {
            return res.status(404).render('error', {
                title: 'Personne non trouvée',
                message: `La personne avec l'ID ${personneId} n'existe pas.`
            });
        }

        // Vérifier si la personne a déjà un contact
        const existingContact = await Contact.findOne({ where: { personneId } });
        if (existingContact) {
            return res.status(400).render('error', {
                title: 'Contact existant',
                message: `Cette personne possède déjà un contact. Veuillez le modifier à la place.`
            });
        }

        // Création du nouveau contact
        const newContact = await Contact.create({
            personneId,
            adresse,
            ville,
            pays,
            telephone
        });

        // Redirection vers la page de détails du nouveau contact
        res.redirect(`/contacts/${newContact.id}`);
    } catch (error) {
        console.error(`Erreur lors de la création du contact:`, error);

        // Si c'est une erreur de validation, retourner au formulaire avec les erreurs
        if (error.name === 'SequelizeValidationError') {
            const personneId = req.params.personneId;
            const personne = await Personne.findByPk(personneId);

            return res.render('contact/new', {
                title: `Ajouter un contact pour ${personne.prenom} ${personne.nom}`,
                personne: personne,
                errors: error.errors.map(e => e.message),
                formData: req.body
            });
        }

        next(error);
    }
});

module.exports = router;