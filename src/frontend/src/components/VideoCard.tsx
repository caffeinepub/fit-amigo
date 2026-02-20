import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, User } from 'lucide-react';
import type { Video } from '../backend';
import { useGetUserProfile } from '../hooks/useGetUserProfile';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { data: uploaderProfile } = useGetUserProfile(video.uploaderId);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/fitube/$videoId', params: { videoId: video.id.toString() } });
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="border-2 hover:border-energetic-orange transition-all duration-300 overflow-hidden">
        <div className="relative aspect-video bg-muted">
          <video
            src={video.videoFile.getDirectURL()}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <User className="h-4 w-4" />
            <span>{uploaderProfile?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-bold-red" />
              <span>{Number(video.likeCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 text-vibrant-green" />
              <span>{Number(video.commentCount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
