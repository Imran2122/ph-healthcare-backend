import { NextFunction, Request, Response, Router } from "express";
import { DoctorController } from "./doctor.controller";


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
