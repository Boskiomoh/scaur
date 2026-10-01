const productFields = /* GraphQL */ `
  fragment ProductFields on Product {
    handle
    title
    descriptionHtml
    productType
    tags
    fabricFit: metafield(namespace: "custom", key: "fabric_fit") {
      value
    }
    features: metafield(namespace: "custom", key: "features") {
      value
    }
    care: metafield(namespace: "custom", key: "care") {
      value
    }
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

const cartFields = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        attributes {
          key
          value
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            availableForSale
            quantityAvailable
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
            price {
              amount
              currencyCode
            }
            product {
              handle
              title
            }
          }
        }
      }
    }
  }
`;

const cartResult = /* GraphQL */ `
  cart {
    ...CartFields
  }
  userErrors {
    message
  }
  warnings {
    code
    message
  }
`;

export const cartQuery = /* GraphQL */ `
  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
  ${cartFields}
`;

export const cartCreateMutation = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      ${cartResult}
    }
  }
  ${cartFields}
`;

export const cartLinesAddMutation = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      ${cartResult}
    }
  }
  ${cartFields}
`;

export const cartLinesUpdateMutation = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      ${cartResult}
    }
  }
  ${cartFields}
`;

export const cartLinesRemoveMutation = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      ${cartResult}
    }
  }
  ${cartFields}
`;

export const variantStockQuery = /* GraphQL */ `
  query VariantStock($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        availableForSale
        quantityAvailable
      }
    }
  }
`;
