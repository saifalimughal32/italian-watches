export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    vendor
    tags
    description
    featuredImage {
      url
      altText
    }
    images(first: 8) {
      nodes {
        url
        altText
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "line" },
      { namespace: "custom", key: "reference_number" },
      { namespace: "custom", key: "gender" },
      { namespace: "custom", key: "movement" },
      { namespace: "custom", key: "is_chronograph" },
      { namespace: "custom", key: "case_size_mm" },
      { namespace: "custom", key: "case_material" },
      { namespace: "custom", key: "dial_color" },
      { namespace: "custom", key: "crystal" },
      { namespace: "custom", key: "water_resistance" },
      { namespace: "custom", key: "strap_type" },
      { namespace: "custom", key: "power_reserve" },
      { namespace: "custom", key: "tier" },
      { namespace: "custom", key: "purchase_mode" }
    ]) {
      key
      value
      type
    }
  }
`;

export const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
              featuredImage {
                url
              }
            }
          }
        }
      }
    }
  }
`;
