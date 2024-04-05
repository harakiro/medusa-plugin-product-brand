import {
  DateComparisonOperator,
  Product,
  Image,
  PaginatedResponse,
  Selector,
  FindConfig,
} from "@medusajs/medusa";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsType } from "@medusajs/medusa/dist/utils/validators/is-type";
import { Type } from "class-transformer";
import { ProductBrand } from "../models/product-brand";

/**
 * API Level DTOs + Validation rules
 */
export class FilterableProductBrandProps {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[];

  @IsString()
  @IsOptional()
  q?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator;

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator;
}

export type ProductBrandSelector =
  | FilterableProductBrandProps
  | (Selector<ProductBrand> & {
      q?: string;
    });

export type FindProductBrandConfig = FindConfig<ProductBrand>;

export type CreateProductBrandInput = {
  title: string;
  images?: Image[] | string[] | null;
  thumbnail?: string | Image | null;
  handle?: string;
};

export type UpdateProductBrandInput = {
  title?: string;
  images?: Image[] | string[] | null;
  thumbnail?: string | Image | null;
  handle?: string;
};

export type AdminProductBrandsListRes = PaginatedResponse & {
  brands: ProductBrand[];
};

export type AdminProductBrandRes = {
  brand: ProductBrand;
};

export type AdminProductBrandsListQuery = {
  skip: number;
  take: number;
};
