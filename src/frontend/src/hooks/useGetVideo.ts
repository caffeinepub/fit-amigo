import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Video } from '../backend';

export function useGetVideo(videoId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Video | null>({
    queryKey: ['video', videoId?.toString()],
    queryFn: async () => {
      if (!actor || !videoId) return null;
      // Use getAllVideos and filter by ID as workaround
      const videos = await actor.getAllVideos();
      return videos.find(v => v.id === videoId) || null;
    },
    enabled: !!actor && !actorFetching && videoId !== null,
  });
}
