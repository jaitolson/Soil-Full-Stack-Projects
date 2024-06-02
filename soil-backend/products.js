require('dotenv').config(); // Load environment variables from .env file

const fs = require('fs');
const path = require('path');
const db = require('./models'); // Import models which will use the configured Sequelize instance

const seedDatabase = async () => {
  await db.sequelize.sync({ force: true });

  // Read the JSON file
  const productData = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));

  // Create a set to store unique categories
  const categories = new Set(productData.map(product => product.foodCategory));

  // Convert set to array and create categories
  const categoryInstances = await db.Category.bulkCreate(
    Array.from(categories).map(category => ({ name: category }))
  );

  // Create a map of category name to category ID
  const categoryMap = {};
  categoryInstances.forEach(category => {
    categoryMap[category.name] = category.categoryID;
  });

  // Create products
  const productInstances = await db.Product.bulkCreate(
    productData.map(product => ({
      name: product.name.trim(),
      description: product.description,
      price: product.price,
      imagePath: product.imageUrl
    }))
  );

  // Populate the junction table
  const productCategoryEntries = productData.map(product => ({
    productID: productInstances.find(p => p.name.trim() === product.name.trim()).productID,
    categoryID: categoryMap[product.foodCategory]
  }));

  await db.ProductCategory.bulkCreate(productCategoryEntries);

  console.log('Database seeded successfully with products and categories from JSON file!');
  process.exit();
};

seedDatabase();
