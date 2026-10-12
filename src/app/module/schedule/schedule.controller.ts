import { Request, Response } from "express";
import status from "http-status";

import { ScheduleService } from "./schedule.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResnponse } from "../../../shared/sendResponse";
import { IQueryParams } from "../../interface/query.interface";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const schedule = await ScheduleService.createSchedule(payload);
  sendResnponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Schedule created successfully",
    data: schedule,
  });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await ScheduleService.getAllSchedules(query as IQueryParams);
  sendResnponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Schedules retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const schedule = await ScheduleService.getScheduleById(id as string);
  sendResnponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Schedule retrieved successfully",
    data: schedule,
  });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedSchedule = await ScheduleService.updateSchedule(
    id as string,
    payload,
  );
  sendResnponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Schedule updated successfully",
    data: updatedSchedule,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ScheduleService.deleteSchedule(id as string);
 sendResnponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Schedule deleted successfully",
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
