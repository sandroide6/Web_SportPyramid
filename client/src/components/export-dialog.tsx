import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { exportToJSON, exportToCSV, exportToPDF } from "@/lib/import-export";
import { type Tournament, type PaperSize } from "@shared/schema";

interface ExportDialogProps {
  tournament: Tournament;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ tournament, open, onOpenChange }: ExportDialogProps) {
  const [format, setFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [paperSize, setPaperSize] = useState<PaperSize>('letter');
  const { toast } = useToast();

  const handleExport = () => {
    try {
      switch (format) {
        case 'json':
          exportToJSON(tournament);
          break;
        case 'csv':
          exportToCSV(tournament);
          break;
        case 'pdf':
          exportToPDF(tournament, paperSize);
          break;
      }

      toast({
        title: "Export Successful",
        description: `Tournament exported as ${format.toUpperCase()}`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Export Error",
        description: error instanceof Error ? error.message : "Failed to export",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-export">
        <DialogHeader>
          <DialogTitle>Export Tournament</DialogTitle>
          <DialogDescription>
            Download tournament data in your preferred format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-6">
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(v: any) => setFormat(v)}>
              <div className="flex items-center space-x-2 border rounded-md p-3 hover-elevate cursor-pointer">
                <RadioGroupItem value="json" id="json" data-testid="radio-json" />
                <Label htmlFor="json" className="cursor-pointer flex items-center gap-2 flex-1">
                  <FileJson className="h-4 w-4" />
                  <div>
                    <div className="font-medium">JSON</div>
                    <div className="text-sm text-muted-foreground">
                      Complete tournament data with all matches and results
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3 hover-elevate cursor-pointer">
                <RadioGroupItem value="csv" id="csv" data-testid="radio-csv" />
                <Label htmlFor="csv" className="cursor-pointer flex items-center gap-2 flex-1">
                  <FileSpreadsheet className="h-4 w-4" />
                  <div>
                    <div className="font-medium">CSV</div>
                    <div className="text-sm text-muted-foreground">
                      Participant list with stats (name, country, wins, losses)
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3 hover-elevate cursor-pointer">
                <RadioGroupItem value="pdf" id="pdf" data-testid="radio-pdf" />
                <Label htmlFor="pdf" className="cursor-pointer flex items-center gap-2 flex-1">
                  <FileText className="h-4 w-4" />
                  <div>
                    <div className="font-medium">PDF</div>
                    <div className="text-sm text-muted-foreground">
                      Print-ready bracket visualization
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {format === 'pdf' && (
            <div className="space-y-2">
              <Label htmlFor="paper-size">Paper Size</Label>
              <Select value={paperSize} onValueChange={(v: PaperSize) => setPaperSize(v)}>
                <SelectTrigger id="paper-size" data-testid="select-paper-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="letter">Letter (8.5" × 11")</SelectItem>
                  <SelectItem value="a4">A4 (210mm × 297mm)</SelectItem>
                  <SelectItem value="a3">A3 (297mm × 420mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleExport} data-testid="button-export-confirm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
