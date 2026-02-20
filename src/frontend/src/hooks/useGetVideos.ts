import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Video } from '../backend';

export function useGetVideos() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !actorFetching,
  });
}
