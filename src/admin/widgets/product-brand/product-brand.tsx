import { ProductDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";

import { Button, Container, Heading, useToast } from "@medusajs/ui";
import { AdminGetProductBrandsParams } from "../../../api/_methods/list-brands";
import { AdminProductBrandsListRes } from "../../../types/product-brand";
import { useState } from "react";
import { AdminPostProductsProductReq } from "../../../api/_methods/update-product";
import {
  AdminGetProductParams,
  AdminProductsRes,
} from "@medusajs/medusa/dist/api/routes/admin/products";
import { getErrorMessage } from "../../utils/error-message";
import { useDebounce } from "../../hooks/use-debounce";
import Select from "react-select";

const ProductBrandWidget = ({ product, notify }: ProductDetailsWidgetProps) => {
  const { toast } = useToast();

  const [selectedBrand, setSelectedBrand] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState(undefined);

  const debouncedSearchTerm = useDebounce(query, 500);

  const { data, isLoading } = useAdminCustomQuery<
    AdminGetProductBrandsParams,
    AdminProductBrandsListRes
  >("/brands", ["brands", "list"], {
    offset,
    limit,
    q: debouncedSearchTerm,
  });

  const { mutate } = useAdminCustomPost<
    AdminPostProductsProductReq,
    AdminProductsRes
  >(`/custom-products/${product.id}`, ["products", "update"]);

  const { data: p, isLoading: loading } = useAdminCustomQuery<
    AdminGetProductParams,
    AdminProductsRes & { brand: string }
  >(`/custom-products/${product.id}`, ["custom-products", "list"]);

  console.log("braaaaaaand", p?.product?.brand?.id);

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
  };

  const handleSave = () => {
    mutate(
      {
        brand: selectedBrand as string,
      },
      {
        onSuccess: ({ product }) => {
          console.log(product);
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: getErrorMessage(err),
          });
        },
      }
    );
  };

  const handleSearch = (q) => {
    console.log(q);
    setOffset(0);
    setQuery(q);
  };

  const brandOptions = (data?.brands || []).map((brand) => ({
    value: brand.id,
    label: brand.title,
  }));

  return (
    <>
      <Container className="text-ui-fg-subtle px-0 pt-0 pb-4">
        {isLoading && <span>Loading...</span>}
        <div className="flex py-6 px-8">
          <>
            <div className="flex w-2/3 gap-x-8">
              <div className="flex flex-col flex-1 gap-y-2">
                <div className="flex items-center gap-x-2">
                  <Heading level="h1" className="text-ui-fg-base">
                    Brands
                  </Heading>
                </div>
                <Select
                  options={brandOptions}
                  onChange={handleBrandChange}
                  onInputChange={handleSearch}
                  isSearchable
                  value={brandOptions.filter(
                    ({ value }) => value === p?.product?.brand?.id
                  )}
                  placeholder="Select Brand"
                />
              </div>
            </div>
            <div className="ml-auto flex items-start gap-2">
              <Button variant="secondary" size="base" onClick={handleSave}>
                Save
              </Button>
            </div>
          </>
        </div>
      </Container>
    </>
  );
};

export const config: WidgetConfig = {
  zone: ["product.details.after"],
};

export default ProductBrandWidget;
