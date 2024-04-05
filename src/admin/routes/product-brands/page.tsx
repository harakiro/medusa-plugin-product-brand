import { RouteConfig } from "@medusajs/admin";
import Overview from "../../components/domains/brands/overview";

const ProductBrandsPage = () => {
  return <Overview />;
};

export default ProductBrandsPage;

export const config: RouteConfig = {
  link: {
    label: "Product Brands",
  },
};
