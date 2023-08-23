import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function GET(req:NextRequest) {
    const jwtEncodedToken: string | undefined = cookies().get("next-auth.session-token")?.value;

    return NextResponse.json({token: jwtEncodedToken}, {status: 200})
}