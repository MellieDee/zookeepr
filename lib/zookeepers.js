const fs = require('fs');
const path = require('path');

function filterByQuery(query, zookeepers) {
  let filteredResults = zookeepers;
  if (query.age) {
    filteredResults = filteredResults.filter(
      //since our form data will be coming in as strings and our JSON storesage
      //as a Number, me need to convert query string to #
      //in order to compare the two
      (zookeeper) => zookeeper.age === Number(query.age)
    );
  }

  if (query.favoriteAnimal) {
    filteredResults = filteredResults.filter(
      (zookeeper) => zookeeper.favoriteAnimal === query.favoriteAnimal
    );
  }

  if (query.name) {
    filteredResults = filteredResults.filter( 
      (zookeeper) => zookeeper.name === query.name
    );
  }
  return filteredResults;
}


