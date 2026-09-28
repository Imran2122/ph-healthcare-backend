import z from "zod";

export const updateDoctorZodSchema = z
  .object({
    name: z.string(),
    profilePhoto: z.string(),
    contactNumber: z.string(),
    address: z.string(),
    registrationNumber: z.string(),
    experience: z.number().int().min(0),
    appointmentFee: z.number().min(0),
    qualification: z.string(),
    currentWorkingPlace: z.string(),
    designation: z.string(),
  })
  .partial();