// importe le pack express
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');
require('dotenv').config();

mongoose.connect(process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// créer une application express
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

//exporter l'application pour y acceder depuis les autres fichiers
module.exports = app;








