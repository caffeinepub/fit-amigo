import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SearchResult } from '../backend';

export function useSearchContent(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SearchResult[]>({
    queryKey: ['searchContent', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchContent(searchTerm);
    },
    enabled: !!actor && !actorFetching && searchTerm.length >= 2,
  });
}
