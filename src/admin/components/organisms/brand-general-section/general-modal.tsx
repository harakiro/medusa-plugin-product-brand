import { useTranslation } from "react-i18next";
import { Button, FocusModal, Heading } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import GeneralForm, { GeneralFormType } from "../../forms/general-form";
import { nestedForm } from "../../../utils/nested-form";
import { PencilSquare } from "@medusajs/icons";
import { ProductBrand } from "../../../../models/product-brand";
import useEditProductBrandActions from "../../../hooks/use-edit-brand-actions";
import MetadataForm, {
  MetadataFormType,
  getMetadataFormValues,
  getSubmittableMetadata,
} from "../../forms/metadata-form";

type Props = {
  brand: ProductBrand;
};

type GeneralFormWrapper = {
  general: GeneralFormType;
  metadata: MetadataFormType;
};

const GeneralModal = ({ brand }: Props) => {
  const { t } = useTranslation();
  const { onUpdate } = useEditProductBrandActions(brand.id);
  const [open, setOpen] = useState(false);

  const form = useForm<GeneralFormWrapper>({
    defaultValues: getDefaultValues(brand),
  });

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

  const onSubmit = handleSubmit((data) => {
    setOpen(false);
    onUpdate(
      {
        title: data.general.title,
        handle: data.general?.title?.toLowerCase()?.replace(" ", "-"),
        metadata: getSubmittableMetadata(data.metadata),
      },
      onReset
    );
  });

  return (
    <>
      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Trigger asChild>
          <Button variant="secondary" size="base">
            <PencilSquare />
            {t(
              "brand-general-section-edit-general-information",
              "Edit General Information"
            )}
          </Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              size="base"
              variant="primary"
              type="submit"
              onClick={onSubmit}
              disabled={!isDirty}
            >
              {t("brand-general-section-save", "Save")}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16 overflow-y-auto">
            <div className="h-full w-full px-[20rem]">
              <Heading level="h1" className="text-ui-fg-base">
                {t("edit-brand", "Edit Brand")}
              </Heading>
              <GeneralForm form={nestedForm(form, "general")} />
              <div className="mt-xlarge">
                <h2 className="inter-base-semibold mb-base">
                  {t("product-general-section-metadata", "Metadata")}
                </h2>
                <MetadataForm form={nestedForm(form, "metadata")} />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};

const getDefaultValues = (brand: ProductBrand): GeneralFormWrapper => {
  return {
    general: {
      title: brand.title,
      handle: brand?.handle,
    },
    metadata: getMetadataFormValues(brand.metadata),
  };
};

export default GeneralModal;
