import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ user: user || null });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}

const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

// Updates the signed-in user's own profile. The user is taken from the session
// cookie only — the body cannot choose which account is changed, and email is
// not editable here.
export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = profileUpdateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("auth/me PATCH:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
