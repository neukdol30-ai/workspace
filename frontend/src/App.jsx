import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

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
          <div className="topbar-left">
            <button
                className="topbar-button"
                type="button"
                aria-label="홈"
                title="홈"
            >
              ⌂
            </button>

            <div className="menu-trigger">
              <button
                  className="topbar-button"
                  type="button"
                  aria-label="전체 메뉴"
                  title="전체 메뉴"
              >
        <span className="hamburger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
              </button>

              <aside className="side-menu" aria-label="전체 메뉴" />
            </div>
          </div>

          <time className="clock" dateTime={now.toISOString()}>
            <span className="clock-date">{dateText}</span>
            <span className="clock-time">{timeText}</span>
          </time>
        </header>

        {isMenuOpen && <aside className="side-menu" aria-label="전체 메뉴" />}

        <section className="desktop" aria-label="작업 공간" />
      </main>
  )
}

export default App