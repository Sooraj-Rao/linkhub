import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.user.count();
    return new Response(`User count: ${count}`, { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(`Error: ${(e as Error).message}`, { status: 500 });
  }
}
