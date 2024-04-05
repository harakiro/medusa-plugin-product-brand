import type {
  MedusaRequest,
  MedusaResponse,
  ProductService,
} from "@medusajs/medusa";

export default async function (req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;

  const productService: ProductService = req.scope.resolve("productService");

  const product = await productService.retrieve(id, req.retrieveConfig);

  res.status(200).json({ product });
}
