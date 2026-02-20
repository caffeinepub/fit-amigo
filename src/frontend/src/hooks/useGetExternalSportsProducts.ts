import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface ExternalSportsProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  externalProductUrl: string;
  isExternal: true;
}

export function useGetExternalSportsProducts(categoryFilter?: string, searchTerm?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExternalSportsProduct[]>({
    queryKey: ['externalSportsProducts', categoryFilter, searchTerm],
    queryFn: async () => {
      if (!actor) return [];

      try {
        const response = await actor.fetchExternalSportsProducts(
          categoryFilter || null,
          searchTerm || null
        );
        const data = JSON.parse(response);

        if (Array.isArray(data)) {
          return data.map((item: any) => ({
            id: item.id || String(Math.random()),
            name: item.name || 'Unknown Product',
            description: item.description || '',
            price: Number(item.price) || 0,
            imageUrl: item.imageUrl || '/assets/generated/sports-equipment-placeholder.dim_400x400.png',
            category: item.category || 'general',
            externalProductUrl: item.externalProductUrl || 'https://workoutpuppy.com',
            isExternal: true as const,
          }));
        }

        return [];
      } catch (error) {
        console.error('Failed to fetch external sports products:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
