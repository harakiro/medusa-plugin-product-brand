import {
  Button,
  FocusModal,
  ProgressAccordion,
  useToast,
  Toaster,
  Heading,
} from "@medusajs/ui";
import { useAdminCustomPost, useMedusa } from "medusa-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AdminPostProductBrandsReq } from "../../../../../api/_methods/create-brand";
import GeneralForm from "../../../forms/general-form";
import MediaForm, { FormImage } from "../../../forms/media-form";
import { ProductBrand } from "../../../../../models/product-brand";
import { prepareImages } from "../../../../utils/images";
import { getErrorMessage } from "../../../../utils/error-message";
import { nestedForm } from "../../../../utils/nested-form";

type AdminProductBrandCreateReq = {
  title: string;
};

type AdminProductBrandCreateRes = {
  brand: ProductBrand;
};

const NewProductBrand = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { client } = useMedusa();

  const form = useForm({
    defaultValues: createBlank(),
  });

  const { mutate } = useAdminCustomPost<
    AdminProductBrandCreateReq,
    AdminProductBrandCreateRes
  >(`/brands`, ["brands", "create"], {
    product: true,
  });

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = form;

  const onSubmit = (publish = true) =>
    handleSubmit(async (data) => {
      const payload = createPayload(data);
      if (data.media?.images?.length) {
        let preppedImages: FormImage[] = [];

        try {
          preppedImages = await prepareImages(data.media.images, client);
        } catch (error) {
          let errorMessage = t(
            "new-something-went-wrong-while-trying-to-upload-images",
            "Something went wrong while trying to upload images."
          );
          const response = (error as any).response as Response;

          if (response.status === 500) {
            errorMessage =
              errorMessage +
              " " +
              t(
                "new-no-file-service-configured",
                "You might not have a file service configured. Please contact your administrator"
              );
          }

          toast({
            title: t("new-error", "Error"),
            description: errorMessage,
          });
          return;
        }
        const urls = preppedImages.map((image) => image.url);

        payload.images = urls;
      }

      if (data.thumbnail?.images?.length) {
        let preppedImages: FormImage[] = [];

        try {
          preppedImages = await prepareImages(data.thumbnail.images, client);
        } catch (error) {
          let errorMessage = t(
            "new-upload-thumbnail-error",
            "Something went wrong while trying to upload the thumbnail."
          );
          const response = (error as any).response as Response;

          if (response.status === 500) {
            errorMessage =
              errorMessage +
              " " +
              t(
                "new-no-file-service-configured",
                "You might not have a file service configured. Please contact your administrator"
              );
          }

          toast({ title: t("new-error", "Error"), description: errorMessage });
          return;
        }
        const urls = preppedImages.map((image) => image.url);

        payload.thumbnail = urls[0];
      }

      mutate(payload, {
        onSuccess: ({ brand }) => {
          navigate(`${brand.id}`);
        },
        onError: (err) => {
          toast({
            title: t("new-error", "Error"),
            description: getErrorMessage(err),
          });
        },
      });
    });

  return (
    <>
      <Toaster />
      <FocusModal>
        <FocusModal.Trigger asChild>
          <Button variant="secondary" size="base" onClick={null}>
            New Brand
          </Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button onClick={onSubmit(true)}>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16 overflow-y-auto">
            <div className="h-full w-full px-[20rem]">
              <Heading level="h1" className="text-ui-fg-base">
                {t("new-general-information-title", "General information")}
              </Heading>
              <GeneralForm form={nestedForm(form, "general")} />
              <Heading level="h1" className="text-ui-fg-base">
                {t("new-media-title", "Media")}
              </Heading>
              <MediaForm form={nestedForm(form, "media")} />
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};

export default NewProductBrand;

const createBlank = () => {
  return {
    general: {
      title: "",
      handle: null,
    },
    media: {
      images: [],
    },
    thumbnail: {
      images: [],
    },
  };
};

const createPayload = (data): AdminPostProductBrandsReq => {
  const payload: AdminPostProductBrandsReq = {
    title: data?.general?.title,
    handle:
      data?.general?.handle ||
      data?.general?.title?.toLowerCase()?.replace(" ", "-"),
  };
  return payload;
};
