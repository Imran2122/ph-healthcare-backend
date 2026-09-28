import { Response } from "express";

interface IResponseData<T> {
  success: boolean;
  message: string;
  httpStatusCode: number;
  data?: T;
}

export const sendResnponse = <T>(
  res: Response,
  responseData: IResponseData<T>,
) => {
  const { httpStatusCode, success, message, data } = responseData;

  res.status(httpStatusCode).json({
    success,
    message,
    data,
  });
};
