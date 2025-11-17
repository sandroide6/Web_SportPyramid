import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ReactCountryFlag from "react-country-flag";
import { type Tournament } from "@shared/schema";

interface ParticipantsViewProps {
  tournament: Tournament;
  isRefereeMode: boolean;
}

export function ParticipantsView({ tournament, isRefereeMode }: ParticipantsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants = tournament.participants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats for each participant
  const participantStats = tournament.participants.map((participant) => {
    const matches = tournament.matches.filter(
      (m) => m.redCompetitorId === participant.id || m.blueCompetitorId === participant.id
    );
    const wins = matches.filter((m) => m.winnerId === participant.id).length;
    const losses = matches.filter((m) => m.winnerId !== null && m.winnerId !== participant.id).length;
    const pending = matches.filter((m) => m.winnerId === null).length;

    return {
      ...participant,
      matches: matches.length,
      wins,
      losses,
      pending,
    };
  });

  const filteredStats = participantStats.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Participants</CardTitle>
            <CardDescription>
              {tournament.participants.length} competitors in this tournament
            </CardDescription>
          </div>
          {isRefereeMode && (
            <Button size="sm" data-testid="button-add-participant">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-participants"
          />
        </div>

        {/* Participants Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seed</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Matches</TableHead>
                <TableHead className="text-center">W-L</TableHead>
                <TableHead className="text-center">Status</TableHead>
                {isRefereeMode && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStats.length > 0 ? (
                filteredStats.map((participant, index) => (
                  <TableRow key={participant.id} data-testid={`participant-row-${index}`}>
                    <TableCell className="font-medium">
                      {participant.seed || index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{participant.name}</TableCell>
                    <TableCell>
                      {participant.country ? (
                        <div className="flex items-center gap-2">
                          <ReactCountryFlag
                            countryCode={participant.country}
                            svg
                            style={{ width: '20px', height: '15px' }}
                          />
                          <span className="text-sm">{participant.country.toUpperCase()}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {participant.category || (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{participant.matches}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">
                        {participant.wins}-{participant.losses}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {participant.pending > 0 ? (
                        <Badge variant="secondary">Active</Badge>
                      ) : participant.losses > 0 ? (
                        <Badge variant="outline">Eliminated</Badge>
                      ) : participant.wins > 0 ? (
                        <Badge>Champion</Badge>
                      ) : (
                        <Badge variant="secondary">Waiting</Badge>
                      )}
                    </TableCell>
                    {isRefereeMode && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          data-testid={`button-delete-${index}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isRefereeMode ? 8 : 7} className="text-center py-8 text-muted-foreground">
                    No participants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
