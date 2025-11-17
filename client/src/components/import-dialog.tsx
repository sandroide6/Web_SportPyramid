import { useState } from "react";
import { Upload, FileText, FileJson, FileSpreadsheet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { importFromCSV, importFromJSON, importFromText } from "@/lib/import-export";
import { type InsertParticipant } from "@shared/schema";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (participants: InsertParticipant[]) => void;
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [plainText, setPlainText] = useState("");
  const { toast } = useToast();

  const handleImportCSV = () => {
    try {
      const participants = importFromCSV(csvText);
      onImport(participants);
      toast({
        title: "Success",
        description: `Imported ${participants.length} participants from CSV`,
      });
      setCsvText("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import CSV",
        variant: "destructive",
      });
    }
  };

  const handleImportJSON = () => {
    try {
      const participants = importFromJSON(jsonText);
      onImport(participants);
      toast({
        title: "Success",
        description: `Imported ${participants.length} participants from JSON`,
      });
      setJsonText("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import JSON",
        variant: "destructive",
      });
    }
  };

  const handleImportText = () => {
    try {
      const participants = importFromText(plainText);
      onImport(participants);
      toast({
        title: "Success",
        description: `Imported ${participants.length} participants from text`,
      });
      setPlainText("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import text",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, format: 'csv' | 'json') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (format === 'csv') {
        setCsvText(content);
      } else {
        setJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-import">
        <DialogHeader>
          <DialogTitle>Import Participants</DialogTitle>
          <DialogDescription>
            Import participants from CSV, JSON, or plain text format
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="csv" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="csv" data-testid="tab-csv">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
            </TabsTrigger>
            <TabsTrigger value="json" data-testid="tab-json">
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="text" data-testid="tab-text">
              <FileText className="h-4 w-4 mr-2" />
              Text
            </TabsTrigger>
          </TabsList>

          {/* CSV Import */}
          <TabsContent value="csv" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Upload CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => handleFileUpload(e, 'csv')}
                data-testid="input-csv-file"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="csv-text">Or Paste CSV Content</Label>
              <Textarea
                id="csv-text"
                placeholder="name,country,seed,category&#10;John Doe,US,1,Heavyweight&#10;Jane Smith,GB,2,Lightweight"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={8}
                data-testid="textarea-csv"
              />
              <p className="text-sm text-muted-foreground">
                Format: name,country,seed,category (header required)
              </p>
            </div>

            <Button onClick={handleImportCSV} disabled={!csvText} data-testid="button-import-csv">
              <Upload className="h-4 w-4 mr-2" />
              Import from CSV
            </Button>
          </TabsContent>

          {/* JSON Import */}
          <TabsContent value="json" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="json-file">Upload JSON File</Label>
              <Input
                id="json-file"
                type="file"
                accept=".json"
                onChange={(e) => handleFileUpload(e, 'json')}
                data-testid="input-json-file"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="json-text">Or Paste JSON Content</Label>
              <Textarea
                id="json-text"
                placeholder='[{"name": "John Doe", "country": "US", "seed": 1, "category": "Heavyweight"}]'
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={8}
                data-testid="textarea-json"
              />
              <p className="text-sm text-muted-foreground">
                Format: Array of participant objects with name, country, seed, category
              </p>
            </div>

            <Button onClick={handleImportJSON} disabled={!jsonText} data-testid="button-import-json">
              <Upload className="h-4 w-4 mr-2" />
              Import from JSON
            </Button>
          </TabsContent>

          {/* Text Import */}
          <TabsContent value="text" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="plain-text">Paste Participant Names</Label>
              <Textarea
                id="plain-text"
                placeholder="John Doe&#10;Jane Smith&#10;Mike Johnson&#10;Sarah Williams"
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                rows={10}
                data-testid="textarea-text"
              />
              <p className="text-sm text-muted-foreground">
                One participant name per line
              </p>
            </div>

            <Button onClick={handleImportText} disabled={!plainText} data-testid="button-import-text">
              <Upload className="h-4 w-4 mr-2" />
              Import from Text
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Add missing Input component import
import { Input } from "@/components/ui/input";
