import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { RunningSession } from '../backend';

export function useGetUserRunningSessions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<RunningSession[]>({
    queryKey: ['runningSessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserRunningSessions();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}
