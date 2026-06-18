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

export async function getGroup(
  groupId: string,
  userId: string
) {

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
  });

  if (!membership) {
    throw new Error("You do not have access to this group");
  }

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
          expenses: true,
        },
      },
    },
  });

  if (!group) {
    throw new Error("Group not found");
  }

  return group;
}

export async function getGroupExpenses(
  groupId: string,
  userId: string
) {
  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
  });

  if (!membership) {
    throw new Error("Forbidden");
  }

  return prisma.expense.findMany({
    where: {
      groupId,
    },
    include: {
      paidBy: {
        select: {
          id: true,
          username: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}