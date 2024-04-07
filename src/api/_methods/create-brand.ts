import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Image } from "@medusajs/medusa";
import { validator } from "../../utils/validator";
import { ProductBrand } from "../../models/product-brand";
import ProductBrandService from "../../services/product-brand";

export default async function (req: MedusaRequest, res: MedusaResponse) {
  const validated = await validator(AdminPostProductBrandsReq, req.body);

  const productBrandService: ProductBrandService = req.scope.resolve(
    "productBrandService"
  );

  if (!validated.thumbnail && validated.images && validated.images.length) {
    validated.thumbnail = validated.images[0];
  }

  const brand = await productBrandService.create({ ...validated });

  const rawBrand = await productBrandService.retrieve(brand.id, {
    select: defaultAdminProductBrandFields,
    relations: defaultAdminProductBrandRelations,
  });

  res.status(200).json({ brand: rawBrand });
}

export class AdminPostProductBrandsReq {
  @IsString()
  title: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  handle?: string;
}

const defaultAdminProductBrandRelations = ["images"];

const defaultAdminProductBrandFields: (keyof ProductBrand)[] = [
  "id",
  "title",
  "handle",
  "images",
  "thumbnail",
  "created_at",
  "updated_at",
  "deleted_at",
];
