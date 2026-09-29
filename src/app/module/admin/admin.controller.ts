import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResnponse } from "../../../shared/sendResponse";
import { AdminService } from "./admin.service";
import { Request, Response } from "express";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmins();
  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get All Admin successfully",
    data: result,
  });
});

// get docotor by id
const getAllAdminByID = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminService.getadminById(id as string);
  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get All Admin successfully",
    data: result,
  });
});

// get updatae
const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { payload } = req.body;

  const result = await AdminService.updateAdmin(id as string, payload);
  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin update successfully",
    data: result,
  });
});
// get deleteDoctor
const deletaAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.body;

  const result = await AdminService.deleteAdmin(id as string, user);
  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin delete successfully",
    data: result,
  });
});

export const AdminController = {
  getAllAdmin,
  updateAdmin,
  deletaAdmin,
  getAllAdminByID,
};
