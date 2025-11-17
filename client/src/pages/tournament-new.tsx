import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Upload, Trash2, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { ImportDialog } from "@/components/import-dialog";
import { SPORT_CATEGORIES, type InsertParticipant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useCreateTournament } from "@/hooks/use-tournaments";

export default function TournamentNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createMutation = useCreateTournament();
  const [currentStep, setCurrentStep] = useState<"basic" | "participants">("basic");
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [format, setFormat] = useState<"single-elimination">("single-elimination");
  const [participants, setParticipants] = useState<InsertParticipant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantCountry, setNewParticipantCountry] = useState("");
  const [newParticipantCategory, setNewParticipantCategory] = useState("");

  const selectedSport = SPORT_CATEGORIES.find((s) => s.id === sport);
  const groupedSports = SPORT_CATEGORIES.reduce((acc, sport) => {
    const category = sport.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(sport);
    return acc;
  }, {} as Record<string, typeof SPORT_CATEGORIES>);

  const handleAddParticipant = () => {
    if (!newParticipantName.trim()) {
      toast({
        title: "Error",
        description: "Participant name is required",
        variant: "destructive",
      });
      return;
    }

    const newParticipant: InsertParticipant = {
      name: newParticipantName.trim(),
      country: newParticipantCountry.trim() || undefined,
      category: newParticipantCategory.trim() || undefined,
      seed: participants.length + 1,
    };

    setParticipants([...participants, newParticipant]);
    setNewParticipantName("");
    setNewParticipantCountry("");
    setNewParticipantCategory("");
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleImport = (importedParticipants: InsertParticipant[]) => {
    setParticipants([...participants, ...importedParticipants]);
  };

  const handleCreateTournament = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Tournament name is required",
        variant: "destructive",
      });
      return;
    }

    if (!sport) {
      toast({
        title: "Error",
        description: "Please select a sport",
        variant: "destructive",
      });
      return;
    }

    if (participants.length < 2) {
      toast({
        title: "Error",
        description: "At least 2 participants are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const tournament = await createMutation.mutateAsync({
        name,
        sport,
        format: "single-elimination",
        participants,
        settings: {
          allowTies: false,
          thirdPlaceMatch: false,
          autoAdvanceByes: true,
        },
        isPublic: false,
      });

      toast({
        title: "Success",
        description: "Tournament created successfully",
      });
      setLocation(`/tournaments/${tournament.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tournament",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold tracking-tight">
                Create Tournament
              </h1>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <Tabs value={currentStep} onValueChange={(v) => setCurrentStep(v as typeof currentStep)}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="basic" data-testid="tab-basic">
              1. Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="participants" 
              disabled={!name || !sport}
              data-testid="tab-participants"
            >
              2. Participants
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Details</CardTitle>
                <CardDescription>
                  Set up the basic information for your tournament
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tournament-name">Tournament Name *</Label>
                  <Input
                    id="tournament-name"
                    placeholder="e.g., World Championship 2024"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-tournament-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                    <SelectTrigger id="format" data-testid="select-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-elimination">Single Elimination</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Currently supporting single elimination brackets
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Select Sport *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(groupedSports).map(([category, sports]) => (
                      <div key={category} className="space-y-2 col-span-2 sm:col-span-3">
                        <h4 className="text-sm font-medium text-muted-foreground capitalize">
                          {category === 'esports' ? 'E-Sports' : category}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {sports.map((s) => (
                            <Button
                              key={s.id}
                              variant={sport === s.id ? "default" : "outline"}
                              className="h-auto py-3 px-4 justify-start"
                              onClick={() => setSport(s.id)}
                              data-testid={`button-sport-${s.id}`}
                            >
                              <span className="text-left text-sm">{s.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => setCurrentStep("participants")}
                    disabled={!name || !sport}
                    data-testid="button-next-step"
                  >
                    Next: Add Participants
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>Add Participants</CardTitle>
                    <CardDescription>
                      Add competitors to your {selectedSport?.name} tournament
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowImportDialog(true)}
                    data-testid="button-import"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Participant Form */}
                <div className="grid gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-5">
                    <Label htmlFor="participant-name" className="sr-only">Name</Label>
                    <Input
                      id="participant-name"
                      placeholder="Participant name *"
                      value={newParticipantName}
                      onChange={(e) => setNewParticipantName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
                      data-testid="input-participant-name"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Label htmlFor="participant-country" className="sr-only">Country</Label>
                    <Input
                      id="participant-country"
                      placeholder="Country code (e.g., US)"
                      value={newParticipantCountry}
                      onChange={(e) => setNewParticipantCountry(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
                      data-testid="input-participant-country"
                      maxLength={2}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Label htmlFor="participant-category" className="sr-only">Category</Label>
                    <Input
                      id="participant-category"
                      placeholder="Category/Weight"
                      value={newParticipantCategory}
                      onChange={(e) => setNewParticipantCategory(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
                      data-testid="input-participant-category"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Button
                      onClick={handleAddParticipant}
                      size="icon"
                      data-testid="button-add-participant"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Participants List */}
                {participants.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Participants ({participants.length})</Label>
                      <Badge variant="secondary">
                        {Math.pow(2, Math.ceil(Math.log2(participants.length)))} bracket size
                      </Badge>
                    </div>
                    
                    <div className="border rounded-md divide-y max-h-96 overflow-y-auto">
                      {participants.map((participant, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 hover-elevate"
                          data-testid={`participant-item-${index}`}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{participant.name}</span>
                              {participant.country && (
                                <Badge variant="outline" className="shrink-0">
                                  {participant.country.toUpperCase()}
                                </Badge>
                              )}
                              {participant.category && (
                                <span className="text-sm text-muted-foreground truncate">
                                  {participant.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveParticipant(index)}
                            data-testid={`button-remove-${index}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {participants.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No participants added yet</p>
                    <p className="text-sm mt-1">Add at least 2 participants to create the bracket</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("basic")}
                    data-testid="button-back-step"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateTournament}
                    disabled={participants.length < 2 || createMutation.isPending}
                    data-testid="button-create-tournament"
                  >
                    {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Tournament
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImport}
      />
    </div>
  );
}
