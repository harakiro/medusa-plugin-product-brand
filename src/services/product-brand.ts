import {
  ExtendedFindConfig,
  FindConfig,
  TransactionBaseService,
  buildQuery,
  Image,
  isString,
  EventBusService,
} from "@medusajs/medusa";
import ImageRepository from "@medusajs/medusa/dist/repositories/image";
import { ProductBrand } from "../models/product-brand";
import { MedusaError, isDefined, promiseAll } from "@medusajs/utils";
import {
  CreateProductBrandInput,
  FindProductBrandConfig,
  ProductBrandSelector,
  UpdateProductBrandInput,
} from "../types/product-brand";
import { FindOperator, FindOptionsWhere, ILike } from "typeorm";
import ProductBrandRepository from "../repositories/product-brand";

class ProductBrandService extends TransactionBaseService {
  protected productBrandRepository_: typeof ProductBrandRepository;
  protected readonly imageRepository_: typeof ImageRepository;
  protected readonly eventBus_: EventBusService;

  static readonly IndexName = `product-brand`;

  static readonly Events = {
    UPDATED: "brand.updated",
    CREATED: "brand.created",
    DELETED: "brand.deleted",
  };

  constructor(container) {
    super(container);
    this.productBrandRepository_ = container.productBrandRepository;
    this.imageRepository_ = container.imageRepository;
    this.eventBus_ = container.eventBusService;
  }

  /**
   * Lists brands based on the provided parameters.
   * @param selector - an object that defines rules to filter products
   *   by
   * @param config - object that defines the scope for what should be
   *   returned
   * @return the result of the find operation
   */
  async listAndCount(
    selector?: ProductBrandSelector,
    config: FindProductBrandConfig = {
      skip: 0,
      take: 20,
      relations: [],
    }
  ): Promise<[ProductBrand[], number]> {
    const productBrandRepo = this.activeManager_.withRepository(
      this.productBrandRepository_
    );

    let q;

    if (isString(selector?.q)) {
      q = selector.q;
      delete selector.q;
    }

    const query = buildQuery(
      selector,
      config
    ) as ExtendedFindConfig<ProductBrand> & {
      where: FindOptionsWhere<ProductBrand>;
    };

    const where = query.where as FindOptionsWhere<ProductBrand>;
    delete where?.title;
    delete where?.handle;
    delete where?.created_at;
    delete where?.updated_at;

    if (q) {
      query.where = [
        {
          ...where,
          title: ILike(`%${q}%`),
        },
        {
          ...where,
          handle: ILike(`%${q}%`),
        },
      ];
    }
    return productBrandRepo.findAndCount(query);
  }

  async retrieve(
    id: string,
    config?: FindConfig<ProductBrand>
  ): Promise<ProductBrand> {
    const productBrandRepo = this.activeManager_.withRepository(
      this.productBrandRepository_
    );

    const query = buildQuery(
      {
        id,
      },
      config
    );

    const brand = await productBrandRepo.findOne(query);

    if (!brand) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "ProductBrand was not found"
      );
    }

    return brand;
  }

  async create(
    productBrandObject: CreateProductBrandInput
  ): Promise<ProductBrand> {
    return this.atomicPhase_(async (manager) => {
      const productBrandRepo = manager.withRepository(
        this.productBrandRepository_
      );
      const imageRepo = manager.withRepository(this.imageRepository_);

      const { images, ...rest } = productBrandObject;

      if (!rest.thumbnail && images?.length) {
        rest.thumbnail = images[0];
      }

      let brand = productBrandRepo.create(rest);

      if (images?.length) {
        brand.images = await imageRepo.upsertImages(images);
      }

      brand = await productBrandRepo.save(brand);

      const result = await this.retrieve(brand.id, {
        relations: ["images"],
      });

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductBrandService.Events.CREATED, {
          id: result.id,
        });
      return result;
    });
  }

  async update(
    id: string,
    data: UpdateProductBrandInput
  ): Promise<ProductBrand> {
    return await this.atomicPhase_(async (manager) => {
      const productBrandRepo = manager.withRepository(
        this.productBrandRepository_
      );
      const imageRepo = manager.withRepository(this.imageRepository_);
      const { images, ...rest } = data;

      const brand = await this.retrieve(id, {
        relations: ["images"],
      });

      if (!brand.thumbnail && !brand.thumbnail && images?.length) {
        brand.thumbnail = images[0];
      }

      const promises: Promise<any>[] = [];

      if (images) {
        promises.push(
          imageRepo.upsertImages(images).then((image) => (brand.images = image))
        );
      }

      for (const [key, value] of Object.entries(rest)) {
        if (isDefined(value)) {
          brand[key] = value;
        }
      }

      await promiseAll(promises);

      const result = await productBrandRepo.save(brand);

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductBrandService.Events.UPDATED, {
          id: result.id,
          fields: Object.keys(data),
        });

      return result;
    });
  }

  async delete(id: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const brandRepo = manager.withRepository(this.productBrandRepository_);

      // Should not fail, if brand does not exist, since delete is idempotent
      const brand = await brandRepo.findOne({
        where: { id: id },
        relations: {
          images: true,
        },
      });

      if (!brand) {
        return;
      }

      await brandRepo.softRemove({ id });

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductBrandService.Events.DELETED, {
          id,
        });

      return Promise.resolve();
    });
  }
}

export default ProductBrandService;

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<ProductBrand>,
  "relations"
>;

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"] & {
    images?: FindOperator<Image>;
  };
};
