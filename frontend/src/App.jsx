import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import LeadList from './components/LeadList'
import LeadForm from './components/LeadForm'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadList />} />
          <Route path="/add-lead" element={<LeadForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
