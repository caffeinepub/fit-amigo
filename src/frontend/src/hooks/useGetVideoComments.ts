import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Comment } from '../backend';

export function useGetVideoComments(videoId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['videoComments', videoId?.toString()],
    queryFn: async () => {
      if (!actor || !videoId) return [];
      return actor.getVideoComments(videoId);
    },
    enabled: !!actor && !actorFetching && videoId !== null,
  });
}
