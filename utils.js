function isValidPhoneNumber(phoneNumber, country) {
    // Supprime les espaces et autres caractères non numériques
    const cleanedNumber = phoneNumber.replace(/[^0-9+]/g, '');

    if (country === "FR") {
        // Numéro français : doit commencer par +33 ou 0 et contenir 9 chiffres après l'indicatif
        const frenchRegex = /^(?:\+33|0)[1-9]\d{8}$/;
        return frenchRegex.test(cleanedNumber);
    } else if (country === "UK") {
        // Numéro britannique : doit commencer par +44 ou 0 et contenir 10 chiffres après l'indicatif
        const ukRegex = /^(?:\+44|0)7\d{9}$/;
        return ukRegex.test(cleanedNumber);
    } else {
        // Pays non pris en charge
        return false;
    }
}

function convertToMeters(size) {
    if (typeof size !== "number" || size <= 0) {
        throw new Error("La taille doit être un nombre positif.");
    }

    // Vérification si la taille est déjà en mètres (généralement entre 0.1 et 3 mètres pour une personne)
    if (size >= 0.1 && size <= 3) {
        return size; // Déjà en mètres
    } 
    // Vérification si la taille est en pieds (généralement entre 3 et 10 pieds pour une personne)
    else if (size >= 3 && size <= 10) {
        return size * 0.3048; // Conversion pieds en mètres
    } 
    // Vérification si la taille est en centimètres (généralement entre 30 et 300 cm pour une personne)
    else if (size >= 30 && size <= 300) {
        return size / 100; // Conversion cm en mètres
    } 
    else {
        throw new Error("La taille fournie n'est pas dans une plage raisonnable pour être interprétée.");
    }
}
