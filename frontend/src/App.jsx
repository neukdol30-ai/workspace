import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [now, setNow] = useState(new Date())
  const [isMenuPinned, setIsMenuPinned] = useState(false)
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
      <main className="workspace">
        <header className="topbar">
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
                className="topbar-button"
                type="button"
                aria-label="Menu"
                aria-expanded={isMenuOpen}
                onClick={handleMenuToggle}
            >
    <span className="hamburger" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
            </button>

            <aside
                className={`side-menu ${isMenuOpen ? 'side-menu--open' : ''}`}
                aria-label="Menu"
            />
          </div>

          <time className="clock" dateTime={now.toISOString()}>
            <span className="clock-date">{dateText}</span>
            <span className="clock-time">{timeText}</span>
          </time>
        </header>

        <section className="desktop" aria-label="Workspace" />
      </main>
  )
}

export default App