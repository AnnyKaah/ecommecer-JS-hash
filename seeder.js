const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const productsData = require("./products"); // This now works because of the export
const Product = require("./Product.js");
const Order = require("./order.js");
const Cart = require("./Cart.js");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding...");
  } catch (err) {
    console.error(`Error connecting to DB: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // Clear existing data to avoid duplicates
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();

    // The productsData is an object, we need its values as an array.
    // We also remove the original 'id' field to avoid any potential conflicts with Mongoose.
    const productsToInsert = Object.values(productsData).map((product) => {
      const { id, ...rest } = product;
      return rest;
    });

    if (productsToInsert.length === 0) {
      console.log("No products found in products.js to import.");
      process.exit();
    }

    await Product.insertMany(productsToInsert);

    console.log(
      `Data Imported Successfully! ${productsToInsert.length} products added.`
    );
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();

  if (process.argv[2] === "-d") {
    await destroyData();
  } else {
    await importData();
  }
};

runSeeder();
