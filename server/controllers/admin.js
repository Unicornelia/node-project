const Product = require('../models/product');

postAddProduct = async (req, res) => {
  try {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product({ title, imageUrl, price, description });
    const result = await product.save();
    res.json(result);
    console.info(`Added new product: ${result}`);
  } catch (e) {
    console.error(`Error in postAddProduct: ${e}`);
  }
};

getEditProduct = async (req, res) => {
  try {
    const editMode = req.query.editing;
    if (!editMode) {
      return res.redirect('/');
    }
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.redirect('/');
    }
    res.json(product);
  } catch (e) {
    console.error(`Error in getEditProduct: ${e}`);
  }
};

postEditProduct = async (req, res) => {
  try {
    const {
      id,
      title,
      imageUrl,
      price,
      description,
    } = req.body;

    const product = await Product.findById(id);

    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;

    const result = await product.save();
    res.json(result);
    console.info(`Updated product: ${result}`);
  } catch (e) {
    console.error(`Error in updating product: ${e}`);
  }
};

getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (e) {
    console.error(`Error in fetching all products: ${e}`);
  }
};

deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    console.log(`Product ${id} has been deleted`);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(`Error deleting product: ${err}`);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = { postAddProduct, getEditProduct, postEditProduct, getProducts, deleteProduct };