import { getServerSession } from "next-auth";

export const metadata = {
    title: 'Guest area'
}

export default async function Page() {
    const session = await getServerSession();

    const firstname = session.user.name.split(' ').at(0)
    return (
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
            Welcome, {firstname}
        </h2>
    )
}