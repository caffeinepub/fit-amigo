import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetVideo } from '../hooks/useGetVideo';
import { useLikeVideo } from '../hooks/useLikeVideo';
import { useUnlikeVideo } from '../hooks/useUnlikeVideo';
import { useHasLikedVideo } from '../hooks/useHasLikedVideo';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import VideoCommentsSection from '../components/VideoCommentsSection';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ArrowLeft, User, Calendar, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function VideoDetail() {
  const { videoId } = useParams({ from: '/fitube/$videoId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const videoIdBigInt = videoId ? BigInt(videoId) : null;
  
  const { data: video, isLoading } = useGetVideo(videoIdBigInt);
  const { data: hasLiked = false } = useHasLikedVideo(videoIdBigInt);
  const { data: uploaderProfile } = useGetUserProfile(video?.uploaderId || null);
  const likeVideo = useLikeVideo();
  const unlikeVideo = useUnlikeVideo();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to view videos</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-energetic-orange" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
        <Button onClick={() => navigate({ to: '/fitube' })}>Back to FiTube</Button>
      </div>
    );
  }

  const handleLike = async () => {
    try {
      if (hasLiked) {
        await unlikeVideo.mutateAsync(video.id);
        toast.success('Unliked video');
      } else {
        await likeVideo.mutateAsync(video.id);
        toast.success('Liked video');
      }
    } catch (error: any) {
      if (error.message?.includes('Already liked')) {
        toast.error('You already liked this video');
      } else if (error.message?.includes("Haven't liked")) {
        toast.error("You haven't liked this video");
      } else {
        toast.error('Failed to update like');
      }
      console.error('Like error:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Video link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
      console.error('Share error:', error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/fitube' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to FiTube
      </Button>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src={video.videoFile.getDirectURL()}
            controls
            className="w-full h-full"
            controlsList="nodownload"
          />
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{video.title}</h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{uploaderProfile?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(video.uploadTimestamp)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={hasLiked ? 'default' : 'outline'}
                onClick={handleLike}
                disabled={likeVideo.isPending || unlikeVideo.isPending}
                className={hasLiked ? 'bg-bold-red hover:bg-bold-red/90' : ''}
              >
                {likeVideo.isPending || unlikeVideo.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Heart className={`mr-2 h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                )}
                {Number(video.likeCount)}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>

        {/* Comments Section */}
        <VideoCommentsSection videoId={video.id} />
      </div>
    </div>
  );
}
