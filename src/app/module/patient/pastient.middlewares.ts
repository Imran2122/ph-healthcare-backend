import { NextFunction, Request, Response } from "express";
import {
  IUpdatePatientInfoPayload,
  IUpdatePatientProfilePayload,
} from "./patainet.interface";

export const updateMyPatientProfileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }
  const payload: IUpdatePatientProfilePayload = req.body;

  const files = req.files as {
    [fieldName: string]: Express.Multer.File[] | undefined;
  };

  if (files?.profilePhoto?.[0]) {
    if (!payload.patientInfo) {
      payload.patientInfo = {} as IUpdatePatientInfoPayload;
    }
    payload.patientInfo.profilePhoto = files.profilePhoto[0].path;
  }

  if (files?.medicalReports && files?.medicalReports.length > 0) {
    const newReports = files.medicalReports.map((file) => ({
      reportName:
        file.originalname || `Medical Report - ${new Date().getTime()}`,
      reportLink: file.path,
    }));

    if (payload.medicaleReports && Array.isArray(payload.medicaleReports)) {
      payload.medicaleReports = [...payload.medicaleReports, ...newReports];
    } else {
      payload.medicaleReports = newReports;
    }
  }
  console.log(payload);

  req.body = payload;
  console.log(req.body);

  next();
};
