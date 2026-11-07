import { BloodGroup, Gender } from "../../../generated/prisma/enums";

export interface IUpdatePatientInfoPayload {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
}

export interface IUpdatePatientHealthDataPayload {
  gender: Gender;
  dateOfBirth: Date;
  bloodGroup: BloodGroup;
  hasAllergies: boolean;
  hasDiabetes: boolean;
  height: string;
  weight: string;
  smokingStatus: boolean;
  dietaryPreferences?: string | null;
  pregnancyStatus: boolean;
  mentalHealthHistory?: string;
  immunizationStatus?: string;
  hasPastSurgeries: boolean;
  recentAnxiety: boolean;
  recentDepression: boolean;
  maritalStatus?: string;
}

export interface IupdateMedicaleReportPayload {
  reportName?: string;
  reportLink?: string;
  shouldDeleted?: boolean;
  reportId?: string;
}

export interface IUpdatePatientProfilePayload {
  patientInfo?: IUpdatePatientInfoPayload;
  patienthealthData?: IUpdatePatientHealthDataPayload;
  medicaleReports: IupdateMedicaleReportPayload[];
}
