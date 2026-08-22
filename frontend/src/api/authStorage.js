const ACCESS_TOKEN_KEY =
    'workspace.accessToken'

export function getAccessToken() {
    return sessionStorage.getItem(
        ACCESS_TOKEN_KEY,
    )
}

export function setAccessToken(accessToken) {
    sessionStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken,
    )
}

export function clearAccessToken() {
    sessionStorage.removeItem(
        ACCESS_TOKEN_KEY,
    )
}

export function hasAccessToken() {
    return getAccessToken() !== null
}