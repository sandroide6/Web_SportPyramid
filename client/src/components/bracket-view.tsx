import { useState } from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MatchCard } from "./match-card";
import { MatchEditor } from "./match-editor";
import { useUpdateMatch } from "@/hooks/use-tournaments";
import { type Tournament, type Match } from "@shared/schema";

interface BracketViewProps {
  tournament: Tournament;
  isRefereeMode: boolean;
}

export function BracketView({ tournament, isRefereeMode }: BracketViewProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const updateMatchMutation = useUpdateMatch();

  // Organize matches by rounds
  const rounds: Match[][] = [];
  const maxRound = Math.max(...tournament.matches.map((m) => m.round));
  
  for (let i = maxRound; i >= 0; i--) {
    rounds.push(tournament.matches.filter((m) => m.round === i).sort((a, b) => a.position - b.position));
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleFitScreen = () => setZoom(1);

  const handleMatchClick = (match: Match) => {
    if (isRefereeMode) {
      setSelectedMatch(match);
    }
  };

  if (tournament.matches.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">Bracket not generated</p>
          <p>The tournament bracket will appear here once generated.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Zoom Controls */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          data-testid="button-zoom-out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground min-w-16 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 2}
          data-testid="button-zoom-in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFitScreen}
          data-testid="button-fit-screen"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Bracket Canvas */}
      <Card className="overflow-auto">
        <div className="p-6 min-w-max" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          <div className="flex gap-8">
            {rounds.map((roundMatches, roundIndex) => (
              <div key={roundIndex} className="flex flex-col gap-4" data-testid={`round-${roundIndex}`}>
                {/* Round Header */}
                <div className="text-center pb-2 border-b">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    {roundIndex === 0 ? 'Final' : 
                     roundIndex === 1 ? 'Semifinals' : 
                     roundIndex === 2 ? 'Quarterfinals' : 
                     `Round ${maxRound - roundIndex + 1}`}
                  </h3>
                </div>

                {/* Matches */}
                <div className="flex flex-col gap-8 justify-around" style={{ minHeight: `${roundMatches.length * 120}px` }}>
                  {roundMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      tournament={tournament}
                      isRefereeMode={isRefereeMode}
                      onClick={() => handleMatchClick(match)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Match Editor Dialog */}
      {selectedMatch && (
        <MatchEditor
          match={selectedMatch}
          tournament={tournament}
          open={!!selectedMatch}
          onOpenChange={(open) => !open && setSelectedMatch(null)}
          onSave={async (updatedMatch) => {
            await updateMatchMutation.mutateAsync({
              tournamentId: tournament.id,
              match: updatedMatch,
            });
            setSelectedMatch(null);
          }}
        />
      )}
    </div>
  );
}
