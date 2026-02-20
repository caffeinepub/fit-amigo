import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CartItem } from '../backend';

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: CartItem) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('addToCart method not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
