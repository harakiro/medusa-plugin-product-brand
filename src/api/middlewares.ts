import type { MiddlewaresConfig, Product } from "@medusajs/medusa";
import { AdminGetProductsParams, FindParams } from "@medusajs/medusa";
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

const ListProductsMiddleware = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  await transformQuery(AdminGetProductsParams, {
    defaultRelations: defaultAdminProductRelations,
    defaultFields: defaultAdminProductFields,
    isList: true,
  })(req, res, next);
};

const GetProductMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  transformQuery(FindParams, {
    defaultRelations: defaultAdminProductRelations,
    defaultFields: defaultAdminProductFields,
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
    {
      matcher: "/admin/custom-products/:id",
      middlewares: [GetProductMiddleware],
      method: "GET",
    },
    {
      matcher: "/admin/custom-products",
      middlewares: [ListProductsMiddleware],
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

export const defaultAdminProductRelations = [
  "variants",
  "variants.prices",
  "variants.options",
  "profiles",
  "images",
  "options",
  "options.values",
  "tags",
  "type",
  "collection",
  "brand",
];

export const defaultAdminProductFields: (keyof Product)[] = [
  "id",
  "title",
  "subtitle",
  "status",
  "external_id",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "collection_id",
  "type_id",
  "weight",
  "length",
  "height",
  "width",
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "brand",
];
