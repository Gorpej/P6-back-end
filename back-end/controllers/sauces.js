const Sauce = require('../models/Sauces');

const fs = require('fs');

// creation de sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// recupere les auce dans la base de donnée
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};

//recupere une sauce dans la base de donnée
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({ error: error });
        });
};

//verifie son id  et modifie ce que l'utilisateur souhaite
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.userId != sauce.userId) {
                console.log('Vous ne pouvez pas modifier cette item')
            } else {
                const sauceObject = req.file ?
                    {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    } : { ...req.body };
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
};

//supprime la sauce selectionné
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id, userId:res.locals.userId})
    .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })

        .catch(error => res.status(500).json({ error }));
};

// gére le like dislike et l'annulation . Envoi l'id de l'utilisateur et le like dans la base donnée 
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    switch (like) {
        case 1:
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        console.log('Vous n\'avez pas l\'accès requis')
                    } else {
                        Sauce.updateOne({ _id: req.params.id },
                            {
                                $push: { usersLiked: req.body.userId },
                                $inc: { likes: +1 }
                            })
                            .then(() => res.status(200).json({ message: 'Like enregistré' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
            break;
        case -1:
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        console.log('Vous n\'avez pas l\'accès requis')
                    } else {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $push: { usersDisliked: req.body.userId },
                            $inc: { dislikes: +1 }
                        })
                            .then(() => res.status(200).json({ message: 'Dislike enregistré' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
            break;
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $pull: { usersLiked: req.body.userId },
                            $inc: { likes: -1 }
                        })
                            .then(() => res.status(200).json({ message: 'like est annulé' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 }
                        })
                            .then(() => res.status(200).json({ message: 'dislike est annulé' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
            break;
        default:
    }
};