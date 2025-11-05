import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    const validExtensions = ['txt', 'pdf', 'xlsx', 'xls'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !validExtensions.includes(extension)) {
      alert('Bitte laden Sie eine TXT-, PDF- oder Excel-Datei hoch.');
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      await onFileUpload(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Hochladen der Datei');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging ? 'hsl(var(--primary))' : 'hsl(var(--border))',
            backgroundColor: isDragging ? 'hsl(var(--accent))' : 'transparent',
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-accent' : 'border-border'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={48} className="text-primary" />
              </motion.div>
            ) : (
              <Upload size={48} className="text-muted-foreground" />
            )}

            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isUploading
                  ? 'Datei wird verarbeitet...'
                  : 'Datei hochladen'}
              </p>
              <p className="text-sm text-muted-foreground">
                TXT, PDF oder Excel (XLSX/XLS)
              </p>
              {uploadedFileName && !isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-primary"
                >
                  <FileText size={16} />
                  {uploadedFileName}
                </motion.div>
              )}
            </div>

            <Button
              onClick={handleButtonClick}
              disabled={isUploading}
              className="gap-2"
            >
              <Upload size={18} />
              Datei auswählen
            </Button>

            <p className="text-xs text-muted-foreground">
              oder per Drag & Drop hier ablegen
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
