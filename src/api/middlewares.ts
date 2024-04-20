import type { MiddlewaresConfig } from "@medusajs/medusa";
import { FindParams } from "@medusajs/medusa";
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { transformQuery } from "../utils/transform-query";
import { ProductBrand } from "../models/product-brand";

const ListProductBrandsMiddleware = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  await transformQuery(AdminGetProductBrandsParams, {
    defaultRelations: defaultAdminProductBrandRelations,
    defaultFields: defaultAdminProductBrandFields,
    isList: true,
  })(req, res, next);
};

const GetProductBrandMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  transformQuery(FindParams, {
    defaultRelations: defaultAdminProductBrandRelations,
    defaultFields: defaultAdminProductBrandFields,
    isList: false,
  })(req, res, next);
};

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/store/brands",
      middlewares: [ListProductBrandsMiddleware],
      method: "GET",
    },
    {
      matcher: "/admin/brands",
      middlewares: [ListProductBrandsMiddleware],
      method: "GET",
    },
    {
      matcher: "/store/brands/:id",
      middlewares: [GetProductBrandMiddleware],
      method: "GET",
    },
    {
      matcher: "/admin/brands/:id",
      middlewares: [GetProductBrandMiddleware],
      method: "GET",
    },
  ],
};

export const defaultAdminProductBrandRelations = ["images"];

export const defaultAdminProductBrandFields: (keyof ProductBrand)[] = [
  "id",
  "title",
  "handle",
  "images",
  "thumbnail",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
];

export class AdminGetProductBrandsParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

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
