import { useToast, Toaster, FocusModal, Button } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import MediaForm, { MediaFormType } from "../../forms/media-form";
import { prepareImages } from "../../../utils/images";
import { nestedForm } from "../../../utils/nested-form";
import { useMedusa } from "medusa-react";
import useEditProductBrandActions from "../../../hooks/use-edit-brand-actions";
import { ProductBrand } from "../../../../models/product-brand";
import { FormImage } from "../../../../types/shared";

type Props = {
  brand: ProductBrand;
};

type MediaFormWrapper = {
  media: MediaFormType;
};

const MediaModal = ({ brand }: Props) => {
  const { t } = useTranslation();
  const { toast: notification } = useToast();
  const { client } = useMedusa();
  const { onUpdate } = useEditProductBrandActions(brand.id);
  const form = useForm<MediaFormWrapper>({
    defaultValues: getDefaultValues(brand),
  });
  const [open, setOpen] = useState(false);

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form;

  useEffect(() => {
    reset(getDefaultValues(brand));
  }, [brand, reset]);

  const onReset = () => {
    reset(getDefaultValues(brand));
  };

  const onSubmit = handleSubmit(async (data) => {
    let preppedImages: FormImage[] = [];

    try {
      preppedImages = await prepareImages(data.media.images, client);
      setOpen(false);
    } catch (error) {
      let errorMessage = t(
        "brand-media-section-upload-images-error",
        "Something went wrong while trying to upload images."
      );
      const response = (error as any).response as Response;

      if (response.status === 500) {
        errorMessage =
          errorMessage +
          " " +
          t(
            "brand-media-section-file-service-not-configured",
            "You might not have a file service configured. Please contact your administrator"
          );
      }

      notification({
        title: t("brand-media-section-error", "Error"),
        description: errorMessage,
        variant: "error",
      });
      return;
    }
    const urls = preppedImages.map((image) => image.url);
    onUpdate(
      {
        images: urls,
      },
      onReset
    );
  });

  return (
    <>
      <Toaster />
      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Trigger asChild>
          <Button variant="secondary" size="base" onClick={null}>
            {t("brand-media-section-edit-media", "Edit Media")}
          </Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              size="base"
              variant="primary"
              type="submit"
              disabled={!isDirty}
              onClick={onSubmit}
            >
              {t("brand-media-section-save", "Save")}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16 overflow-y-auto">
            <div className="h-full w-full px-[20rem]">
              <h2 className="inter-large-semibold mb-2xsmall">
                {t("brand-media-section-media", "Media")}
              </h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                {t(
                  "brand-media-section-add-images-to-your-brand",
                  "Add images to your brand."
                )}
              </p>
              <div>
                <MediaForm form={nestedForm(form, "media")} />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};

const getDefaultValues = (brand: ProductBrand): MediaFormWrapper => {
  return {
    media: {
      images:
        brand.images?.map((image) => ({
          url: image.url,
          selected: false,
        })) || [],
    },
  };
};

export default MediaModal;
