const express = require('express');
const { animals } = require('./data/animals');
const app = express();

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

//  ** To filter response  with accouning for some repsonse data being in an []
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
      personalityTraitsArray.forEach(trait => {
          // check trait against ea animal in the filteredResults array
          // Remember it's initially a copy of the animalsArray
          // but here we are updating it for each train in the .forEach() loop
          // For each trait being targeted by the fileter, the filteredResults array
          //will then contain only the entries that contain the trait, so at the end,
          //we'll have an array of animales that have every one of the traits 
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

app.get('/api/animals', (req,res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.listen(3001, () => {
    console.log(`API server now on port 3001`);
});

