"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { DicomMetadata } from "./dicom-metadata-panel";
import type { DicomTool, WLPreset } from "./dicom-toolbar";

/**
 * Loose interface for the Cornerstone StackViewport methods we use.
 * We cast via unknown once in getStackViewport and reuse throughout.
 */
interface StackViewportLike {
  setStack: (ids: string[]) => Promise<void>;
  setProperties: (props: Record<string, unknown>) => void;
  resetCamera: () => void;
  render: () => void;
  getCurrentImageIdIndex: () => number;
  getImageIds: () => string[];
  setImageIdIndex: (idx: number) => void;
}

interface CornerstoneViewportHandle {
  renderingEngine: unknown;
  viewport: unknown;
  toolGroup: unknown;
}

interface DicomViewportProps {
  imageIds: string[];
  activeTool: DicomTool;
  onMetadataChange: (metadata: DicomMetadata | null) => void;
  onStackPositionChange: (current: number, total: number) => void;
  resetKey: number;
  invertKey: number;
  rotateAction: { direction: "cw" | "ccw"; key: number } | null;
  flipAction: { direction: "h" | "v"; key: number } | null;
  presetAction: { preset: WLPreset; key: number } | null;
}

const RENDERING_ENGINE_ID = "dicomViewerEngine";
const VIEWPORT_ID = "dicomViewport";
const TOOL_GROUP_ID = "dicomToolGroup";

const TOOL_NAME_MAP: Record<DicomTool, string> = {
  WindowLevel: "WindowLevel",
  Zoom: "Zoom",
  Pan: "Pan",
  Length: "Length",
  Angle: "Angle",
  EllipticalROI: "EllipticalROI",
  ArrowAnnotate: "ArrowAnnotate",
};

function parseDicomDate(dateStr: string | undefined): string {
  if (!dateStr || dateStr.length < 8) return dateStr || "";
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}

// Module references stored after dynamic import so cleanup and metadata extraction can use them synchronously
let csCoreMod: typeof import("@cornerstonejs/core") | null = null;
let csToolsMod: typeof import("@cornerstonejs/tools") | null = null;

function extractMetadata(imageId: string): DicomMetadata {
  try {
    if (!csCoreMod) return {};
    const metaDataProvider = csCoreMod.metaData;

    const generalStudy = metaDataProvider.get("generalStudyModule", imageId) || {};
    const patient = metaDataProvider.get("patientModule", imageId) || {};
    const generalSeries = metaDataProvider.get("generalSeriesModule", imageId) || {};
    const generalImage = metaDataProvider.get("generalImageModule", imageId) || {};
    const imagePixel = metaDataProvider.get("imagePixelModule", imageId) || {};
    const voiLut = metaDataProvider.get("voiLutModule", imageId) || {};
    const imagePlane = metaDataProvider.get("imagePlaneModule", imageId) || {};

    return {
      patientName: patient.patientName?.Alphabetic || patient.patientName || undefined,
      patientId: patient.patientId || undefined,
      patientDob: parseDicomDate(patient.patientBirthDate) || undefined,
      patientGender: patient.patientSex || undefined,
      studyDate: parseDicomDate(generalStudy.studyDate) || undefined,
      studyDescription: generalStudy.studyDescription || undefined,
      modality: generalSeries.modality || undefined,
      seriesDescription: generalSeries.seriesDescription || undefined,
      instanceNumber: generalImage.instanceNumber?.toString() || undefined,
      rows: imagePixel.rows || undefined,
      columns: imagePixel.columns || undefined,
      pixelSpacing: imagePlane.pixelSpacing
        ? `${imagePlane.pixelSpacing[0]?.toFixed(2)} x ${imagePlane.pixelSpacing[1]?.toFixed(2)} mm`
        : undefined,
      windowCenter: voiLut.windowCenter?.toString() || undefined,
      windowWidth: voiLut.windowWidth?.toString() || undefined,
      bitsAllocated: imagePixel.bitsAllocated || undefined,
      photometricInterpretation: imagePixel.photometricInterpretation || undefined,
    };
  } catch {
    return {};
  }
}

/** Helper: get the stack viewport from a rendering engine, cast to our loose interface. */
function getStackViewport(
  engine: { getViewport: (id: string) => unknown } | undefined
): StackViewportLike | null {
  if (!engine) return null;
  const vp = engine.getViewport(VIEWPORT_ID);
  return vp ? (vp as unknown as StackViewportLike) : null;
}

