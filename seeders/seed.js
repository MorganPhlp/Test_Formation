'use strict';
const { faker } = require('@faker-js/faker/locale/fr');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            // Création des personnes
            const personnes = [];
            for (let i = 0; i < 50; i++) {
                personnes.push({
                    nom: faker.person.lastName(),
                    prenom: faker.person.firstName()
                });
            }

            await queryInterface.bulkInsert('personne', personnes, { timestamps: false });

            // Récupération des IDs des personnes créées
            const personneIds = await queryInterface.sequelize.query(
                'SELECT id FROM personne;',
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            // Création des contacts
            const contacts = [];
            for (const personne of personneIds) {
                const pays = faker.helpers.arrayElement(['FR', 'UK']);
                let numero_tel; // Modification du nom de la variable

                if (pays === 'FR') {
                    numero_tel = '+336' + faker.string.numeric(8);
                } else {
                    numero_tel = '+447' + faker.string.numeric(9);
                }

                contacts.push({
                    personneId: personne.id,
                    adresse: faker.location.streetAddress(),
                    ville: faker.location.city(),
                    pays: pays,
                    numero_tel: numero_tel // Changement de telephone à numero_tel
                });
            }

            await queryInterface.bulkInsert('contact', contacts, { timestamps: false });

            // Création des personnels
            const personnels = [];
            for (const personne of personneIds) {
                const age = faker.number.int({ min: 16, max: 80 });
                const taille = faker.number.float({ min: 1.50, max: 2.10, precision: 0.01 });
                const poids = faker.number.float({ min: 45, max: 120, precision: 0.1 });

                personnels.push({
                    personneId: personne.id,
                    age: age,
                    taille: taille,
                    poids: poids
                });
            }

            await queryInterface.bulkInsert('personnel', personnels, { timestamps: false });

            console.log('Données de test générées avec succès !');
        } catch (error) {
            console.error('Erreur lors de la génération des données de test:', error);
            throw error; // Relancer l'erreur pour voir les détails complets
        }
    },

    async down(queryInterface, Sequelize) {
        // Suppression des données dans l'ordre inverse pour respecter les contraintes de clé étrangère
        await queryInterface.bulkDelete('personnel', null, {});
        await queryInterface.bulkDelete('contact', null, {});
        await queryInterface.bulkDelete('personne', null, {});
    }
};