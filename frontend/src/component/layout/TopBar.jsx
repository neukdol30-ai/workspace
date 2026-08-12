import { useEffect, useState } from 'react'
import { MdHome, MdDensityMedium } from 'react-icons/md'
import SideMenu from './sideMenu/SideMenu'
import './TopBar.css'

function TopBar({
                    onHome,
                    isMenuPinned,
                    onMenuPinnedChange,
                    sideMenuMode,
                    onSideMenuModeChange,
                    onMenuOpenChange,
                }) {
    const [now, setNow] = useState(new Date())
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

    useEffect(() => {
        onMenuOpenChange(isMenuOpen)
    }, [isMenuOpen, onMenuOpenChange])

    function handleMenuToggle() {
        if (isMenuPinned) {
            onMenuPinnedChange(false)
            setIsMenuHovered(false)
            return
        }

        onMenuPinnedChange(true)
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
                    <MdHome className="topbar-icon" aria-hidden="true" />
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

                        <MdDensityMedium className="topbar-icon" aria-hidden="true"/>
                    </button>
                    <SideMenu
                        isOpen={isMenuOpen}
                        sideMenuMode={sideMenuMode}
                        onSideMenuModeChange={onSideMenuModeChange}
                    />
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
