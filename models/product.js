const db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, imageUrl, price, description) VALUES (?, ?, ?, ?)',
      [this.title, this.imageUrl, this.price, this.description]
    );
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.execute('SELECT * FROM PRODUCTS');
  }

  static findById(id) {
    return db.execute('SELECT * FROM PRODUCTS WHERE products.id = ?', [id]);
  }
};
