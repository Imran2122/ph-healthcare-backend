import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctor = async () => {
  const doctor = await prisma.doctor.findMany({
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return doctor;
};

const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return result;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const data = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return data;
};

// delete docotor

const deleteDoctor = async (id: string) => {
  const result = await prisma.doctor.delete({
    where: {
      id,
    },
  });
};

export const DoctorServises = {
  getAllDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
