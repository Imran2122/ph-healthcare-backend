import express, { Application, NextFunction, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { SpecialtyRoutes } from "./app/module/specialty/specialty.route";
import { IndexRoutes } from "./app/routes";
import { golbalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cron from "node-cron";
import path from "path";
import qs from "qs";
const app: Application = express();
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/template`));
app.set("query parser", (str: string) => qs.parse(str));
import cors from "cors";

import { envVars } from "./config/env";
import { paymentController } from "./app/module/payment/payment.controller";
import { AppointmentService } from "./app/module/appointment/appointment.service";

app.use("/api/auth", toNodeHandler(auth));
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Stripe webhook body is Buffer:", Buffer.isBuffer(req.body));
    next();
  },
  paymentController.handleStripeWebHookEvent,
);

app.use(express.json());
// IndexRoutes router a jabe ai khan theke different route banalam
app.use("/api/v1", IndexRoutes);


cron.schedule("*/25 * * * *", async () => {
  try {
    console.log("Running cron job to cancel unpaid appointments");

    await AppointmentService.cancelUnpaidAppointments();
  } catch (error: any) {
    console.error(
      "Error occurred while cancelling unpaid appointments:",
      error.message,
    );
  }
});


app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "API is working",
  });
});
app.use(notFound);
app.use(golbalErrorHandler);

export default app;
