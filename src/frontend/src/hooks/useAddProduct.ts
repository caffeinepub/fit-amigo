import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';

// Local type definition since ProductDetails is not exported from backend
type ProductDetails = Omit<Product, 'id' | 'isInternal'>;

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productDetails: ProductDetails) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('addProduct method not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
