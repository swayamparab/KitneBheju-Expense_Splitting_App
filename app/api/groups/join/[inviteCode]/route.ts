import { getOptionalUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { joinGroupRateLimit, redis } from "@/lib/redis";

//join a group through invite code
export async function POST(request: NextRequest,
    { params }: { params: Promise<{ inviteCode: string }> }
) {
    try {

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

        const { success } = await joinGroupRateLimit.limit(`kb:invite:${ip}`);

        if (!success) {
            return NextResponse.json({
                message: "Too many attempts"
            }, { status: 429 })
        }

        const user = await getOptionalUser();

        if (!user) {
            return NextResponse.json(
                {
                    message: "Please login first"
                },
                {
                    status: 401
                }
            );
        }

        const userId = user.id;

        const { inviteCode } = await params;

        const group = await prisma.group.findUnique({
            where: {
                inviteCode
            }
        })
        if (!group) {
            return NextResponse.json({
                message: "group not found"
            }, { status: 404 })
        }

        const existingMember = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId,
                    groupId: group.id
                }
            }
        })
        if (existingMember) {
            return NextResponse.json({
                message: "group already joined"
            }, { status: 400 })
        }

        await prisma.groupMember.create({
            data: {
                userId,
                groupId: group.id
            }
        })

        const members = await prisma.groupMember.findMany({
            where: {
                groupId: group.id,
            },
            select: {
                userId: true,
            },
        });

        await Promise.all(
            members.map((member) => redis.del(`groups:${member.userId}`))
        );

        return NextResponse.json({
            message: "joined group successfully"
        }, { status: 201 })

    }
    catch (err) {
        return NextResponse.json({
            message: "error joining group",
            err
        })
    }
}