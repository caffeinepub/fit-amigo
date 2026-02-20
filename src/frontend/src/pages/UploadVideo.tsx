import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useUploadVideo } from '../hooks/useUploadVideo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

interface UploadFormData {
  title: string;
  description: string;
  videoFile: FileList;
}

export default function UploadVideo() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const uploadVideo = useUploadVideo();
  const [uploadProgress, setUploadProgress] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm<UploadFormData>();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to upload videos</p>
      </div>
    );
  }

  const onSubmit = async (data: UploadFormData) => {
    if (!data.videoFile || data.videoFile.length === 0) {
      toast.error('Please select a video file');
      return;
    }

    const file = data.videoFile[0];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (file.size > maxSize) {
      toast.error('Video file is too large. Maximum size is 100MB');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const videoId = await uploadVideo.mutateAsync({
        title: data.title,
        description: data.description,
        file: blob,
      });

      toast.success('Video uploaded successfully!');
      navigate({ to: `/fitube/${videoId.toString()}` });
    } catch (error) {
      toast.error('Failed to upload video');
      console.error('Upload error:', error);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/fitube' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to FiTube
      </Button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-card border-2 border-energetic-orange rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter video title"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your video"
                className="min-h-[120px]"
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoFile">Video File *</Label>
              <Input
                id="videoFile"
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                {...register('videoFile', { required: 'Video file is required' })}
              />
              {errors.videoFile && (
                <p className="text-sm text-destructive">{errors.videoFile.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Supported formats: MP4, WebM, MOV (Max 100MB)
              </p>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <Button
              type="submit"
              disabled={uploadVideo.isPending}
              className="w-full bg-energetic-orange hover:bg-energetic-orange/90 font-semibold"
            >
              {uploadVideo.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Video
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
