import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useSearchProducts(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProducts(searchTerm);
    },
    enabled: !!actor && !actorFetching,
  });
}
