export const isHomePage = (path: string) => {
    return ['/welcome', '/welcome-with-services'].includes(path)
}

export const isConnectivityIssuesPage = (path: string) => {
    return ['/connectivity-issues'].includes(path)
}
