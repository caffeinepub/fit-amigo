import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useLikeVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('likeVideo method not yet implemented in backend');
    },
    onSuccess: (_, videoId) => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['videoLike', videoId.toString()] });
    },
  });
}
