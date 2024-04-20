import { AdminPostProductsProductReq as MedusaAdminPostProductsReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";
import { registerOverriddenValidators } from "@medusajs/medusa";
import { IsOptional, IsString } from "class-validator";

export class AdminPostProductsProductReq extends MedusaAdminPostProductsReq {
  @IsString()
  @IsOptional()
  brand?: string;
}

registerOverriddenValidators(AdminPostProductsProductReq);
