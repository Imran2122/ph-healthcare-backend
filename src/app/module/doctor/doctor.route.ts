import { NextFunction, Request, Response, Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/chackAuth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.get("/", DoctorController.getAllDoctor);
router.get(
  "/:id",checkAuth(Role.ADMIN,Role.SUPPER_ADMIN),
  (req: Request, res: Response, next: NextFunction) =>  
    DoctorController.getAllDoctorByID,
);

router.patch("/:id",
   checkAuth(Role.ADMIN, Role.SUPPER_ADMIN),
  DoctorController.updateDoctor);

// wrap all the router
export const DoctorRoutes = router;
