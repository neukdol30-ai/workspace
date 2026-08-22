import {
    clearAccessToken,
    setAccessToken,
} from './authStorage.js'

export async function login(
    email,
    password,
) {
    const response = await fetch(
        '/api/auth/login',
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        },
    )

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(
                '이메일 또는 비밀번호가 올바르지 않습니다.',
            )
        }

        throw new Error(
            `로그인 실패: ${response.status}`,
        )
    }

    const loginResponse =
        await response.json()

    if (!loginResponse.accessToken) {
        throw new Error(
            '로그인 응답에 토큰이 없습니다.',
        )
    }

    setAccessToken(
        loginResponse.accessToken,
    )

    return loginResponse
}

export function logout() {
    clearAccessToken()
}