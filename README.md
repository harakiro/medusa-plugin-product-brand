# Product Brand Plugin

CRUD brands and add them to your products.

## Features

- CRUD Brands
- Available columns: title, handle, thumbnail, metadata
- Add thumbnail to a Brand
- Return Brand in store/admin apis
- Edit/search Brand in product details
- Add metadata to a brand
- Create/Update/Delete Brand events

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
