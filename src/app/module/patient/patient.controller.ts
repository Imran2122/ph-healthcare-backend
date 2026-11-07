import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { IRequestUser } from "../../interface/requestUser.interface";
import { PatientService } from "./patient.service";
import { sendResnponse } from "../../../shared/sendResponse";
import status from "http-status";

const updateMyProfile = catchAsync(async (req : Request, res : Response) =>{

    const user = req.user as IRequestUser;
    const payload = req.body;
 

    const result = await PatientService.updateMyProfile(user, payload);

    sendResnponse(res, {
        success: true,
        httpStatusCode : status.OK,
        message : "Profile updated successfully",
        data : result
    });
})

export const PatientController = {
    updateMyProfile
}