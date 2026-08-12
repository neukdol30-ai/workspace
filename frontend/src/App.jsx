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
    const [sideMenuMode, setSideMenuMode] = useState('global')

    const shouldMoveContent =
        isMenuPinned && location.pathname.startsWith('/memo')

    return (
        <main className="workspace">
            <TopBar
                onHome={() => {
                    setSideMenuMode('global')
                    navigate('/')}}
                isMenuPinned={isMenuPinned}
                onMenuPinnedChange={setIsMenuPinned}
                sideMenuMode={sideMenuMode}
                onSideMenuModeChange={setSideMenuMode}
            />

            <div
                className={`workspace-content ${
                    shouldMoveContent ? 'workspace-content--menu-pinned' : ''
                }`}
            >
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="*" element={<HomePage />} />
                    <Route path="/memo" element={<MemoLayout />}>
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