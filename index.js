const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const PORT = 4000;

app.use(express.json());
app.use(cors());

// Get all products
app.get('/products', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/products.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the data file');
    }
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(data);
  });
});

//Add a new product
app.post('/products', (req, res) => {
  const newProduct = req.body;

  fs.readFile(path.join(__dirname, 'data/products.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the data file');
    }

    const jsonData = JSON.parse(data); // Parses existing data into JSON
    newProduct.id = jsonData.products.length + 1; // Generates a new ID
    jsonData.products.push(newProduct); // Adds the new product to the list

    fs.writeFile(path.join(__dirname, 'data/products.json'), JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing the data file');
      }
      res.status(201).json(newProduct); // Returns the new product as confirmation
    });
  });
});

// Delete a product by model name
app.delete('/products/:model', (req, res) => {
  const modelName = req.params.model;

  fs.readFile(path.join(__dirname, 'data/products.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the data file');
    }

    const jsonData = JSON.parse(data);
    const initialLength = jsonData.products.length;

    // Filter out the product with the specified model name
    jsonData.products = jsonData.products.filter(
      (product) => product.model.toLowerCase() !== modelName.toLowerCase()
    );

    if (jsonData.products.length === initialLength) {
      return res.status(404).send('Product not found');
    }

    fs.writeFile(path.join(__dirname, 'data/products.json'), JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing the data file');
      }
      res.status(204).send();
    });
  });
});
//Put is used to change certain in the data/product 
app.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedData = req.body;

  fs.readFile(path.join(__dirname, 'data/products.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the data file');
    }

    const jsonData = JSON.parse(data);
    const productIndex = jsonData.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      return res.status(404).send('Product not found');
    }

    jsonData.products[productIndex] = { ...jsonData.products[productIndex], ...updatedData };

    fs.writeFile(path.join(__dirname, 'data/products.json'), JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing the data file');
      }
      res.status(200).json(jsonData.products[productIndex]);
    });
  });
});
// Partially update the product data
app.patch('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedFields = req.body; // Only specified fields

  fs.readFile(path.join(__dirname, 'data/products.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the data file');
    }

    const jsonData = JSON.parse(data);
    const productIndex = jsonData.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      return res.status(404).send('Product not found');
    }

    // Update only the provided fields
    jsonData.products[productIndex] = { ...jsonData.products[productIndex], ...updatedFields };

    fs.writeFile(path.join(__dirname, 'data/products.json'), JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing the data file');
      }
      res.status(200).json(jsonData.products[productIndex]);
    });
  });
});

//console commanding for everythings
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
