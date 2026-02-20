import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useDeleteRunningSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (runId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRunningSession(runId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runningSessions'] });
    },
  });
}
