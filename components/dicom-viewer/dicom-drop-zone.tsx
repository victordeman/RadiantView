"use client";

import { useCallback, useState } from "react";
import { Upload, FileImage, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DicomDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
  fileCount: number;
}

export function DicomDropZone({ onFilesSelected, isLoading, fileCount }: DicomDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const files: File[] = [];
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          const item = e.dataTransfer.items[i];
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (file) files.push(file);
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          files.push(e.dataTransfer.files[i]);
        }
      }

      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (fileList && fileList.length > 0) {
        onFilesSelected(Array.from(fileList));
      }
      e.target.value = "";
    },
    [onFilesSelected]
  );

  const handleFolderInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (fileList && fileList.length > 0) {
        const dcmFiles = Array.from(fileList).filter(
          (f) => f.name.endsWith(".dcm") || f.name.endsWith(".DCM") || !f.name.includes(".")
        );
        if (dcmFiles.length > 0) {
          onFilesSelected(dcmFiles);
        }
      }
      e.target.value = "";
    },
    [onFilesSelected]
  );

  if (fileCount > 0 && !isLoading) {
    return null;
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div
        className={`w-full max-w-lg rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border/50 hover:border-border"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading DICOM files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="size-8 text-primary/60" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Drop DICOM files here
              </h3>
              <p className="text-sm text-muted-foreground">
                or click to browse for .dcm files
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => document.getElementById("dcm-file-input")?.click()}
              >
                <FileImage className="size-4" />
                Select Files
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => document.getElementById("dcm-folder-input")?.click()}
              >
                <FolderOpen className="size-4" />
                Select Folder
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/60">
              Supports .dcm files and CT/MR series folders
            </p>
          </div>
        )}

        <input
          id="dcm-file-input"
          type="file"
          accept=".dcm,.DCM"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        <input
          id="dcm-folder-input"
          type="file"
          // @ts-expect-error webkitdirectory is not in the standard HTML spec
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={handleFolderInput}
        />
      </div>
    </div>
  );
}
