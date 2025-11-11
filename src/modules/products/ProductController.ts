import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  HttpCode,
  NotFoundError,
  BadRequestError,
  QueryParam,
} from 'routing-controllers';
import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { ProductService } from './ProductService';
import { CreateProductDto } from './dto/CreateProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { Product, ProductCategory } from './models/Product';

@JsonController('/products')
@Service()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  @OpenAPI({
    summary: 'Get all products',
    description: 'Retrieve a list of all products with optional filtering',
    responses: {
      '200': {
        description: 'List of products',
      },
    },
  })
  async getAll(
    @QueryParam('category') category?: ProductCategory,
    @QueryParam('search') search?: string
  ): Promise<Product[]> {
    if (search) {
      return this.productService.search(search);
    }
    if (category) {
      return this.productService.findByCategory(category);
    }
    return this.productService.findAll();
  }

  @Get('/available')
  @OpenAPI({
    summary: 'Get available products',
    description: 'Retrieve a list of all available products (in stock)',
  })
  async getAvailable(): Promise<Product[]> {
    return this.productService.findAvailable();
  }

  @Get('/:id')
  @OpenAPI({
    summary: 'Get product by ID',
    description: 'Retrieve a specific product by its ID',
    responses: {
      '200': {
        description: 'Product found',
      },
      '404': {
        description: 'Product not found',
      },
    },
  })
  async getOne(@Param('id') id: string): Promise<Product> {
    const product = this.productService.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  @Post('/')
  @HttpCode(201)
  @OpenAPI({
    summary: 'Create a new product',
    description: 'Create a new product with the provided data',
    responses: {
      '201': {
        description: 'Product created successfully',
      },
      '400': {
        description: 'Invalid input data',
      },
    },
  })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    try {
      return this.productService.create(dto);
    } catch (error) {
      throw new BadRequestError((error as Error).message);
    }
  }

  @Put('/:id')
  @OpenAPI({
    summary: 'Update a product',
    description: 'Update an existing product by its ID',
    responses: {
      '200': {
        description: 'Product updated successfully',
      },
      '404': {
        description: 'Product not found',
      },
      '400': {
        description: 'Invalid input data',
      },
    },
  })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<Product> {
    try {
      return this.productService.update(id, dto);
    } catch (error) {
      const message = (error as Error).message;
      if (message === 'Product not found') {
        throw new NotFoundError(message);
      }
      throw new BadRequestError(message);
    }
  }

  @Patch('/:id/stock')
  @OpenAPI({
    summary: 'Update product stock',
    description: 'Update the stock quantity of a product (add or subtract)',
    responses: {
      '200': {
        description: 'Stock updated successfully',
      },
      '404': {
        description: 'Product not found',
      },
      '400': {
        description: 'Insufficient stock or invalid quantity',
      },
    },
  })
  async updateStock(
    @Param('id') id: string,
    @Body() body: { quantity: number }
  ): Promise<Product> {
    try {
      return this.productService.updateStock(id, body.quantity);
    } catch (error) {
      const message = (error as Error).message;
      if (message === 'Product not found') {
        throw new NotFoundError(message);
      }
      throw new BadRequestError(message);
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @OpenAPI({
    summary: 'Delete a product',
    description: 'Delete a product by its ID',
    responses: {
      '204': {
        description: 'Product deleted successfully',
      },
      '404': {
        description: 'Product not found',
      },
    },
  })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      this.productService.delete(id);
    } catch (error) {
      throw new NotFoundError((error as Error).message);
    }
  }
}
