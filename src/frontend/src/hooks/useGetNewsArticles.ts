import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NewsArticle, NewsCategory } from '../backend';

export function useGetNewsArticles(categoryFilter: NewsCategory | null = null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NewsArticle[]>({
    queryKey: ['newsArticles', categoryFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNewsArticles(categoryFilter);
    },
    enabled: !!actor && !actorFetching,
  });
}
