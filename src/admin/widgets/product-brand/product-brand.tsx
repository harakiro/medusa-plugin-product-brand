import { ProductDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import { useAdminCustomQuery, useAdminUpdateProduct } from "medusa-react";
import { Button, Container, Heading } from "@medusajs/ui";
import { AdminGetProductBrandsParams } from "../../../api/_methods/list-brands";
import { AdminProductBrandsListRes } from "../../../types/product-brand";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../utils/error-message";
import { useDebounce } from "../../hooks/use-debounce";
import Select from "react-select";

const ProductBrandWidget = ({ product, notify }: ProductDetailsWidgetProps) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState(undefined);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const debouncedSearchTerm = useDebounce(query, 500);

  const { data, isLoading } = useAdminCustomQuery<
    AdminGetProductBrandsParams,
    AdminProductBrandsListRes
  >("/brands", ["brands", "list"], {
    offset,
    limit,
    q: debouncedSearchTerm,
  });

  useEffect(() => {
    if (product?.brand?.id) {
      setSelectedBrandId(product?.brand?.id);
    }
  }, [product?.brand?.id]);

  const updateProduct = useAdminUpdateProduct(product?.id);

  const handleBrandChange = (value) => {
    setSelectedBrandId(value);
  };

  const handleSave = () => {
    updateProduct.mutate(
      {
        //@ts-ignore
        brand: selectedBrandId.value,
      },
      {
        onSuccess: ({ product }) => {},
        onError: (err) => {
          notify.error("Error", getErrorMessage(err));
        },
      }
    );
  };

  const handleSearch = (q) => {
    setOffset(0);
    setQuery(q);
  };

  const brandOptions = (data?.brands || []).map((brand) => ({
    value: brand?.id,
    label: brand?.title,
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
                  value={brandOptions.find((op) => {
                    return op.value === selectedBrandId;
                  })}
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
