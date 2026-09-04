import { useEffect, useState } from "react";
import { login } from '../api/authApi.js'
import {hasAccessToken} from "../api/authStorage.js";

// 편의상 로그인 무력화
const isDevAutologinEnabled =
    import.meta.env.DEV &&
    import.meta.env.VITE_DEV_AUTO_LOGIN === 'true'

// 자동로그인 처리용 const
export default function useDevAutoLogin(
    setIsAuthenticated,
) {
    const [isAuthInitializing, setIsAuthInitializing,]
        = useState(
        () =>
            isDevAutologinEnabled &&
            Boolean(import.meta.env.VITE_DEV_EMAIL,) &&
            Boolean(import.meta.env.VITE_DEV_PASSWORD) &&
            !hasAccessToken(),
    )

// 자동로그인 관련 절차 진행(파일 없으면 꺼져)
    useEffect(() => {
        if (
            !isDevAutologinEnabled || hasAccessToken()
        ) {
            return
        }

        const email = import.meta.env.VITE_DEV_EMAIL
        const password = import.meta.env.VITE_DEV_PASSWORD

        if (!email || !password) {
            console.error(
                '개발용 자동 로그인 정보가 없습니다.',
            )
            return
        }

        let isCancelled = false

        async function performDevAutoLogin() {
            try {
                await login(email, password)

                if (!isCancelled) {
                    setIsAuthenticated(true)
                }
            } catch (error) {
                console.error(
                    '개발용 자동 로그인에 실패했습니다.',
                    error,
                )
            } finally {
                if (!isCancelled) {
                    setIsAuthInitializing(false)
                }
            }
        }

        performDevAutoLogin()

        return () => {
            isCancelled = true
        }
    }, [setIsAuthenticated])
    return isAuthInitializing
}