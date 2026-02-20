import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

interface UploadVideoParams {
  title: string;
  description: string;
  file: ExternalBlob;
}

export function useUploadVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, file }: UploadVideoParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadVideo(title, description, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}
