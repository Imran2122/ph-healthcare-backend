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

export const AuthController = {
  registerPatient,
  loginUser,
};

// src\app\module\specialty\specialty.server.ts
//src\app\module\specialty\auth
