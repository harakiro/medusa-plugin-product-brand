import { WidgetConfig } from "@medusajs/admin";

import { Button, Container, Heading, Text } from "@medusajs/ui";

const BrandWidget = () => {
  return (
    <>
      <Container className="text-ui-fg-subtle px-0 pt-0 pb-4">
        <div className="flex py-6 px-8">
          <>
            <div className="flex w-2/3 gap-x-8">
              <div className="flex flex-col flex-1 gap-y-2">
                <div className="flex items-center gap-x-2">
                  <Heading level="h1" className="text-ui-fg-base">
                    Brands
                  </Heading>
                </div>
                <div className="flex items-center gap-x-2">
                  <Text className="inter-base-regular text-grey-50">
                    Create brands and assign them to your products
                  </Text>
                </div>
              </div>
            </div>
            <div className="ml-auto flex items-start gap-2">
              <Button
                variant="secondary"
                size="base"
                onClick={() => (window.location.href = "/a/product-brands")}
              >
                Create Brand
              </Button>
            </div>
          </>
        </div>
      </Container>
    </>
  );
};

export const config: WidgetConfig = {
  zone: ["product.list.before"],
};

export default BrandWidget;
