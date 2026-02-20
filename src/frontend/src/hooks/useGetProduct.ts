import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useGetProduct(productId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', productId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(productId);
    },
    enabled: !!actor && !actorFetching,
  });
}
