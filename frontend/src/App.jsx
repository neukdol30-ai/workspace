import { useState } from 'react'
import TopBar from './component/layout/TopBar.jsx'
import MainMenu from './component/layout/MainMenu.jsx'
import MemoPage from './pages/MemoPage.jsx'

function App() {
    const [activePage, setActivePage] = useState('home')

    return (
        <main className="workspace">
            <TopBar />

            {activePage === 'memo' ? (
                <MemoPage />
            ) : (
                <MainMenu onSelectMenu={setActivePage} />
            )}
        </main>
    )
}

export default App