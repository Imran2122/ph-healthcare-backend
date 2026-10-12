import z from "zod";

const createSpecialityZodSchema = z.object({
  title: z.string("title is required"),
  description: z.string("Description is reqiuired").optional(),
});

export const SpecialtyValidation = {
  createSpecialityZodSchema,
};
