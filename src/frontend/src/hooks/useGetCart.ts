import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CartItem } from '../backend';

export function useGetCart() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not yet implemented - return empty cart
      return [];
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}
