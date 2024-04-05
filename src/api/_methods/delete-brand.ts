import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductBrandService from "../../services/product-brand";
import { EntityManager } from "typeorm";

export default async function (req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;

  const productBrandService: ProductBrandService = req.scope.resolve(
    "productBrandService"
  );

  const manager: EntityManager = req.scope.resolve("manager");
  await manager.transaction(async (transactionManager) => {
    return await productBrandService
      .withTransaction(transactionManager)
      .delete(id);
  });

  res.json({
    id,
    object: "brand",
    deleted: true,
  });
}
