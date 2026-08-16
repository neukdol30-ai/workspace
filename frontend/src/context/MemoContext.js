import { createContext, useContext } from 'react'

const MemoContext = createContext(null)

export function useMemoContext() {
    const context = useContext(MemoContext)

    if (!context) {
        throw new Error(
            'useMemoContext must be used inside MemoProvider'
        )
    }
    return context
}

export default MemoContext