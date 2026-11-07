import z from "zod";
import { BloodGroup, Gender } from "../../../generated/prisma/enums";

const booleanField = z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;

    return value;
  },
  z.boolean().optional(),
);

const updatePatientProfileZodSchema = z.object({
  patientInfo: z
    .object({
      name: z.string().min(1).max(100).optional(),

      profilePhoto: z.url().optional(),

      contactNumber: z.string().min(1).max(20).optional(),

      address: z.string().min(1).max(200).optional(),
    })
    .optional(),

  patienthealthData: z
    .object({
      gender: z.enum([Gender.FEMALE, Gender.MALE]).optional(),

      dateOfBirth: z
        .string()
        .refine(
          (date) => !Number.isNaN(Date.parse(date)),
          { message: "Invalid date format" },
        )
        .optional(),

      bloodGroup: z
        .enum([
          BloodGroup.A_POSITIVE,
          BloodGroup.A_NEGATIVE,
          BloodGroup.B_POSITIVE,
          BloodGroup.B_NEGATIVE,
          BloodGroup.AB_POSITIVE,
          BloodGroup.AB_NEGATIVE,
          BloodGroup.O_POSITIVE,
          BloodGroup.O_NEGATIVE,
        ])
        .optional(),

      hasAllergies: booleanField,

      hasDiabetes: booleanField,

      height: z.string().optional(),

      weight: z.string().optional(),

      smokingStatus: booleanField,

      // Match the Prisma field name
      dietaryPreferences: z.string().optional(),

      pregnancyStatus: booleanField,

      mentalHealthHistory: z.string().optional(),

      immunizationStatus: z.string().optional(),

      hasPastSurgeries: booleanField,

      recentAnxiety: booleanField,

      recentDepression: booleanField,

      maritalStatus: z.string().optional(),
    })
    .optional(),

  medicaleReports: z
    .array(
      z.object({
        shouldDeleted: booleanField,

        reportId: z.uuid().optional(),

        reportName: z.string().optional(),

        reportLink: z.url().optional(),
      }),
    )
    .optional()
    .refine(
      (reports) =>
        !reports ||
        reports.every((report) => {
          // Deleting a report requires its ID.
          if (report.shouldDeleted && !report.reportId) {
            return false;
          }

          // Report name and link must be provided together.
          if (
            Boolean(report.reportName) !==
            Boolean(report.reportLink)
          ) {
            return false;
          }

          return true;
        }),
      {
        message:
          "Deleting a report requires reportId. reportName and reportLink must be provided together.",
      },
    ),
});

export const PatientValidation = {
  updatePatientProfileZodSchema,
};

