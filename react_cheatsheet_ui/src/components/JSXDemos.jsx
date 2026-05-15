import { useState } from 'react'

const code = {
  tags: `<h1 style="color:#60a5fa">My Header</h1>\n<button style="padding:8px 16px;border-radius:8px;border:none;background:#14b8a6;color:#fff">My Button</button>`,
  attr: `<div className="container">\n  <img className="avatar" src="https://picsum.photos/100" alt="Profile"/>\n</div>`,
  embedded: `const title = "Hello from JS!"\nconst styles = { color: "#60a5fa", fontSize: "1.5rem" }\n\n<div style={styles}>\n  <h1>{title}</h1>\n  <p>2 + 2 = {2 + 2}</p>\n</div>`,
  fragment: `import { Fragment } from 'react'\n\n<Fragment>\n  <h1>Title</h1>\n  <p>Paragraph</p>\n</Fragment>`,
  inlineStyles: `// HTML: <h1 style="color:blue;text-align:center">Header</h1>\n\n// JSX:\n<h1 style={{\n  color: 'blue',\n  textAlign: 'center'\n}}>\n  Header\n</h1>`
}

export default function JSXDemos() {
  const [tagResult, setTagResult] = useState('')
  const [fragShow, setFragShow] = useState(false)
  const [embedColor, setEmbedColor] = useState('#60a5fa')
  const [embedText, setEmbedText] = useState('Hello from JS!')

  return (
    <section>
      <h2 className="section-title"><span className="icon">⚛️</span> JSX — JavaScript XML</h2>
      <p className="card" style={{marginBottom:16,fontSize:'.9rem',lineHeight:1.6}}>
        JSX is a syntax extension of JavaScript that lets you write HTML-like markup inside JavaScript.
        Almost all React code is written in JSX.
      </p>

      <div className="grid-2">
        {/* Tags */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>React Element Tags</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>React elements look just like HTML and render the same equivalent HTML elements. Single tags like <code className="code-tag">&lt;img/&gt;</code> and <code className="code-tag">&lt;br/&gt;</code> must be self-closing.</p>
          <pre>{code.tags}</pre>
          <div className="demo-box flex flex-center" style={{gap:12}}>
            <h1 style={{color:'#60a5fa',margin:0}}>My Header</h1>
            <button style={{padding:'8px 16px',borderRadius:8,border:'none',background:'#14b8a6',color:'#fff',cursor:'pointer'}} onClick={() => setTagResult('Button clicked!')}>My Button</button>
            {tagResult && <span style={{color:'#34d399',fontSize:'.8rem'}}>✓ {tagResult}</span>}
          </div>
        </div>

        {/* Attributes */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>React Element Attributes</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>JSX uses camelCase. <code className="code-tag">class</code> becomes <code className="code-tag">className</code> because <code>class</code> is a reserved JS keyword.</p>
          <pre>{code.attr}</pre>
          <div className="demo-box flex flex-center" style={{gap:12}}>
            <div className="dark-card" style={{padding:'8px 16px',borderRadius:8}}>
              <img src="https://picsum.photos/60?random=1" alt="Demo" style={{borderRadius:'50%',width:60,height:60}} />
            </div>
            <span style={{fontSize:'.8rem',color:'#94a3b8'}}>className="avatar" → rendered as class</span>
          </div>
        </div>

        {/* Embedded JavaScript */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>Embedded JavaScript <code className="code-tag">{ }</code></h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Use curly braces <code>{'{}'}</code> to embed any JS expression — variables, math, functions.</p>
          <pre>{code.embedded}</pre>
          <div className="demo-box">
            <div className="flex flex-center" style={{gap:8,marginBottom:8}}>
              <input type="text" value={embedText} onChange={e => setEmbedText(e.target.value)} style={{flex:1}} placeholder="Enter text..." />
              <input type="color" value={embedColor} onChange={e => setEmbedColor(e.target.value)} style={{width:40,height:40,borderRadius:6,cursor:'pointer',background:'none',border:'none'}} />
            </div>
            <div className="output-box flex flex-center" style={{flexDirection:'column'}}>
              <span style={{color:embedColor,fontSize:'1.3rem',fontWeight:700}}>{embedText}</span>
              <span style={{fontSize:'.85rem',color:'#94a3b8'}}>2 + 2 = <span className="result-highlight">{2 + 2}</span></span>
            </div>
          </div>
        </div>

        {/* Inline Styles */}
        <div className="card">
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>Inline Styles</h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Pass styles as JS objects (camelCase keys) instead of strings.</p>
          <pre>{code.inlineStyles}</pre>
          <div className="demo-box flex flex-center">
            <h1 style={{color:'blue',textAlign:'center',margin:0,fontSize:'1.5rem'}}>Styled Header</h1>
          </div>
        </div>

        {/* Fragments */}
        <div className="card" style={{gridColumn:'1 / -1'}}>
          <h3 style={{marginBottom:8,color:'#60a5fa'}}>React Fragments <code className="code-tag">&lt;Fragment&gt;</code> <code className="code-tag">&lt;&gt;&lt;/&gt;</code></h3>
          <p style={{fontSize:'.8rem',color:'#94a3b8',marginBottom:8}}>Fragments let you group elements without adding extra DOM nodes. Use <code className="code-tag">&lt;Fragment&gt;</code> or the shorthand <code className="code-tag">&lt;&gt;...&lt;/&gt;</code>.</p>
          <div className="grid-2">
            <pre>{code.fragment}</pre>
            <div className="dark-card">
              <div className="flex flex-center" style={{marginBottom:8}}>
                <button className="btn btn-primary btn-sm" onClick={() => setFragShow(!fragShow)}>
                  {fragShow ? 'Hide' : 'Show'} Fragment Demo
                </button>
              </div>
              {fragShow && (
                <div className="output-box flex flex-center" style={{flexDirection:'column',gap:4}}>
                  <h1 style={{color:'#60a5fa',margin:0,fontSize:'1.2rem'}}>Fragment Title</h1>
                  <p style={{color:'#94a3b8',margin:0}}>Fragment Paragraph — no extra div in DOM!</p>
                  <span style={{fontSize:'.7rem',color:'#64748b'}}>↓ Inspect the DOM — no wrapper element</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
