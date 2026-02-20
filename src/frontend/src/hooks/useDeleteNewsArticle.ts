import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ArticleId } from '../backend';

export function useDeleteNewsArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: ArticleId) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('deleteNewsArticle method not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
    },
  });
}
