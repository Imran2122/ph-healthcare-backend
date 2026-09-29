import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { AuthService, IRegisterPatientPayload } from "./auth.service";
import { sendResnponse } from "../../../shared/sendResponse";
import { auth } from "../../lib/auth";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  console.log(payload);
  const result = await AuthService.registerPatient(payload);

  console.log(payload);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);
  console.log(result);
  sendResnponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Patient create successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  console.log(payload);
  const result = await AuthService.loginUser(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Patient Login successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});
// const getMe = catchAsync(async (req: Request, res: Response) => {
//   const user = req.user;

//   const result = await AuthService.getMe(user);

//   sendResnponse(res, {
//     httpStatusCode: status.OK,
//     success: true,
//     message: "Patient Login successfully",
//     data: result,
//   });
// });

const getMe = catchAsync(async (req: Request, res: Response) => {
  console.log("REQ USER:", req.user);

  const user = req.user;

  const result = await AuthService.getMe(user);

  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User information retrieved successfully",
    data: result,
  });
});
export const AuthController = {
  registerPatient,
  loginUser,
  getMe,
};

// src\app\module\specialty\specialty.server.ts
//src\app\module\specialty\auth
