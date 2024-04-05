import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { ProductBrand } from "../models/product-brand";

export const ProductBrandRepository = dataSource.getRepository(ProductBrand);

export default ProductBrandRepository;
