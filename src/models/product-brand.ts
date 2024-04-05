import {
  DbAwareColumn,
  SoftDeletableEntity,
  generateEntityId,
  Image,
} from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity()
export class ProductBrand extends SoftDeletableEntity {
  @Column()
  title: string;

  @Column()
  handle: string;

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
  images: Image[] | string[] | null;

  @Column({ type: "text", nullable: true })
  thumbnail: string | Image | null;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pbrd");
  }
}
