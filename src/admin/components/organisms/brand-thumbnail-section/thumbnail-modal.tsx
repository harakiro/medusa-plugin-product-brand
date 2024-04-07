import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useEditProductBrandActions from "../../../hooks/use-edit-brand-actions";
import { FormImage } from "../../../../types/shared";
import { prepareImages } from "../../../utils/images";
import { nestedForm } from "../../../utils/nested-form";
import ThumbnailForm, { ThumbnailFormType } from "../../forms/thumbnail-form";
import { ProductBrand } from "../../../../models/product-brand";
import { Button, FocusModal, useToast } from "@medusajs/ui";
import { useMedusa } from "medusa-react";

type Props = {
  brand: ProductBrand;
  open: boolean;
  onClose: () => void;
};

type ThumbnailFormWrapper = {
  thumbnail: ThumbnailFormType;
};

const ThumbnailModal = ({ brand, open, onClose }: Props) => {
  const { t } = useTranslation();
  const { client } = useMedusa();

  const { onUpdate, updating } = useEditProductBrandActions(brand.id);
  const form = useForm<ThumbnailFormWrapper>({
    defaultValues: getDefaultValues(brand),
  });

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form;

  const { toast: notification } = useToast();

  useEffect(() => {
    reset(getDefaultValues(brand));
  }, [brand, reset]);

  const onReset = () => {
    reset(getDefaultValues(brand));
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    let preppedImages: FormImage[] = [];
    try {
      preppedImages = await prepareImages(data.thumbnail.images, client);
    } catch (error) {
      let errorMessage = t(
        "product-thumbnail-section-upload-thumbnail-error",
        "Something went wrong while trying to upload the thumbnail."
      );
      const response = (error as any).response as Response;

      if (response.status === 500) {
        errorMessage =
          errorMessage +
          " " +
          t(
            "product-thumbnail-section-you-might-not-have-a-file-service-configured-please-contact-your-administrator",
            "You might not have a file service configured. Please contact your administrator"
          );
      }

      notification({
        title: t("product-thumbnail-section-error", "Error"),
        description: errorMessage,
        variant: "error",
      });
      return;
    }
    const url = preppedImages?.[0]?.url;

    onUpdate(
      {
        // @ts-ignore
        thumbnail: url || null,
      },
      onReset
    );
  });

  return (
    <FocusModal open={open} onOpenChange={onReset}>
      <FocusModal.Content>
        <FocusModal.Header>
          <Button
            size="base"
            variant="primary"
            type="submit"
            disabled={!isDirty}
            onClick={onSubmit}
          >
            {t("brand-thumbnail-section-save", "Save")}
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center">
          <div className="h-full w-full px-[20rem]">
            <h2 className="inter-large-semibold mb-2xsmall">
              {t("product-thumbnail-section-thumbnail", "Thumbnail")}
            </h2>
            <p className="inter-base-regular text-grey-50">
              {t(
                "product-thumbnail-section-used-to-represent-your-product-during-checkout-social-sharing-and-more",
                "Used to represent your product during checkout, social sharing and more."
              )}
            </p>
            <div>
              <ThumbnailForm form={nestedForm(form, "thumbnail")} />
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

const getDefaultValues = (brand: ProductBrand): ThumbnailFormWrapper => {
  return {
    thumbnail: {
      images: brand.thumbnail
        ? [
            {
              url: brand.thumbnail,
            },
          ]
        : [],
    },
  };
};

export default ThumbnailModal;
