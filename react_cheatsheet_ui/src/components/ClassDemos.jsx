import { useState, Component } from 'react'

/* ─── Counter Class Component ─── */
class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
    this.increment = this.increment.bind(this)
    this.decrement = this.decrement.bind(this)
  }

  increment() { this.setState(prev => ({ count: prev.count + 1 })) }
  decrement() { this.setState(prev => ({ count: prev.count - 1 })) }

  render() {
    return (
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'2.5rem',fontWeight:700,color:'#60a5fa'}}>{this.state.count}</div>
        <div className="flex flex-center" style={{gap:8}}>
          <button className="btn btn-primary" onClick={this.increment}>+</button>
          <button className="btn btn-secondary" onClick={this.decrement}>-</button>
        </div>
      </div>
    )
  }
}

/* ─── Form Class Component ─── */
class Form extends Component {
  constructor(props) {
    super(props)
    this.state = { name: '', address: '' }
  }

  handleNameChange = (e) => this.setState({ name: e.target.value })
  handleAddressChange = (e) => this.setState({ address: e.target.value })

  render() {
    return (
      <div>
        <div className="flex" style={{marginBottom:8}}>
          <input type="text" value={this.state.name} onChange={this.handleNameChange} placeholder="Name" style={{flex:1}} />
          <input type="text" value={this.state.address} onChange={this.handleAddressChange} placeholder="Address" style={{flex:1}} />
        </div>
        <div className="output-box" style={{fontSize:'.85rem'}}>
          Hello, <span className="result-highlight">{this.state.name || 'Stranger'}</span>.
          You live at <span className="result-highlight">{this.state.address || 'Unknown'}</span>
        </div>
      </div>
    )
  }
}

/* ─── Lifecycle Demo ─── */
class LifecycleDemo extends Component {
  constructor(props) {
    super(props)
    this.state = { items: [], loadCount: 0 }
  }

  componentDidMount() {
    console.log('⚠️ LifecycleDemo mounted')
    this.loadData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loadCount !== this.state.loadCount) {
      console.log(`⚠️ componentDidUpdate: loadCount changed to ${this.state.loadCount}`)
      this.loadData()
    }
  }

  componentWillUnmount() {
    console.log('⚠️ LifecycleDemo unmounting — cleanup!')
  }

  loadData = () => {
    const items = [
      { id: 1, text: `Item from fetch #${this.state.loadCount + 1}` },
      { id: 2, text: `Another item #${this.state.loadCount + 1}` },
    ]
    this.setState({ items })
  }

  render() {
    return (
      <div>
        <div className="flex flex-center" style={{marginBottom:8,gap:8}}>
          <span style={{fontSize:'.8rem'}}>Load count: {this.state.loadCount}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => this.setState(prev => ({ loadCount: prev.loadCount + 1 }))}>
            Trigger re-fetch (update)
          </button>
          {this.props.onRequestUnmount && (
            <button className="btn btn-danger btn-sm" onClick={this.props.onRequestUnmount}>Unmount</button>
          )}
        </div>
        <div style={{background:'#111120',borderRadius:6,padding:8}}>
          {this.state.items.map(item => (
            <div key={item.id} style={{padding:'4px 8px',fontSize:'.85rem',color:'#e2e8f0',borderBottom:'1px solid #2a2a4a'}}>
              {item.text}
            </div>
          ))}
        </div>
        <span style={{fontSize:'.7rem',color:'#64748b',display:'block',marginTop:4}}>Check the console for lifecycle logs (mount, update, unmount)</span>
      </div>
    )
  }
}

/* ─── Main Export ─── */
export default function ClassDemos() {
  const [showLifecycle, setShowLifecycle] = useState(true)
  return (
    <section>
      <h2 className="section-title"><span className="icon">🏛️</span> Class Components &amp; Lifecycle</h2>
      <p className="card" style={{marginBottom:16,fontSize:'.9rem',lineHeight:1.6}}>
        Class components were the original way to add state and lifecycle to React.
        While functional components + hooks are now standard, understanding classes is important for maintaining legacy code.
      </p>

      <div className="grid-2">
        {/* Class Component Basics */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>Class Component</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Extends <code className="code-tag">Component</code>, implements <code className="code-tag">render()</code> to return JSX.</p>
          <pre>{`class MyComp extends Component {\n  render() {\n    return <h1>Hello</h1>\n  }\n}`}</pre>
          <div className="demo-box flex flex-center">
            <div style={{textAlign:'center'}}>
              <span style={{fontSize:'1.3rem',fontWeight:700,color:'#60a5fa'}}>Class Component</span>
              <p style={{fontSize:'.85rem',color:'#94a3b8'}}>Rendered from the render() method</p>
            </div>
          </div>
        </div>

        {/* Constructor + State */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>Constructor &amp; State (Counter)</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Constructor initializes <code className="code-tag">this.state</code> and binds methods. Modern class fields syntax <code className="code-tag">state = {}</code> is preferred.</p>
          <pre>{`constructor(props) {\n  super(props)\n  this.state = { count: 0 }\n}\n// or:\nstate = { count: 0 }`}</pre>
          <div className="demo-box">
            <Counter />
            <span style={{fontSize:'.7rem',color:'#64748b',display:'block',marginTop:4}}>setState triggers re-render</span>
          </div>
        </div>

        {/* setState Object + Function forms */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>setState — Object &amp; Function Forms</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Pass an <strong>object</strong> for shallow merge, or a <strong>function</strong> <code className="code-tag">{'(prevState, props) => newState'}</code> that receives previous state. Optional callback runs after update.</p>
          <pre>{`// Object:\nthis.setState({ name: 'Bob' })\n\n// Function:\nthis.setState(prev =>\n  ({ count: prev.count + 1 })\n)\n\n// + callback:\nthis.setState({}, () =>\n  console.log('done')\n)`}</pre>
          <div className="demo-box">
            <Form />
            <span style={{fontSize:'.7rem',color:'#64748b',display:'block',marginTop:4}}>setState with object — shallow merge updates name &amp; address independently</span>
          </div>
        </div>

        {/* Lifecycle Methods */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>Lifecycle Methods</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>
            <code className="code-tag">componentDidMount</code> — after first render<br/>
            <code className="code-tag">componentDidUpdate(prevProps, prevState)</code> — after re-render<br/>
            <code className="code-tag">componentWillUnmount</code> — before removal (cleanup)
          </p>
          <pre>{`componentDidMount() {\n  fetch(url).then(setState)\n}\ncomponentDidUpdate(prev) {\n  if (this.props.id !== prev.id) fetch()\n}\ncomponentWillUnmount() {\n  cleanup()\n}`}</pre>
          <div className="demo-box">
            {showLifecycle ? (
              <LifecycleDemo onRequestUnmount={() => setShowLifecycle(false)} />
            ) : (
              <div className="flex flex-center" style={{flexDirection:'column',gap:8}}>
                <span style={{fontSize:'.85rem',color:'#ef4444'}}>Component unmounted! ✅ Cleanup ran.</span>
                <button className="btn btn-primary btn-sm" onClick={() => setShowLifecycle(true)}>Re-mount</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}


