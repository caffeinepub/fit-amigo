import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FoodEntry } from '../backend';

export function useGetFoodEntry(entryId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FoodEntry | null>({
    queryKey: ['foodEntry', entryId?.toString()],
    queryFn: async () => {
      if (!actor || !entryId) return null;
      return actor.getFoodEntry(entryId);
    },
    enabled: !!actor && !actorFetching && !!entryId,
  });
}
