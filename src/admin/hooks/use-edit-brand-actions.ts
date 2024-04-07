import { useToast, usePrompt } from "@medusajs/ui";
import {
  useAdminCustomPost,
  useAdminCustomQuery,
  useAdminCustomDelete,
} from "medusa-react";
import { AdminPostProductBrandsReq } from "../../api/_methods/create-brand";
import { getErrorMessage } from "../utils/error-message";

const useEditProductBrandActions = (brandId: string) => {
  const dialog = usePrompt();
  const { toast: notification } = useToast();
  const getProductBrand = useAdminCustomQuery(`/brands/${brandId}`, [
    "brands",
    "get",
  ]);

  const UpdateProductBrand = useAdminCustomPost(`/brands/${brandId}`, [
    "brands",
    "update",
  ]);

  const DeleteProductBrand = useAdminCustomDelete(`/brands/${brandId}`, [
    "brands",
    "delete",
  ]);

  const onDelete = async () => {
    const shouldDelete = await dialog({
      title: "Delete Brand",
      description: "Are you sure you want to delete this brand",
    });
    if (shouldDelete) {
      DeleteProductBrand.mutate(undefined, {
        onSuccess: () => {
          notification({
            title: "Success",
            description: "Brand deleted successfully",
            variant: "success",
          });
          window.location.href = "/a/product-brands";
        },
        onError: (err) => {
          notification({
            title: "Error",
            description: getErrorMessage(err),
            variant: "error",
          });
        },
      });
    }
  };

  const onUpdate = (
    payload: Partial<AdminPostProductBrandsReq>,
    onSuccess: () => void,
    successMessage = "Brand was successfully updated"
  ) => {
    UpdateProductBrand.mutate(
      // @ts-ignore TODO fix images being required
      payload,
      {
        onSuccess: () => {
          notification({
            title: "Success",
            description: successMessage,
            variant: "success",
          });
          onSuccess();
        },
        onError: (err) => {
          notification({
            title: "Error",
            description: getErrorMessage(err),
            variant: "error",
          });
        },
      }
    );
  };

  return {
    getProductBrand,
    onDelete,
    onUpdate,
    retrieving: getProductBrand.isLoading,
    updating: UpdateProductBrand.isLoading,
    deleting: DeleteProductBrand.isLoading,
  };
};

export default useEditProductBrandActions;
