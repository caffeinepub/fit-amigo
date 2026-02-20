import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NewsArticle, ArticleId } from '../backend';

// Local type definition since NewsArticleInput is not exported from backend
type NewsArticleInput = Omit<NewsArticle, 'id' | 'creationTimestamp' | 'creatorUserId'>;

export function useEditNewsArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, articleInput }: { articleId: ArticleId; articleInput: NewsArticleInput }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('updateNewsArticle method not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
      queryClient.invalidateQueries({ queryKey: ['newsArticle'] });
    },
  });
}
