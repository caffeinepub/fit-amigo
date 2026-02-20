import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useHasLikedVideo(videoId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['videoLike', videoId?.toString()],
    queryFn: async () => {
      if (!actor || !videoId) return false;
      return actor.hasLikedVideo(videoId);
    },
    enabled: !!actor && !actorFetching && videoId !== null && !!identity,
  });
}
