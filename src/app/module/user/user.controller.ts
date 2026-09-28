import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResnponse } from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserService.createDoctor(payload);

  sendResnponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "create successfully",
    data: result,
  });
});

export const UserController = {
  createDoctor,
};
