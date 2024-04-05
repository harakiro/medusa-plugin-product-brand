import type {
  MedusaRequest,
  MedusaResponse,
  ProductService,
} from "@medusajs/medusa";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { DateComparisonOperator, IsType } from "@medusajs/medusa";

export default async function ListProducts(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const productService: ProductService = req.scope.resolve("productService");
  console.log(req.query, req.listConfig);
  const { skip, take } = req.listConfig;

  const [products, count] = await productService.listAndCount(
    req.filterableFields,
    req.listConfig
  );

  res.status(200).json({
    products,
    count,
    offset: skip,
    limit: take,
  });
}

export class FilterableProductProps {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[];

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

export class AdminGetProductsParams extends FilterableProductProps {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;

  @IsString()
  @IsOptional()
  q?: string;

  @IsString()
  @IsOptional()
  fields?: string;

  @IsString()
  @IsOptional()
  order?: string;
}
