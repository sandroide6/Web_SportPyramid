import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Download, Eye, Edit, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { BracketView } from "@/components/bracket-view";
import { ParticipantsView } from "@/components/participants-view";
import { TournamentOverview } from "@/components/tournament-overview";
import { TournamentSettings } from "@/components/tournament-settings";
import { ExportDialog } from "@/components/export-dialog";
import { useTournament } from "@/hooks/use-tournaments";

export default function TournamentView() {
  const [, params] = useRoute("/tournaments/:id");
  const [, setLocation] = useLocation();
  const [isRefereeMode, setIsRefereeMode] = useState(true);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const { data: tournament, isLoading } = useTournament(params?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Tournament not found</h2>
          <p className="text-muted-foreground mb-4">
            The tournament you're looking for doesn't exist.
          </p>
          <Button onClick={() => setLocation("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold tracking-tight truncate" data-testid="text-tournament-name">
                  {tournament.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {tournament.participants.length} participants
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {/* Mode Toggle */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant={isRefereeMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsRefereeMode(true)}
                  data-testid="button-referee-mode"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Referee
                </Button>
                <Button
                  variant={!isRefereeMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsRefereeMode(false)}
                  data-testid="button-public-mode"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Public
                </Button>
              </div>

              <Button variant="outline" size="sm" data-testid="button-share">
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowExportDialog(true)}
                data-testid="button-export"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="bracket" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview" data-testid="tab-overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="bracket" data-testid="tab-bracket">
              Bracket
            </TabsTrigger>
            <TabsTrigger value="participants" data-testid="tab-participants">
              Participants
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TournamentOverview tournament={tournament} />
          </TabsContent>

          <TabsContent value="bracket">
            <BracketView tournament={tournament} isRefereeMode={isRefereeMode} />
          </TabsContent>

          <TabsContent value="participants">
            <ParticipantsView tournament={tournament} isRefereeMode={isRefereeMode} />
          </TabsContent>

          <TabsContent value="settings">
            <TournamentSettings tournament={tournament} isRefereeMode={isRefereeMode} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Export Dialog */}
      <ExportDialog
        tournament={tournament}
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
      />
    </div>
  );
}
