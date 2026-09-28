import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { DoctorServises } from "./doctor.service";
import { sendResnponse } from "../../../shared/sendResponse";
import status from "http-status";

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorServises.getAllDoctor();
  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get All Doctor successfully",
    data: result,
  });
});

// get docotor by id
const getAllDoctorByID = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServises.getDoctorById(id as string);
  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get All Doctor successfully",
    data: result,
  });
});

// get updatae
const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { payload } = req.body;

  const result = await DoctorServises.updateDoctor(id as string, payload);
  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Docotor update successfully",
    data: result,
  });
});
// get deleteDoctor
const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServises.deleteDoctor(id as string);
  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Docotor delete successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllDoctor,
  getAllDoctorByID,
  updateDoctor,
  deleteDoctor,
};
