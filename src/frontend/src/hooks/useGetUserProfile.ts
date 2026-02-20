import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

export function useGetUserProfile(userId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !actorFetching && userId !== null,
  });
}
