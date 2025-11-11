import { Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductCategory } from './models/Product';
import { CreateProductDto } from './dto/CreateProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';

@Service()
export class ProductService {
  private products: Product[] = [
    {
      id: uuidv4(),
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      stock: 50,
      category: ProductCategory.ELECTRONICS,
      sku: 'WH-001',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Running Shoes',
      description: 'Comfortable running shoes with excellent cushioning',
      price: 89.99,
      stock: 100,
      category: ProductCategory.SPORTS,
      sku: 'RS-001',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Programming Book',
      description: 'Learn TypeScript from beginner to advanced level',
      price: 49.99,
      stock: 30,
      category: ProductCategory.BOOKS,
      sku: 'BK-001',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  /**
   * Get all products
   */
  findAll(): Product[] {
    return this.products;
  }

  /**
   * Get a product by ID
   */
  findById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  /**
   * Get a product by SKU
   */
  findBySku(sku: string): Product | undefined {
    return this.products.find((product) => product.sku === sku);
  }

  /**
   * Create a new product
   */
  create(dto: CreateProductDto): Product {
    // Check if product with same SKU already exists
    const existingProduct = this.findBySku(dto.sku);
    if (existingProduct) {
      throw new Error('Product with this SKU already exists');
    }

    const newProduct: Product = {
      id: uuidv4(),
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      category: dto.category,
      sku: dto.sku,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * Update an existing product
   */
  update(id: string, dto: UpdateProductDto): Product {
    const product = this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check SKU uniqueness if SKU is being updated
    if (dto.sku && dto.sku !== product.sku) {
      const existingProduct = this.findBySku(dto.sku);
      if (existingProduct) {
        throw new Error('Product with this SKU already exists');
      }
    }

    // Update product properties
    Object.assign(product, {
      ...dto,
      updatedAt: new Date(),
    });

    return product;
  }

  /**
   * Delete a product
   */
  delete(id: string): void {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    this.products.splice(index, 1);
  }

  /**
   * Get products by category
   */
  findByCategory(category: ProductCategory): Product[] {
    return this.products.filter((product) => product.category === category);
  }

  /**
   * Get available products
   */
  findAvailable(): Product[] {
    return this.products.filter((product) => product.isAvailable && product.stock > 0);
  }

  /**
   * Search products by name or description
   */
  search(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Update product stock
   */
  updateStock(id: string, quantity: number): Product {
    const product = this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    product.stock += quantity;
    if (product.stock < 0) {
      throw new Error('Insufficient stock');
    }

    product.isAvailable = product.stock > 0;
    product.updatedAt = new Date();

    return product;
  }
}
