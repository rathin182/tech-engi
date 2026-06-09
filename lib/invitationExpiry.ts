// import { prisma } from "@/lib/prisma";

// const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

// export function startInvitationExpiryJob() {
//   setInterval(async () => {
//     try {
//       const twentyFourHoursAgo = new Date(
//         Date.now() - TWENTY_FOUR_HOURS
//       );

//       const result = await prisma.projectInvitation.updateMany({
//         where: {
//           status: "SENT",
//         },
//         data: {
//           status: "REJECTED",
//         },
//       });

//       console.log(
//         `[InvitationExpiry] ${result.count} invitations rejected`
//       );
//     } catch (error) {
//       console.error("[InvitationExpiry]", error);
//     }
//   }, TWENTY_FOUR_HOURS);
// }

import { prisma } from "@/lib/prisma";
import sendEmail from "@/lib/email";

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export function startInvitationExpiryJob() {
  setInterval(async () => {
    try {
      const twentyFourHoursAgo = new Date(
        Date.now() - TWENTY_FOUR_HOURS
      );

      const expiredInvitations = await prisma.projectInvitation.findMany({
        where: {
          status: "SENT",
        },
        include: {
          engineer: {
            include: {
              user: true,
            },
          },
        },
      });

      if (expiredInvitations.length === 0) return;

      // 1. Send emails
      await Promise.all(
        expiredInvitations.map(async (inv) => {
          const email = inv.engineer.user.email;
          const name = inv.engineer.user.name;

          if (!email) return;

          await sendEmail(
            email,
            "Project Invitation Rejected",
            `
              <h2>Hello ${name || "Engineer"},</h2>
              <p>Your project invitation has been automatically <b>rejected</b> because it was not accepted within 24 hours.</p>
              <p>If this is a mistake, please contact support.</p>
            `
          );
        })
      );

      // 2. Update status after emails
      await prisma.projectInvitation.updateMany({
        where: {
          id: {
            in: expiredInvitations.map((i) => i.id),
          },
        },
        data: {
          status: "REJECTED",
        },
      });

      console.log(
        `[InvitationExpiry] rejected + emailed ${expiredInvitations.length}`
      );
    } catch (error) {
      console.error("[InvitationExpiry]", error);
    }
  }, TWENTY_FOUR_HOURS);
}