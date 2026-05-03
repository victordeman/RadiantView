"use client";

import { useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DicomDropZone } from "@/components/dicom-viewer/dicom-drop-zone";
import { DicomMetadataPanel } from "@/components/dicom-viewer/dicom-metadata-panel";
import type { DicomMetadata } from "@/components/dicom-viewer/dicom-metadata-panel";
import { DicomToolbar } from "@/components/dicom-viewer/dicom-toolbar";
import type { DicomTool, WLPreset } from "@/components/dicom-viewer/dicom-toolbar";
import { DicomViewport } from "@/components/dicom-viewer/dicom-viewport";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

function DicomViewerContent() {
  const searchParams = useSearchParams();
  const studyHint = searchParams.get("study");

  const [imageIds, setImageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<DicomTool>("WindowLevel");
  const [metadata, setMetadata] = useState<DicomMetadata | null>(null);
  const [metadataPanelOpen, setMetadataPanelOpen] = useState(true);
  const [isInverted, setIsInverted] = useState(false);
  const [stackPosition, setStackPosition] = useState({ current: 0, total: 0 });
  const [resetKey, setResetKey] = useState(0);
  const [invertKey, setInvertKey] = useState(0);
  const [rotateAction, setRotateAction] = useState<{ direction: "cw" | "ccw"; key: number } | null>(null);
  const [flipAction, setFlipAction] = useState<{ direction: "h" | "v"; key: number } | null>(null);
  const [presetAction, setPresetAction] = useState<{ preset: WLPreset; key: number } | null>(null);
  const actionKeyRef = useRef(0);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setIsLoading(true);

    try {
      // Dynamically import cornerstone to avoid SSR issues
      const { initCornerstone } = await import("@/lib/cornerstone");
      await initCornerstone();

      const cornerstoneDICOMImageLoader = await import("@cornerstonejs/dicom-image-loader");

      const newImageIds: string[] = [];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
        if (imageId) {
          newImageIds.push(imageId);
        } else {
          // Fallback: use blob URL approach
          const blob = new Blob([arrayBuffer], { type: "application/dicom" });
          const url = URL.createObjectURL(blob);
          newImageIds.push(`wadouri:${url}`);
        }
      }

      // Sort by instance number if available (for CT series ordering)
      // We'll sort after loading since we need metadata
      setImageIds(newImageIds);
      setStackPosition({ current: 1, total: newImageIds.length });
    } catch (error) {
      console.error("Error loading DICOM files:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
    setIsInverted(false);
  }, []);

  const handleInvert = useCallback(() => {
    setInvertKey((k) => k + 1);
    setIsInverted((v) => !v);
  }, []);

  const handleRotate = useCallback((direction: "cw" | "ccw") => {
    actionKeyRef.current += 1;
    setRotateAction({ direction, key: actionKeyRef.current });
  }, []);

  const handleFlip = useCallback((direction: "h" | "v") => {
    actionKeyRef.current += 1;
    setFlipAction({ direction, key: actionKeyRef.current });
  }, []);

  const handleApplyPreset = useCallback((preset: WLPreset) => {
    actionKeyRef.current += 1;
    setPresetAction({ preset, key: actionKeyRef.current });
  }, []);

  const handleStackPositionChange = useCallback((current: number, total: number) => {
    setStackPosition({ current, total });
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (imageIds.length === 0) return;

      switch (e.key.toLowerCase()) {
        case "w":
          setActiveTool("WindowLevel");
          break;
        case "z":
          setActiveTool("Zoom");
          break;
        case "p":
          setActiveTool("Pan");
          break;
        case "l":
          setActiveTool("Length");
          break;
        case "a":
          setActiveTool("Angle");
          break;
        case "e":
          setActiveTool("EllipticalROI");
          break;
        case "n":
          setActiveTool("ArrowAnnotate");
          break;
        case "i":
          handleInvert();
          break;
        case "r":
          handleReset();
          break;
      }
    },
    [imageIds.length, handleInvert, handleReset]
  );

  const hasImage = imageIds.length > 0;

  return (
    <div
      className="flex flex-col h-[calc(100vh-4rem)] bg-background"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Study hint banner */}
      {studyHint && imageIds.length === 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-950/30 border-b border-amber-800/30 text-amber-200 text-sm">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            No PACS server connected. Drop DICOM files below to view study{" "}
            <span className="font-mono font-medium">{studyHint}</span>
          </span>
        </div>
      )}

      {/* Toolbar */}
      <DicomToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onReset={handleReset}
        onInvert={handleInvert}
        onRotate={handleRotate}
        onFlip={handleFlip}
        onApplyPreset={handleApplyPreset}
        isInverted={isInverted}
        hasImage={hasImage}
      />

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Viewport or Drop Zone */}
        {hasImage ? (
          <DicomViewport
            imageIds={imageIds}
            activeTool={activeTool}
            onMetadataChange={setMetadata}
            onStackPositionChange={handleStackPositionChange}
            resetKey={resetKey}
            invertKey={invertKey}
            rotateAction={rotateAction}
            flipAction={flipAction}
            presetAction={presetAction}
          />
        ) : (
          <DicomDropZone
            onFilesSelected={handleFilesSelected}
            isLoading={isLoading}
            fileCount={imageIds.length}
          />
        )}

        {/* Metadata sidebar */}
        <DicomMetadataPanel
          metadata={metadata}
          isOpen={metadataPanelOpen}
          onToggle={() => setMetadataPanelOpen((v) => !v)}
        />
      </div>

      {/* Status bar */}
      {hasImage && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/80 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-mono">
              {activeTool}
            </Badge>
            {metadata?.modality && (
              <span>Modality: {metadata.modality}</span>
            )}
            {metadata?.patientName && (
              <span>Patient: {metadata.patientName}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {stackPosition.total > 1 && (
              <span>
                Image {stackPosition.current} / {stackPosition.total}
              </span>
            )}
            <span>
              {metadata?.columns && metadata?.rows
                ? `${metadata.columns} x ${metadata.rows}`
                : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DicomViewerPage() {
  return (
    <Suspense>
      <DicomViewerContent />
    </Suspense>
  );
}
