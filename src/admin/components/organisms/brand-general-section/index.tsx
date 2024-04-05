import { Trash } from "@medusajs/icons";
import { useTranslation } from "react-i18next";
import Section from "../../molecules/section";
import DelimitedList from "../../molecules/delimited-list";
import { ActionType } from "../../molecules/actionables";
import GeneralModal from "./general-modal";
import useEditProductBrandActions from "../../../hooks/use-edit-brand-actions";
import { ProductBrand } from "../../../../models/product-brand";

type Props = {
  brand: ProductBrand;
};

const ProductBrandGeneralSection = ({ brand }: Props) => {
  const { t } = useTranslation();
  const { onDelete } = useEditProductBrandActions(brand.id);

  const actions: ActionType[] = [
    {
      component: <GeneralModal brand={brand} />,
    },
    {
      label: t("brand-general-section-delete", "Delete"),
      onClick: onDelete,
      variant: "danger",
      icon: <Trash />,
    },
  ];

  return (
    <>
      <Section title={brand.title} forceDropdown actions={actions}>
        <ProductBrandDetails brand={brand} />
      </Section>
    </>
  );
};

type DetailProps = {
  title: string;
  value?: string[] | string | null;
};

const Detail = ({ title, value }: DetailProps) => {
  const DetailValue = () => {
    if (!Array.isArray(value)) {
      return <p>{value ? value : "–"}</p>;
    }

    if (value.length) {
      return <DelimitedList list={value} delimit={2} />;
    }

    return <p>–</p>;
  };

  return (
    <div className="inter-base-regular text-grey-50 flex items-center justify-between">
      <p>{title}</p>
      <DetailValue />
    </div>
  );
};

const ProductBrandDetails = ({ brand }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 flex flex-col gap-y-3">
      <h2 className="inter-base-semibold">
        {t("brand-general-section-details", "Details")}
      </h2>
      <Detail
        title={t("brand-general-section-handle", "Handle")}
        value={brand.handle}
      />
    </div>
  );
};

export default ProductBrandGeneralSection;
