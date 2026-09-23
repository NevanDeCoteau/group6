import { useEffect, useState } from 'react'
import './App.css'

type HealthStatus = { status: string; environment: string }

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.json() as Promise<HealthStatus>
      })
      .then(setHealth)
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <section id="center">
      <h1>G6</h1>
      <p className="status">
        Backend:{' '}
        {error ? (
          <span className="bad">error — {error}</span>
        ) : health ? (
          <span className="ok">
            {health.status} ({health.environment})
          </span>
        ) : (
          'checking…'
        )}
      </p>
    </section>
  )
}

export default App
