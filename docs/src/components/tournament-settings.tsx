import { Save, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { type Tournament } from "@shared/schema";

interface TournamentSettingsProps {
  tournament: Tournament;
  isRefereeMode: boolean;
}

export function TournamentSettings({ tournament, isRefereeMode }: TournamentSettingsProps) {
  if (!isRefereeMode) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Switch to Referee mode to edit tournament settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tournament Settings</CardTitle>
          <CardDescription>
            Configure bracket rules and behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-ties">Allow Ties</Label>
              <p className="text-sm text-muted-foreground">
                Enable draw/tie results for matches
              </p>
            </div>
            <Switch
              id="allow-ties"
              checked={tournament.settings.allowTies}
              data-testid="switch-allow-ties"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="third-place">Third Place Match</Label>
              <p className="text-sm text-muted-foreground">
                Include a match for 3rd place finishers
              </p>
            </div>
            <Switch
              id="third-place"
              checked={tournament.settings.thirdPlaceMatch}
              data-testid="switch-third-place"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-advance">Auto-advance BYEs</Label>
              <p className="text-sm text-muted-foreground">
                Automatically advance competitors with BYE opponents
              </p>
            </div>
            <Switch
              id="auto-advance"
              checked={tournament.settings.autoAdvanceByes}
              data-testid="switch-auto-advance"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button data-testid="button-save-settings">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect the entire tournament
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Reset Bracket</h4>
              <p className="text-sm text-muted-foreground">
                Clear all match results and regenerate bracket
              </p>
            </div>
            <Button variant="outline" data-testid="button-reset-bracket">
              Reset
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Delete Tournament</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete this tournament and all data
              </p>
            </div>
            <Button variant="destructive" data-testid="button-delete-tournament">
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
