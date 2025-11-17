import Papa from 'papaparse';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { 
  type Tournament, 
  type Participant, 
  type InsertParticipant,
  csvImportSchema,
  jsonImportSchema,
  type PaperSize,
} from '@shared/schema';

/**
 * Import participants from CSV
 */
export function importFromCSV(csvText: string): InsertParticipant[] {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().trim(),
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV parsing error: ${result.errors[0].message}`);
  }

  const participants: InsertParticipant[] = [];

  for (const row of result.data) {
    try {
      const validated = csvImportSchema.parse(row);
      participants.push({
        name: validated.name,
        country: validated.country,
        seed: validated.seed,
        category: validated.category,
      });
    } catch (error) {
      console.warn('Skipping invalid row:', row, error);
    }
  }

  if (participants.length === 0) {
    throw new Error('No valid participants found in CSV');
  }

  return participants;
}

/**
 * Import participants from JSON
 */
export function importFromJSON(jsonText: string): InsertParticipant[] {
  try {
    const data = JSON.parse(jsonText);
    return jsonImportSchema.parse(data);
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Import participants from plain text (one name per line)
 */
export function importFromText(text: string): InsertParticipant[] {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error('No participants found in text');
  }

  return lines.map((name, index) => ({
    name,
    seed: index + 1,
  }));
}

/**
 * Export tournament to JSON
 */
export function exportToJSON(tournament: Tournament): void {
  const jsonString = JSON.stringify(tournament, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  saveAs(blob, `${tournament.name.replace(/\s+/g, '-')}-tournament.json`);
}

/**
 * Export participants to CSV
 */
export function exportToCSV(tournament: Tournament): void {
  const participants = tournament.participants.map((p, index) => {
    // Calculate stats
    const matches = tournament.matches.filter(
      (m) => m.redCompetitorId === p.id || m.blueCompetitorId === p.id
    );
    const wins = matches.filter((m) => m.winnerId === p.id).length;
    const losses = matches.filter((m) => m.winnerId !== null && m.winnerId !== p.id).length;

    return {
      seed: p.seed || index + 1,
      name: p.name,
      country: p.country || '',
      category: p.category || '',
      matches: matches.length,
      wins,
      losses,
    };
  });

  const csv = Papa.unparse(participants);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${tournament.name.replace(/\s+/g, '-')}-participants.csv`);
}

/**
 * Export bracket to PDF
 */
export function exportToPDF(
  tournament: Tournament,
  paperSize: PaperSize = 'letter'
): void {
  // Paper dimensions in mm
  const paperSizes = {
    letter: { width: 215.9, height: 279.4 },
    a4: { width: 210, height: 297 },
    a3: { width: 297, height: 420 },
  };

  const { width, height } = paperSizes[paperSize];
  const pdf = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [width, height],
  });

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(tournament.name, width / 2, 20, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    `${tournament.participants.length} Participants | ${tournament.format}`,
    width / 2,
    28,
    { align: 'center' }
  );

  // Organize matches by rounds
  const rounds: { [key: number]: typeof tournament.matches } = {};
  const maxRound = Math.max(...tournament.matches.map((m) => m.round));

  for (let i = maxRound; i >= 0; i--) {
    rounds[i] = tournament.matches
      .filter((m) => m.round === i)
      .sort((a, b) => a.position - b.position);
  }

  // Calculate layout
  const startY = 40;
  const roundWidth = (width - 40) / (maxRound + 1);
  const matchHeight = 30;
  const matchSpacing = 10;

  let xOffset = 20;

  // Draw rounds
  Object.entries(rounds).forEach(([roundNum, matches]) => {
    const round = parseInt(roundNum);
    const roundLabel = 
      round === 0 ? 'Final' : 
      round === 1 ? 'Semifinals' : 
      round === 2 ? 'Quarterfinals' : 
      `Round ${maxRound - round + 1}`;

    // Round header
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(roundLabel, xOffset + roundWidth / 2, startY - 5, { align: 'center' });

    // Draw matches
    const verticalSpacing = (height - startY - 20) / matches.length;
    
    matches.forEach((match, index) => {
      const yPos = startY + index * verticalSpacing;
      const matchBoxWidth = roundWidth - 10;
      const matchBoxHeight = matchHeight;

      // Match box
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(255, 255, 255);
      pdf.rect(xOffset, yPos, matchBoxWidth, matchBoxHeight, 'FD');

      // Divider line
      pdf.line(xOffset, yPos + matchBoxHeight / 2, xOffset + matchBoxWidth, yPos + matchBoxHeight / 2);

      // Get participants
      const redParticipant = match.redCompetitorId
        ? tournament.participants.find((p) => p.id === match.redCompetitorId)
        : null;
      const blueParticipant = match.blueCompetitorId
        ? tournament.participants.find((p) => p.id === match.blueCompetitorId)
        : null;

      // Red competitor
      pdf.setFontSize(8);
      pdf.setFont('helvetica', match.winnerId === match.redCompetitorId ? 'bold' : 'normal');
      pdf.text(
        redParticipant?.name || 'BYE',
        xOffset + 2,
        yPos + 6,
        { maxWidth: matchBoxWidth - 4 }
      );

      if (match.redScore) {
        pdf.text(match.redScore, xOffset + matchBoxWidth - 2, yPos + 6, { align: 'right' });
      }

      // Blue competitor
      pdf.setFont('helvetica', match.winnerId === match.blueCompetitorId ? 'bold' : 'normal');
      pdf.text(
        blueParticipant?.name || 'BYE',
        xOffset + 2,
        yPos + matchBoxHeight / 2 + 6,
        { maxWidth: matchBoxWidth - 4 }
      );

      if (match.blueScore) {
        pdf.text(match.blueScore, xOffset + matchBoxWidth - 2, yPos + matchBoxHeight / 2 + 6, { align: 'right' });
      }

      // Connection line to next round
      if (match.nextMatchId && round > 0) {
        const nextMatch = rounds[round - 1].find((m) => m.id === match.nextMatchId);
        if (nextMatch) {
          const nextMatchIndex = rounds[round - 1].indexOf(nextMatch);
          const nextY = startY + nextMatchIndex * ((height - startY - 20) / rounds[round - 1].length);
          
          pdf.setDrawColor(150, 150, 150);
          pdf.line(
            xOffset + matchBoxWidth,
            yPos + matchBoxHeight / 2,
            xOffset + roundWidth,
            nextY + matchBoxHeight / 2
          );
        }
      }
    });

    xOffset += roundWidth;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Generated on ${new Date().toLocaleString()}`,
    width / 2,
    height - 10,
    { align: 'center' }
  );

  // Save
  pdf.save(`${tournament.name.replace(/\s+/g, '-')}-bracket.pdf`);
}
