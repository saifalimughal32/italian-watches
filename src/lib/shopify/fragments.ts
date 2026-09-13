export const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFields on Product {
    id
    title
    handle
    vendor
    tags
    description
    featuredImage {
      url(transform: { maxWidth: 900 })
      altText
    }
    images(first: 1) {
      nodes {
        url(transform: { maxWidth: 900 })
        altText
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 3) {
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
      { namespace: "watches", key: "line" },
      { namespace: "watches", key: "gender" },
      { namespace: "watches", key: "movement" },
      { namespace: "watches", key: "tier" },
      { namespace: "watches", key: "purchase_mode" },
      { namespace: "watches", key: "is_limited" },
      { namespace: "watches", key: "is_chronograph" },
      { namespace: "custom", key: "line" },
      { namespace: "custom", key: "gender" },
      { namespace: "custom", key: "movement" },
      { namespace: "custom", key: "tier" },
      { namespace: "custom", key: "purchase_mode" },
      { namespace: "custom", key: "is_limited" },
      { namespace: "custom", key: "is_chronograph" }
    ]) {
      key
      value
      type
    }
  }
`;

export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    vendor
    tags
    description
    descriptionHtml
    featuredImage {
      url(transform: { maxWidth: 1600 })
      altText
    }
    images(first: 8) {
      nodes {
        url(transform: { maxWidth: 1600 })
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
      { namespace: "watches", key: "line" },
      { namespace: "watches", key: "reference_number" },
      { namespace: "watches", key: "gender" },
      { namespace: "watches", key: "movement" },
      { namespace: "watches", key: "is_chronograph" },
      { namespace: "watches", key: "case_size_mm" },
      { namespace: "watches", key: "case_material" },
      { namespace: "watches", key: "dial_color" },
      { namespace: "watches", key: "crystal" },
      { namespace: "watches", key: "water_resistance" },
      { namespace: "watches", key: "strap_type" },
      { namespace: "watches", key: "power_reserve" },
      { namespace: "watches", key: "tier" },
      { namespace: "watches", key: "purchase_mode" },
      { namespace: "watches", key: "is_limited" },
      { namespace: "watches", key: "box_papers" },
      { namespace: "watches", key: "year_of_production" },
      { namespace: "watches", key: "condition" },
      { namespace: "watches", key: "service_history" },
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
      { namespace: "custom", key: "purchase_mode" },
      { namespace: "custom", key: "is_limited" },
      { namespace: "custom", key: "box_papers" },
      { namespace: "custom", key: "year_of_production" },
      { namespace: "custom", key: "year_or_generation" },
      { namespace: "custom", key: "condition" },
      { namespace: "custom", key: "service_history" }
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
                url(transform: { maxWidth: 400 })
              }
            }
          }
        }
      }
    }
  }
`;
