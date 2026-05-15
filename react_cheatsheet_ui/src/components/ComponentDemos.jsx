import { useState, memo, createContext, useContext } from 'react'

/* ─── Child Demos ─── */
function Greeting({ name }) {
  return <h3 style={{color:'#60a5fa',margin:0}}>Hello, {name}!</h3>
}

function ListItems({ items, onRemove }) {
  return (
    <ul style={{listStyle:'none',padding:0,margin:0}}>
      {items.map((item, i) => (
        <li key={item.id || i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 8px',borderBottom:'1px solid #2a2a4a',fontSize:'.85rem'}}>
          <span>{item.text}</span>
          <button className="btn btn-sm btn-danger" onClick={() => onRemove(item.id)}>✕</button>
        </li>
      ))}
    </ul>
  )
}

function ChildrenDemo({ children }) {
  return (
    <div className="output-box">
      <h4 style={{color:'#fbbf24',margin:'0 0 8px',fontSize:'.85rem'}}>Children Prop Container</h4>
      {children}
    </div>
  )
}

function GreetingCard({ large, message, display }) {
  if (!display) return null
  if (large) return <h2 style={{color:'#60a5fa'}}>{message}</h2>
  return <p style={{color:'#94a3b8',fontSize:'1.1rem'}}>{message}</p>
}

const MemoizedItem = memo(function MemoizedItem({ text, count }) {
  return (
    <div style={{padding:'6px 10px',background:'#2d2d44',borderRadius:6,fontSize:'.8rem',display:'flex',justifyContent:'space-between'}}>
      <span>{text}</span>
      <span className="result-highlight">renders: {count}</span>
    </div>
  )
})

/* ─── Context ─── */
const TextContext = createContext('')

function GrandChildA() {
  const text = useContext(TextContext)
  return (
    <div className="dark-card" style={{marginTop:6}}>
      <span style={{fontSize:'.75rem',color:'#94a3b8'}}>GrandChildA gets: </span>
      <span className="result-highlight">{text}</span>
    </div>
  )
}

function ChildA() {
  return (
    <div className="dark-card">
      <span style={{fontSize:'.8rem',color:'#f472b6'}}>ChildA (doesn't use text directly)</span>
      <GrandChildA />
    </div>
  )
}

function ParentA() {
  return (
    <div className="context-box">
      <span style={{fontSize:'.8rem',color:'#818cf8'}}>ParentA (doesn't use text)</span>
      <ChildA />
    </div>
  )
}

function ChildB() {
  const text = useContext(TextContext)
  return (
    <div className="context-box">
      <span style={{fontSize:'.8rem',color:'#f472b6'}}>ChildB gets text directly: </span>
      <span className="result-highlight">{text}</span>
    </div>
  )
}

function ParentB() {
  return (
    <div className="context-box">
      <span style={{fontSize:'.8rem',color:'#818cf8'}}>ParentB (doesn't use text)</span>
      <ChildB />
    </div>
  )
}

/* ─── Props drilling demo (before context) ─── */
function GrandChildDrill({ text }) {
  return <div className="dark-card" style={{marginTop:6,fontSize:'.85rem'}}><span>Got: </span><span className="result-highlight">{text}</span></div>
}
function ChildDrill({ text }) {
  return <div className="dark-card"><span style={{fontSize:'.8rem',color:'#f472b6'}}>Child (passes through)</span><GrandChildDrill text={text} /></div>
}
function ParentDrill({ text }) {
  return <div className="context-box"><span style={{fontSize:'.8rem',color:'#818cf8'}}>Parent (passes through)</span><ChildDrill text={text} /></div>
}

export default function ComponentDemos() {
  const [propName, setPropName] = useState('World')
  const [items, setItems] = useState([
    { id: 'a', text: 'Learn React' },
    { id: 'b', text: 'Build projects' },
    { id: 'c', text: 'Deploy apps' },
  ])
  const [childMsg, setChildMsg] = useState('')
  const [condLarge, setCondLarge] = useState(true)
  const [condDisplay, setCondDisplay] = useState(true)
  const [condMsg, setCondMsg] = useState('Hello World!')
  const [listInput, setListInput] = useState('')
  const [memoRenders, setMemoRenders] = useState(0)
  const [contextText, setContextText] = useState('Shared via Context!')
  const [showDrill, setShowDrill] = useState(false)

  const addItem = () => {
    if (!listInput.trim()) return
    setItems(prev => [...prev, { id: Date.now().toString(), text: listInput }])
    setListInput('')
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <section>
      <h2 className="section-title"><span className="icon">🧩</span> React Components</h2>
      <p className="card" style={{marginBottom:16,fontSize:'.9rem',lineHeight:1.6}}>
        Components are the building blocks of any React app. They organize groups of React elements into reusable pieces.
        Two rules: names must be capitalized, and they must return JSX (one parent element).
      </p>

      <div className="grid-2">
        {/* Functional Components */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>Functional Components</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Just JavaScript functions that return JSX. Can use function declaration or arrow functions.</p>
          <pre>{`function Welcome() {\n  return <h1>Hello!</h1>\n}\n\nconst Welcome = () => <h1>Hello!</h1>`}</pre>
          <div className="demo-box flex flex-center" style={{flexDirection:'column'}}>
            <div style={{fontSize:'1.3rem',fontWeight:700,color:'#60a5fa'}}>Hello!</div>
            <span style={{fontSize:'.7rem',color:'#64748b'}}>Functional component rendering "Hello!"</span>
          </div>
        </div>

        {/* Component Props */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>Component Props <code className="code-tag">{ }</code></h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Pass data via custom attributes. Props become an object, typically destructured.</p>
          <pre>{`const Greeting = ({name}) => <h1>{name}</h1>\n\n<Greeting name="World" />`}</pre>
          <div className="demo-box">
            <div className="flex flex-center" style={{marginBottom:8,gap:8}}>
              <span style={{fontSize:'.8rem'}}>Enter name:</span>
              <input type="text" value={propName} onChange={e => setPropName(e.target.value)} style={{flex:1}} placeholder="World" />
            </div>
            <div className="output-box flex flex-center">
              <Greeting name={propName || 'World'} />
            </div>
          </div>
        </div>

        {/* Children Prop */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>The Children Prop</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Everything between opening and closing tags passes as <code className="code-tag">children</code>. Render it with <code className="code-tag">{'{children}'}</code>.</p>
          <pre>{`const Card = ({children}) =>\n  <div>{children}</div>\n\n<Card>\n  <p>Content</p>\n</Card>`}</pre>
          <div className="demo-box">
            <div className="flex" style={{marginBottom:8}}>
              <input type="text" value={childMsg} onChange={e => setChildMsg(e.target.value)} placeholder="Type children content..." style={{flex:1}} />
            </div>
            <ChildrenDemo>
              <p style={{margin:0,fontSize:'.85rem',color:'#e2e8f0'}}>{childMsg || 'Default children content'}</p>
            </ChildrenDemo>
          </div>
        </div>

        {/* Conditional Rendering */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>Conditional Rendering</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Use <code className="code-tag">if</code>, ternary <code className="code-tag">? :</code>, or <code className="code-tag">&amp;&amp;</code>. Return <code className="code-tag">null</code> to render nothing.</p>
          <pre>{`{condition ? <H1/> : <P/>}\n{display && <Content/>}`}</pre>
          <div className="demo-box">
            <div className="flex flex-center" style={{marginBottom:8,gap:8}}>
              <label className="flex flex-center" style={{gap:4,fontSize:'.8rem'}}><input type="checkbox" checked={condLarge} onChange={e => setCondLarge(e.target.checked)} /> Large</label>
              <label className="flex flex-center" style={{gap:4,fontSize:'.8rem'}}><input type="checkbox" checked={condDisplay} onChange={e => setCondDisplay(e.target.checked)} /> Display</label>
              <input type="text" value={condMsg} onChange={e => setCondMsg(e.target.value)} style={{flex:1}} placeholder="Message" />
            </div>
            <div className="output-box flex flex-center" style={{flexDirection:'column',minHeight:60}}>
              <GreetingCard large={condLarge} message={condMsg} display={condDisplay} />
              {!condDisplay && <span style={{fontSize:'.8rem',color:'#ef4444'}}>null — nothing rendered</span>}
            </div>
          </div>
        </div>

        {/* Lists in Components */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>Lists &amp; Keys <code className="code-tag">.map()</code></h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Loop with <code className="code-tag">.map()</code>, return JSX. Each item needs a unique <code className="code-tag">key</code>. Don't use index as key!</p>
          <pre>{`{items.map(item =>\n  <li key={item.id}>{item}</li>\n)}`}</pre>
          <div className="demo-box">
            <div className="flex" style={{marginBottom:8}}>
              <input type="text" value={listInput} onChange={e => setListInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Add item..." style={{flex:1}} />
              <button className="btn btn-primary btn-sm" onClick={addItem}>Add</button>
            </div>
            <ListItems items={items} onRemove={removeItem} />
            <span style={{fontSize:'.7rem',color:'#64748b',marginTop:4,display:'block'}}>Each item has a unique key → efficient re-renders</span>
          </div>
        </div>

        {/* Memo */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>React.memo</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Wraps a component to skip re-rendering if props haven't changed. Second arg: optional custom comparison.</p>
          <pre>{`const C = memo(({data}) =>\n  <div>{data}</div>\n)`}</pre>
          <div className="demo-box">
            <div className="flex flex-center" style={{marginBottom:8,gap:8}}>
              <button className="btn btn-secondary btn-sm" onClick={() => setMemoRenders(prev => prev + 1)}>Re-render parent <span style={{fontSize:'.7rem'}}>({memoRenders})</span></button>
              <span style={{fontSize:'.75rem',color:'#94a3b8'}}>Parent renders: {memoRenders + 1}</span>
            </div>
            <MemoizedItem text="Memoized — props never change" count={memoRenders + 1} />
            <span style={{fontSize:'.7rem',color:'#64748b',display:'block',marginTop:4}}>The "renders" count only updates when props change, not when parent re-renders</span>
          </div>
        </div>
      </div>

      {/* ─── Context Section ─── */}
      <div className="card" style={{marginTop:16}}>
        <h3 style={{marginBottom:8,color:'#60a5fa'}}>Context API — Solving Prop Drilling</h3>
        <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>
          <code className="code-tag">createContext</code> + <code className="code-tag">Provider</code> + <code className="code-tag">useContext</code> lets any child access data without passing through every level (prop drilling).
          Toggle between <strong>prop drilling</strong> and <strong>Context</strong> to see the difference.
        </p>
        <div className="flex flex-center" style={{marginBottom:12,gap:8}}>
          <span style={{fontSize:'.8rem'}}>Shared value:</span>
          <input type="text" value={contextText} onChange={e => setContextText(e.target.value)} style={{flex:1}} placeholder="Enter shared value..." />
          <button className={`btn btn-sm ${showDrill ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setShowDrill(false)}>Context API</button>
          <button className={`btn btn-sm ${showDrill ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowDrill(true)}>Prop Drilling</button>
        </div>
        <div className="grid-2">
          <div className="dark-card">
            <h4 style={{fontSize:'.9rem',color:'#fbbf24',marginBottom:8}}>Component Tree A</h4>
            {showDrill ? <ParentDrill text={contextText} /> : (
              <TextContext.Provider value={contextText}>
                <ParentA />
              </TextContext.Provider>
            )}
          </div>
          <div className="dark-card">
            <h4 style={{fontSize:'.9rem',color:'#fbbf24',marginBottom:8}}>Component Tree B</h4>
            {showDrill ? <ParentDrill text={contextText} /> : (
              <TextContext.Provider value={contextText}>
                <ParentB />
              </TextContext.Provider>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
