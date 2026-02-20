import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Video } from '../backend';

export function useGetVideo(videoId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Video | null>({
    queryKey: ['video', videoId?.toString()],
    queryFn: async () => {
      if (!actor || !videoId) return null;
      return actor.getVideo(videoId);
    },
    enabled: !!actor && !actorFetching && videoId !== null,
  });
}
