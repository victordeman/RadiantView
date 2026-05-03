"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface DicomMetadata {
  patientName?: string;
  patientId?: string;
  patientDob?: string;
  patientGender?: string;
  studyDate?: string;
  studyDescription?: string;
  modality?: string;
  seriesDescription?: string;
  instanceNumber?: string;
  rows?: number;
  columns?: number;
  pixelSpacing?: string;
  windowCenter?: string;
  windowWidth?: string;
  bitsAllocated?: number;
  photometricInterpretation?: string;
}

interface DicomMetadataPanelProps {
  metadata: DicomMetadata | null;
  isOpen: boolean;
  onToggle: () => void;
}

function MetadataRow({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2 py-1.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs text-foreground font-mono text-right truncate">{value}</span>
    </div>
  );
}

export function DicomMetadataPanel({ metadata, isOpen, onToggle }: DicomMetadataPanelProps) {
  return (
    <div className="relative flex">
      <Button
        variant="ghost"
        size="sm"
        className="absolute -left-8 top-2 z-10 size-6 p-0 rounded-full bg-slate-800 hover:bg-slate-700"
        onClick={onToggle}
      >
        {isOpen ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
      </Button>

      {isOpen && (
        <div className="w-72 bg-slate-900/80 border-l border-border overflow-y-auto p-4 space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            DICOM Tags
          </h3>

          {!metadata ? (
            <p className="text-xs text-muted-foreground">No file loaded</p>
          ) : (
            <>
              {/* Patient Info */}
              <div className="space-y-0.5">
                <h4 className="text-xs font-medium text-primary mb-1">Patient</h4>
                <MetadataRow label="Name" value={metadata.patientName} />
                <MetadataRow label="ID" value={metadata.patientId} />
                <MetadataRow label="DOB" value={metadata.patientDob} />
                <MetadataRow label="Gender" value={metadata.patientGender} />
              </div>

              {/* Study Info */}
              <div className="space-y-0.5">
                <h4 className="text-xs font-medium text-primary mb-1">Study</h4>
                <MetadataRow label="Date" value={metadata.studyDate} />
                <MetadataRow label="Description" value={metadata.studyDescription} />
                {metadata.modality && (
                  <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                    <span className="text-xs text-muted-foreground">Modality</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {metadata.modality}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Series / Instance */}
              <div className="space-y-0.5">
                <h4 className="text-xs font-medium text-primary mb-1">Series / Instance</h4>
                <MetadataRow label="Series" value={metadata.seriesDescription} />
                <MetadataRow label="Instance #" value={metadata.instanceNumber} />
              </div>

              {/* Image Info */}
              <div className="space-y-0.5">
                <h4 className="text-xs font-medium text-primary mb-1">Image</h4>
                <MetadataRow
                  label="Dimensions"
                  value={metadata.rows && metadata.columns ? `${metadata.columns} x ${metadata.rows}` : undefined}
                />
                <MetadataRow label="Pixel Spacing" value={metadata.pixelSpacing} />
                <MetadataRow label="Bits Allocated" value={metadata.bitsAllocated} />
                <MetadataRow label="Photometric" value={metadata.photometricInterpretation} />
                <MetadataRow label="Window Center" value={metadata.windowCenter} />
                <MetadataRow label="Window Width" value={metadata.windowWidth} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
