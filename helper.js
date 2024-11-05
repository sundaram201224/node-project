const path = require('path'); 
const fs = require('fs').promises;

// Define the path to the data file
const filePath = path.join(__dirname, 'data/products.json');

// Function to read data from the file
export const readDataFile = async () => {
  console.log(`Reading file from path: ${filePath}`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    console.log('File content read successfully');
    return { error: null, data: JSON.parse(fileContent) };
  } catch (error) {
    console.log(`Error reading file: ${error.message}`);
    return { error: `Error reading the data file: ${error.message}`, data: null };
  }
};

// Function to write data to the file with error handling
export const writeDataFile = async (data) => {
  console.log(`Writing to file at path: ${filePath}`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log('File written successfully');
    return { error: null };
  } catch (error) {
    console.log(`Error writing file: ${error.message}`);
    return { error: `Error writing the data file: ${error.message}` };
  }
};
