import { useState } from 'react'
import { Navigate, useLocation, useNavigate, Route, Routes } from 'react-router-dom'
import TopBar from './component/layout/TopBar.jsx'
import HomePage from './pages/HomePage.jsx'
import MemoLayout from './pages/memo/MemoLayout.jsx'
import ListMemoPage from './pages/memo/ListMemoPage.jsx'
import BoardMemoPage from './pages/memo/BoardMemoPage.jsx'

function App() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isMenuPinned, setIsMenuPinned] = useState(true)
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(true)
    const [memoSideMenuMode, setMemoSideMenuMode] = useState('local')

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
        <main className="workspace">
            <TopBar
                onHome={() => {
                    navigate('/')
                }}
                isMenuPinned={isMenuPinned}
                onMenuPinnedChange={setIsMenuPinned}
                sideMenuMode={sideMenuMode}
                onSideMenuModeChange={setMemoSideMenuMode}
                onMenuOpenChange={setIsSideMenuOpen}
            />

            <div
                className={`workspace-content ${
                    shouldMoveContent ? 'workspace-content--menu-pinned' : ''
                }`}
            >
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="*" element={<HomePage />} />
                    <Route
                        path="/memo"
                        element={
                            <MemoLayout
                                hideFolderList={shouldHideMemoFolders}
                            />
                        }
                    >
                        <Route index element={<Navigate to="list" replace />} />
                        <Route path="list" element={<ListMemoPage />} />
                        <Route path="board" element={<BoardMemoPage />} />
                    </Route>
                </Routes>
            </div>
        </main>
    )
}

export default App