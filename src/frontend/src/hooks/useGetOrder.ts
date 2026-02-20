import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order } from '../backend';

export function useGetOrder(orderId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order>({
    queryKey: ['order', orderId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !actorFetching,
  });
}
