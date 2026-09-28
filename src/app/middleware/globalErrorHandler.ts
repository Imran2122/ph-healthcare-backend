import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import { error } from "console";
import status from "http-status/cloudflare";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";
import { handleZodeError } from "../errorHelpers/handleZoodError";
import AppError from "../errorHelpers/AppError";

export const golbalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Golbal Error Hasndler", error);
  }

  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "internal Server error ";
  let stack: string | undefined = undefined;

  if (error instanceof z.ZodError) {
    const simplifiedError = handleZodeError(error);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
  } else if (error instanceof AppError) {
    statusCode: error.statusCode;
    message: error.message;
    stack: error.stack;
    errorSources = [
      {
        path: "",
        message: error.message,
      },
    ];
  } else if (error instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message: error.message;
    stack: error.stack;
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSourse: errorSources,
    stack: envVars.NODE_ENV === "development" ? stack : undefined,
    error: envVars.NODE_ENV === "development" ? error : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
