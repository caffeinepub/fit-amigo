import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductDetails } from '../backend';

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productDetails: ProductDetails) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(productDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
