"use client";

import * as cornerstoneCore from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import * as cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";

let initialized = false;

export async function initCornerstone(): Promise<void> {
  if (initialized) return;

  await cornerstoneCore.init();

  cornerstoneDICOMImageLoader.init({
    maxWebWorkers: Math.max(navigator.hardwareConcurrency - 1, 1),
  });

  cornerstoneTools.init();

  initialized = true;
}

export { cornerstoneCore, cornerstoneTools, cornerstoneDICOMImageLoader };
