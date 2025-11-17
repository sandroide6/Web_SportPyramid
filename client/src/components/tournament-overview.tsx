import { Trophy, Users, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SPORT_CATEGORIES, type Tournament, ResultType } from "@shared/schema";

interface TournamentOverviewProps {
  tournament: Tournament;
}

export function TournamentOverview({ tournament }: TournamentOverviewProps) {
  const sport = SPORT_CATEGORIES.find((s) => s.id === tournament.sport);
  const completedMatches = tournament.matches.filter((m) => m.resultType !== ResultType.PENDING).length;
  const totalMatches = tournament.matches.length;
  const progress = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

  const activeParticipants = tournament.participants.filter((p) => {
    return tournament.matches.some((m) => 
      (m.redCompetitorId === p.id || m.blueCompetitorId === p.id) && m.resultType === ResultType.PENDING
    );
  });

  const eliminatedParticipants = tournament.participants.filter((p) => {
    const lastMatch = tournament.matches
      .filter((m) => m.redCompetitorId === p.id || m.blueCompetitorId === p.id)
      .sort((a, b) => b.round - a.round)[0];
    
    return lastMatch && lastMatch.winnerId !== null && lastMatch.winnerId !== p.id;
  });

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sport</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sport?.name || tournament.sport}</div>
            <p className="text-xs text-muted-foreground capitalize">
              {tournament.format}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournament.participants.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeParticipants.length} active, {eliminatedParticipants.length} eliminated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMatches}/{totalMatches}</div>
            <p className="text-xs text-muted-foreground">
              {totalMatches - completedMatches} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(tournament.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(tournament.createdAt).toLocaleDateString(undefined, { year: 'numeric' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Tournament Progress</CardTitle>
          <CardDescription>
            Track the completion status of all matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Completion</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedMatches}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-result-pending">{totalMatches - completedMatches}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalMatches}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Info */}
      <Card>
        <CardHeader>
          <CardTitle>Tournament Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Name</Label>
              <p className="text-lg font-semibold mt-1">{tournament.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Format</Label>
              <p className="text-lg font-semibold mt-1 capitalize">{tournament.format}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="text-lg font-semibold mt-1">
                {new Date(tournament.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
              <p className="text-lg font-semibold mt-1">
                {new Date(tournament.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-sm font-medium text-muted-foreground">Settings</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tournament.settings.allowTies && (
                <Badge variant="secondary">Ties Allowed</Badge>
              )}
              {tournament.settings.thirdPlaceMatch && (
                <Badge variant="secondary">3rd Place Match</Badge>
              )}
              {tournament.settings.autoAdvanceByes && (
                <Badge variant="secondary">Auto-advance BYEs</Badge>
              )}
              {tournament.isPublic ? (
                <Badge variant="outline">Public Mode</Badge>
              ) : (
                <Badge>Referee Mode</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
