import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";

import { ScheduleController } from "./schedule.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { ScheduleValidation } from "./schedule.validation";
import { checkAuth } from "../../middleware/chackAuth";

const router = Router();

router.post('/', checkAuth(Role.ADMIN, Role.SUPPER_ADMIN), validateRequest(ScheduleValidation.createScheduleZodSchema) , ScheduleController.createSchedule);
router.get('/', checkAuth(Role.ADMIN, Role.SUPPER_ADMIN, Role.DOCTOR), ScheduleController.getAllSchedules);
router.get('/:id', checkAuth(Role.ADMIN, Role.SUPPER_ADMIN, Role.DOCTOR), ScheduleController.getScheduleById);
router.patch('/:id', checkAuth(Role.ADMIN, Role.SUPPER_ADMIN),validateRequest(ScheduleValidation.updateScheduleZodSchema), ScheduleController.updateSchedule);
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPPER_ADMIN), ScheduleController.deleteSchedule);

export const scheduleRoutes = router;