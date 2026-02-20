import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { FoodEntry } from '../backend';

export function useGetUserFoodEntries() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<FoodEntry[]>({
    queryKey: ['userFoodEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserFoodEntries();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}
