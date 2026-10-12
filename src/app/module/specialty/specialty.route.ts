import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/chackAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialtyValidation } from "./speciality.validation";

const router = Router();

router.post(
  "/",
  // checkAuth(Role.ADMIN, Role.SUPPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(SpecialtyValidation.createSpecialityZodSchema),
  SpecialtyController.createSpeciality,
);
router.get(
  "/",

  SpecialtyController.getAllSpeciality,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPPER_ADMIN),
  SpecialtyController.deleteAllSpeciality,
);

// wrap all the router
export const SpecialtyRoutes = router;
