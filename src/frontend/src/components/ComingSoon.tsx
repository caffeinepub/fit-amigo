import { Rocket } from 'lucide-react';

interface ComingSoonProps {
  featureName: string;
  description: string;
}

export default function ComingSoon({ featureName, description }: ComingSoonProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-energetic-orange to-vibrant-green mb-6">
          <Rocket className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-energetic-orange via-vibrant-green to-bold-red bg-clip-text text-transparent">
          {featureName}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">{description}</p>
        <div className="inline-block px-6 py-3 bg-sunny-yellow/20 rounded-lg border-2 border-sunny-yellow">
          <p className="text-lg font-semibold text-foreground">Coming Soon in Phase 2 & 3!</p>
        </div>
      </div>
    </div>
  );
}
