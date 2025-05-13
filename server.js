const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');

// Import des routes
const personneRoutes = require('./routes/personne');
const contactRoutes = require('./routes/contact');
const personnelRoutes = require('./routes/personnel');

// Initialisation de l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Configuration du moteur de template Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Express avec Pug', message: 'Bienvenue sur votre application Express!' });
});

// Intégration des routes
app.use('/personnes', personneRoutes);
app.use('/contacts', contactRoutes);
app.use('/personnels', personnelRoutes);

// Route 404 pour les pages non trouvées
app.use((req, res, next) => {
  res.status(404).render('error', { 
    title: 'Page non trouvée',
    message: 'La page que vous recherchez n\'existe pas.' 
  });
});

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Erreur',
    message: 'Une erreur est survenue sur le serveur.' 
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Le serveur est démarré sur le port ${port}`);
});

module.exports = app;
