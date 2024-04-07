import type {
  MedusaRequest,
  MedusaResponse,
  ProductService,
} from "@medusajs/medusa";
import { registerOverriddenValidators } from "@medusajs/medusa";
import { validator } from "../../utils/validator";
import { AdminPostProductsProductReq as MedusaAdminPostProductsReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";

export class AdminPostProductsProductReq extends MedusaAdminPostProductsReq {
  brand: string;
}

export default async function UpdateProduct(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params;
  registerOverriddenValidators(AdminPostProductsProductReq);

  const productService: ProductService = req.scope.resolve("productService");

  const product = await productService.update(id, req.body);

  const rawProduct = await productService.retrieve(product.id);

  res.status(200).json({ product: rawProduct });
}
