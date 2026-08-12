import { useEffect, useState } from 'react'
import SideMenu from './SideMenu'
import './TopBar.css'

function TopBar({ onHome }) {
    const [now, setNow] = useState(new Date())
    const [isMenuPinned, setIsMenuPinned] = useState(true)
    const [isMenuHovered, setIsMenuHovered] = useState(false)

    useEffect(() => {
        const timerId = window.setInterval(() => {
            setNow(new Date())
        }, 1000)

        return () => {
            window.clearInterval(timerId)
        }
    }, [])

    const isMenuOpen = isMenuPinned || isMenuHovered

    function handleMenuToggle() {
        if (isMenuPinned) {
            setIsMenuPinned(false)
            setIsMenuHovered(false)
            return
        }

        setIsMenuPinned(true)
    }

    const dateText = now.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    })

    const timeText = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="topbar-button" type="button" aria-label="Home" onClick={onHome}>
                    <span className="material-symbols-outlined topbar-icon"
                    aria-hidden="true">
                    home
                    </span>
                </button>

                <div
                    className="menu-trigger"
                    onMouseEnter={() => {
                        if (!isMenuPinned) {
                            setIsMenuHovered(true)
                        }
                    }}
                    onMouseLeave={() => {
                        if (!isMenuPinned) {
                            setIsMenuHovered(false)
                        }
                    }}
                >
                    <button
                        className={`topbar-button ${
                            isMenuPinned ? 'topbar-button--active' : ''
                        }`}
                        type="button"
                        aria-label="Menu"
                        aria-expanded={isMenuOpen}
                        onClick={handleMenuToggle}
                    >

                        <span class="material-symbols-outlined topbar-icon" aria-hidden="true">
                        density_medium
                        </span>
                    </button>
                    <SideMenu isOpen={isMenuOpen} />
                </div>
            </div>

            <time className="clock" dateTime={now.toISOString()}>
                <span className="clock-date">{dateText}</span>
                <span className="clock-time">{timeText}</span>
            </time>
        </header>
    )
}

export default TopBar