export function DicomViewport({
  imageIds,
  activeTool,
  onMetadataChange,
  onStackPositionChange,
  resetKey,
  invertKey,
  rotateAction,
  flipAction,
  presetAction,
}: DicomViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const csRef = useRef<CornerstoneViewportHandle | null>(null);
  const [isReady, setIsReady] = useState(false);
  const currentRotation = useRef(0);
  const currentFlipH = useRef(false);
  const currentFlipV = useRef(false);
  const currentInvert = useRef(false);

  // Initialize cornerstone viewport
  useEffect(() => {
    if (!containerRef.current || imageIds.length === 0) return;

    let disposed = false;

    const setup = async () => {
      const { initCornerstone } = await import("@/lib/cornerstone");
      await initCornerstone();

      if (disposed || !containerRef.current) return;

      csCoreMod = await import("@cornerstonejs/core");
      csToolsMod = await import("@cornerstonejs/tools");

      const cornerstoneCore = csCoreMod;
      const cornerstoneTools = csToolsMod;

      const {
        RenderingEngine,
        Enums: CoreEnums,
      } = cornerstoneCore;

      const {
        ToolGroupManager,
        WindowLevelTool,
        ZoomTool,
        PanTool,
        LengthTool,
        AngleTool,
        EllipticalROITool,
        ArrowAnnotateTool,
        StackScrollTool,
        Enums: ToolEnums,
      } = cornerstoneTools;

      // Add tools (safe to call multiple times - they deduplicate)
      const tools = [
        WindowLevelTool,
        ZoomTool,
        PanTool,
        LengthTool,
        AngleTool,
        EllipticalROITool,
        ArrowAnnotateTool,
        StackScrollTool,
      ];
      for (const tool of tools) {
        try {
          cornerstoneTools.addTool(tool);
        } catch {
          // Tool already added
        }
      }

      // Clean up previous rendering engine if exists
      try {
        const existingEngine = cornerstoneCore.getRenderingEngine(RENDERING_ENGINE_ID);
        if (existingEngine) {
          existingEngine.destroy();
        }
      } catch {
        // No existing engine
      }

      // Clean up previous tool group if exists
      try {
        const existingTG = ToolGroupManager.getToolGroup(TOOL_GROUP_ID);
        if (existingTG) {
          ToolGroupManager.destroyToolGroup(TOOL_GROUP_ID);
        }
      } catch {
        // No existing tool group
      }

      if (disposed || !containerRef.current) return;

      // Create rendering engine
      const renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID);

      const viewportInput = {
        viewportId: VIEWPORT_ID,
        type: CoreEnums.ViewportType.STACK,
        element: containerRef.current,
      };

      renderingEngine.setViewports([viewportInput]);

      const viewport = getStackViewport(renderingEngine);

      // Create tool group
      const toolGroup = ToolGroupManager.createToolGroup(TOOL_GROUP_ID);
      if (!toolGroup || !viewport) return;

      toolGroup.addViewport(VIEWPORT_ID, RENDERING_ENGINE_ID);

      // Add tools to tool group
      toolGroup.addTool(WindowLevelTool.toolName);
      toolGroup.addTool(ZoomTool.toolName);
      toolGroup.addTool(PanTool.toolName);
      toolGroup.addTool(LengthTool.toolName);
      toolGroup.addTool(AngleTool.toolName);
      toolGroup.addTool(EllipticalROITool.toolName);
      toolGroup.addTool(ArrowAnnotateTool.toolName);
      toolGroup.addTool(StackScrollTool.toolName);

      // Enable StackScroll on mouse wheel
      toolGroup.setToolActive(StackScrollTool.toolName, {
        bindings: [{ mouseButton: ToolEnums.MouseBindings.Auxiliary }],
      });

      // Set default active tool
      toolGroup.setToolActive(WindowLevelTool.toolName, {
        bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }],
      });

      // Set stack
      await viewport.setStack(imageIds);

      // Reset transforms
      currentRotation.current = 0;
      currentFlipH.current = false;
      currentFlipV.current = false;
      currentInvert.current = false;

      csRef.current = {
        renderingEngine,
        viewport,
        toolGroup,
      };

      setIsReady(true);

      // Extract metadata from first image
      if (imageIds.length > 0) {
        const meta = extractMetadata(imageIds[0]);
        onMetadataChange(meta);
        onStackPositionChange(1, imageIds.length);
      }

      // Listen for stack index changes
      const element = containerRef.current;
      const handleStackChange = () => {
        const vp = getStackViewport(renderingEngine);
        if (vp) {
          const idx = vp.getCurrentImageIdIndex();
          const ids = vp.getImageIds();
          onStackPositionChange(idx + 1, ids.length);
          const meta = extractMetadata(ids[idx]);
          onMetadataChange(meta);
        }
      };

      element?.addEventListener(
        cornerstoneCore.Enums.Events.STACK_NEW_IMAGE,
        handleStackChange
      );
    };

    setup();

    return () => {
      disposed = true;
      try {
        if (csToolsMod) {
          const { ToolGroupManager } = csToolsMod;
          try {
            ToolGroupManager.destroyToolGroup(TOOL_GROUP_ID);
          } catch { /* noop */ }
        }
        if (csCoreMod) {
          try {
            const engine = csCoreMod.getRenderingEngine(RENDERING_ENGINE_ID);
            if (engine) engine.destroy();
          } catch { /* noop */ }
        }
      } catch { /* noop */ }
      csRef.current = null;
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageIds]);

  // Handle tool switching
  useEffect(() => {
    if (!isReady || !csRef.current) return;

    const switchTool = async () => {
      const cornerstoneTools = await import("@cornerstonejs/tools");
      const { ToolGroupManager, Enums: ToolEnums } = cornerstoneTools;
      const toolGroup = ToolGroupManager.getToolGroup(TOOL_GROUP_ID);
      if (!toolGroup) return;

      // Deactivate all primary button tools
      const allTools = ["WindowLevel", "Zoom", "Pan", "Length", "Angle", "EllipticalROI", "ArrowAnnotate"];
      for (const t of allTools) {
        try {
          const toolName = TOOL_NAME_MAP[t as DicomTool] || t;
          toolGroup.setToolPassive(toolName);
        } catch {
          // Tool may not be in group
        }
      }

      // Activate selected tool
      const toolName = TOOL_NAME_MAP[activeTool];
      toolGroup.setToolActive(toolName, {
        bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }],
      });
    };

    switchTool();
  }, [activeTool, isReady]);

  // Handle reset
  useEffect(() => {
    if (!isReady || !csRef.current || resetKey === 0) return;

    const doReset = async () => {
      const csMod = await import("@cornerstonejs/core");
      const engine = csMod.getRenderingEngine(RENDERING_ENGINE_ID);
      const viewport = getStackViewport(engine);
      if (!viewport) return;

      currentRotation.current = 0;
      currentFlipH.current = false;
      currentFlipV.current = false;
      currentInvert.current = false;

      viewport.setProperties({ rotation: 0, invert: false });
      viewport.resetCamera();
      viewport.render();
    };

    doReset();
  }, [resetKey, isReady]);

  // Handle invert
  useEffect(() => {
    if (!isReady || !csRef.current || invertKey === 0) return;

    const doInvert = async () => {
      const csMod = await import("@cornerstonejs/core");
      const engine = csMod.getRenderingEngine(RENDERING_ENGINE_ID);
      const viewport = getStackViewport(engine);
      if (!viewport) return;

      currentInvert.current = !currentInvert.current;
      viewport.setProperties({ invert: currentInvert.current });
      viewport.render();
    };

    doInvert();
  }, [invertKey, isReady]);

  // Handle rotation
  useEffect(() => {
    if (!isReady || !csRef.current || !rotateAction) return;

    const doRotate = async () => {
      const csMod = await import("@cornerstonejs/core");
      const engine = csMod.getRenderingEngine(RENDERING_ENGINE_ID);
      const viewport = getStackViewport(engine);
      if (!viewport) return;

      currentRotation.current += rotateAction.direction === "cw" ? 90 : -90;
      viewport.setProperties({ rotation: currentRotation.current });
      viewport.render();
    };

    doRotate();
  }, [rotateAction, isReady]);

  // Handle flip
  useEffect(() => {
    if (!isReady || !csRef.current || !flipAction) return;

    const doFlip = async () => {
      const csMod = await import("@cornerstonejs/core");
      const engine = csMod.getRenderingEngine(RENDERING_ENGINE_ID);
      const viewport = getStackViewport(engine);
      if (!viewport) return;

      if (flipAction.direction === "h") {
        currentFlipH.current = !currentFlipH.current;
        viewport.setProperties({ flipHorizontal: currentFlipH.current });
      } else {
        currentFlipV.current = !currentFlipV.current;
        viewport.setProperties({ flipVertical: currentFlipV.current });
      }
      viewport.render();
    };

    doFlip();
  }, [flipAction, isReady]);

  // Handle W/L preset
  useEffect(() => {
    if (!isReady || !csRef.current || !presetAction) return;

    const doPreset = async () => {
      const csMod = await import("@cornerstonejs/core");
      const engine = csMod.getRenderingEngine(RENDERING_ENGINE_ID);
      const viewport = getStackViewport(engine);
      if (!viewport) return;

      viewport.setProperties({
        voiRange: {
          lower: presetAction.preset.windowCenter - presetAction.preset.windowWidth / 2,
          upper: presetAction.preset.windowCenter + presetAction.preset.windowWidth / 2,
        },
      });
      viewport.render();
    };

    doPreset();
  }, [presetAction, isReady]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (!isReady || !csRef.current || imageIds.length <= 1) return;

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const csMod = await import("@cornerstonejs/core");
        const engine = csMod.getRenderingEngine(RENDERING_ENGINE_ID);
        const viewport = getStackViewport(engine);
        if (!viewport) return;

        const currentIdx = viewport.getCurrentImageIdIndex();
        const totalImages = viewport.getImageIds().length;
        let newIdx = currentIdx;

        if (e.key === "ArrowDown" && currentIdx < totalImages - 1) {
          newIdx = currentIdx + 1;
        } else if (e.key === "ArrowUp" && currentIdx > 0) {
          newIdx = currentIdx - 1;
        }

        if (newIdx !== currentIdx) {
          viewport.setImageIdIndex(newIdx);
        }
      }
    },
    [isReady, imageIds.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex-1 relative bg-black min-h-0">
      {imageIds.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          No images loaded
        </div>
      ) : (
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{ background: "#000" }}
          onContextMenu={(e) => e.preventDefault()}
        />
      )}
    </div>
  );
}
