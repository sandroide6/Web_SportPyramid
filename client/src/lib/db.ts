import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { type Tournament } from '@shared/schema';

interface TournamentDB extends DBSchema {
  tournaments: {
    key: string;
    value: Tournament;
    indexes: { 'by-date': number };
  };
}

const DB_NAME = 'tournament-manager';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<TournamentDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<TournamentDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<TournamentDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create tournaments store
      if (!db.objectStoreNames.contains('tournaments')) {
        const tournamentStore = db.createObjectStore('tournaments', {
          keyPath: 'id',
        });
        tournamentStore.createIndex('by-date', 'createdAt');
      }
    },
  });

  return dbInstance;
}

// Tournament CRUD operations
export async function getAllTournaments(): Promise<Tournament[]> {
  const db = await getDB();
  const tournaments = await db.getAllFromIndex('tournaments', 'by-date');
  return tournaments.reverse(); // Most recent first
}

export async function getTournament(id: string): Promise<Tournament | undefined> {
  const db = await getDB();
  return db.get('tournaments', id);
}

export async function saveTournament(tournament: Tournament): Promise<void> {
  const db = await getDB();
  await db.put('tournaments', tournament);
}

export async function deleteTournament(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('tournaments', id);
}

export async function updateTournament(
  id: string,
  updates: Partial<Tournament>
): Promise<Tournament | undefined> {
  const db = await getDB();
  const tournament = await db.get('tournaments', id);
  
  if (!tournament) {
    return undefined;
  }

  const updated: Tournament = {
    ...tournament,
    ...updates,
    updatedAt: Date.now(),
  };

  await db.put('tournaments', updated);
  return updated;
}

// Clear all data (for testing/reset)
export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.clear('tournaments');
}
