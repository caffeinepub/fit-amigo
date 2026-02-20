import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface ExternalFitnessVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  uploader: string;
  viewCount?: number;
  duration: number;
  isExternal: true;
}

export function useGetExternalFitnessVideos() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExternalFitnessVideo[]>({
    queryKey: ['externalFitnessVideos'],
    queryFn: async () => {
      if (!actor) return [];

      try {
        const response = await actor.fetchSportsAndFitnessVideos();
        const data = JSON.parse(response);

        if (Array.isArray(data)) {
          return data.map((item: any) => ({
            id: item.id || String(Math.random()),
            title: item.title || 'Untitled Video',
            description: item.description || '',
            thumbnailUrl: item.thumbnailUrl || '/assets/generated/workout-bg.dim_1200x800.png',
            videoUrl: item.videoUrl || item.embedUrl || '',
            uploader: item.uploader || item.channel || 'Unknown',
            viewCount: item.viewCount ? Number(item.viewCount) : undefined,
            duration: Number(item.duration) || 0,
            isExternal: true as const,
          }));
        }

        return [];
      } catch (error) {
        console.error('Failed to fetch external fitness videos:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
