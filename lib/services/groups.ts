import { prisma } from "@/lib/prisma";
import { redis } from "../redis";
import { Prisma } from "@prisma/client";

type UserGroups = Prisma.GroupGetPayload<{
  include: {
    _count: {
      select: {
        members: true;
      };
    };
  };
}>[];

export async function getUserGroups(userId: string): Promise<UserGroups> {

  const cacheKey = `groups:${userId}`
  const cachedGroups: UserGroups | null = await redis.get<UserGroups>(cacheKey);

  if (cachedGroups !== null) {
    return cachedGroups;
  }

  const groups = await prisma.group.findMany({
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

  await redis.set(cacheKey, groups, { ex: 300 });

  return groups;
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

export async function getGroupBalances(groupId: string, userId: string) {
  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId
      }
    }
  })

  if (!membership) {
    throw new Error("You do not have access to this group")
  }

  const members = await prisma.groupMember.findMany({
    where: {
      groupId
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        }
      }
    }
  })

  const expenses = await prisma.expense.findMany({
    where: {
      groupId
    },
    include: {
      paidBy: {
        select: {
          id: true,
          username: true,
        }
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const balances: Record<
    string,
    {
      userId: string;
      username: string;
      balance: number;
    }
  > = {};

  // Initialize all members with 0 balance
  for (const member of members) {
    balances[member.user.id] = {
      userId: member.user.id,
      username: member.user.username,
      balance: 0,
    };
  }

  // Calculate balances
  for (const expense of expenses) {
    if (expense.participants.length === 0) {
      continue;
    }

    const share =
      expense.amount / expense.participants.length;

    // Payer gets credited
    balances[expense.paidBy.id].balance +=
      expense.amount;

    // Participants owe their share
    for (const participant of expense.participants) {
      balances[participant.user.id].balance -=
        share;
    }
  }

  return Object.values(balances)
    .map((user) => ({
      ...user,
      balance: Number(user.balance.toFixed(2)),
    }))
    .sort((a, b) => b.balance - a.balance);

}

export async function getGroupSettlements(groupId: string, userId: string) {

  const balances = await getGroupBalances(groupId, userId);

  const creditors = balances
    .filter((user) => user.balance > 0)
    .map((user) => ({ ...user }));

  const debtors = balances
    .filter((user) => user.balance < 0)
    .map((user) => ({ ...user }));

  const settlements: {
    fromUserId: string;
    from: string;
    toUserId: string;
    to: string;
    amount: number;
  }[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(
      Math.abs(debtor.balance),
      creditor.balance
    );

    settlements.push({
      fromUserId: debtor.userId,
      from: debtor.username,
      toUserId: creditor.userId,
      to: creditor.username,
      amount: Number(amount.toFixed(2)),
    });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (Math.abs(debtor.balance) < 0.01) {
      i++;
    }

    if (Math.abs(creditor.balance) < 0.01) {
      j++;
    }
  }

  return settlements;
}

export async function getGroupByInviteCode(
  inviteCode: string
) {
  return prisma.group.findUnique({
    where: {
      inviteCode,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
}