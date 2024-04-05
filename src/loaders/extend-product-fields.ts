export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/products/index"
  )) as any;
  imports.allowedStoreProductsFields = [
    ...imports.allowedStoreProductsFields,
    "brand",
  ];
  imports.defaultStoreProductsFields = [
    ...imports.defaultStoreProductsFields,
    "brand",
  ];
  imports.allowedStoreProductsRelations = [
    ...imports.allowedStoreProductsRelations,
    "brand",
  ];
  imports.defaultStoreProductsRelations = [
    ...imports.defaultStoreProductsRelations,
    "brand",
  ];
}
