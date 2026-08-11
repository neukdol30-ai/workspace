import { useNavigate, Route, Routes } from 'react-router-dom'
import TopBar from './component/layout/TopBar.jsx'
import HomePage from './pages/HomePage.jsx'
import MemoPage from './pages/MemoPage.jsx'

function App() {
    const navigate = useNavigate()

    return (
        <main className="workspace">
            <TopBar onHome={() => navigate('/')} />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/memo" element={<MemoPage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
        </main>
    )
}

export default App