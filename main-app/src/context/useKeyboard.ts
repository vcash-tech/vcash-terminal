import { useContext } from 'react'

import { KeyboardContext } from './KeyboardContext'

export function useKeyboard() {
    return useContext(KeyboardContext)
}
