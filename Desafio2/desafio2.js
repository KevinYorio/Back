const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = fs.readFileSync(this.path, 'utf8');
        this.products = JSON.parse(data);
      } else {
        // Si el archivo no existe, crea un archivo JSON vacío
        fs.writeFileSync(this.path, '[]');
        this.products = [];
      }
    } catch (error) {
      console.error('Error loading products:', error);
      this.products = [];
    }
  }  

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data);
  }

  generateProductId() {
    return this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
  }

  addProduct(product) {
    const productId = this.generateProductId();
    const newProduct = { ...product, id: productId };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct = { ...this.products[productIndex], ...updatedFields };
    this.products[productIndex] = updatedProduct;
    this.saveProducts();
    return updatedProduct;
  }

  deleteProduct(productId) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const deletedProduct = this.products.splice(productIndex, 1)[0];
    this.saveProducts();
    return deletedProduct;
  }
}

const productManager = new ProductManager('ruta_de_tu_archivo.json');

console.log('Productos iniciales:', productManager.getProducts()); // []

const newProduct = {
  title: 'Producto de prueba',
  description: 'Este es un producto de prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
};

const addedProduct = productManager.addProduct(newProduct);
console.log('Producto agregado:', addedProduct);

console.log('Productos después de agregar:', productManager.getProducts()); // [producto]

try {
  const productIdToFind = addedProduct.id;
  console.log('Producto encontrado por ID:', productManager.getProductById(productIdToFind));
} catch (error) {
  console.error('Error:', error.message);
}

try {
  const productIdToUpdate = addedProduct.id;
  const updatedFields = { price: 250 };
  console.log('Producto actualizado:', productManager.updateProduct(productIdToUpdate, updatedFields));
} catch (error) {
  console.error('Error:', error.message);
}

try {
  const productIdToDelete = addedProduct.id;
  console.log('Producto eliminado:', productManager.deleteProduct(productIdToDelete));
} catch (error) {
  console.error('Error:', error.message);
}

module.exports = ProductManager;

