import express, { Application, NextFunction, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { SpecialtyRoutes } from "./app/module/specialty/specialty.route";
import { IndexRoutes } from "./app/routes";
import { golbalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import qs from "qs"
const app: Application = express();
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/template`));
app.set("query parser",(str:string)=>qs.parse(str))
import cors from "cors";

import { envVars } from "./config/env";

app.use("/api/auth", toNodeHandler(auth));
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));


// Middleware to parse JSON bodies
app.use(express.json());
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

// IndexRoutes router a jabe ai khan theke different route banalam
app.use("/api/v1", IndexRoutes);

// Basic route
// Basic route
// app.get("/", async (req: Request, res: Response) => {
//   const specialty = await prisma.specialty.create({
//     data: {
//       title: "Cardiology",
//     },
//   });

//   return res.status(201).json({
//     success: true,
//     message: "API is working",
//     data: specialty,
//   });
// });

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "API is working",
  });
});
app.use(notFound);
app.use(golbalErrorHandler);

export default app;
