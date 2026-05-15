import { useState } from 'react'
import JSXDemos from './components/JSXDemos'
import ComponentDemos from './components/ComponentDemos'
import HooksDemos from './components/HooksDemos'
import ClassDemos from './components/ClassDemos'
import ErrorBoundaryDemos from './components/ErrorBoundaryDemos'

const sections = [
  { id: 'jsx', label: 'JSX' },
  { id: 'components', label: 'Components' },
  { id: 'hooks', label: 'Hooks' },
  { id: 'class', label: 'Class + Lifecycle' },
  { id: 'error-boundaries', label: 'Error Boundaries' },
]

export default function App() {
  const [activeSection, setActiveSection] = useState('jsx')
  const [navOpen, setNavOpen] = useState(false)

  function goTo(id) {
    setActiveSection(id)
    setNavOpen(false)
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header-row">
        <span style={{fontSize:'1.8rem'}}>⚛️</span>
        <div>
          <h1 style={{fontSize:'1.5rem',fontWeight:800,color:'#e2e8f0',margin:0}}>
            React Cheatsheet
          </h1>
          <span style={{fontSize:'.75rem',color:'#64748b'}}>Interactive Visual Guide</span>
        </div>
      </div>

      {/* Hamburger toggle (mobile) */}
      <button className="hamburger" onClick={() => setNavOpen(!navOpen)}>
        <span className="ham-icon">{navOpen ? '✕' : '☰'}</span>
        <span>Sections</span>
      </button>

      {/* Sticky Nav */}
      <nav className={`sticky-nav${navOpen ? ' open' : ''}`}>
        {sections.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={e => { e.preventDefault(); goTo(s.id) }}
            style={{
              color: activeSection === s.id ? '#14b8a6' : '#94a3b8',
              background: activeSection === s.id ? '#1a3a3a' : 'transparent',
              fontWeight: activeSection === s.id ? 600 : 400,
            }}
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* Content */}
      <div style={{display:activeSection === 'jsx' ? 'block' : 'none'}} id="jsx"><JSXDemos /></div>
      <div style={{display:activeSection === 'components' ? 'block' : 'none'}} id="components"><ComponentDemos /></div>
      <div style={{display:activeSection === 'hooks' ? 'block' : 'none'}} id="hooks"><HooksDemos /></div>
      <div style={{display:activeSection === 'class' ? 'block' : 'none'}} id="class"><ClassDemos /></div>
      <div style={{display:activeSection === 'error-boundaries' ? 'block' : 'none'}} id="error-boundaries"><ErrorBoundaryDemos /></div>

      {/* Footer */}
      <div style={{textAlign:'center',padding:'24px 0',fontSize:'.75rem',color:'#64748b',marginTop:24,borderTop:'1px solid #2a2a4a'}}>
        React Interactive Cheatsheet — Based on Zero To Mastery React Cheat Sheet &bull; Built with React + Vite
      </div>
    </div>
  )
}
