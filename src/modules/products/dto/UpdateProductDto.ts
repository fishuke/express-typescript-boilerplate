import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProductCategory } from '../models/Product';

/**
 * DTO for updating an existing product
 */
export class UpdateProductDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  @IsOptional()
  price?: number;

  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock cannot be negative' })
  @IsOptional()
  stock?: number;

  @IsEnum(ProductCategory, { message: 'Invalid category' })
  @IsOptional()
  category?: ProductCategory;

  @IsString({ message: 'SKU must be a string' })
  @MinLength(3, { message: 'SKU must be at least 3 characters long' })
  @MaxLength(20, { message: 'SKU must not exceed 20 characters' })
  @IsOptional()
  sku?: string;

  @IsBoolean({ message: 'isAvailable must be a boolean' })
  @IsOptional()
  isAvailable?: boolean;
}
