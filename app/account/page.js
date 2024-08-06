import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { getGuest } from "../_lib/data-service";

export const metadata = {
    title: 'Guest area'
}

export default async function Page() {
    const session = await getServerSession(authOptions);
    // const guests = await getGuest(session.user.email)


    const firstname = session.user.name.split(' ').at(0)
    return (
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
            Welcome, {firstname}
        </h2>
    )
}