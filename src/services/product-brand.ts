import {
  ExtendedFindConfig,
  FindConfig,
  TransactionBaseService,
  buildQuery,
  Image,
  isString,
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

  static readonly IndexName = `product-brand`;

  constructor(container) {
    super(container);
    this.productBrandRepository_ = container.productBrandRepository;
    this.imageRepository_ = container.imageRepository;
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

      return await productBrandRepo.save(brand);
    });
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.atomicPhase_(async (manager) => {
        const productBrandRepo = manager.withRepository(
          this.productBrandRepository_
        );
        const brand = await productBrandRepo.softRemove({ id });
      });
    } catch (err) {
      console.log(err);
    }
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
