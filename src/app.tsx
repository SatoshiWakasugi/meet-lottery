import { useState } from 'preact/hooks'
import './app.css'
import { Button } from './components/ui/button'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p className="text-4xl">Meet Nominator</p>
      <Button>sss</Button>
    </div>
  )
}
