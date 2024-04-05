# Product Brand Plugin

CRUD brands and add them to your products.

## Features

- CRUD Brands
- Product Brand Pages
- Add images/thumbnail to a Brand
- Return Brand in store/admin api
- For Admin Brand response use GET `/custom-products` with id `/custom-products/${id}`
- For Admin update product with brand use POST `/custom-products/${id}`
- Edit Brand in product details

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)

---

1 \. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-product-brand`,
    options: {
      enableUI: true,
    },
  },
];
```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

```bash
npm run start
```
