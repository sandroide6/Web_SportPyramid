import { useState } from "react";
import { Link } from "wouter";
import { Plus, Trophy, Calendar, Users, ArrowRight, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { SPORT_CATEGORIES } from "@shared/schema";
import { useTournaments } from "@/hooks/use-tournaments";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  
  const { data: tournaments = [], isLoading } = useTournaments();

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === "all" || tournament.sport === sportFilter;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-semibold tracking-tight" data-testid="text-app-title">
                Tournament Manager
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
              Your Tournaments
            </h2>
            <p className="text-muted-foreground mt-1">
              Create and manage professional tournament brackets
            </p>
          </div>
          
          <Link href="/tournaments/new">
            <Button size="default" data-testid="button-create-tournament">
              <Plus className="h-4 w-4 mr-2" />
              New Tournament
            </Button>
          </Link>
        </div>

        {/* Filters */}
        {tournaments.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
                className="w-full"
              />
            </div>
            
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-sport-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {SPORT_CATEGORIES.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tournament Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading tournaments...</p>
            </div>
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => {
              const sport = SPORT_CATEGORIES.find((s) => s.id === tournament.sport);
              const completedMatches = tournament.matches.filter((m) => m.winnerId !== null).length;
              const totalMatches = tournament.matches.length;
              const progress = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

              return (
                <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                  <Card className="hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-tournament-${tournament.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl truncate" data-testid={`text-tournament-name-${tournament.id}`}>
                            {tournament.name}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-2">
                            <span>{sport?.name || tournament.sport}</span>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {tournament.format}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{tournament.participants.length} participants</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(tournament.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                          View Bracket
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : tournaments.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-primary/10 p-8">
                  <Trophy className="h-16 w-16 text-primary" />
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold mb-2" data-testid="text-empty-title">
                No tournaments yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first tournament bracket and start managing competitions for any sport.
              </p>
              
              <Link href="/tournaments/new">
                <Button size="lg" data-testid="button-create-first">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Tournament
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // No results state
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tournaments match your search criteria</p>
          </div>
        )}
      </main>
    </div>
  );
}
