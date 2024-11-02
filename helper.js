// helper.js
const fs = require('fs');
const path = require('path');

// Path to the products file
const filePath = path.join(__dirname, 'data/products.json');

// Common function to read the products file
const readDataFile = (callback) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(`Error reading the data file: ${err.message}`, null);
    } else {
      try {
        const jsonData = JSON.parse(data);
        callback(null, jsonData);
      } catch (parseErr) {
        callback(`Error parsing the data file: ${parseErr.message}`, null);
      }
    }
  });
};

// Common function to write the products file
const writeDataFile = (data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      callback(`Error writing the data file: ${err.message}`);
    } else {
      callback(null);
    }
  });
};

// Exporting the functions for use in other files
module.exports = {
  readDataFile,
  writeDataFile,
};
