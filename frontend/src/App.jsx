import {
    useEffect,
    useState,
} from 'react'
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import TopBar from './component/layout/TopBar.jsx'
import MemoProvider from './context/MemoProvider.jsx'
import { hasAccessToken } from './api/authStorage.js'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import MemoLayout from './pages/memo/MemoLayout.jsx'
import ListMemoPage from './pages/memo/ListMemoPage.jsx'
import BoardMemoPage from './pages/memo/BoardMemoPage.jsx'
import { logout } from './api/authApi.js'

function App() {
    const navigate = useNavigate()
    const location = useLocation()

    const [isAuthenticated, setIsAuthenticated] =
        useState(() => hasAccessToken())

    const [isMenuPinned, setIsMenuPinned] =
        useState(true)

    const [isSideMenuOpen, setIsSideMenuOpen] =
        useState(true)

    const [memoSideMenuMode, setMemoSideMenuMode] =
        useState('local')

    useEffect(() => {
        function handleUnauthorized() {
            setIsAuthenticated(false)

            navigate('/login', {
                replace: true,
            })
        }

        window.addEventListener(
            'workspace:unauthorized',
            handleUnauthorized,
        )

        return () => {
            window.removeEventListener(
                'workspace:unauthorized',
                handleUnauthorized,
            )
        }
    }, [navigate])

    function handleLoginSuccess() {
        setIsAuthenticated(true)
    }

    function handleLogout() {
        logout()
        setIsAuthenticated(false)

        navigate('/login', {
            replace: true,
        })
    }

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route
                    path="/login"
                    element={
                        <LoginPage
                            onLoginSuccess={
                                handleLoginSuccess
                            }
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
            </Routes>
        )
    }

    const isMemoRoute =
        location.pathname.startsWith('/memo')

    const sideMenuMode =
        isMemoRoute
            ? memoSideMenuMode
            : 'global'

    const shouldHideMemoFolders =
        isMemoRoute &&
        isSideMenuOpen &&
        sideMenuMode === 'local'

    const shouldMoveContent =
        isMenuPinned && isMemoRoute

    return (
        <MemoProvider>
            <main className="workspace">
                <TopBar
                    onHome={() => {
                        navigate('/')
                    }}
                    onLogout={handleLogout}
                    isMenuPinned={isMenuPinned}
                    onMenuPinnedChange={
                        setIsMenuPinned
                    }
                    sideMenuMode={sideMenuMode}
                    onSideMenuModeChange={
                        setMemoSideMenuMode
                    }
                    onMenuOpenChange={
                        setIsSideMenuOpen
                    }
                />

                <div
                    className={`workspace-content ${
                        shouldMoveContent
                            ? 'workspace-content--menu-pinned'
                            : ''
                    }`}
                >
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <Navigate
                                    to="/"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="/"
                            element={<HomePage />}
                        />

                        <Route
                            path="/memo"
                            element={
                                <MemoLayout
                                    hideFolderList={
                                        shouldHideMemoFolders
                                    }
                                />
                            }
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="list"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="list"
                                element={
                                    <ListMemoPage />
                                }
                            />

                            <Route
                                path="board"
                                element={
                                    <BoardMemoPage />
                                }
                            />
                        </Route>

                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to="/"
                                    replace
                                />
                            }
                        />
                    </Routes>
                </div>
            </main>
        </MemoProvider>
    )
}

export default App