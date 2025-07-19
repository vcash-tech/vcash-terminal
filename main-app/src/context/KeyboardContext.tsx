import { createContext, ReactNode, useContext, useState } from 'react'

type KeyboardContextType = {
    isKeyboardVisible: boolean
    setKeyboardVisible: (visible: boolean) => void
}

// Create a default context value with a no-op function
const defaultContextValue: KeyboardContextType = {
    isKeyboardVisible: false,
    setKeyboardVisible: () => {}
}

// eslint-disable-next-line react-refresh/only-export-components
export const KeyboardContext =
    createContext<KeyboardContextType>(defaultContextValue)

// eslint-disable-next-line react-refresh/only-export-components
export function useKeyboard() {
    const context = useContext(KeyboardContext)
    if (context === undefined) {
        throw new Error('useKeyboard must be used within a KeyboardProvider')
    }
    return context
}

export function KeyboardProvider({ children }: { children: ReactNode }) {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false)

    return (
        <KeyboardContext.Provider
            value={{ isKeyboardVisible, setKeyboardVisible }}>
            {children}
        </KeyboardContext.Provider>
    )
}
