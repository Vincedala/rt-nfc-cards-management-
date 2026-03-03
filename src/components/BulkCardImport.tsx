import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Info,
  Download,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { useAppStore } from '../hooks/useAppStore';
import { Card } from '../types';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn } from '../lib/utils';

interface BulkCardImportProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkCardImport({ isOpen, onClose }: BulkCardImportProps) {
  const { addCards, cards, projects } = useAppStore();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    success: any[];
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file');
        return;
      }
      setFile(selectedFile);
      setResults(null);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `serialNumber,nfcCode,project,batchNumber,notes
HP-BATCH-001,04:A1:B2:C3:D4:E5:F6,Kilimo Coop,BATCH-01,Sample note
HP-BATCH-002,04:F1:E2:D3:C4:B5:A6,Gikomba Traders,BATCH-01,Another note`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'card_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processFile = () => {
    if (!file) return;

    setIsProcessing(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const success: Card[] = [];
        const errors: string[] = [];

        data.forEach((row, index) => {
          const rowNum = index + 2; 
          
          if (!row.serialNumber || !row.nfcCode || !row.project) {
            errors.push(`Row ${rowNum}: Missing required fields (serialNumber, nfcCode, or project)`);
            return;
          }

          if (cards.some(c => c.serialNumber === row.serialNumber) || success.some(c => c.serialNumber === row.serialNumber)) {
            errors.push(`Row ${rowNum}: Serial number ${row.serialNumber} already exists`);
            return;
          }

          if (!projects.some(p => p.name === row.project)) {
            errors.push(`Row ${rowNum}: Project "${row.project}" not found`);
            return;
          }

          success.push({
            serialNumber: row.serialNumber,
            nfcCode: row.nfcCode,
            status: 'Active',
            project: row.project,
            dateRegistered: new Date().toISOString().split('T')[0],
            batchNumber: row.batchNumber || '',
            notes: row.notes || '',
          });
        });

        setResults({ success, errors });
        setIsProcessing(false);
      },
      error: (error) => {
        toast.error('Error parsing CSV file: ' + error.message);
        setIsProcessing(false);
      }
    });
  };

  const handleConfirmImport = () => {
    if (results && results.success.length > 0) {
      addCards(results.success);
      toast.success(`Successfully imported ${results.success.length} cards`);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setResults(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden border-none bg-white dark:bg-slate-900 shadow-2xl">
        <DialogHeader className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Bulk Card Import</DialogTitle>
              <DialogDescription className="text-slate-500">
                Import multiple NFC cards at once using a CSV file.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6">
          {!results ? (
            <div className="space-y-6">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer",
                  file ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv" 
                  onChange={handleFileChange} 
                />
                {file ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      Remove file
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">Drag and drop CSV here</p>
                      <p className="text-sm text-slate-500">or click to browse from your computer</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Need a template for your CSV file?</p>
                </div>
                <Button variant="ghost" size="sm" onClick={downloadTemplate} className="text-blue-600 h-8 font-bold">
                  <Download className="w-4 h-4 mr-2" />
                  Download template
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Ready to Import</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{results.success.length}</p>
                </div>
                <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-center">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Failed / Errors</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-400">{results.errors.length}</p>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-2xl border border-red-100 dark:border-red-900/30 p-4 space-y-2">
                  <p className="text-xs font-bold text-red-600 uppercase flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Errors found:
                  </p>
                  {results.errors.map((error, i) => (
                    <p key={i} className="text-[11px] text-red-500 font-medium leading-relaxed"> - {error}</p>
                  ))}
                </div>
              )}

              {results.success.length > 0 && (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 inline mr-2" />
                    Valid data found. Click the button below to complete the import process.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={handleClose} className="rounded-xl h-12 px-6 font-bold">
            {results ? 'Discard' : 'Cancel'}
          </Button>
          {!results ? (
            <Button 
              disabled={!file || isProcessing} 
              onClick={processFile} 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-blue-600/20"
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                'Process File'
              )}
            </Button>
          ) : (
            <Button 
              disabled={results.success.length === 0} 
              onClick={handleConfirmImport} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-emerald-600/20"
            >
              Confirm Import ({results.success.length})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}