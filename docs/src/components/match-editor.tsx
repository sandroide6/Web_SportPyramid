import { useState, useEffect } from "react";
import { Trophy, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactCountryFlag from "react-country-flag";
import { type Match, type Tournament, ResultType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MatchEditorProps {
  match: Match;
  tournament: Tournament;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (match: Match) => void;
}

export function MatchEditor({ match, tournament, open, onOpenChange, onSave }: MatchEditorProps) {
  const [resultType, setResultType] = useState<ResultType>(match.resultType);
  const [winnerId, setWinnerId] = useState<string | null>(match.winnerId);
  const [redScore, setRedScore] = useState(match.redScore || "");
  const [blueScore, setBlueScore] = useState(match.blueScore || "");
  const [redCompetitorId, setRedCompetitorId] = useState(match.redCompetitorId);
  const [blueCompetitorId, setBlueCompetitorId] = useState(match.blueCompetitorId);

  const redCompetitor = redCompetitorId 
    ? tournament.participants.find((p) => p.id === redCompetitorId) 
    : null;
  const blueCompetitor = blueCompetitorId 
    ? tournament.participants.find((p) => p.id === blueCompetitorId) 
    : null;

  useEffect(() => {
    setResultType(match.resultType);
    setWinnerId(match.winnerId);
    setRedScore(match.redScore || "");
    setBlueScore(match.blueScore || "");
    setRedCompetitorId(match.redCompetitorId);
    setBlueCompetitorId(match.blueCompetitorId);
  }, [match]);

  const handleSave = () => {
    const updatedMatch: Match = {
      ...match,
      resultType,
      winnerId,
      redScore: resultType === ResultType.SCORE ? redScore : undefined,
      blueScore: resultType === ResultType.SCORE ? blueScore : undefined,
      redCompetitorId,
      blueCompetitorId,
    };
    onSave(updatedMatch);
  };

  const handleSetWinner = (competitorId: string) => {
    setWinnerId(competitorId);
    if (resultType === ResultType.PENDING) {
      setResultType(ResultType.SCORE);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-match-editor">
        <DialogHeader>
          <DialogTitle>Edit Match</DialogTitle>
          <DialogDescription>
            Update match results and competitors
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="result" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="result" data-testid="tab-result">
              Result
            </TabsTrigger>
            <TabsTrigger value="competitors" data-testid="tab-competitors">
              Competitors
            </TabsTrigger>
          </TabsList>

          {/* Result Tab */}
          <TabsContent value="result" className="space-y-6 mt-6">
            {/* Competitors Display */}
            <div className="grid grid-cols-2 gap-4">
              {/* Red Competitor */}
              <div
                className={cn(
                  "p-4 border rounded-md cursor-pointer transition-all",
                  winnerId === redCompetitorId && "bg-competitor-red-bg dark:bg-competitor-red-bg-dark border-competitor-red border-2"
                )}
                onClick={() => redCompetitor && handleSetWinner(redCompetitorId!)}
                data-testid="competitor-red-select"
              >
                {redCompetitor ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {redCompetitor.country && (
                        <ReactCountryFlag
                          countryCode={redCompetitor.country}
                          svg
                          style={{ width: '24px', height: '18px' }}
                        />
                      )}
                      <span className="font-semibold text-lg">
                        {redCompetitor.name}
                      </span>
                    </div>
                    {redCompetitor.category && (
                      <p className="text-sm text-muted-foreground">
                        {redCompetitor.category}
                      </p>
                    )}
                    {winnerId === redCompetitorId && (
                      <div className="flex items-center gap-1 text-sm font-medium text-competitor-red">
                        <Trophy className="h-4 w-4" />
                        <span>Winner</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">BYE</div>
                )}
              </div>

              {/* Blue Competitor */}
              <div
                className={cn(
                  "p-4 border rounded-md cursor-pointer transition-all",
                  winnerId === blueCompetitorId && "bg-competitor-blue-bg dark:bg-competitor-blue-bg-dark border-competitor-blue border-2"
                )}
                onClick={() => blueCompetitor && handleSetWinner(blueCompetitorId!)}
                data-testid="competitor-blue-select"
              >
                {blueCompetitor ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {blueCompetitor.country && (
                        <ReactCountryFlag
                          countryCode={blueCompetitor.country}
                          svg
                          style={{ width: '24px', height: '18px' }}
                        />
                      )}
                      <span className="font-semibold text-lg">
                        {blueCompetitor.name}
                      </span>
                    </div>
                    {blueCompetitor.category && (
                      <p className="text-sm text-muted-foreground">
                        {blueCompetitor.category}
                      </p>
                    )}
                    {winnerId === blueCompetitorId && (
                      <div className="flex items-center gap-1 text-sm font-medium text-competitor-blue">
                        <Trophy className="h-4 w-4" />
                        <span>Winner</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">BYE</div>
                )}
              </div>
            </div>

            {/* Result Type */}
            <div className="space-y-3">
              <Label>Result Type</Label>
              <RadioGroup
                value={resultType}
                onValueChange={(value) => setResultType(value as ResultType)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ResultType.SCORE} id="score" data-testid="radio-score" />
                  <Label htmlFor="score" className="cursor-pointer font-normal">
                    Score / Points
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ResultType.KO} id="ko" data-testid="radio-ko" />
                  <Label htmlFor="ko" className="cursor-pointer font-normal">
                    Knockout (KO)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ResultType.WALKOVER} id="walkover" data-testid="radio-walkover" />
                  <Label htmlFor="walkover" className="cursor-pointer font-normal">
                    Walkover (W)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ResultType.DQ} id="dq" data-testid="radio-dq" />
                  <Label htmlFor="dq" className="cursor-pointer font-normal">
                    Disqualification (DQ)
                  </Label>
                </div>
                {tournament.settings.allowTies && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ResultType.TIE} id="tie" data-testid="radio-tie" />
                    <Label htmlFor="tie" className="cursor-pointer font-normal">
                      Tie / Draw
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* Score Input */}
            {resultType === ResultType.SCORE && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="red-score">Red Score</Label>
                  <Input
                    id="red-score"
                    placeholder="e.g., 3, 21-19"
                    value={redScore}
                    onChange={(e) => setRedScore(e.target.value)}
                    data-testid="input-red-score"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blue-score">Blue Score</Label>
                  <Input
                    id="blue-score"
                    placeholder="e.g., 1, 19-21"
                    value={blueScore}
                    onChange={(e) => setBlueScore(e.target.value)}
                    data-testid="input-blue-score"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="red-competitor">Red Competitor</Label>
                <Select
                  value={redCompetitorId || ""}
                  onValueChange={(value) => setRedCompetitorId(value || null)}
                >
                  <SelectTrigger id="red-competitor" data-testid="select-red-competitor">
                    <SelectValue placeholder="Select competitor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (BYE)</SelectItem>
                    {tournament.participants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.id}>
                        {participant.name}
                        {participant.country && ` (${participant.country})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blue-competitor">Blue Competitor</Label>
                <Select
                  value={blueCompetitorId || ""}
                  onValueChange={(value) => setBlueCompetitorId(value || null)}
                >
                  <SelectTrigger id="blue-competitor" data-testid="select-blue-competitor">
                    <SelectValue placeholder="Select competitor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (BYE)</SelectItem>
                    {tournament.participants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.id}>
                        {participant.name}
                        {participant.country && ` (${participant.country})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-match">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
