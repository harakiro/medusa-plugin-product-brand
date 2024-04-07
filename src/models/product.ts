import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product as MedusaProduct } from "@medusajs/medusa";
import { ProductBrand } from "./product-brand";

@Entity()
export class Product extends MedusaProduct {
  @ManyToOne(() => ProductBrand, (brand) => brand.products)
  @JoinColumn({ name: "brand_id" })
  brand: ProductBrand;
}
