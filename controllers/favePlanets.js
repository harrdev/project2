const express = require('express')
const router = express.Router()
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')

// INDEX ROUTE to list favorites
router.get('/', isLoggedIn, (req, res) => {
    req.user.getFaveplanets()
        .then(faves => {
            res.render('indexPlanets', { results: faves })
        })
        .catch(error => {
            console.error
        })
})
// SAVE ROUTE
router.post('/addFave', isLoggedIn, (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body))
    db.faveplanet.findOrCreate({
        where: { name: data.name },
        defaults: { gravity: data.gravity, population: data.population, terrain: data.terrain, diameter: data.diameter}
    })
        .then(([createdFave, wasCreated]) => {
            req.user.addFaveplanets(createdFave)
            console.log("DB instance created: \n", createdFave)
            res.redirect('/planets/')
        })
        .catch(error => {
            console.error
        })
})
// GET UPDATE FORM
router.get('/edit/:idx', isLoggedIn, (req, res) => {
    console.log("Edit route hit: ", req.params.idx)
    db.faveplanet.findOne({
        where: { id: req.params.idx }
    })
        .then(foundPlanet => {
            console.log("This is the planet to edit: ", foundPlanet)
            res.render('editPlanet', { planetId: req.params.idx, name: foundPlanet.faveplanet.name })
        })
        .catch(error => {
            console.error
        })
})

// // UPDATE ROUTE
router.put('/:id', (req, res) => {
    db.faveplanet
      .findByPk(req.params.id)
      .then((planet) => {
        planet.update({
          name: req.body.name,
          population: req.body.population,
          gravity: req.body.gravity,
          terrain: req.body.terrain,
          diameter: req.body.diameter,
        });
        res.redirect('favePlanets');
      })
      .catch((error) => {
        console.error(error.message);
      });
  });
// SHOW ROUTE
router.get('/:id', (req, res) => {
    console.log('this is the fave id\n', req.params.id)
    db.faveplanet.findOne({
       where: { id: req.params.id } 
    })
    .then(foundFave => {
        res.render('faveDetail', { name: foundFave.name, id: foundFave.id})
    })
    .catch(error => {
        console.error
    })
})

// DELETE ROUTE
router.delete('/:id', (req, res) => {
    console.log('this is the id: ', req.params.id)
    db.faveplanet.destroy({ 
        where: { name: req.params.id }
    })
    .then(deletedItem => {
        console.log('you deleted: ', deletedItem)
        res.redirect('/favePlanets')
    })
    .catch(error => {
        console.error
    })
})

module.exports = router