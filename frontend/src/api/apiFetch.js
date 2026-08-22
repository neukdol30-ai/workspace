import {
    clearAccessToken,
    getAccessToken,
} from './authStorage.js'

export default async function apiFetch(
    resource,
    options = {},
) {
    const accessToken = getAccessToken()
    const headers = new Headers(options.headers)

    if (accessToken) {
        headers.set(
            'Authorization',
            `Bearer ${accessToken}`,
        )
    }

    const response = await fetch(resource, {
        ...options,
        headers,
    })

    if (
        response.status === 401 &&
        accessToken
    ) {
        clearAccessToken()

        window.dispatchEvent(
            new Event('workspace:unauthorized'),
        )
    }

    return response
}