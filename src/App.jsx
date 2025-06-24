// src/App.jsx
import Calendar from './components/Calendar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <Calendar />
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </div>
  )
}
export default App
