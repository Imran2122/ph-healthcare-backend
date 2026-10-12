import { Doctor, Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interface/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/queryBuilders";
import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchAbleFields,
} from "./doctor.constant";
import { IUpdateDoctorPayload } from "./doctor.interface";

// const getAllDoctor = async (query : IQueryParams) => {
   
//     const queryBuilder = new QueryBuilder<Doctor, Prisma.DoctorWhereInput, Prisma.DoctorInclude>(
//         prisma.doctor,
//         query,
//         {
//             searchableFields: doctorSearchAbleFields,
//             filterrableFields: doctorFilterableFields,
//         }
//     )

//     const result = await queryBuilder
//         .search()
//         .filter()
//         .where({
//             isDeleted: false,
//         })
//         .include({
//             user: true,
//             //  specialties: true,
//             specialties: {
//                 include:{
//                     specialty: true
//                 }
//             },
//         })
//         .dynamicInclude(doctorIncludeConfig)
//         .paginate()
//         .sort()
//         .fields()
//         .execute();

//         console.log(result);
//     return result;
// }

// const getAllDoctor = async (query: IQueryParams) => {
//   const result = await prisma.doctor.findMany({
//     where: {
//       isDeleted: false,
//     },
//     include: {
//       user: true,
//       specialties: {
//         include: {
//           specialty: true,
//         },
//       },
//     },
//   });

//   console.log(JSON.stringify(result, null, 2));

//   return {
//     data: result,
//     meta: {
//       page: 1,
//       limit: result.length,
//       total: result.length,
//       totalPages: 1,
//     },
//   };
// };
const getAllDoctor = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Doctor,
    Prisma.DoctorWhereInput,
    Prisma.DoctorInclude
  >(
    prisma.doctor,
    query,
    {
      searchableFields: doctorSearchAbleFields,
      filterrableFields: doctorFilterableFields,
    }
  );

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false,
    })
    .include({
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    })
    .paginate()
    .sort()
    .execute();

  console.log(result);

  return result;
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
