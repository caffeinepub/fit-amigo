import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shippingAddress: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(shippingAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
