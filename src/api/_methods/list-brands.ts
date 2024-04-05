import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
} from "class-validator";
import ProductBrandService from "../../services/product-brand";
import { Type } from "class-transformer";
import { DateComparisonOperator, IsType } from "@medusajs/medusa";

export default async function ListProductBrands(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const productBrandService: ProductBrandService = req.scope.resolve(
    "productBrandService"
  );

  const { skip, take } = req.listConfig;

  const [brands, count] = await productBrandService.listAndCount(
    req.filterableFields,
    req.listConfig
  );

  res.status(200).json({
    brands,
    count,
    offset: skip,
    limit: take,
  });
}

export class FilterableProductBrandProps {
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

export class AdminGetProductBrandsParams extends FilterableProductBrandProps {
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
