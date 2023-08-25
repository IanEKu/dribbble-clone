import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXT_AUTH_SECRET

export async function GET(req:NextRequest) {
    const token = await getToken({
        req: req,
        secret: secret,
        raw: true,
    });
    
    return NextResponse.json({ token }, { status: 200 });
}