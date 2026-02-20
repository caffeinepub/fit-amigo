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
      // Backend method not yet implemented
      throw new Error('deleteComment method not yet implemented in backend');
    },
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['videoComments', videoId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['video', videoId.toString()] });
    },
  });
}
