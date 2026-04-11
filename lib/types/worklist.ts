export interface WorklistCard {
  id: string; // Internal ID or Orthanc ID
  patientId: string;
  patientName: string;
  dob: string;
  gender: string;
  accessionNumber: string;
  modality: string;
  studyDate: string;
  studyTime?: string;
  description: string;
  status: "UNREPORTED" | "DRAFT" | "FINALIZED" | "ARCHIVED";
  priority: "ROUTINE" | "STAT" | "URGENT";
  institution?: string;
  instancesCount?: number;
}
