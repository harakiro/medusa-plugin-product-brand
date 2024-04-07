import {
  SoftDeletableEntity,
  generateEntityId,
  Image,
  DbAwareColumn,
} from "@medusajs/medusa";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Product } from "./product";

@Entity()
export class ProductBrand extends SoftDeletableEntity {
  @Column()
  title: string;

  @Column()
  handle: string;

  @OneToMany(() => Product, (product) => product.brand, {
    cascade: true,
  })
  products: Product[];

  @ManyToMany(() => Image, (image) => image, { cascade: ["insert"] })
  @JoinTable({
    name: "product_brand_images",
    joinColumn: {
      name: "product_brand_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id",
    },
  })
  images: Image[];

  @Column({ type: "text", nullable: true })
  thumbnail: string | null;

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pbrd");
  }
}
