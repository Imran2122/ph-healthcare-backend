import { deleteImageFromCLoudinary } from "../../../config/cloudinary.config";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
  IUpdatePatientHealthDataPayload,
  IUpdatePatientProfilePayload,
} from "./patainet.interface";
import { convertToDateTime } from "./patient.utils";


const updateMyProfile = async (
  user: IRequestUser,
  payload: IUpdatePatientProfilePayload,
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    include: {
      healthData: true,
      medicalReports: true,
    },
  });

  const cloudinaryLinksToDelete: string[] = [];

  await prisma.$transaction(async (tx) => {
    // Update patient information
    if (payload.patientInfo) {
      const patientInfo = payload.patientInfo;

      await tx.patient.update({
        where: {
          id: patientData.id,
        },
        data: {
          ...patientInfo,
        },
      });

      if (
        patientInfo.name !== undefined ||
        patientInfo.profilePhoto !== undefined
      ) {
        await tx.user.update({
          where: {
            id: patientData.userId,
          },
          data: {
            ...(patientInfo.name !== undefined && {
              name: patientInfo.name,
            }),
            ...(patientInfo.profilePhoto !== undefined && {
              image: patientInfo.profilePhoto,
            }),
          },
        });
      }
    }

    // Update patient health data
    if (payload.patienthealthData) {
      const healthDataToSave: IUpdatePatientHealthDataPayload = {
        ...payload.patienthealthData,
      };

      if (payload.patienthealthData.dateOfBirth) {
        const dateOfBirth = convertToDateTime(
          String(payload.patienthealthData.dateOfBirth),
        );

        if (!dateOfBirth) {
          throw new Error("Invalid dateOfBirth");
        }

        healthDataToSave.dateOfBirth = dateOfBirth;
      }

      await tx.patientHealthData.upsert({
        where: {
          patientId: patientData.id,
        },
        update: healthDataToSave,
        create: {
          patientId: patientData.id,
          ...healthDataToSave,
        },
      });
    }

    // Create or delete medical reports
    for (const report of payload.medicaleReports ?? []) {
      if (report.shouldDeleted && report.reportId) {
        const existingReport = await tx.medicalReport.findFirst({
          where: {
            id: report.reportId,
            patientId: patientData.id,
          },
        });

        if (existingReport) {
          await tx.medicalReport.delete({
            where: {
              id: existingReport.id,
            },
          });

          if (existingReport.reportLink) {
            cloudinaryLinksToDelete.push(existingReport.reportLink);
          }
        }
      } else if (report.reportName && report.reportLink) {
        await tx.medicalReport.create({
          data: {
            patientId: patientData.id,
            reportName: report.reportName,
            reportLink: report.reportLink,
          },
        });
      }
    }
  });

  // Delete Cloudinary files only after the database transaction succeeds
  for (const link of cloudinaryLinksToDelete) {
    try {
      await deleteImageFromCLoudinary(link);
    } catch (error) {
      console.error("Failed to delete medical report from Cloudinary:", error);
    }
  }

  // Return updated profile
  return prisma.patient.findUnique({
    where: {
      id: patientData.id,
    },
    include: {
      user: true,
      healthData: true,
      medicalReports: true,
    },
  });
};

export const PatientService = {
  updateMyProfile,
};
