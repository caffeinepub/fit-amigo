import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, ProductId } from '../backend';

// Local type definition since ProductDetails is not exported from backend
type ProductDetails = Omit<Product, 'id' | 'isInternal'>;

export function useEditProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productDetails }: { id: ProductId; productDetails: ProductDetails }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('editProduct method not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
