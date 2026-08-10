import { useEffect, useState} from "react";
import './App.css'

function App() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  const dateText = now.toLocaleDateString('ko-KR',{
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  const timeText = now.toLocaleDateString('ko-KR',{
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hor12: false,
  })

  return (
    <main className="workspace">
      <header className="topbar">
        <time className="clock" dateTime={now.toISOString()}>
          <span className="clock-date">{dateText}</span>
          <span className="clock-time">{timeText}</span>
        </time>
      </header>

      <section className="desktop" aria-label="작업 공간"/>
    </main>
  )
}

export default App
