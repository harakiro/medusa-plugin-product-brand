import clsx from "clsx";
import { useTranslation } from "react-i18next";
import TwoStepDelete from "../../atoms/two-step-delete";
import ThumbnailModal from "./thumbnail-modal";
import useEditProductBrandActions from "../../../hooks/use-edit-brand-actions";
import { ProductBrand } from "../../../../models/product-brand";
import { Button, useToast, useToggleState } from "@medusajs/ui";
import { getErrorMessage } from "../../../utils/error-message";
import Section from "../../molecules/section";

type Props = {
  brand: ProductBrand;
};

const ProductThumbnailSection = ({ brand }: Props) => {
  const { t } = useTranslation();
  const { onUpdate, updating } = useEditProductBrandActions(brand.id);
  const { state, toggle, close } = useToggleState();

  const { toast: notification } = useToast();

  const handleDelete = () => {
    onUpdate(
      {
        // @ts-ignore
        thumbnail: null,
      },
      {
        // @ts-ignore
        onSuccess: () => {
          notification({
            title: t("product-thumbnail-section-success", "Success"),
            description: t(
              "product-thumbnail-section-successfully-deleted-thumbnail",
              "Successfully deleted thumbnail"
            ),
            variant: "success",
          });
        },
        onError: (err) => {
          notification({
            title: t("product-thumbnail-section-error", "Error"),
            description: getErrorMessage(err),
            variant: "error",
          });
        },
      }
    );
  };

  return (
    <>
      <Section
        title="Thumbnail"
        customActions={
          <div className="gap-x-xsmall flex items-center">
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={toggle}
            >
              {brand.thumbnail
                ? t("product-thumbnail-section-edit", "Edit")
                : t("product-thumbnail-section-upload", "Upload")}
            </Button>
            {brand.thumbnail && (
              <TwoStepDelete onDelete={handleDelete} deleting={updating} />
            )}
          </div>
        }
      >
        <div
          className={clsx("gap-xsmall mt-base grid grid-cols-3", {
            hidden: !brand.thumbnail,
          })}
        >
          {brand.thumbnail && (
            <div className="flex aspect-square items-center justify-center">
              <img
                src={brand.thumbnail}
                alt={`Thumbnail for ${brand.title}`}
                className="rounded-rounded max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </Section>

      <ThumbnailModal brand={brand} open={state} onClose={close} />
    </>
  );
};

export default ProductThumbnailSection;
