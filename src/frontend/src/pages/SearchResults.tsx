import { useSearch, Link } from '@tanstack/react-router';
import { SearchX, Package, Video, Newspaper, Dumbbell, MapPin, Utensils, Loader2, ExternalLink, Globe } from 'lucide-react';
import { useSearchContent } from '../hooks/useSearchContent';
import { useExternalSearch } from '../hooks/useExternalSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SearchResult } from '../backend';

export default function SearchResults() {
  const search = useSearch({ from: '/search' });
  const searchTerm = (search as { q?: string }).q || '';
  const { data: results, isLoading: internalLoading } = useSearchContent(searchTerm);
  const { data: externalResults, isLoading: externalLoading } = useExternalSearch(searchTerm);

  // Group results by content type
  const groupedResults = results?.reduce((acc, result) => {
    const type = result.contentType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>) || {};

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      product: 'Products',
      video: 'Videos',
      article: 'News Articles',
      workout: 'Workouts',
      runningSession: 'Running Sessions',
      foodEntry: 'Food Entries',
    };
    return labels[type] || type;
  };

  const getContentTypeIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      product: Package,
      video: Video,
      article: Newspaper,
      workout: Dumbbell,
      runningSession: MapPin,
      foodEntry: Utensils,
    };
    return icons[type] || Package;
  };

  const getResultLink = (result: SearchResult) => {
    const routes: Record<string, string> = {
      product: `/product/${result.itemId}`,
      video: `/fitube/${result.itemId}`,
      article: `/news`,
      workout: '/workout-tracker',
      runningSession: '/running',
      foodEntry: '/food',
    };
    return routes[result.contentType] || '/';
  };

  const getExternalResultTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('news')) return Newspaper;
    if (lowerType.includes('workout')) return Dumbbell;
    if (lowerType.includes('nutrition')) return Utensils;
    return Globe;
  };

  if (searchTerm.length < 2) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-energetic-orange to-vibrant-green bg-clip-text text-transparent">
            Search FIT AMIGO
          </h1>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground text-center">
                Please enter at least 2 characters to search
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isLoading = internalLoading || externalLoading;
  const hasInternalResults = results && results.length > 0;
  const hasExternalResults = externalResults && externalResults.length > 0;
  const hasAnyResults = hasInternalResults || hasExternalResults;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-energetic-orange to-vibrant-green bg-clip-text text-transparent">
          Search Results
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Results for: <span className="font-semibold text-foreground">"{searchTerm}"</span>
        </p>

        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-energetic-orange mb-4" />
              <p className="text-lg text-muted-foreground">Searching...</p>
            </CardContent>
          </Card>
        ) : hasAnyResults ? (
          <div className="space-y-12">
            {/* Internal Results */}
            {hasInternalResults && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-3xl font-bold">FIT AMIGO Results</h2>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {results.length}
                  </Badge>
                </div>
                <div className="space-y-8">
                  {Object.entries(groupedResults).map(([contentType, typeResults]) => {
                    const Icon = getContentTypeIcon(contentType);
                    return (
                      <div key={contentType}>
                        <div className="flex items-center gap-2 mb-4">
                          <Icon className="h-5 w-5 text-energetic-orange" />
                          <h3 className="text-2xl font-bold">{getContentTypeLabel(contentType)}</h3>
                          <Badge variant="secondary" className="ml-2">
                            {typeResults.length}
                          </Badge>
                        </div>
                        <div className="grid gap-4">
                          {typeResults.map((result, index) => (
                            <Link
                              key={`${result.contentType}-${result.itemId}-${index}`}
                              to={getResultLink(result)}
                              className="block"
                            >
                              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-energetic-orange">
                                <CardHeader>
                                  <CardTitle className="text-xl">{result.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-muted-foreground line-clamp-2">
                                    {result.previewText}
                                  </p>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* External Results */}
            {hasExternalResults && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="h-6 w-6 text-vibrant-green" />
                  <h2 className="text-3xl font-bold">Web Results</h2>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {externalResults.length}
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {externalResults.map((result, index) => {
                    const Icon = getExternalResultTypeIcon(result.resultType);
                    return (
                      <a
                        key={`external-${index}`}
                        href={result.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-vibrant-green bg-muted/30">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon className="h-4 w-4 text-vibrant-green" />
                                  <Badge variant="outline" className="text-xs">
                                    {result.resultType}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" />
                                    External
                                  </Badge>
                                </div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                  {result.title}
                                </CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground line-clamp-2 mb-2">
                              {result.preview}
                            </p>
                            <p className="text-sm text-vibrant-green font-medium">
                              Source: {result.sourceName}
                            </p>
                          </CardContent>
                        </Card>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">No results found for "{searchTerm}"</p>
              <p className="text-muted-foreground text-center">
                Try different keywords or check your spelling
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
