import { useState } from 'react'
import { Navigate, useLocation, useNavigate, Route, Routes } from 'react-router-dom'
import TopBar from './component/layout/TopBar.jsx'
import HomePage from './pages/HomePage.jsx'
import MemoPage from './pages/MemoPage.jsx'

function App() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isMenuPinned, setIsMenuPinned] = useState(true)

    const shouldMoveContent =
        isMenuPinned && location.pathname === '/memo'

    return (
        <main className="workspace">
            <TopBar
                onHome={() => navigate('/')}
                isMenuPinned={isMenuPinned}
                onMenuPinnedChange={setIsMenuPinned}
            />

            <div
                className={`workspace-content ${
                    shouldMoveContent ? 'workspace-content--menu-pinned' : ''
                }`}
            >
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="*" element={<HomePage />} />
                    <Route path="/memo" element={<Navigate to="/memo/list" replace />} />
                    <Route path="/memo/list" element={<MemoPage viewMode="list" />} />
                    <Route path="/memo/board" element={<MemoPage viewMode="board" />} />
                </Routes>
            </div>
        </main>
    )
}

export default App