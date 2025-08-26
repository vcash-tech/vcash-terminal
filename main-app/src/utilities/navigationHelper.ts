export const isHomePage = (path: string) => {
    return ['/welcome', '/welcome-with-services'].includes(path)
}