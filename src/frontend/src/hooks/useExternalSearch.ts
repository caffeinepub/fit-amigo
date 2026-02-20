import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface ExternalSearchResult {
  resultType: string;
  title: string;
  preview: string;
  sourceUrl: string;
  sourceName: string;
}

export function useExternalSearch(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExternalSearchResult[]>({
    queryKey: ['externalSearch', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      
      try {
        const response = await actor.getExternalFitnessSearchResults(searchTerm);
        
        // Parse JSON response from backend
        const parsedData = JSON.parse(response);
        
        // Transform to ExternalSearchResult format
        if (Array.isArray(parsedData)) {
          return parsedData.map((item: any) => ({
            resultType: item.resultType || item.type || 'general',
            title: item.title || '',
            preview: item.preview || item.snippet || item.description || '',
            sourceUrl: item.sourceUrl || item.url || '',
            sourceName: item.source || item.sourceName || 'External Source',
          }));
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching external search results:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching && searchTerm.length >= 2,
    retry: false,
  });
}
