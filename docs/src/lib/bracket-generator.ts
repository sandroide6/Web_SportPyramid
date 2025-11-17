import { v4 as uuidv4 } from 'crypto';
import { type Participant, type Match, ResultType } from '@shared/schema';

// Generate a unique ID (fallback for client-side)
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate the next power of 2 (bracket size)
 * e.g., 5 participants -> 8 bracket size
 */
function nextPowerOfTwo(n: number): number {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

/**
 * Generate a single elimination bracket
 * @param participants Array of participants
 * @returns Array of matches organized in rounds
 */
export function generateSingleEliminationBracket(
  participants: Participant[]
): Match[] {
  if (participants.length < 2) {
    throw new Error('At least 2 participants are required');
  }

  const bracketSize = nextPowerOfTwo(participants.length);
  const totalRounds = Math.log2(bracketSize);
  const byeCount = bracketSize - participants.length;

  // Shuffle participants for seeding (or use their seed property if available)
  const seededParticipants = [...participants].sort((a, b) => {
    if (a.seed !== undefined && b.seed !== undefined) {
      return a.seed - b.seed;
    }
    return 0;
  });

  // Add BYE placeholders
  const allSlots: (Participant | null)[] = [...seededParticipants];
  for (let i = 0; i < byeCount; i++) {
    allSlots.push(null); // null represents BYE
  }

  // Distribute BYEs evenly (alternate between top and bottom)
  const finalSlots: (Participant | null)[] = [];
  let topIndex = 0;
  let bottomIndex = allSlots.length - 1;
  let fromTop = true;

  while (topIndex <= bottomIndex) {
    if (fromTop) {
      finalSlots.push(allSlots[topIndex]);
      topIndex++;
    } else {
      finalSlots.push(allSlots[bottomIndex]);
      bottomIndex--;
    }
    fromTop = !fromTop;
  }

  // Generate matches for all rounds
  const matches: Match[] = [];
  const matchesByRound: Match[][] = [];

  // Round 0 is the final, Round 1 is semifinals, etc.
  // We build from the first round (highest round number) to the final
  for (let round = totalRounds - 1; round >= 0; round--) {
    const matchesInRound = Math.pow(2, round);
    const roundMatches: Match[] = [];

    for (let position = 0; position < matchesInRound; position++) {
      const match: Match = {
        id: generateId(),
        round,
        position,
        redCompetitorId: null,
        blueCompetitorId: null,
        winnerId: null,
        resultType: ResultType.PENDING,
        nextMatchId: null,
      };

      // For the first round, assign participants
      if (round === totalRounds - 1) {
        const slotIndex = position * 2;
        const redParticipant = finalSlots[slotIndex];
        const blueParticipant = finalSlots[slotIndex + 1];

        match.redCompetitorId = redParticipant ? redParticipant.id : null;
        match.blueCompetitorId = blueParticipant ? blueParticipant.id : null;

        // Auto-advance if one side is BYE
        if (!redParticipant && blueParticipant) {
          match.winnerId = blueParticipant.id;
          match.resultType = ResultType.WALKOVER;
        } else if (redParticipant && !blueParticipant) {
          match.winnerId = redParticipant.id;
          match.resultType = ResultType.WALKOVER;
        }
      }

      roundMatches.push(match);
    }

    matchesByRound.push(roundMatches);
    matches.push(...roundMatches);
  }

  // Link matches to their next matches
  for (let round = totalRounds - 1; round > 0; round--) {
    const currentRound = matchesByRound[totalRounds - 1 - round];
    const nextRound = matchesByRound[totalRounds - round];

    currentRound.forEach((match, index) => {
      const nextMatchIndex = Math.floor(index / 2);
      match.nextMatchId = nextRound[nextMatchIndex].id;
    });
  }

  return matches;
}

/**
 * Update bracket when a match result is set
 * Advances winner to next match and clears downstream if needed
 */
export function advanceWinner(
  matches: Match[],
  updatedMatch: Match
): Match[] {
  const newMatches = matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m));

  // Handle next match updates
  if (updatedMatch.nextMatchId) {
    const nextMatch = newMatches.find((m) => m.id === updatedMatch.nextMatchId);
    
    if (nextMatch) {
      const isRedSide = updatedMatch.position % 2 === 0;
      const targetSlot = isRedSide ? 'redCompetitorId' : 'blueCompetitorId';
      
      if (updatedMatch.winnerId) {
        // Store the previous competitor to detect changes
        const previousCompetitor = isRedSide ? nextMatch.redCompetitorId : nextMatch.blueCompetitorId;
        const competitorChanged = previousCompetitor !== updatedMatch.winnerId;
        
        // Set the winner in the next match
        if (isRedSide) {
          nextMatch.redCompetitorId = updatedMatch.winnerId;
        } else {
          nextMatch.blueCompetitorId = updatedMatch.winnerId;
        }

        // Clear next match result if competitor changed
        // This ensures stale results are invalidated when upstream matches change
        if (competitorChanged) {
          nextMatch.winnerId = null;
          nextMatch.resultType = ResultType.PENDING;
          nextMatch.redScore = undefined;
          nextMatch.blueScore = undefined;
          nextMatch.metadata = undefined;
          
          // Recursively clear downstream matches
          if (nextMatch.nextMatchId) {
            return advanceWinner(newMatches, nextMatch);
          }
        }

        // Auto-advance if opponent is BYE
        if (!nextMatch.redCompetitorId && nextMatch.blueCompetitorId) {
          nextMatch.winnerId = nextMatch.blueCompetitorId;
          nextMatch.resultType = ResultType.WALKOVER;
          return advanceWinner(newMatches, nextMatch);
        } else if (nextMatch.redCompetitorId && !nextMatch.blueCompetitorId) {
          nextMatch.winnerId = nextMatch.redCompetitorId;
          nextMatch.resultType = ResultType.WALKOVER;
          return advanceWinner(newMatches, nextMatch);
        }
      } else {
        // No winner yet - clear the downstream slot
        if (isRedSide) {
          nextMatch.redCompetitorId = null;
        } else {
          nextMatch.blueCompetitorId = null;
        }
        
        // Clear next match result since a competitor was removed
        nextMatch.winnerId = null;
        nextMatch.resultType = ResultType.PENDING;
        nextMatch.redScore = undefined;
        nextMatch.blueScore = undefined;
        nextMatch.metadata = undefined;
        
        // Recursively clear downstream
        if (nextMatch.nextMatchId) {
          return advanceWinner(newMatches, nextMatch);
        }
      }
    }
  }

  return newMatches;
}

/**
 * Reset all match results in a bracket
 */
export function resetBracket(matches: Match[]): Match[] {
  return matches.map((match) => ({
    ...match,
    winnerId: null,
    resultType: ResultType.PENDING,
    redScore: undefined,
    blueScore: undefined,
    // Keep first round competitors, clear others
    redCompetitorId: match.round === Math.max(...matches.map((m) => m.round)) 
      ? match.redCompetitorId 
      : null,
    blueCompetitorId: match.round === Math.max(...matches.map((m) => m.round))
      ? match.blueCompetitorId
      : null,
  }));
}
