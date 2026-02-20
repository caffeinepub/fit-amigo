import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface LogRunningSessionParams {
  distance: number;
  duration: bigint;
  notes: string | null;
}

export function useLogRunningSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ distance, duration, notes }: LogRunningSessionParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logRunningSession(distance, duration, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runningSessions'] });
    },
  });
}
