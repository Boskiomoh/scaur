const productFields = /* GraphQL */ `
  fragment ProductFields on Product {
    handle
    title
    descriptionHtml
    productType
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 50) {
      nodes {
        id
        availableForSale
        quantityAvailable
        price {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

export const productsQuery = /* GraphQL */ `
  query Products {
    products(first: 50, sortKey: TITLE) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${productFields}
`;

export const productQuery = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${productFields}
`;
