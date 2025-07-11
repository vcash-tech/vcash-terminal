import { existsSync, mkdirSync, writeFileSync } from 'fs'
import * as path from 'path'

const baseUrl = 'http://localhost:3001'

const apiRoutes = {
    print: '/api/v1/printer/print-image',
    activate: '/api/v1/bill-acceptor/activate',
    deactivate: '/api/v1/bill-acceptor/deactivate'
}

export type apiResponse = {
    success: boolean
    message: string
    status: {
        iLogicCode: number
        iPhyCode: number
    }
}
export type activateApiResponse = {
    activated: boolean
    timer_seconds: number
    expires_at: string
}

export async function executePrint(base64: string): Promise<apiResponse> {
    const vCashPath = `C:\\VCash\\UI`

    // Ensure the VCash directory exists
    if (!existsSync(vCashPath)) {
        mkdirSync(vCashPath, { recursive: true })
    }

    writeFileSync(
        path.join(vCashPath, 'test.bmp'),
        Buffer.from(base64, 'base64')
    )
    writeFileSync(path.join(vCashPath, 'test.txt'), base64)

    const response = await fetch(`${baseUrl}${apiRoutes.print}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: 'data:image/bmp;base64,' + base64 })
    })
    const data = await response.json()
    return data as apiResponse
}

export async function executeActivate(
    jwt: string
): Promise<activateApiResponse> {
    const response = await fetch(`${baseUrl}${apiRoutes.activate}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: jwt })
    })
    const data = await response.json()
    return data as activateApiResponse
}

export async function executeDeactivate(): Promise<void> {
    const resp = await fetch(`${baseUrl}${apiRoutes.deactivate}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!resp.ok) {
        throw new Error('Failed to deactivate')
    }
}
