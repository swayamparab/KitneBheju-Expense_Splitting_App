import { prisma } from "@/lib/prisma";

export async function getUserGroups(userId: string) {
  return prisma.group.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
}