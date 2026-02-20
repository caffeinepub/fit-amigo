import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductId } from '../backend';

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ProductId) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('deleteProduct method not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
