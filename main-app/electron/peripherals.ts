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
    return data
}

export async function executeActivate(jwt: string): Promise<apiResponse> {
    const response = await fetch(`${baseUrl}${apiRoutes.activate}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: jwt })
    })
    const data = await response.json()
    return data
}

export async function executeDeactivate(): Promise<apiResponse> {
    const response = await fetch(`${baseUrl}${apiRoutes.deactivate}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data
}
