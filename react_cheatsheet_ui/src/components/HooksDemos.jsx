import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react'

/* ─── Context for useContext demo ─── */
const ThemeContext = createContext('dark')

function ThemedBox() {
  const theme = useContext(ThemeContext)
  return (
    <div style={{
      background: theme === 'dark' ? '#1e1e36' : '#f0fdfa',
      color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
      border: `1px solid ${theme === 'dark' ? '#2a2a4a' : '#14b8a6'}`,
      borderRadius: 8, padding: '12px 16px', textAlign: 'center', transition: 'all .3s'
    }}>
      <span style={{fontSize:'.8rem'}}>Theme via Context: </span>
      <strong>{theme}</strong>
    </div>
  )
}

/* ─── useCallback demo child ─── */
function UserItem({ user, onHide }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 8px',borderBottom:'1px solid #2a2a4a',fontSize:'.85rem'}}>
      <span>{user.name}</span>
      <button className="btn btn-sm btn-danger" onClick={() => onHide(user.id)}>Hide</button>
    </div>
  )
}

/* ─── factorial for useMemo ─── */
function factorialOf(n) {
  if (n < 0) return -1
  if (n === 0) return 1
  return n * factorialOf(n - 1)
}

export default function HooksDemos() {
  /* ─── useState ─── */
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  /* ─── useEffect ─── */
  const [effectMsg, setEffectMsg] = useState('')
  const [effectCount, setEffectCount] = useState(0)
  useEffect(() => {
    setEffectMsg(`useEffect ran! count: ${effectCount}`)
  }, [effectCount])

  /* ─── useLayoutEffect ─── */
  const [layoutMsg, setLayoutMsg] = useState('')
  useLayoutEffect(() => {
    setLayoutMsg('useLayoutEffect ran synchronously after DOM mutations')
  }, [])

  /* ─── useRef ─── */
  const inputRef = useRef(null)
  const clickCount = useRef(0)
  const [refDisplay, setRefDisplay] = useState(0)

  /* ─── useCallback ─── */
  const [users] = useState([
    { id: 1, name: 'Mike' }, { id: 2, name: 'Steve' }, { id: 3, name: 'Andrew' }, { id: 4, name: 'Pierre' }
  ])
  const [shownUsers, setShownUsers] = useState(users)
  const [cbRerender, setCbRerender] = useState(0)

  const hideUser = useCallback((userId) => {
    setShownUsers(prev => prev.filter(u => u.id !== userId))
  }, [])

  /* ─── useMemo ─── */
  const [factNum, setFactNum] = useState(5)
  const [factToggle, setFactToggle] = useState(false)
  const factorial = useMemo(() => factorialOf(factNum), [factNum])

  /* ─── useContext ─── */
  const [theme, setTheme] = useState('dark')

  /* ─── useEffect cleanup demo ─── */
  const [showCleanup, setShowCleanup] = useState(true)

  return (
    <section>
      <h2 className="section-title"><span className="icon">🎣</span> React Hooks</h2>
      <p className="card" style={{marginBottom:16,fontSize:'.9rem',lineHeight:1.6}}>
        Hooks (React 16.8+) add state and lifecycle features to functional components. They follow the component lifecycle:
        <strong> Mount</strong> → <strong>Update</strong> → <strong>Unmount</strong>.
      </p>

      <div className="grid-2">
        {/* useState */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>useState</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Returns <code className="code-tag">[value, setter]</code>. Calls to setter trigger re-render. The setter is <strong>asynchronous</strong>.</p>
          <pre>{`const [count, setCount] = useState(0)\nconst increment = () => setCount(c => c + 1)`}</pre>
          <div className="demo-box">
            <div className="counter-display">{count}</div>
            <div className="flex flex-center" style={{gap:8}}>
              <button className="btn btn-primary" onClick={() => setCount(c => c + 1)}>+ Increment</button>
              <button className="btn btn-secondary" onClick={() => setCount(c => c - 1)}>- Decrement</button>
              <button className="btn btn-danger btn-sm" onClick={() => setCount(0)}>Reset</button>
            </div>
            <div style={{marginTop:8,textAlign:'center'}}>
              <span style={{fontSize:'.8rem'}}>Name: </span>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Type name..." style={{width:140}} />
              <div style={{fontSize:'.85rem',marginTop:4}}>Hello, <span className="result-highlight">{name || 'Stranger'}</span></div>
            </div>
          </div>
        </div>

        {/* useEffect */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>useEffect</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Runs after render. Takes a callback + dependency array. Runs on mount + when deps change. Return a cleanup function for unmount.</p>
          <pre>{`useEffect(() => {\n  // side effect\n  fetch(url).then(setData)\n}, [dependency])`}</pre>
          <div className="demo-box">
            <div className="flex flex-center" style={{marginBottom:8,gap:8}}>
              <span style={{fontSize:'.8rem'}}>Dependency:</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setEffectCount(c => c + 1)}>Change dep ({effectCount})</button>
              <button className="btn btn-primary btn-sm" onClick={() => setEffectCount(0)}>Reset</button>
            </div>
            <div className="output-box">
              <span style={{fontSize:'.8rem'}}>{effectMsg || 'Click "Change dep" to trigger effect'}</span>
            </div>
            <div style={{marginTop:8,padding:8,background:'#111120',borderRadius:6}}>
              <h4 style={{fontSize:'.8rem',color:'#fbbf24',marginBottom:4}}>Cleanup Demo</h4>
              <label className="flex flex-center" style={{gap:8,fontSize:'.8rem'}}>
                <input type="checkbox" checked={showCleanup} onChange={e => setShowCleanup(e.target.checked)} />
                Show cleanup component {showCleanup ? '🟢' : '🔴'}
              </label>
              {showCleanup && <CleanupDemo />}
            </div>
          </div>
        </div>

        {/* useLayoutEffect */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>useLayoutEffect</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Same signature as useEffect but <strong>runs synchronously</strong> after DOM mutations, before browser paint. Prevents flicker.</p>
          <pre>{`useLayoutEffect(() => {\n  // runs before paint\n}, [deps])`}</pre>
          <div className="demo-box">
            <div className="output-box">
              <span style={{fontSize:'.8rem'}}>{layoutMsg}</span>
            </div>
            <span style={{fontSize:'.7rem',color:'#64748b',display:'block',marginTop:4}}>useLayoutEffect fires synchronously — useful for reading layout before paint</span>
          </div>
        </div>

        {/* useRef */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>useRef</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Stores mutable values that persist across renders. Changes <strong>don't trigger re-render</strong>. Commonly used for DOM node references.</p>
          <pre>{`const ref = useRef(initialValue)\nref.current // access value\n<input ref={ref} />`}</pre>
          <div className="demo-box">
            <div className="flex flex-center" style={{marginBottom:8,gap:8}}>
              <input ref={inputRef} type="text" placeholder="Focus me via ref" style={{flex:1}} />
              <button className="btn btn-primary btn-sm" onClick={() => inputRef.current?.focus()}>Focus Input</button>
            </div>
            <div className="flex flex-center" style={{gap:8,marginBottom:8}}>
              <button className="btn btn-secondary btn-sm" onClick={() => { clickCount.current += 1; setRefDisplay(clickCount.current) }}>
                Clicks (ref): {refDisplay}
              </button>
              <span style={{fontSize:'.75rem',color:'#94a3b8'}}>Ref value persists but <strong>doesn't re-render</strong> alone</span>
            </div>
            <span style={{fontSize:'.7rem',color:'#64748b',display:'block'}}>Try clicking fast — the ref tracks every click, but display updates only via setState</span>
          </div>
        </div>

        {/* useCallback */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>useCallback</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Memoizes a function so it's not recreated on every render unless dependencies change. Prevents unnecessary child re-renders.</p>
          <pre>{`const handleClick = useCallback(\n  () => doThing(dep),\n  [dep]\n)`}</pre>
          <div className="demo-box">
            <div className="flex flex-center" style={{marginBottom:8,gap:8}}>
              <span style={{fontSize:'.8rem'}}>Users shown: {shownUsers.length}/4</span>
              {shownUsers.length < 4 && <button className="btn btn-secondary btn-sm" onClick={() => setShownUsers(users)}>Reset all</button>}
              <button className="btn btn-sm" style={{background:'#2d2d44',color:'#e2e8f0'}} onClick={() => setCbRerender(p => p + 1)}>Force re-render ({cbRerender})</button>
            </div>
            <div style={{background:'#111120',borderRadius:6,padding:8}}>
              {shownUsers.map(u => (
                <UserItem key={u.id} user={u} onHide={hideUser} />
              ))}
              {shownUsers.length === 0 && <span style={{fontSize:'.85rem',color:'#64748b'}}>All users hidden — click "Reset all"</span>}
            </div>
            <span style={{fontSize:'.7rem',color:'#64748b',display:'block',marginTop:4}}>hideUser is memoized — not recreated on force re-render</span>
          </div>
        </div>

        {/* useMemo */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>useMemo</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Memoizes an expensive computation's return value. Only recomputes when dependencies change.</p>
          <pre>{`const total = useMemo(\n  () => expensiveCalc(n),\n  [n]\n)`}</pre>
          <div className="demo-box">
            <div className="flex flex-center" style={{marginBottom:8,gap:8}}>
              <span style={{fontSize:'.8rem'}}>Factorial of:</span>
              <input type="number" min="1" max="20" value={factNum} onChange={e => setFactNum(Number(e.target.value))} style={{width:80}} />
              <span style={{fontSize:'.8rem'}}>= <span className="result-highlight">{factorial}</span></span>
            </div>
            <div className="flex flex-center" style={{gap:8}}>
              <button className={`btn btn-sm ${factToggle ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFactToggle(t => !t)}>
                Toggle: {factToggle ? 'ON' : 'OFF'}
              </button>
              <span style={{fontSize:'.75rem',color:'#94a3b8'}}>Toggling doesn't recompute factorial — only number change does</span>
            </div>
          </div>
        </div>

        {/* useContext */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>useContext</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Access context values without <code className="code-tag">&lt;Consumer&gt;</code> wrapping. Pass the context object to get its current value.</p>
          <pre>{`const ctx = useContext(MyContext)\n// instead of:\n<MyContext.Consumer>\n  {val => <p>{val}</p>}\n</MyContext.Consumer>`}</pre>
          <div className="demo-box">
            <div className="flex flex-center" style={{marginBottom:8,gap:8}}>
              <span style={{fontSize:'.8rem'}}>Toggle theme:</span>
              <button className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
            <ThemeContext.Provider value={theme}>
              <ThemedBox />
            </ThemeContext.Provider>
            <span style={{fontSize:'.7rem',color:'#64748b',display:'block',marginTop:4}}>ThemedBox uses useContext(ThemeContext) to read the current theme</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Cleanup Demo Component ─── */
function CleanupDemo() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    return () => {
      clearInterval(id)
      console.log('Cleanup: interval cleared')
    }
  }, [])

  return (
    <div style={{fontSize:'.8rem',marginTop:4}}>
      <span>Timer: <span style={{fontFamily:'monospace',color:'#60a5fa'}}>{time}</span></span>
      <span style={{color:'#64748b',marginLeft:12,fontSize:'.7rem'}}>(unmount checkbox to see cleanup)</span>
    </div>
  )
}
