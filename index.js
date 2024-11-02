const express = require('express');
const app = express();
const cors = require('cors');
const { readDataFile, writeDataFile } = require('./helper');

const PORT = 4000;

app.use(express.json());
app.use(cors());

// Get all products
app.get('/products', (req, res) => {
  readDataFile((err, jsonData) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(jsonData);
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const newProduct = req.body;

  readDataFile((err, jsonData) => {
    if (err) {
      return res.status(500).send(err);
    }

    newProduct.id = jsonData.products.length + 1; // Generate a new ID
    jsonData.products.push(newProduct); // Add the new product to the list

    writeDataFile(jsonData, (writeErr) => {
      if (writeErr) {
        return res.status(500).send(writeErr);
      }
      res.status(201).json(newProduct); // Return the new product as confirmation
    });
  });
});

// Delete a product by model name
app.delete('/products/:model', (req, res) => {
  const modelName = req.params.model;

  readDataFile((err, jsonData) => {
    if (err) {
      return res.status(500).send(err);
    }

    const initialLength = jsonData.products.length;
    jsonData.products = jsonData.products.filter(
      (product) => product.model.toLowerCase() !== modelName.toLowerCase()
    );

    if (jsonData.products.length === initialLength) {
      return res.status(404).send('Product not found');
    }

    writeDataFile(jsonData, (writeErr) => {
      if (writeErr) {
        return res.status(500).send(writeErr);
      }
      res.status(204).send();
    });
  });
});

// Update a product by ID (PUT)
app.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedData = req.body;

  readDataFile((err, jsonData) => {
    if (err) {
      return res.status(500).send(err);
    }

    const productIndex = jsonData.products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      return res.status(404).send('Product not found');
    }

    jsonData.products[productIndex] = { ...jsonData.products[productIndex], ...updatedData };

    writeDataFile(jsonData, (writeErr) => {
      if (writeErr) {
        return res.status(500).send(writeErr);
      }
      res.status(200).json(jsonData.products[productIndex]);
    });
  });
});

// Partially update the product data (PATCH)
app.patch('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedFields = req.body;

  readDataFile((err, jsonData) => {
    if (err) {
      return res.status(500).send(err);
    }

    const productIndex = jsonData.products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      return res.status(404).send('Product not found');
    }

    jsonData.products[productIndex] = { ...jsonData.products[productIndex], ...updatedFields };

    writeDataFile(jsonData, (writeErr) => {
      if (writeErr) {
        return res.status(500).send(writeErr);
      }
      res.status(200).json(jsonData.products[productIndex]);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
