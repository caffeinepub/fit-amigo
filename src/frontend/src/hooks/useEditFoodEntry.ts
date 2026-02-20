import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FoodEntryInput } from '../backend';

interface EditFoodEntryParams {
  entryId: bigint;
  food: FoodEntryInput;
}

export function useEditFoodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryId, food }: EditFoodEntryParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editFoodEntry(entryId, food);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFoodEntries'] });
      queryClient.invalidateQueries({ queryKey: ['foodEntry'] });
    },
  });
}
