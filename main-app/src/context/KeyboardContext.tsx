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

const KeyboardContext = createContext<KeyboardContextType>(defaultContextValue)

export function KeyboardProvider({ children }: { children: ReactNode }) {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false)

    return (
        <KeyboardContext.Provider value={{ isKeyboardVisible, setKeyboardVisible }}>
            {children}
        </KeyboardContext.Provider>
    )
}

export function useKeyboard() {
    return useContext(KeyboardContext)
}
