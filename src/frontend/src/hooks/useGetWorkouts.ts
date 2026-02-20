import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Workout } from '../backend';

export function useGetWorkouts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Workout[]>({
    queryKey: ['workouts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkouts();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}
