import { MigrationInterface, QueryRunner } from "typeorm";

export class BrandCreate1712276707390 implements MigrationInterface {
  name = "BrandCreate1712276707390";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_brand" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "handle" character varying NOT NULL, "thumbnail" text, CONSTRAINT "PK_2eb5ce4324613b4b457c364f4a2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "product_brand_images" ("product_brand_id" character varying NOT NULL, "image_id" character varying NOT NULL, CONSTRAINT "PK_63a6f78479308aba43852cf4138" PRIMARY KEY ("product_brand_id", "image_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_45289c81dbe439e85fbcd48f69" ON "product_brand_images" ("product_brand_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ad810cf4891366c0130f841f6d" ON "product_brand_images" ("image_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "brand_id" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_2eb5ce4324613b4b457c364f4a2" FOREIGN KEY ("brand_id") REFERENCES "product_brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "product_brand_images" ADD CONSTRAINT "FK_45289c81dbe439e85fbcd48f694" FOREIGN KEY ("product_brand_id") REFERENCES "product_brand"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "product_brand_images" ADD CONSTRAINT "FK_ad810cf4891366c0130f841f6d2" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_brand_images" DROP CONSTRAINT "FK_ad810cf4891366c0130f841f6d2"`
    );
    await queryRunner.query(
      `ALTER TABLE "product_brand_images" DROP CONSTRAINT "FK_45289c81dbe439e85fbcd48f694"`
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "brand_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad810cf4891366c0130f841f6d"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_45289c81dbe439e85fbcd48f69"`
    );
    await queryRunner.query(`DROP TABLE "product_brand_images"`);
    await queryRunner.query(`DROP TABLE "product_brand"`);
  }
}
