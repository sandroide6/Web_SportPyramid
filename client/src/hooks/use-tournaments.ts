import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllTournaments,
  getTournament,
  saveTournament,
  deleteTournament,
  updateTournament,
} from '@/lib/db';
import { generateSingleEliminationBracket, advanceWinner } from '@/lib/bracket-generator';
import {
  type Tournament,
  type InsertTournament,
  type Match,
  type InsertParticipant,
} from '@shared/schema';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useTournaments() {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: getAllTournaments,
  });
}

export function useTournament(id: string | undefined) {
  return useQuery({
    queryKey: ['tournaments', id],
    queryFn: () => (id ? getTournament(id) : Promise.resolve(undefined)),
    enabled: !!id,
  });
}

export function useCreateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertTournament) => {
      // Add IDs to participants
      const participants = data.participants.map((p) => ({
        ...p,
        id: generateId(),
      }));

      // Generate bracket
      const matches = generateSingleEliminationBracket(participants);

      const tournament: Tournament = {
        ...data,
        id: generateId(),
        participants,
        matches,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await saveTournament(tournament);
      return tournament;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}

export function useUpdateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      match,
    }: {
      tournamentId: string;
      match: Match;
    }) => {
      const tournament = await getTournament(tournamentId);
      if (!tournament) {
        throw new Error('Tournament not found');
      }

      // Update matches with winner advancement
      const updatedMatches = advanceWinner(tournament.matches, match);

      const updated = await updateTournament(tournamentId, {
        matches: updatedMatches,
      });

      return updated;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}

export function useDeleteTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}

export function useAddParticipants() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      participants,
    }: {
      tournamentId: string;
      participants: InsertParticipant[];
    }) => {
      const tournament = await getTournament(tournamentId);
      if (!tournament) {
        throw new Error('Tournament not found');
      }

      const newParticipants = participants.map((p) => ({
        ...p,
        id: generateId(),
      }));

      const allParticipants = [...tournament.participants, ...newParticipants];

      // Regenerate bracket with new participants
      const matches = generateSingleEliminationBracket(allParticipants);

      const updated = await updateTournament(tournamentId, {
        participants: allParticipants,
        matches,
      });

      return updated;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}

export function useUpdateTournamentSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      updates,
    }: {
      tournamentId: string;
      updates: Partial<Tournament>;
    }) => {
      return updateTournament(tournamentId, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}
