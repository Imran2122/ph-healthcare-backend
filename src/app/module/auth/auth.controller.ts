import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResnponse } from "../../../shared/sendResponse";
import { auth } from "../../lib/auth";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { CookieUtils } from "../../utils/cookie";
import { email } from "zod";
import { ota } from "zod/locales";
import { envVars } from "../../../config/env";
import { betterAuth } from "better-auth";

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
const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSession = req.cookies["better-auth.session_token"];

  console.log("refreshToken:", refreshToken);
  console.log("betterAuthSession:", betterAuthSession);

  if (!refreshToken) {
    throw new AppError(status.UNAUTHORIZED, "Refresh token missing");
  }
  const result = await AuthService.getNewToken(refreshToken, betterAuthSession);

  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "new token generate successfully",
    data: result,
  });
});
// change pass
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const betterAuthSessionToken = req.cookies["better-auth.session_token"];

  const result = await AuthService.changePassword(
    payload,
    betterAuthSessionToken,
  );

  const { accessToken, refreshToken, token } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "change password successfully",
    data: result,
  });
});
const logOut = catchAsync(async (req: Request, res: Response) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!betterAuthSessionToken) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Better Auth session token missing",
    );
  }
  const result = await AuthService.logOut(betterAuthSessionToken);

  CookieUtils.clearCookies(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookies(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookies(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "change password successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyEmail(email, otp);

  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "verifyEmailOTP successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.forgetPassword(email);

  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password reset oto sent to the email successfully",
    data: result,
  });
});

// forget password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  const result = await AuthService.resetPassword(email, otp, newPassword);

  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password successfully",
    data: result,
  });
});

// google login patient
const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = (req.query.redirect as string) || "/dashboard";

  const encodedRedirectPath = encodeURIComponent(redirectPath as string);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL: callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL,
  });
  // sendResnponse(res, {
  //   httpStatusCode: status.OK,
  //   success: true,
  //   message: "Password successfully",
  //   data:,
  // });
});
// const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
//   const redirectQuery = req.query.redirect;
//   const redirectPath =
//     typeof redirectQuery === "string" ? redirectQuery : "dashboard";
//   const sessionToken = req.cookies["better-auth.session_token"];

//   if (!sessionToken) {
//     return res.redirect(`${envVars.FRONTEND_URL}/login?=oauth_failed`);
//   }

//   const session = await auth.api.getSession({
//     headers: {
//       Cookie: `better-auth.session_token=${sessionToken}`,
//     },
//   });

//   if (!session) {
//     return res.redirect(`${envVars.FRONTEND_URL}/login?=no session found`);
//   }

//   if (session && !session.user) {
//     return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
//   }

//   const result = await AuthService.googleLoginSuccess(session);

//   const { accessToken, refreshToken } = result;

//   tokenUtils.setAccessTokenCookie(res, accessToken);
//   tokenUtils.setRefreshTokenCookie(res, refreshToken);

//   const isValidRedirectPath =
//     redirectPath.startsWith("/") && !redirectPath.startsWith("//");

//   const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
//   res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
//   sendResnponse(res, {
//     httpStatusCode: status.OK,
//     success: true,
//     message: "google login successfully",
//     data: {},
//   });
// });
const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
    const redirectPath = req.query.redirect as string || "/dashboard";

    const sessionToken = req.cookies["better-auth.session_token"];

    if(!sessionToken){
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const session = await auth.api.getSession({
        headers:{
            "Cookie" : `better-auth.session_token=${sessionToken}`
        }
    })

    if (!session) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
    }


    if(session && !session.user){
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
    }

    const result = await AuthService.googleLoginSuccess(session);

    const {accessToken, refreshToken} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
 // ?redirect=//profile -> /profile
    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

    res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
})

const handleOAuthError = catchAsync(async (req: Request, res: Response) => {
  const error = (req.query.error as string) || "oauth failed";

  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);

  sendResnponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Error",
    data: {},
  });
});

export const AuthController = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logOut,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLogin,
  googleLoginSuccess,
  handleOAuthError,
};

// src\app\module\specialty\specialty.server.ts
//src\app\module\specialty\auth
