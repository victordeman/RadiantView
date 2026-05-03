"use client";

import {
  MousePointer2,
  Move,
  ZoomIn,
  SunMedium,
  Ruler,
  TriangleRight,
  Circle,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Contrast,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type DicomTool =
  | "WindowLevel"
  | "Zoom"
  | "Pan"
  | "Length"
  | "Angle"
  | "EllipticalROI"
  | "ArrowAnnotate";

export interface WLPreset {
  name: string;
  windowCenter: number;
  windowWidth: number;
}

export const WL_PRESETS: WLPreset[] = [
  { name: "Soft Tissue", windowCenter: 40, windowWidth: 400 },
  { name: "Lung", windowCenter: -600, windowWidth: 1500 },
  { name: "Bone", windowCenter: 300, windowWidth: 1500 },
  { name: "Brain", windowCenter: 40, windowWidth: 80 },
  { name: "Abdomen", windowCenter: 60, windowWidth: 400 },
];

interface DicomToolbarProps {
  activeTool: DicomTool;
  onToolChange: (tool: DicomTool) => void;
  onReset: () => void;
  onInvert: () => void;
  onRotate: (direction: "cw" | "ccw") => void;
  onFlip: (direction: "h" | "v") => void;
  onApplyPreset: (preset: WLPreset) => void;
  isInverted: boolean;
  hasImage: boolean;
}

function ToolButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <TooltipProvider delay={300}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`size-8 p-0 ${isActive ? "bg-primary text-primary-foreground" : ""}`}
              onClick={onClick}
              disabled={disabled}
            >
              <Icon className="size-4" />
            </Button>
          }
        />
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function DicomToolbar({
  activeTool,
  onToolChange,
  onReset,
  onInvert,
  onRotate,
  onFlip,
  onApplyPreset,
  isInverted,
  hasImage,
}: DicomToolbarProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-900/80 border-b border-border px-3 py-1.5 overflow-x-auto">
      {/* Navigation Tools */}
      <ToolButton
        icon={SunMedium}
        label="Window/Level (W)"
        isActive={activeTool === "WindowLevel"}
        onClick={() => onToolChange("WindowLevel")}
        disabled={!hasImage}
      />
      <ToolButton
        icon={ZoomIn}
        label="Zoom (Z)"
        isActive={activeTool === "Zoom"}
        onClick={() => onToolChange("Zoom")}
        disabled={!hasImage}
      />
      <ToolButton
        icon={Move}
        label="Pan (P)"
        isActive={activeTool === "Pan"}
        onClick={() => onToolChange("Pan")}
        disabled={!hasImage}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Measurement Tools */}
      <ToolButton
        icon={Ruler}
        label="Length (L)"
        isActive={activeTool === "Length"}
        onClick={() => onToolChange("Length")}
        disabled={!hasImage}
      />
      <ToolButton
        icon={TriangleRight}
        label="Angle (A)"
        isActive={activeTool === "Angle"}
        onClick={() => onToolChange("Angle")}
        disabled={!hasImage}
      />
      <ToolButton
        icon={Circle}
        label="Elliptical ROI (E)"
        isActive={activeTool === "EllipticalROI"}
        onClick={() => onToolChange("EllipticalROI")}
        disabled={!hasImage}
      />
      <ToolButton
        icon={ArrowUpRight}
        label="Arrow Annotate (N)"
        isActive={activeTool === "ArrowAnnotate"}
        onClick={() => onToolChange("ArrowAnnotate")}
        disabled={!hasImage}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* W/L Presets */}
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs px-2" disabled={!hasImage}>
            <MousePointer2 className="size-3.5" />
            Presets
          </Button>
        } />
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Window/Level Presets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {WL_PRESETS.map((preset) => (
              <DropdownMenuItem key={preset.name} onClick={() => onApplyPreset(preset)}>
                {preset.name}
                <span className="ml-auto text-xs text-muted-foreground">
                  C:{preset.windowCenter} W:{preset.windowWidth}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Viewport Controls */}
      <ToolButton
        icon={Contrast}
        label={isInverted ? "Un-invert (I)" : "Invert (I)"}
        isActive={isInverted}
        onClick={onInvert}
        disabled={!hasImage}
      />
      <ToolButton
        icon={RotateCcw}
        label="Rotate Left"
        onClick={() => onRotate("ccw")}
        disabled={!hasImage}
      />
      <ToolButton
        icon={RotateCw}
        label="Rotate Right"
        onClick={() => onRotate("cw")}
        disabled={!hasImage}
      />
      <ToolButton
        icon={FlipHorizontal}
        label="Flip Horizontal"
        onClick={() => onFlip("h")}
        disabled={!hasImage}
      />
      <ToolButton
        icon={FlipVertical}
        label="Flip Vertical"
        onClick={() => onFlip("v")}
        disabled={!hasImage}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      <ToolButton
        icon={RefreshCw}
        label="Reset View (R)"
        onClick={onReset}
        disabled={!hasImage}
      />
    </div>
  );
}
