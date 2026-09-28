import { NextFunction, Request, Response, Router } from "express";
import { DoctorController } from "./doctor.controller";
import z from "zod";
import { Gender } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get("/", DoctorController.getAllDoctor);
router.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>  
    DoctorController.getAllDoctorByID,
);

router.patch("/:id", DoctorController.updateDoctor);

// wrap all the router
export const DoctorRoutes = router;
