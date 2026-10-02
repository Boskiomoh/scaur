import "server-only";

export class ShopifyError extends Error {
  constructor(
    readonly kind: "config" | "network" | "graphql",
    readonly messages: string[],
  ) {
    super(`Shopify ${kind} error: ${messages.join("; ")}`);
  }
}

interface FetchOptions {
  tags?: string[];
  revalidate?: number | false;
  cache?: RequestCache;
  // Set on requests made for a visitor, so Shopify's bot protection sees them, not our server.
  buyerIp?: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export const storefrontFetch = async <T>(
  query: string,
  variables: Record<string, unknown> = {},
  { tags, revalidate, cache, buyerIp }: FetchOptions = {},
): Promise<T> => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-07";
  if (!domain || !token) {
    throw new ShopifyError("config", [
      "SHOPIFY_STORE_DOMAIN or the Storefront token is not set",
    ]);
  }

  let response: Response;
  try {
    response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": token,
        ...(buyerIp ? { "Shopify-Storefront-Buyer-IP": buyerIp } : {}),
      },
      body: JSON.stringify({ query, variables }),
      ...(cache ? { cache } : { next: { tags, revalidate } }),
    });
  } catch (error) {
    throw new ShopifyError("network", [
      error instanceof Error ? error.message : "fetch failed",
    ]);
  }

  if (!response.ok) {
    throw new ShopifyError("network", [
      `${response.status} ${response.statusText}`,
    ]);
  }

  const body = (await response.json()) as GraphQLResponse<T>;
  if (body.errors?.length || !body.data) {
    throw new ShopifyError(
      "graphql",
      body.errors?.map((error) => error.message) ?? ["empty response"],
    );
  }
  return body.data;
};
