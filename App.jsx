import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SupplierList from './supplumanagement'

function App() {
  const [count, setCount] = useState(0)

  return (
    <SupplierList/>
  )
}

export default App
