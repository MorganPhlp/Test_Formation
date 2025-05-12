const { expect } = require('chai');
const { isValidPhoneNumber, convertToMeters } = require('../utils.js');

// Tests pour isValidPhoneNumber
describe('isValidPhoneNumber', () => {
    // Tests pour les numéros français
    it('Valide un numéro français correct avec +33', () => {
        expect(isValidPhoneNumber('+33612345678', 'FR')).to.be.true;
    });

    it('Valide un numéro français correct avec 0', () => {
        expect(isValidPhoneNumber('0612345678', 'FR')).to.be.true;
    });

    it('Valide un numéro français avec des espaces', () => {
        expect(isValidPhoneNumber('+33 6 12 34 56 78', 'FR')).to.be.true;
    });

    it('Rejette un numéro français trop court', () => {
        expect(isValidPhoneNumber('0612345', 'FR')).to.be.false;
    });

    it('Rejette un numéro français invalide', () => {
        expect(isValidPhoneNumber('0012345678', 'FR')).to.be.false;
    });

    // Tests pour les numéros britanniques
    it('Valide un numéro britannique correct avec +44', () => {
        expect(isValidPhoneNumber('+447123456789', 'UK')).to.be.true;
    });

    it('Valide un numéro britannique correct avec 0', () => {
        expect(isValidPhoneNumber('07123456789', 'UK')).to.be.true;
    });

    it('Rejette un numéro britannique trop court', () => {
        expect(isValidPhoneNumber('0712345', 'UK')).to.be.false;
    });

    it('Rejette un numéro britannique invalide', () => {
        expect(isValidPhoneNumber('06123456789', 'UK')).to.be.false;
    });

    // Test pour un pays non pris en charge
    it('Rejette un pays non pris en charge', () => {
        expect(isValidPhoneNumber('0612345678', 'US')).to.be.false;
    });
});

// Tests pour convertToMeters
describe('convertToMeters', () => {
    // Tests pour les tailles déjà en mètres
    it('Garde une taille en mètres inchangée', () => {
        expect(convertToMeters(1.75)).to.be.closeTo(1.75, 0.001);
    });

    it('Garde une taille limite basse en mètres inchangée', () => {
        expect(convertToMeters(0.1)).to.be.closeTo(0.1, 0.001);
    });

    it('Garde une taille limite haute en mètres inchangée', () => {
        expect(convertToMeters(3)).to.be.closeTo(3, 0.001);
    });

    // Tests pour les tailles en pieds
    it('Convertit correctement des pieds en mètres', () => {
        expect(convertToMeters(6)).to.be.closeTo(1.8288, 0.001);
    });

    it('Convertit correctement une taille limite basse en pieds', () => {
        expect(convertToMeters(3.1)).to.be.closeTo(0.94488, 0.001);
    });

    it('Convertit correctement une taille limite haute en pieds', () => {
        expect(convertToMeters(9.9)).to.be.closeTo(3.01752, 0.001);
    });

    // Tests pour les tailles en centimètres
    it('Convertit correctement des centimètres en mètres', () => {
        expect(convertToMeters(175)).to.be.closeTo(1.75, 0.001);
    });

    it('Convertit correctement une taille limite basse en centimètres', () => {
        expect(convertToMeters(30)).to.be.closeTo(0.3, 0.001);
    });

    it('Convertit correctement une taille limite haute en centimètres', () => {
        expect(convertToMeters(300)).to.be.closeTo(3, 0.001);
    });

    // Tests pour les erreurs
    it('Lance une erreur pour une taille négative', () => {
        expect(() => convertToMeters(-10)).to.throw();
    });

    it('Lance une erreur pour une taille de zéro', () => {
        expect(() => convertToMeters(0)).to.throw();
    });

    it('Lance une erreur pour une taille hors des plages reconnues', () => {
        expect(() => convertToMeters(1000)).to.throw();
    });
});