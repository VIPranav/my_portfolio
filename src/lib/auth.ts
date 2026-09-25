import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./db";
import { authConfig } from "./auth.config";
import { loginSchema } from "./validators";
import { clientIdentity, rateLimit } from "./rate-limit";
import { databaseConfigured } from "./config";
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(input, request) {
        const parsed = loginSchema.safeParse(input);
        if (
          !parsed.success ||
          !databaseConfigured() ||
          !process.env.AUTH_SECRET
        )
          return null;
        try {
          const identity = clientIdentity(request.headers);
          if (
            !(await rateLimit("login-ip", identity, 20, 900000)) ||
            !(await rateLimit("login-email", parsed.data.email, 5, 900000))
          )
            return null;
          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
          });
          const valid = await compare(
            parsed.data.password,
            user?.passwordHash ||
              "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW",
          );
          return user && valid
            ? { id: user.id, email: user.email, name: "Admin" }
            : null;
        } catch {
          return null;
        }
      },
    }),
  ],
});
export async function getAdmin() {
  if (!databaseConfigured() || !process.env.AUTH_SECRET) return null;
  const session = await auth();
  if (!session?.user?.id || "error" in session) return null;
  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true },
  });
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}
