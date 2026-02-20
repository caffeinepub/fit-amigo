import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useDeleteFoodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFoodEntry(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFoodEntries'] });
    },
  });
}
