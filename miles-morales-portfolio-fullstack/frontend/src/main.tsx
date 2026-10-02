import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BootGate } from './boot/BootGate'
import { loadLiveData } from './data/useResumeData'
import './index.css'

// Start the real data load now, in parallel with the cinematic chunk
// downloading, rather than waiting for anything to mount.
void loadLiveData()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BootGate>
      <App />
    </BootGate>
  </React.StrictMode>,
)
