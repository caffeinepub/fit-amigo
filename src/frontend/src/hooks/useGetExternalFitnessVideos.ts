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

/**
 * Hook that returns mock fitness videos data for demonstration purposes.
 * No external API configuration required.
 */
export function useGetExternalFitnessVideos() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExternalFitnessVideo[]>({
    queryKey: ['externalFitnessVideos'],
    queryFn: async () => {
      if (!actor) return [];

      // Mock fitness videos data
      const mockVideos: ExternalFitnessVideo[] = [
        {
          id: 'video-1',
          title: 'Full Body Strength Training Workout',
          description: 'Complete 45-minute strength training session targeting all major muscle groups. Perfect for building muscle and increasing strength.',
          thumbnailUrl: '/assets/generated/video-strength-training.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example1',
          uploader: 'FitPro Training',
          viewCount: 125000,
          duration: 2700,
          isExternal: true as const,
        },
        {
          id: 'video-2',
          title: 'Advanced HIIT Cardio Blast',
          description: '30-minute high-intensity interval training for maximum calorie burn. No equipment needed.',
          thumbnailUrl: '/assets/generated/video-strength-training.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example2',
          uploader: 'CardioKing',
          viewCount: 89000,
          duration: 1800,
          isExternal: true as const,
        },
        {
          id: 'video-3',
          title: 'Proper Running Form Tutorial',
          description: 'Learn the fundamentals of proper running technique to prevent injuries and improve performance.',
          thumbnailUrl: '/assets/generated/video-running-form.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example3',
          uploader: 'RunCoach Pro',
          viewCount: 234000,
          duration: 900,
          isExternal: true as const,
        },
        {
          id: 'video-4',
          title: 'Marathon Training Tips',
          description: 'Essential tips and strategies for marathon training. From beginner to advanced runners.',
          thumbnailUrl: '/assets/generated/video-running-form.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example4',
          uploader: 'RunCoach Pro',
          viewCount: 156000,
          duration: 1200,
          isExternal: true as const,
        },
        {
          id: 'video-5',
          title: 'Yoga for Athletes - Flexibility Flow',
          description: '40-minute yoga session designed specifically for athletes. Improve flexibility and recovery.',
          thumbnailUrl: '/assets/generated/video-yoga.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example5',
          uploader: 'Yoga Flow Studio',
          viewCount: 178000,
          duration: 2400,
          isExternal: true as const,
        },
        {
          id: 'video-6',
          title: 'Morning Yoga Routine',
          description: 'Gentle 20-minute morning yoga to energize your day. Perfect for all fitness levels.',
          thumbnailUrl: '/assets/generated/video-yoga.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example6',
          uploader: 'Yoga Flow Studio',
          viewCount: 312000,
          duration: 1200,
          isExternal: true as const,
        },
        {
          id: 'video-7',
          title: 'Pilates Core Strengthening',
          description: 'Targeted pilates workout for building a strong, stable core. Suitable for beginners.',
          thumbnailUrl: '/assets/generated/video-yoga.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example7',
          uploader: 'Pilates Power',
          viewCount: 98000,
          duration: 1800,
          isExternal: true as const,
        },
        {
          id: 'video-8',
          title: 'Nutrition Basics for Athletes',
          description: 'Complete guide to sports nutrition. Learn what to eat before, during, and after workouts.',
          thumbnailUrl: '/assets/generated/video-nutrition.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example8',
          uploader: 'Sports Nutrition Expert',
          viewCount: 267000,
          duration: 1500,
          isExternal: true as const,
        },
        {
          id: 'video-9',
          title: 'Meal Prep for Fitness Goals',
          description: 'Step-by-step meal prep guide for building muscle and losing fat. Easy recipes included.',
          thumbnailUrl: '/assets/generated/video-nutrition.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example9',
          uploader: 'Healthy Eats',
          viewCount: 445000,
          duration: 2100,
          isExternal: true as const,
        },
        {
          id: 'video-10',
          title: 'Supplements Guide for Beginners',
          description: 'Everything you need to know about fitness supplements. What works and what doesn\'t.',
          thumbnailUrl: '/assets/generated/video-nutrition.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example10',
          uploader: 'Sports Nutrition Expert',
          viewCount: 189000,
          duration: 1800,
          isExternal: true as const,
        },
        {
          id: 'video-11',
          title: 'Bodyweight Training at Home',
          description: 'Effective bodyweight exercises you can do anywhere. No gym required.',
          thumbnailUrl: '/assets/generated/video-strength-training.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example11',
          uploader: 'FitPro Training',
          viewCount: 201000,
          duration: 1500,
          isExternal: true as const,
        },
        {
          id: 'video-12',
          title: 'Stretching Routine for Recovery',
          description: 'Essential stretching exercises for post-workout recovery and injury prevention.',
          thumbnailUrl: '/assets/generated/video-yoga.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example12',
          uploader: 'Mobility Master',
          viewCount: 134000,
          duration: 900,
          isExternal: true as const,
        },
        {
          id: 'video-13',
          title: 'Sprint Training Techniques',
          description: 'Improve your speed with these proven sprint training methods. For all running levels.',
          thumbnailUrl: '/assets/generated/video-running-form.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example13',
          uploader: 'Speed Coach',
          viewCount: 87000,
          duration: 1200,
          isExternal: true as const,
        },
        {
          id: 'video-14',
          title: 'Kettlebell Full Body Workout',
          description: 'Dynamic kettlebell workout for strength and conditioning. Burn calories and build muscle.',
          thumbnailUrl: '/assets/generated/video-strength-training.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example14',
          uploader: 'Kettlebell King',
          viewCount: 156000,
          duration: 2400,
          isExternal: true as const,
        },
        {
          id: 'video-15',
          title: 'Hydration and Performance',
          description: 'Understanding the critical role of hydration in athletic performance and recovery.',
          thumbnailUrl: '/assets/generated/video-nutrition.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example15',
          uploader: 'Sports Science Lab',
          viewCount: 76000,
          duration: 600,
          isExternal: true as const,
        },
        {
          id: 'video-16',
          title: 'Beginner Weight Training Guide',
          description: 'Complete beginner\'s guide to weight training. Learn proper form and technique.',
          thumbnailUrl: '/assets/generated/video-strength-training.dim_640x360.png',
          videoUrl: 'https://www.youtube.com/watch?v=example16',
          uploader: 'FitPro Training',
          viewCount: 389000,
          duration: 2700,
          isExternal: true as const,
        },
      ];

      return mockVideos;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
