import { ProductBrand } from "../../../../models/product-brand";
import { ActionType } from "../../molecules/actionables";
import Section from "../../molecules/section";
import MediaModal from "./media-modal";

type Props = {
  brand: ProductBrand;
};

const ProductBrandMediaSection = ({ brand }: Props) => {
  const actions: ActionType[] = [
    {
      component: <MediaModal brand={brand} />,
    },
  ];

  return (
    <>
      <Section title="Media" actions={actions} forceDropdown>
        {brand.images && brand.images.length > 0 && (
          <div className="gap-xsmall mt-base grid grid-cols-3">
            {brand.images.map((image, index) => {
              return (
                <div
                  key={image.id}
                  className="flex aspect-square items-center justify-center"
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="rounded-rounded max-h-full max-w-full object-contain"
                  />
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
};

export default ProductBrandMediaSection;
