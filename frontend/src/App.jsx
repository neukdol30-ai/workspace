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
            <button className="topbar-button" type="button" aria-label="Home">
              ⌂
            </button>

            <div className="menu-trigger">
              <button className="topbar-button" type="button" aria-label="Menu">
              <span className="hamburger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              </button>

              <aside className="side-menu" aria-label="Menu" />
            </div>
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