import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product as MedusaProduct } from "@medusajs/medusa";
import { ProductBrand } from "./product-brand";

@Entity()
export class Product extends MedusaProduct {
  @ManyToOne(() => ProductBrand)
  @JoinColumn({ name: "brand_id" })
  brand: ProductBrand;
}
