import { title } from "node:process";
import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload: Specialty): Promise<Specialty> => {
  const specialty = await prisma.specialty.create({
    data: payload,
  });

  return specialty;
};

// 
const getAllSpeciality = async () => {
  const speciality = await prisma.specialty.findMany();
  return speciality;
};

const deleteAllSpeciality = async (id: string): Promise<Specialty> => {
  const speciality = await prisma.specialty.delete({
    where: { id },
  });

  return speciality;
};

// update
const updateSpeciality = async (
  id: string,
  payload: Partial<Specialty>,
): Promise<Specialty> => {
  const speciality = await prisma.specialty.update({
    where: {
      id,
    },
    data: payload,
  });

  return speciality;
};

export const specialtyService = {
  createSpeciality,
  getAllSpeciality,
  deleteAllSpeciality,
  updateSpeciality,
};
