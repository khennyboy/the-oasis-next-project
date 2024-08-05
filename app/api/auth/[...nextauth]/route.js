import { createGuest, getGuest } from "@/app/_lib/data-service";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user }) {
            try {
                const existingGuest = await getGuest(user.email);
                if (!existingGuest) {
                    await createGuest({
                        email: user.email,
                        fullName: user.name,
                    });
                }
                return true;
            } catch (error) {
                console.error('Error during sign-in callback:', error);
                return false;
            }
        },
    },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
