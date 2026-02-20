import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface AddCommentParams {
  videoId: bigint;
  text: string;
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, text }: AddCommentParams) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('addComment method not yet implemented in backend');
    },
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['videoComments', videoId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['video', videoId.toString()] });
    },
  });
}
