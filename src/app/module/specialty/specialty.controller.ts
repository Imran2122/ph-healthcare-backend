import { NextFunction, Request, RequestHandler, Response } from "express";
import { specialtyService } from "./specialty.server";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResnponse } from "../../../shared/sendResponse";

// catch function

// create speciality
const createSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await specialtyService.createSpeciality(payload);

  sendResnponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "create successfully",
    data: result,
  });
});

// getAllSpeciality

const getAllSpeciality = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtyService.getAllSpeciality();
  sendResnponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "getAllSpeciality successfully",
    data: result,
  });
});

// delete

const deleteAllSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtyService.deleteAllSpeciality(id as string);
   sendResnponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "deletesuccessfully",
    data: result,
  });
});

// updateSpeciality
const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await specialtyService.updateSpeciality(id as string, payload);

  sendResnponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "updateSpeciality successfully",
    data: result,
  });
});
export const SpecialtyController = {
  createSpeciality,
  getAllSpeciality,
  deleteAllSpeciality,
  updateSpeciality,
};
