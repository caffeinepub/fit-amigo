import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductDetails, ProductId } from '../backend';

export function useEditProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productDetails }: { id: ProductId; productDetails: ProductDetails }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editProduct(id, productDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
