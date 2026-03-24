import type { QueryParams } from "sanity";
import { sanityClient } from "sanity:client";

export async function loadQuery<T>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {
  const result = await sanityClient.fetch<T>(query, params ?? {});
  return { data: result };
}
