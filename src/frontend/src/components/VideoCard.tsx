import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, User, ExternalLink, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Video } from '../backend';
import type { ExternalFitnessVideo } from '../hooks/useGetExternalFitnessVideos';
import { useGetUserProfile } from '../hooks/useGetUserProfile';

interface VideoCardProps {
  video: Video | ExternalFitnessVideo;
}

function isExternalVideo(video: Video | ExternalFitnessVideo): video is ExternalFitnessVideo {
  return 'isExternal' in video && video.isExternal === true;
}

export default function VideoCard({ video }: VideoCardProps) {
  const isExternal = isExternalVideo(video);
  const navigate = useNavigate();
  
  const uploaderId = !isExternal ? video.uploaderId : undefined;
  const { data: uploaderProfile } = useGetUserProfile(uploaderId!);

  const handleClick = () => {
    if (isExternal) {
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate({ to: '/fitube/$videoId', params: { videoId: video.id.toString() } });
    }
  };

  const getThumbnailUrl = () => {
    if (isExternal) {
      return video.thumbnailUrl;
    }
    return video.videoFile.getDirectURL();
  };

  const getUploaderName = () => {
    if (isExternal) {
      return video.uploader;
    }
    return uploaderProfile?.name || 'Anonymous';
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className={`border-2 transition-all duration-300 overflow-hidden ${
        isExternal ? 'hover:border-sunny-yellow' : 'hover:border-energetic-orange'
      }`}>
        <div className="relative aspect-video bg-muted">
          {isExternal ? (
            <>
              <Badge className="absolute top-2 right-2 z-10 bg-sunny-yellow text-black font-semibold flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                External
              </Badge>
              <img
                src={getThumbnailUrl()}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </>
          ) : (
            <video
              src={getThumbnailUrl()}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <User className="h-4 w-4" />
            <span>{getUploaderName()}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {isExternal ? (
              <>
                {video.viewCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-vibrant-green" />
                    <span>{video.viewCount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-bold-red" />
                  <span>{Number(video.likeCount)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-vibrant-green" />
                  <span>{Number(video.commentCount)}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
