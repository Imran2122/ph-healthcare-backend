import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),

  doctor: z.object({
    name: z
      .string("Name is required")
      .min(2, "Name must be at least 2 characters"),

    email: z.string("Email is required").email("Invalid email address"),

    profilePhoto: z.string().url("Invalid profile photo URL").optional(),

    contactNumber: z.string().optional(),

    address: z.string().optional(),

    registrationNumber: z.string("Registration number is required"),

    experience: z
      .int("Experience must be integer")
      .nonnegative("Experience cannot be negative")
      .optional(),

    gender: z.enum(
      [Gender.MALE, Gender.FEMALE],
      "Gender must be either Male or female",
    ),

    appointmentFee: z
      .number("Appointment fee is required")
      .nonnegative("Appointment fee cannot be negative"),

    qualification: z
      .string("Qualification is required")
      .min(2, "Qualification at lest 2 charester")
      .max(50, "qualification must be at most 50 charecter"),

    currentWorkingPlace: z
      .string("Current working place is required")
      .min(2, "currentWorkingPlace at lest 2 charester")
      .max(50, "currentWorkingPlace must be at most 50 charecter"),

    designation: z
      .string("Designation is required")
      .min(2, " designation at lest 2 charester")
      .max(50, " designation must be at most 50 charecter"),
  }),

  specialties: z
    .array(z.uuid(), "Specialties must be an array of UUID strings")
    .min(1, "At least one specialty is required"),
});
