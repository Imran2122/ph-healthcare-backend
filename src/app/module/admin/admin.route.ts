import { Router } from "express";
import { checkAuth } from "../../middleware/chackAuth";
import { Role } from "../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateAdminZodSchema } from "./admin.validation";
const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPPER_ADMIN),
  AdminController.getAllAdmin,
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPPER_ADMIN),
  AdminController.getAllAdminByID,
);
router.patch(
  "/:id",
  checkAuth(Role.SUPPER_ADMIN),
  validateRequest(updateAdminZodSchema),
  AdminController.updateAdmin,
);
router.delete(
  "/:id",
  checkAuth(Role.SUPPER_ADMIN),
  AdminController.deletaAdmin,
);

export const AdminRoutes = router;
