export default async function () {
  const adminProductImports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/products/index"
  )) as any;

  const storeProductImports = (await import(
    "@medusajs/medusa/dist/api/routes/store/products/index"
  )) as any;

  adminProductImports.defaultAdminProductRelations = [
    ...adminProductImports.defaultAdminProductRelations,
    "brand",
  ];

  adminProductImports.defaultAdminProductRemoteQueryObject = {
    ...adminProductImports.defaultAdminProductRemoteQueryObject,
    brand: {
      relation: "brand",
      fields: ["title", "handle"],
    },
  };

  storeProductImports.defaultStoreProductsRelations = [
    ...storeProductImports.defaultStoreProductsRelations,
    "brand",
  ];

  storeProductImports.allowedStoreProductsRelations = [
    ...storeProductImports.allowedStoreProductsRelations,
    "brand",
  ];
}
