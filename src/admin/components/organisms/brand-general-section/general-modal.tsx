import { useTranslation } from "react-i18next";
import { Button, Drawer } from "@medusajs/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import GeneralForm, { GeneralFormType } from "../../forms/general-form";
import { nestedForm } from "../../../utils/nested-form";
import { PencilSquare } from "@medusajs/icons";
import { ProductBrand } from "../../../../models/product-brand";
import useEditProductBrandActions from "../../../hooks/use-edit-brand-actions";

type Props = {
  brand: ProductBrand;
};

type GeneralFormWrapper = {
  general: GeneralFormType;
};

const GeneralModal = ({ brand }: Props) => {
  const { t } = useTranslation();
  const { onUpdate } = useEditProductBrandActions(brand.id);
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
    onUpdate(
      {
        title: data.general.title,
        handle: data.general.handle,
      },
      onReset
    );
  });

  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="secondary" size="base">
          <PencilSquare />
          {t(
            "brand-general-section-edit-general-information",
            "Edit General Information"
          )}
        </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit Brand</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          <GeneralForm form={nestedForm(form, "general")} />
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button
            size="base"
            variant="primary"
            type="submit"
            onClick={onSubmit}
            disabled={!isDirty}
          >
            {t("brand-general-section-save", "Save")}
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

const getDefaultValues = (brand: ProductBrand): GeneralFormWrapper => {
  return {
    general: {
      title: brand.title,
      handle: brand.handle!,
    },
  };
};

export default GeneralModal;
