export async function apiTimeOut<T>(
    fetchRequest: Promise<T>,
    timeoutSeconds: number
): Promise<T | false> {
    const controller = new AbortController()
    
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
            controller.abort()
            reject(new Error('Request timed out'))
        }, timeoutSeconds * 1000)
    })

    try {
        const response = await Promise.race([fetchRequest, timeoutPromise])
        return response
    } catch (error) {
        if (error instanceof Error && error.message === 'Request timed out') {
            return false
        }
        throw error
    }
}
