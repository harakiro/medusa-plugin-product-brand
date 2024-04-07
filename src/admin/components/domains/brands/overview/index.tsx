import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Table,
  DropdownMenu,
  Button,
  Input,
  Heading,
  Toaster,
  Text,
} from "@medusajs/ui";
import { EllipsisHorizontal, Eye, Trash } from "@medusajs/icons";
import { AdminProductBrandsListRes } from "../../../../../types/product-brand";
import { useAdminCustomQuery } from "medusa-react";
import NewProductBrand from "../new";
import { useDebounce } from "../../../../hooks/use-debounce";
import { AdminGetProductBrandsParams } from "../../../../../api/_methods/list-brands";
import useEditProductBrandActions from "../../../../hooks/use-edit-brand-actions";
import { ProductBrand } from "../../../../../models/product-brand";
import { Thumbnail } from "../../../../components/common/thumbnail";

const Overview = () => {
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
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

  /**
   * Pagination Props
   * PageIndex: Current page number
   * PageSize: How many records do want to show on one page
   * PageCount: Number of pages to navigate through
   * canPreviousPage: disable prev button when it is on the first page
   * canNextPage: disable next page button when it on the last page
   */
  const pageSize = limit;
  const pageCount = Math.ceil(data?.count / pageSize);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const handleNext = () => {
    if (canNextPage) {
      setOffset(offset + limit);
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset(offset - limit);
      setPageIndex(pageIndex - 1);
    }
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setOffset(0);
    setQuery(q);
  };

  const { onDelete } = useEditProductBrandActions(deleteId);

  return (
    <>
      <Container>
        <Toaster />
        {isLoading && <span>Loading...</span>}
        <>
          <div className="pb-large">
            <div className="flex items-start justify-between">
              <div className="gap-x-base text-grey-40 flex">
                <Heading
                  level="h1"
                  className="text-[16px] text-grey-90 font-semibold inter-large-semibold leading-6"
                >
                  Brands
                </Heading>
              </div>

              <div className="flex items-center space-x-2">
                <NewProductBrand />
              </div>
            </div>
          </div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search"
                id="search-input"
                type="search"
                value={query}
                onChange={handleSearch}
                className="w-[20rem] h-[2.5rem]"
              />
            </div>
          </div>
          <Table title="Brands">
            <Table.Header title="Brands">
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.brands.map((brand) => {
                return (
                  <Table.Row
                    key={brand.id}
                    className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap cursor-pointer"
                  >
                    <Table.Cell onClick={() => navigate(`${brand.id}`)}>
                      <ProductBrandTitleCell brand={brand} />
                    </Table.Cell>
                    <Table.Cell>
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <Button variant="primary">
                            <EllipsisHorizontal />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            className="gap-x-2"
                            onClick={() => navigate(`${brand.id}`)}
                          >
                            <Eye className="text-ui-fg-subtle" />
                            View
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item
                            className="gap-x-2"
                            onClick={async () => {
                              setDeleteId(brand.id);
                              onDelete();
                            }}
                          >
                            <Trash className="text-ui-fg-subtle" />
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <Table.Pagination
            count={data?.count}
            pageSize={pageSize}
            pageIndex={pageIndex}
            pageCount={pageCount}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            previousPage={handlePrev}
            nextPage={handleNext}
          ></Table.Pagination>
        </>
      </Container>
    </>
  );
};

export default Overview;

export const ProductBrandTitleCell = ({ brand }: { brand: ProductBrand }) => {
  const thumbnail = brand.thumbnail;
  const title = brand.title;

  return (
    <div className="flex items-center gap-x-3">
      <Thumbnail src={thumbnail} alt={`Thumbnail image of ${title}`} />
      <Text size="small" className="text-ui-fg-base">
        {title}
      </Text>
    </div>
  );
};
