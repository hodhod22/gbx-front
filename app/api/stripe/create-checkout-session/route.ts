// app/api/stripe/create-checkout-session/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const authHeader = req.headers.get("authorization");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/stripe/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(body),
    },
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
