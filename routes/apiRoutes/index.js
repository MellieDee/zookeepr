const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);

module.exports = router;

//  Here we're employing Router as before, but this time we're having it use the module exported from animalRoutes.js. (Note that the .js extension is implied when supplying file names in require()).

// Doing it this way, we're using apiRoutes/index.js as a central hub for all routing functions we may want to add to the application. It may seem like overkill with just one exported module, but as your application evolves, it will become a very efficient mechanism for managing your routing code and keeping it modularized.