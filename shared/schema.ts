import { z } from "zod";

// Sport categories for tournament creation
export const SPORT_CATEGORIES = [
  // Combat Sports
  { id: 'boxing', name: 'Boxing', category: 'combat' },
  { id: 'mma', name: 'Mixed Martial Arts', category: 'combat' },
  { id: 'karate', name: 'Karate', category: 'combat' },
  { id: 'taekwondo', name: 'Taekwondo', category: 'combat' },
  { id: 'judo', name: 'Judo', category: 'combat' },
  { id: 'wrestling', name: 'Wrestling', category: 'combat' },
  { id: 'kickboxing', name: 'Kickboxing', category: 'combat' },
  { id: 'muay-thai', name: 'Muay Thai', category: 'combat' },
  
  // Racket Sports
  { id: 'tennis', name: 'Tennis', category: 'racket' },
  { id: 'badminton', name: 'Badminton', category: 'racket' },
  { id: 'table-tennis', name: 'Table Tennis', category: 'racket' },
  { id: 'squash', name: 'Squash', category: 'racket' },
  { id: 'padel', name: 'Padel', category: 'racket' },
  
  // Team Sports
  { id: 'soccer', name: 'Soccer / Football', category: 'team' },
  { id: 'basketball', name: 'Basketball', category: 'team' },
  { id: 'volleyball', name: 'Volleyball', category: 'team' },
  { id: 'handball', name: 'Handball', category: 'team' },
  { id: 'rugby', name: 'Rugby', category: 'team' },
  { id: 'hockey', name: 'Hockey', category: 'team' },
  { id: 'baseball', name: 'Baseball', category: 'team' },
  { id: 'american-football', name: 'American Football', category: 'team' },
  
  // Individual Sports
  { id: 'chess', name: 'Chess', category: 'individual' },
  { id: 'athletics', name: 'Athletics', category: 'individual' },
  { id: 'swimming', name: 'Swimming', category: 'individual' },
  { id: 'cycling', name: 'Cycling', category: 'individual' },
  { id: 'gymnastics', name: 'Gymnastics', category: 'individual' },
  { id: 'golf', name: 'Golf', category: 'individual' },
  { id: 'archery', name: 'Archery', category: 'individual' },
  { id: 'fencing', name: 'Fencing', category: 'individual' },
  { id: 'bowling', name: 'Bowling', category: 'individual' },
  { id: 'darts', name: 'Darts', category: 'individual' },
  { id: 'billiards', name: 'Billiards / Pool', category: 'individual' },
  
  // E-Sports
  { id: 'esports', name: 'E-Sports', category: 'esports' },
  
  // Other
  { id: 'other', name: 'Other / Custom', category: 'other' },
] as const;

export type SportId = typeof SPORT_CATEGORIES[number]['id'];

// Result types for match outcomes
export enum ResultType {
  PENDING = 'PENDING',
  SCORE = 'SCORE',
  KO = 'KO',
  WALKOVER = 'WALKOVER',
  DQ = 'DQ',
  TIE = 'TIE',
}

// Participant in a tournament
export const participantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  country: z.string().optional(),
  seed: z.number().optional(),
  category: z.string().optional(), // Weight class, division, ranking, etc.
  metadata: z.record(z.string()).optional(), // Additional custom fields
});

export type Participant = z.infer<typeof participantSchema>;

// Match in the bracket
export const matchSchema = z.object({
  id: z.string(),
  round: z.number(), // 0 = finals, 1 = semifinals, 2 = quarterfinals, etc.
  position: z.number(), // Position within the round
  redCompetitorId: z.string().nullable(), // null = BYE
  blueCompetitorId: z.string().nullable(), // null = BYE
  winnerId: z.string().nullable(),
  resultType: z.nativeEnum(ResultType),
  redScore: z.string().optional(), // Can be "3-1", "KO Round 2", etc.
  blueScore: z.string().optional(),
  nextMatchId: z.string().nullable(), // For progression
  metadata: z.record(z.string()).optional(),
});

export type Match = z.infer<typeof matchSchema>;

// Tournament settings
export const tournamentSettingsSchema = z.object({
  allowTies: z.boolean().default(false),
  thirdPlaceMatch: z.boolean().default(false),
  autoAdvanceByes: z.boolean().default(true),
});

export type TournamentSettings = z.infer<typeof tournamentSettingsSchema>;

// Complete tournament
export const tournamentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tournament name is required"),
  sport: z.string(),
  format: z.enum(['single-elimination', 'double-elimination', 'round-robin']),
  participants: z.array(participantSchema),
  matches: z.array(matchSchema),
  createdAt: z.number(), // timestamp
  updatedAt: z.number(), // timestamp
  settings: tournamentSettingsSchema,
  isPublic: z.boolean().default(false), // Public mode vs Referee mode
});

export type Tournament = z.infer<typeof tournamentSchema>;

// Insert schemas for forms
export const insertParticipantSchema = participantSchema.omit({ id: true });
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;

export const insertTournamentSchema = tournamentSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  matches: true,
}).extend({
  participants: z.array(insertParticipantSchema),
});
export type InsertTournament = z.infer<typeof insertTournamentSchema>;

// Import format schemas
export const csvImportSchema = z.object({
  name: z.string(),
  country: z.string().optional(),
  seed: z.coerce.number().optional(),
  category: z.string().optional(),
});

export const jsonImportSchema = z.array(insertParticipantSchema);

// Export formats
export type ExportFormat = 'json' | 'pdf' | 'csv';
export type PaperSize = 'letter' | 'a4' | 'a3';

// Dummy user schema (required by template but not used)
export const users = {
  id: '',
  username: '',
  password: '',
} as const;

export type User = typeof users;
export type InsertUser = Omit<User, 'id'>;
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});
