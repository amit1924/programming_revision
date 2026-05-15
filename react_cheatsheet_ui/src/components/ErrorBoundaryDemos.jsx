import { useState, Component } from 'react'

/* ─── Error Boundary Class Component ─── */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.log('⚠️ Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-banner">
          <h3><span style={{fontSize:'1.5rem'}}>⚠️</span> Something went wrong</h3>
          <p style={{fontSize:'.85rem',fontFamily:'monospace'}}>{this.state.error?.message}</p>
          <button className="btn btn-primary btn-sm" style={{marginTop:8}} onClick={() => this.setState({ hasError: false, error: null })}>
            Reset &amp; try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

/* ─── Buggy Component ─── */
function BuggyComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('💥 Oops! This component crashed!')
  }
  return (
    <div className="output-box flex flex-center" style={{flexDirection:'column'}}>
      <span style={{fontSize:'1.1rem'}}>✅ Component rendered successfully</span>
      <span style={{fontSize:'.8rem',color:'#94a3b8'}}>Click "Crash it" to trigger the error boundary</span>
    </div>
  )
}

/* ─── Safe Component ─── */
function SafeComponent() {
  return (
    <div className="output-box flex flex-center" style={{flexDirection:'column',borderColor:'#22c55e'}}>
      <span style={{fontSize:'1.1rem',color:'#22c55e'}}>✅ Safe Component — still works!</span>
      <span style={{fontSize:'.8rem',color:'#94a3b8'}}>Error boundaries catch errors only in their child tree, not in themselves.</span>
    </div>
  )
}

/* ─── Main Export ─── */
export default function ErrorBoundaryDemos() {
  const [shouldThrow, setShouldThrow] = useState(false)

  return (
    <section>
      <h2 className="section-title"><span className="icon">🛡️</span> Error Boundaries</h2>
      <p className="card" style={{marginBottom:16,fontSize:'.9rem',lineHeight:1.6}}>
        Error boundaries catch JS errors in their child component tree, display fallback UI, and prevent the whole app from crashing.
        They are implemented with <code className="code-tag">getDerivedStateFromError</code> (render phase) and <code className="code-tag">componentDidCatch</code> (commit phase, for side effects like logging).
      </p>

      <div className="grid-2">
        {/* getDerivedStateFromError */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>getDerivedStateFromError</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>
            A static method called during the <strong>render phase</strong> when a child throws. Returns updated state to show fallback UI.
            <span style={{display:'block',marginTop:4,fontSize:'.75rem',color:'#ef4444'}}>No side effects allowed here!</span>
          </p>
          <pre>{`static getDerivedStateFromError(error) {\n  return { hasError: true }\n}`}</pre>
        </div>

        {/* componentDidCatch */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>componentDidCatch</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>
            Called during the <strong>commit phase</strong> after an error is caught. Receives the error and info about the component stack.
            <span style={{display:'block',marginTop:4,fontSize:'.75rem',color:'#22c55e'}}>Side effects allowed — log errors here!</span>
          </p>
          <pre>{`componentDidCatch(error, info) {\n  logError(error, info)\n}`}</pre>
        </div>
      </div>

      {/* Live Demo */}
      <div className="card" style={{marginTop:16}}>
        <h3 style={{marginBottom:8,color:'#60a5fa'}}>Live Error Boundary Demo</h3>
        <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>
          Wrap a portion of your component tree with <code className="code-tag">&lt;ErrorBoundary&gt;</code>. When a child throws, the boundary catches it and shows fallback UI while sibling components remain intact.
        </p>

        <div className="flex flex-center" style={{marginBottom:12,gap:8}}>
          <button className={`btn btn-sm ${shouldThrow ? 'btn-danger' : 'btn-primary'}`} onClick={() => setShouldThrow(true)}>
            💥 Crash it
          </button>
          {shouldThrow && (
            <button className="btn btn-sm btn-primary" onClick={() => setShouldThrow(false)}>
              🔄 Reset
            </button>
          )}
          <span style={{fontSize:'.75rem',color:'#94a3b8'}}>Watch how only the crashing component is replaced by fallback UI</span>
        </div>

        <div className="grid-2">
          <ErrorBoundary>
            <div className="dark-card">
              <h4 style={{fontSize:'.9rem',color:'#fbbf24',marginBottom:8}}>Protected by Error Boundary</h4>
              <BuggyComponent shouldThrow={shouldThrow} />
            </div>
          </ErrorBoundary>

          <div className="dark-card">
            <h4 style={{fontSize:'.9rem',color:'#22c55e',marginBottom:8}}>Sibling Component (no boundary)</h4>
            <SafeComponent />
          </div>
        </div>

        <div style={{marginTop:12,padding:'8px 12px',background:'#111120',borderRadius:6}}>
          <h4 style={{fontSize:'.85rem',color:'#94a3b8',marginBottom:4}}>How it works:</h4>
          <ol style={{fontSize:'.75rem',color:'#64748b',paddingLeft:20,lineHeight:1.8}}>
            <li>Child component throws an <code>Error</code></li>
            <li><code className="code-tag">getDerivedStateFromError</code> sets <code>hasError: true</code> in state</li>
            <li>Boundary re-renders with fallback UI instead of the crashed component</li>
            <li><code className="code-tag">componentDidCatch</code> logs to console (open DevTools to see)</li>
            <li>Sibling components are <strong>not affected</strong> — the error is contained!</li>
          </ol>
        </div>
      </div>
    </section>
  )
}


