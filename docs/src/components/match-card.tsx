import { Edit2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactCountryFlag from "react-country-flag";
import { type Match, type Tournament, ResultType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  tournament: Tournament;
  isRefereeMode: boolean;
  onClick?: () => void;
}

export function MatchCard({ match, tournament, isRefereeMode, onClick }: MatchCardProps) {
  const redCompetitor = match.redCompetitorId 
    ? tournament.participants.find((p) => p.id === match.redCompetitorId) 
    : null;
  const blueCompetitor = match.blueCompetitorId 
    ? tournament.participants.find((p) => p.id === match.blueCompetitorId) 
    : null;

  const isRedWinner = match.winnerId === match.redCompetitorId;
  const isBlueWinner = match.winnerId === match.blueCompetitorId;
  const isPending = match.resultType === ResultType.PENDING;

  const getResultBadge = () => {
    if (isPending) return null;
    
    switch (match.resultType) {
      case ResultType.KO:
        return <Badge variant="destructive" className="text-xs">KO</Badge>;
      case ResultType.WALKOVER:
        return <Badge className="bg-result-walkover text-white text-xs">W</Badge>;
      case ResultType.DQ:
        return <Badge variant="secondary" className="text-xs">DQ</Badge>;
      case ResultType.TIE:
        return <Badge variant="outline" className="text-xs">TIE</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card 
      className={cn(
        "relative w-64 transition-all",
        isRefereeMode && "hover-elevate active-elevate-2 cursor-pointer",
        !isRefereeMode && "cursor-default"
      )}
      onClick={onClick}
      data-testid={`match-card-${match.id}`}
    >
      {isRefereeMode && isPending && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-primary rounded-full p-1.5">
            <Edit2 className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      )}

      <div className="divide-y">
        {/* Red Competitor */}
        <div 
          className={cn(
            "p-3 transition-colors rounded-t-md",
            isRedWinner && "bg-competitor-red-bg dark:bg-competitor-red-bg-dark border-l-4 border-l-competitor-red",
            !isRedWinner && redCompetitor && "opacity-70"
          )}
          data-testid={`competitor-red-${match.id}`}
        >
          {redCompetitor ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {redCompetitor.country && (
                  <ReactCountryFlag
                    countryCode={redCompetitor.country}
                    svg
                    style={{ width: '20px', height: '15px' }}
                  />
                )}
                <span className={cn(
                  "font-medium truncate",
                  isRedWinner && "font-semibold"
                )}>
                  {redCompetitor.name}
                </span>
              </div>
              {match.redScore && (
                <span className="text-lg font-bold shrink-0">
                  {match.redScore}
                </span>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">BYE</div>
          )}
          {redCompetitor?.category && (
            <div className="text-xs text-muted-foreground mt-1">
              {redCompetitor.category}
            </div>
          )}
        </div>

        {/* Blue Competitor */}
        <div 
          className={cn(
            "p-3 transition-colors rounded-b-md",
            isBlueWinner && "bg-competitor-blue-bg dark:bg-competitor-blue-bg-dark border-l-4 border-l-competitor-blue",
            !isBlueWinner && blueCompetitor && "opacity-70"
          )}
          data-testid={`competitor-blue-${match.id}`}
        >
          {blueCompetitor ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {blueCompetitor.country && (
                  <ReactCountryFlag
                    countryCode={blueCompetitor.country}
                    svg
                    style={{ width: '20px', height: '15px' }}
                  />
                )}
                <span className={cn(
                  "font-medium truncate",
                  isBlueWinner && "font-semibold"
                )}>
                  {blueCompetitor.name}
                </span>
              </div>
              {match.blueScore && (
                <span className="text-lg font-bold shrink-0">
                  {match.blueScore}
                </span>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">BYE</div>
          )}
          {blueCompetitor?.category && (
            <div className="text-xs text-muted-foreground mt-1">
              {blueCompetitor.category}
            </div>
          )}
        </div>
      </div>

      {/* Result Badge */}
      {getResultBadge() && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          {getResultBadge()}
        </div>
      )}
    </Card>
  );
}
