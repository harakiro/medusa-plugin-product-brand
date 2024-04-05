import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductBrandService from "../../services/product-brand";

export default async function (req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;

  const productBrandService: ProductBrandService = req.scope.resolve(
    "productBrandService"
  );

  const brand = await productBrandService.retrieve(id, req.retrieveConfig);

  res.status(200).json({ brand });
}
