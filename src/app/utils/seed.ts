// import { envVars } from "../../config/env";
// import { Role } from "../../generated/prisma/enums";
// import { auth } from "../lib/auth";
// import { prisma } from "../lib/prisma";

// export const seedSupperAdmin = async () => {
//   try {
//     const isSupperAdminExist = await prisma.user.findFirst({
//       where: {
//         role: Role.SUPPER_ADMIN,
//       },
//     });

//     if (isSupperAdminExist) {
//       console.log("supper admin already exist .skipping the supper asmin");

//       return;
//     }

//     const supperAdminUser = await auth.api.signUpEmail({
//       body: {
//         email: envVars.SUPPER_ADMIN_EMAIL,
//         password: "",
//         name: "Supper_Admin",
//         role: Role.SUPPER_ADMIN,
//         needPasswordChange: false,
//         rememberMe: false,
//       },
//     });

//     const result = await prisma.$transaction(async (tx) => {
//       await tx.user.update({
//         where: {
//           id: supperAdminUser.user.id,
//         },
//         data: {
//           emailVerified: true,
//         },
//       });

//       const adminData = await tx.admin.create({
//         data: {
//           userId: supperAdminUser.user.id,
//           name: "Supper Admin",
//           email: envVars.SUPPER_ADMIN_EMAIL,
//         },
//       });
//     });
//     const supperAdmin = await prisma.admin.findUnique({
//       where: {
//         email: envVars.SUPPER_ADMIN_EMAIL,
//       },
//       include: {
//         user: true,
//       },
//     });
//     console.log("supper admin created", supperAdmin);
//   } catch (error) {
//     console.error("Error seetind Asmin", error);

//     await prisma.user.delete({
//       where: {
//         email: envVars.SUPPER_ADMIN_EMAIL,
//       },
//     });
//   }
// };



import { envVars } from "../../config/env";
import { Role } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedSupperAdmin = async () => {
  try {
    // 1. Check whether the super admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: Role.SUPPER_ADMIN,
      },
    });

    if (existingAdmin) {
      console.log("Super admin already exists. Skipping seed.");
      return;
    }

    // 2. Create the user through Better Auth
    const supperAdminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.SUPPER_ADMIN_EMAIL,
        password: envVars.SUPPER_ADMIN_PASSWORD,
        name: "Super Admin",
        role: Role.SUPPER_ADMIN,
        needPasswordChange: false,
        rememberMe: false,
      },
    });

    // 3. Update the user and create the admin profile
    const supperAdmin = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: supperAdminUser.user.id,
        },
        data: {
          emailVerified: true,
        },
      });

      const adminData = await tx.admin.create({
        data: {
          userId: supperAdminUser.user.id,
          name: "Super Admin",
          email: envVars.SUPPER_ADMIN_EMAIL,
        },
      });

      return adminData;
    });

    console.log("Super admin created successfully:", supperAdmin);
  } catch (error) {
    console.error("Error creating super admin:", error);
  }
};
