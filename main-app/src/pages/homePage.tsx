import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Welcome from '@/components/templates/welcome/welcomeTemplate'
import { POSService } from '@/services/posService'

function HomePage() {
    const navigate = useNavigate()

    useEffect(() => {
        const createSession = async () => {
            try {
                console.log('Attempting to create session...')
                await POSService.createSession()
                console.log(
                    '✅ Session created successfully - redirecting to welcome'
                )
                navigate('/welcome')
            } catch (error) {
                console.error(
                    'Failed to create session, redirecting to registration:',
                    error
                )
                navigate('/register')
            }
        }

        // Always try to create session on home page load
        createSession()
    }, [navigate])

    return <Welcome navigate={navigate} />
}

export default HomePage
