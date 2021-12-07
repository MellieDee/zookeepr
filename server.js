const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3002;
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming json data
app.use(express.json());



//  ** To Filter Response - original
// function filterByQuery(query, animalsArray) {
//     let filteredResults = animalsArray;
//     if(query.diet) {
//         filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
//     }
//     if (query.species) {
//         filteredResults = filteredResults.filter(animal => animal.species === query.species);
//     }
//     if (query.name) {
//         filteredResults = filteredResults.filter(animal => animal.name === query.name);
//     }
//     return filteredResults;
// };

//  ** Function for GET 1: To filter response  with accounting for some repsonse data being in an []
// param = query & animalsArray; arguments = req.query & results in filterByQuery in the GET 1  callback function
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  //Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array & save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    //  Loop through each trait in the pT Array:
    // check trait against ea animal in the filteredResults array
    // Remember it's initially a copy of the animalsArray
    // but here we are updating it for each train in the .forEach() loop
    // For each trait being targeted by the fileter, the filteredResults array
    // will then contain only the entries that contain the trait, so at the end,
    // we'll have an array of animales that have every one of the traits 
    personalityTraitsArray.forEach(trait => {
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}


// function in prep for GET 2 (11.1.7)
function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}


// ** NEW ANIMAL funciton  11.2.4 to 11.2.6**
function createNewAnimal(body, animalsArray) {
  //  body is what json type
  const animal = body;
  animalsArray.push(animal);
  //sync vs doesnt require call back - sinch small data ok larger would want async vs writeFile()
  fs.writeFileSync(
    // __dirname =  dir we execute the code in
    path.join(__dirname, './data/animals.json'),
    // need to save the js array as JSON so stringify
    // null means dont edit exisitng
    // 2 means create white space between to make more readable
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  //return finished code to post route for response
  return animal;
}


// VALIDATE data
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}


// GET 1: animals GENERAL w/queries use req.query for combining multiple parameters "multifacited"
// GET has 2 arguments a) string of path b) callback function exec each time path accessed
app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});


// GET 2: animals by ID & param: Use req.params to search for SINGLE record (param needs to come AFTER query)
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});


// POST route function
// req.body is where our incoming content will be 
// set id based on what next index of the animalsArray will be
// When we receive new post data to be added to the animals.json file, we'll take the length property of animals array (because it's a one-to-one representation of our animals.json file data)
//Set that as the id for the new data. Remember, the length property is always going to be one number ahead of the last index of the array so we can avoid any duplicate values.

app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});


//  PORT that is actively used open to use port assigned by Heroku (80) or default to 3002
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
