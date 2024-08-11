import { createGuest, getGuest } from "@/app/_lib/data-service";
import Google from "next-auth/providers/google";

export const options = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                const existingGuest = await getGuest(user.email);

                if (!existingGuest)
                    await createGuest({ email: user.email, fullName: user.name });

                return true;
            } catch {
                return false;
            }
        },
        async session({ session, user }) {
            const guest = await getGuest(session.user.email);
            session.user.guestId = guest.id;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

