import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Here you can store/check the user in DB
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.email === "admin@gmail.com" ? "admin" : "user"; // example
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  session: {
    strategy: "jwt", // you can use 'database' if storing sessions in DB
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
