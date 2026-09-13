import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// NOTE (security): this endpoint changes a user's password given only their
// email — no proof of ownership is required. That's a deliberate, accepted
// trade-off for this project (avoids Supabase's auth-email rate limits
// during development) and must NOT be used as-is in a real production app,
// since anyone who knows a user's email can take over their account.
export async function POST(request: Request) {
  const { email, newPassword } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
  }
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json(
      { error: "Kata sandi minimal 6 karakter." },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  // The admin SDK has no "get user by email" call, so we page through users
  // and match by email. Fine at this app's scale; revisit if the user base
  // grows large enough for this to matter.
  let userId: string | null = null;
  let page = 1;
  const perPage = 1000;
  while (!userId) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const match = data.users.find((u) => u.email?.toLowerCase() === normalizedEmail);
    if (match) {
      userId = match.id;
      break;
    }
    if (data.users.length < perPage) break; // no more pages
    page += 1;
  }

  if (!userId) {
    return NextResponse.json(
      { error: "Email tidak terdaftar." },
      { status: 404 }
    );
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
