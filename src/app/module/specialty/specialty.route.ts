import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/chackAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", checkAuth(Role.ADMIN, Role.SUPPER_ADMIN), SpecialtyController.createSpeciality);
router.get(
  "/",
 
  SpecialtyController.getAllSpeciality,
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPPER_ADMIN), SpecialtyController.deleteAllSpeciality);

// wrap all the router
export const SpecialtyRoutes = router;
