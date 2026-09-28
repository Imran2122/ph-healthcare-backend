import { error } from "console";
import status from "http-status";
import z, { success } from "zod";
import { TErrorSources } from "../interface/error.interface";

export const handleZodeError = (error: z.ZodError) => {
  const statusCode = status.BAD_REQUEST;
  const message = "Zod validation error";

  const errorSources: TErrorSources[]=[];

  error.issues.map((issue) => {
    errorSources.push({
      path: issue.path.join(" "),
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};
