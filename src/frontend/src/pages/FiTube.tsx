import { Link } from '@tanstack/react-router';
import { useGetVideos } from '../hooks/useGetVideos';
import VideoCard from '../components/VideoCard';
import { Button } from '@/components/ui/button';
import { Plus, Video, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function FiTube() {
  const { identity } = useInternetIdentity();
  const { data: videos = [], isLoading } = useGetVideos();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Video className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to access FiTube</p>
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

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden bg-gradient-to-r from-energetic-orange via-bold-red to-vibrant-green">
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-white mb-4">
              Fi<span className="text-sunny-yellow">Tube</span>
            </h1>
            <p className="text-xl text-white/90">Share your fitness journey with the community</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">All Videos</h2>
          <Link to="/fitube/upload">
            <Button className="bg-energetic-orange hover:bg-energetic-orange/90 font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              Upload Video
            </Button>
          </Link>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20">
            <Video className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-6">No videos yet</p>
            <Link to="/fitube/upload">
              <Button className="bg-energetic-orange hover:bg-energetic-orange/90">
                <Plus className="mr-2 h-5 w-5" />
                Upload First Video
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id.toString()} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
