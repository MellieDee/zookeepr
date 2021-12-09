// We can't use app any longer, because it's defined in the server.js file and can't be accessed here. 
// Instead, we'll use Router, which allows to declare routes in any file as long as you use the proper middleware.
const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');

const { animals } = require('../../data/animals');
// Notice that our app functions are making calls to filterByQuery(), findById(), createNewAnimal(), and validateAnimal(). So, we also need to import those functions that we've moved into lib/animals.js. But we also need to import the animals object that's in data/animals, because those functions make use of it.

// We'll also have to be careful in constructing relative paths to their locations. Remember that ../ is one level higher, so ../../ is two levels higher.





router.get('/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

router.get('/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

router.post('/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

module.exports = router;