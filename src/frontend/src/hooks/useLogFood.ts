import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FoodEntryInput } from '../backend';

export function useLogFood() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (food: FoodEntryInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFoodEntry(food);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFoodEntries'] });
    },
  });
}
