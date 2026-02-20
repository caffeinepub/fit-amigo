import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NewsArticle, ArticleId } from '../backend';

export function useGetNewsArticle(articleId: ArticleId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NewsArticle | null>({
    queryKey: ['newsArticle', articleId?.toString()],
    queryFn: async () => {
      if (!actor || !articleId) return null;
      return actor.getNewsArticle(articleId);
    },
    enabled: !!actor && !actorFetching && articleId !== null,
  });
}
