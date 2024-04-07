import { useParams, useNavigate } from "react-router-dom";
import { getErrorStatus } from "../../../../utils/get-error-status";
import Spinner from "../../../atoms/spinner";
import BackButton from "../../../atoms/back-button";
import ProductBrandGeneralSection from "../../../organisms/brand-general-section";
import { Toaster } from "@medusajs/ui";
import useEditProductBrandActions from "../../../../hooks/use-edit-brand-actions";
import ProductThumbnailSection from "../../../../components/organisms/product-thumbnail-section";

const EditProductBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProductBrand, retrieving } = useEditProductBrandActions(id);
  const { data, error } = getProductBrand;

  if (error) {
    const errorStatus = getErrorStatus(error);

    if (errorStatus) {
      // If the product is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404");
        return null;
      }
    }

    // Let the error boundary handle the error
    throw error;
  }

  if (retrieving) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="pb-5xlarge">
        <BackButton
          path="/a/product-brands"
          label="Back to Brands"
          className="mb-xsmall"
        />
        <div className="gap-y-xsmall flex flex-col">
          <div className="gap-x-base grid grid-cols-12">
            <div className="gap-y-xsmall col-span-8 flex flex-col">
              <ProductBrandGeneralSection brand={data.brand} />
            </div>
            <div className="gap-y-xsmall col-span-4 flex flex-col">
              <ProductThumbnailSection brand={data.brand} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProductBrand;
