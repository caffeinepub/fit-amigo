import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface DeleteCommentParams {
  commentId: bigint;
  videoId: bigint;
}

export function useDeleteComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: DeleteCommentParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteComment(commentId);
    },
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['videoComments', videoId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['video', videoId.toString()] });
    },
  });
}
