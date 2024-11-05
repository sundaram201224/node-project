// server.js

const express = require('express');
const app = express();
const cors = require('cors');
const { readDataFile, writeDataFile } = require('./helper.js');

const PORT = 4000;

app.use(express.json());
app.use(cors());

// GET/products-all products
app.get('data/products.json', async (req, res) => {
  console.log('GET /products request received');
  
  const { error, data } = await readDataFile();
  if (error) {
    console.log('Error in GET /products:', error);
    return res.status(500).send(error);
  }

  res.status(200).json(data);
});

// POST /products - Add a new product
app.post('data/products.json', async (req, res) => {
  console.log('POST /products request received with body:', req.body);
  
  const result = await readDataFile();
  console.log('Result from readDataFile:', result);

  const { error, data: jsonData } = result;
  if (error) {
    console.error('Error in reading file:', error);
    return res.status(500).send(error);
  }

  const newProduct = { id: jsonData.products.length + 1, ...req.body };
  jsonData.products.push(newProduct);

  const writeResult = await writeDataFile(jsonData);
  if (writeResult.error) return res.status(500).send(writeResult.error);

  res.status(201).json(newProduct);
});

// DELETE /products/:model - Delete a product by model name
app.delete('data/products.json/:model', async (req, res) => {
  console.log(`DELETE /products request received for model: ${req.params.model}`);

  const { error, data: jsonData } = await readDataFile();
  if (error) return res.status(500).send(error);

  const initialLength = jsonData.products.length;
  const updatedProducts = jsonData.products.filter(
    product => product.model.toLowerCase() !== req.params.model.toLowerCase()
  );

  if (updatedProducts.length === initialLength) {
    console.log(`Product with model ${req.params.model} not found`);
    return res.status(404).send('Product not found');
  }

  jsonData.products = updatedProducts;
  const writeResult = await writeDataFile(jsonData); 
  if (writeResult.error) {
    console.log('Error writing file in DELETE /products:', writeResult.error);
    return res.status(500).send(writeResult.error);
  }

  res.status(204).send();
});

// PUT /products/:id - Update a product by ID
app.put('data/products.json/:id', async (req, res) => {
  const { error, data: jsonData } = await readDataFile(); 
  if (error) return res.status(500).send(error);

  const productIndex = jsonData.products.findIndex(
    product => product.id === parseInt(req.params.id, 10)
  );

  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }

  jsonData.products[productIndex] = { ...jsonData.products[productIndex], ...req.body };
  const writeResult = await writeDataFile(jsonData);
  if (writeResult.error) return res.status(500).send(writeResult.error);

  res.status(200).json(jsonData.products[productIndex]);
});

// PATCH /products/:id - Partially update a product by ID
app.patch('data/products.json/:id', async (req, res) => {
  const { error, data: jsonData } = await readDataFile();
  if (error) return res.status(500).send(error);

  const productIndex = jsonData.products.findIndex(
    product => product.id === parseInt(req.params.id, 10)
  );

  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }

  jsonData.products[productIndex] = { ...jsonData.products[productIndex], ...req.body };
  const writeResult = await writeDataFile(jsonData); 
  if (writeResult.error) return res.status(500).send(writeResult.error);

  res.status(200).json(jsonData.products[productIndex]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
