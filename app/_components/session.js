'use client'
import { SessionProvider } from 'next-auth/react'

export const Session = ({ children }) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
