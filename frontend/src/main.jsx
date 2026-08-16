import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import MemoProvider from './context/MemoProvider.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <MemoProvider>
                <App />
            </MemoProvider>
        </BrowserRouter>
    </StrictMode>,
)