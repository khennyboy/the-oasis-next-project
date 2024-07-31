'use client'

import { useState } from "react"

export const Counter = ({ user }) => {
    const [count, setCount] = useState(0)

    return (
        <>
            <p>There are {user.length} users</p>
            <button onClick={() => setCount(c => c + 1)}>{count}</button>
        </>
    )
}
