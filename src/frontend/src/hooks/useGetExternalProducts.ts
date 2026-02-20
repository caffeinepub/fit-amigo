import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExternalProduct } from '../types/ExternalProduct';
import { isGoStoreConfigured } from '../config/api';

export function useGetExternalProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExternalProduct[]>({
    queryKey: ['externalProducts'],
    queryFn: async () => {
      if (!isGoStoreConfigured()) {
        console.warn('Go Store API not configured. External products will not be displayed.');
        return [];
      }

      if (!actor) return [];

      try {
        const response = await actor.fetchExternalProducts();
        const data = JSON.parse(response);
        
        // Transform API response to ExternalProduct format
        if (Array.isArray(data)) {
          return data.map((item: any) => ({
            id: item.id || item._id || String(Math.random()),
            name: item.name || item.title || 'Unknown Product',
            price: Number(item.price) || 0,
            imageUrl: item.imageUrl || item.image || '/assets/generated/sports-equipment-placeholder.dim_400x400.png',
            externalUrl: item.externalUrl || item.url || 'https://gostore.icp0.io',
            isExternal: true as const,
          }));
        }
        
        return [];
      } catch (error) {
        console.error('Failed to fetch external products:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching && isGoStoreConfigured(),
    retry: false,
  });
}
