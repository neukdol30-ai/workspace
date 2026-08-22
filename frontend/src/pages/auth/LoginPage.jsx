import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/authApi.js'
import './LoginPage.css'

function LoginPage({ onLoginSuccess }) {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] =
        useState('')
    const [errorMessage, setErrorMessage] =
        useState('')
    const [isSubmitting, setIsSubmitting] =
        useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        if (isSubmitting) {
            return
        }

        setErrorMessage('')
        setIsSubmitting(true)

        try {
            const loginResponse =
                await login(email, password)

            onLoginSuccess(loginResponse)

            navigate('/', {
                replace: true,
            })
        } catch (error) {
            setErrorMessage(
                error.message ||
                '로그인에 실패했습니다.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section
            className="login-page"
            aria-label="Workspace login"
        >
            <div className="login-panel">
                <header className="login-panel-header">
                    <span>AUTHORIZATION</span>
                    <span>WS / 01</span>
                </header>

                <div className="login-panel-title">
                    <span>PERSONAL</span>
                    <h1>WORKSPACE</h1>
                    <p>
                        IDENTIFICATION REQUIRED
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <label className="login-field">
                        <span>EMAIL</span>

                        <input
                            type="email"
                            value={email}
                            autoComplete="email"
                            placeholder="dev@workspace.local"
                            required
                            onChange={(event) =>
                                setEmail(
                                    event.target.value,
                                )
                            }
                        />
                    </label>

                    <label className="login-field">
                        <span>PASSWORD</span>

                        <input
                            type="password"
                            value={password}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            required
                            onChange={(event) =>
                                setPassword(
                                    event.target.value,
                                )
                            }
                        />
                    </label>

                    <div
                        className="login-message"
                        aria-live="polite"
                    >
                        {errorMessage}
                    </div>

                    <button
                        className="login-submit"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        <span>
                            {isSubmitting
                                ? 'AUTHENTICATING'
                                : 'LOGIN'}
                        </span>

                        <span aria-hidden="true">
                            →
                        </span>
                    </button>
                </form>

                <footer className="login-panel-footer">
                    <span>SECURE CONNECTION</span>
                    <span>JWT / HS256</span>
                </footer>
            </div>
        </section>
    )
}

export default LoginPage