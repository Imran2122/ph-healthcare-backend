import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { scheduleRoutes } from "../module/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../module/doctorschedule/doctorSchedule.route";

const router = Router();
router.use("/auth", AuthRoutes);
router.use("/sepcialties", SpecialtyRoutes);
router.use("/users", UserRoutes);
router.use("/doctors",DoctorRoutes );
router.use("/admin",AdminRoutes)
router.use("/schedules", scheduleRoutes)
router.use("/doctor-schedules", DoctorScheduleRoutes)
// router.use("/appointments", AppointmentRoutes)


export const IndexRoutes = router;
