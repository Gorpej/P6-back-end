// importe le pack express
const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Thing = require('./models/Thing');

const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://TrainingDevOC:upYYdgfYA8EWDMIT@cluster0.cxtyq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// créer une application express
const app = express();
// écoute ce que l'on recoit avec la methode get à la route indiquer
// app.get(./)


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// app.use(bodyParser.json());

// app.post('/api/auth/signup', (req, res, next) => {
//   const thing = new Thing({
//     ...req.body
//   });
//   thing.save()
//     .then(() => res.status(201).json({ message: 'Objet enregistré!' }))
//     .catch(error => res.status(400).json({ error }));
// });

// app.use('/api/auth/signup', (req, res, next) => {
//   Thing.find()
//     .then(things => res.status(200).json(things))
//     .catch(error => res.status(400).json({ error }));
// });

app.use('./api/auth', userRoutes);

//exporter l'application pour y acceder depuis les autres fichiers
module.exports = app;








