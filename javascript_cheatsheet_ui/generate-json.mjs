import fs from 'fs';
import path from 'path';

const txt = fs.readFileSync('../javascript.txt', 'utf8');
const lines = txt.split('\n').filter(l => l.trim());

const questions = [];
for (const line of lines) {
  const m = line.trim().match(/^(\d+)\s+(.+)$/);
  if (m) {
    questions.push({ id: parseInt(m[1]), text: m[2].trim() });
  } else if (line.trim().startsWith('What are the possible ways')) {
    questions.push({ id: 1, text: line.trim() });
  }
}

// ===== Detailed answers with code examples =====
const answerMap = {
  1: {
    answer: 'There are **6+ ways** to create objects in JavaScript. The most common are: object literals `{}`, constructor functions with `new`, `Object.create()`, ES6 classes, `Object.assign()`, and factory functions.',
    code: `// 1. Object Literal (simplest)
const person = { name: 'Alice', age: 30 };

// 2. Constructor Function
function Person(name) { this.name = name; }
const p = new Person('Bob');

// 3. Object.create()
const proto = { greet() { return 'Hi!'; } };
const obj = Object.create(proto);

// 4. ES6 Class
class Animal { constructor(name) { this.name = name; } }
const dog = new Animal('Rex');

// 5. Object.assign()
const target = Object.assign({}, { x: 1 });

// 6. Factory Function
const createCar = (model) => ({ model, drive() {} });`,
    demo: {
      type: 'object-creation',
      label: 'Choose a creation method:',
      options: [
        { id: 'literal', label: 'Object Literal', code: 'const obj = { name: "Alice", age: 30 };\nconsole.log(obj);', show: '#person-box' },
        { id: 'constructor', label: 'Constructor fn', code: 'function Person(n) { this.name = n; }\nconst p = new Person("Bob");\nconsole.log(p);', show: '#person-box2' },
        { id: 'class', label: 'ES6 Class', code: 'class Animal {\n  constructor(n) { this.name = n; }\n  speak() { return this.name + " says hi"; }\n}\nconst a = new Animal("Rex");\nconsole.log(a.speak());', show: '#person-box3' }
      ]
    }
  },
  2: {
    answer: 'A **prototype chain** is a linked list of objects where each object has a reference (`[[Prototype]]`) to its parent. When you access a property, JS walks up this chain until found or reaching `null`. This is how **inheritance** works in JavaScript.',
    code: `const animal = { eats: true };
const rabbit = { jumps: true };
rabbit.__proto__ = animal; // or Object.setPrototypeOf

// Property lookup:
console.log(rabbit.jumps); // true (own)
console.log(rabbit.eats);  // true (from prototype)
console.log(rabbit.toString); // from Object.prototype

// Chain: rabbit → animal → Object.prototype → null`,
    demo: {
      type: 'prototype-chain',
      label: 'Click to walk the prototype chain:',
      options: [
        { id: 'step1', label: 'Create Chain', code: '', show: '#proto-chain' }
      ]
    }
  },
  3: {
    answer: '`call`, `apply`, and `bind` control what `this` refers to in a function.\n- **call**: invokes immediately with individual arguments: `fn.call(thisArg, arg1, arg2)`\n- **apply**: invokes immediately with array arguments: `fn.apply(thisArg, [arg1, arg2])`\n- **bind**: returns a NEW function with bound `this` (does NOT invoke)',
    code: `const person = { name: 'Alice' };

function greet(greeting, punctuation) {
  return greeting + ', ' + this.name + punctuation;
}

// call - args spread out
greet.call(person, 'Hello', '!');   // "Hello, Alice!"

// apply - args as array
greet.apply(person, ['Hi', '?']);   // "Hi, Alice?"

// bind - returns new function
const boundGreet = greet.bind(person);
boundGreet('Hey', '.');             // "Hey, Alice."`,
    demo: {
      type: 'call-apply-bind',
      label: 'Click to test each method:',
      options: [
        { id: 'call', label: 'call()', code: 'greet.call(person, "Hello", "!")', show: '#bind-demo' },
        { id: 'apply', label: 'apply()', code: 'greet.apply(person, ["Hi", "?"])', show: '#bind-demo' },
        { id: 'bind', label: 'bind()', code: 'const fn = greet.bind(person); fn("Hey",".")', show: '#bind-demo' }
      ]
    }
  },
  4: {
    answer: 'JSON (JavaScript Object Notation) is a lightweight text-based data format for structured data. **Common operations**:\n- **`JSON.stringify(obj)`** — converts JS object → JSON string\n- **`JSON.parse(str)`** — converts JSON string → JS object\nJSON is language-independent, used everywhere for APIs and config.',
    code: `const user = {
  name: 'Alice',
  age: 25,
  hobbies: ['reading', 'coding']
};

// Object → JSON string
const jsonStr = JSON.stringify(user);
// '{"name":"Alice","age":25,"hobbies":["reading","coding"]}'

// JSON string → Object
const parsed = JSON.parse(jsonStr);
console.log(parsed.name); // 'Alice'`,
    demo: {
      type: 'json-converter',
      label: 'Click to convert:',
      options: [
        { id: 'stringify', label: 'JSON.stringify', code: '', show: '#json-demo' },
        { id: 'parse', label: 'JSON.parse', code: '', show: '#json-demo' }
      ]
    }
  },
  5: {
    answer: '`arr.slice(start, end)` returns a **shallow copy** of a portion of an array into a new array. The original array is **NOT modified**. `start` is inclusive, `end` is exclusive. If omitted, `end` goes to the end. Negative indices count from the end.',
    code: `const arr = [10, 20, 30, 40, 50];

arr.slice(1, 3);     // [20, 30]  (index 1 to 2)
arr.slice(2);        // [30, 40, 50] (index 2 to end)
arr.slice(-2);       // [40, 50]  (last 2)
arr.slice();         // [10,20,30,40,50] (shallow clone)

console.log(arr);    // [10,20,30,40,50] (unchanged!)`,
    demo: {
      type: 'array-slice',
      label: 'Interactive: slice this array',
      options: [
        { id: 'slice-1-3', label: 'slice(1,3)', code: '', show: '#array-demo' },
        { id: 'slice-2', label: 'slice(2)', code: '', show: '#array-demo' },
        { id: 'slice--2', label: 'slice(-2)', code: '', show: '#array-demo' }
      ]
    }
  },
  6: {
    answer: '`arr.splice(start, deleteCount, ...items)` **changes the original array** by removing, replacing, or adding elements. It returns an array of removed elements. This is the main difference from `slice` — `splice` mutates.',
    code: `const arr = [10, 20, 30, 40, 50];

// Remove 2 elements from index 1
const removed = arr.splice(1, 2);
console.log(arr);     // [10, 40, 50]
console.log(removed); // [20, 30]

// Insert at index 1 (0 deleteCount)
arr.splice(1, 0, 99);
console.log(arr);     // [10, 99, 40, 50]

// Replace: remove 1, add 2
arr.splice(2, 1, 11, 22);
console.log(arr);     // [10, 99, 11, 22, 50]`,
    demo: {
      type: 'array-splice',
      label: 'Interactive: splice this array',
      options: [
        { id: 'splice-remove', label: 'splice(1,2) remove', code: '', show: '#array-demo2' },
        { id: 'splice-insert', label: 'splice(1,0,99) insert', code: '', show: '#array-demo2' },
        { id: 'splice-replace', label: 'splice(2,1,11,22) replace', code: '', show: '#array-demo2' }
      ]
    }
  },
  7: {
    answer: '**slice vs splice**:\n- **slice** is **immutable** (does not change original). **splice** **mutates** original.\n- **slice(start, end)** — `end` is exclusive index. **splice(start, deleteCount, items)** — `deleteCount` is number of items.\n- **slice** returns new array. **splice** returns removed elements.\n- Think: slice = copy portion, splice = modify array.',
    code: `const a = [1,2,3,4,5];
const b = [1,2,3,4,5];

const sliced = a.slice(1, 3);  // [2,3]
console.log(a);  // [1,2,3,4,5] (unchanged)

const spliced = b.splice(1, 3); // removes [2,3,4]
console.log(b);  // [1,5] (changed!)`,
    demo: {
      type: 'comparison',
      label: 'Compare side by side:',
      options: [
        { id: 'run-compare', label: 'Run Comparison', code: '', show: '#compare-demo' }
      ]
    }
  },
  8: {
    answer: '**Object vs Map**:\n| Feature | Object | Map |\n|---------|--------|----|\n| Key types | String/Symbol only | Any (objects, functions, primitives) |\n| Insertion order | Not guaranteed (except ES6+) | Guaranteed |\n| Size | Manual counting | `.size` property |\n| Performance | Slower for frequent add/delete | Optimized for add/delete |\n| Iteration | `for...in`, `Object.keys()` | `for...of`, `.forEach()` |\n| Serialization | Native JSON support | Must convert manually |',
    code: `const obj = {};
const map = new Map();

obj['key'] = 'value';
map.set('key', 'value');

// Map accepts any key type
map.set({ id: 1 }, 'object key');
map.set(() => {}, 'function key');

console.log(map.size);      // 3
console.log(Object.keys(obj).length); // 1`,
    demo: {
      type: 'map-vs-object',
      label: 'Compare Map vs Object:',
      options: [
        { id: 'demo-map', label: 'Show Map', code: '', show: '#map-demo' },
        { id: 'demo-obj', label: 'Show Object', code: '', show: '#map-demo' }
      ]
    }
  },
  9: {
    answer: '**`==` (loose equality)** coerces types before comparing. **`===` (strict equality)** checks both type AND value without coercion. **Always prefer `===`** to avoid unexpected type coercion bugs.',
    code: `console.log(1 == '1');   // true  (string→number)
console.log(1 === '1');  // false (number ≠ string)

console.log(null == undefined);  // true
console.log(null === undefined); // false

console.log(0 == false);  // true
console.log(0 === false); // false

console.log('' == false); // true
console.log('' === false);// false

// Falsy values: false, 0, '', null, undefined, NaN`,
    demo: {
      type: 'comparison-table',
      label: 'Test comparisons:',
      options: [
        { id: 'run-comparison', label: 'Run Tests', code: '', show: '#comparison-demo' }
      ]
    }
  },
  10: {
    answer: '**Arrow functions** `(params) => expr` are a shorter function syntax introduced in ES6. Key differences from regular functions:\n- No own `this` (lexically inherited from enclosing scope)\n- No `arguments` object\n- Cannot be used as constructors (no `new`)\n- Implicit return for single-expression bodies',
    code: `// Regular function
const add1 = function(a, b) { return a + b; };

// Arrow function (explicit return)
const add2 = (a, b) => { return a + b; };

// Arrow function (implicit return)
const add3 = (a, b) => a + b;

// Single parameter: parens optional
const double = x => x * 2;

// No 'this' binding
const obj = {
  name: 'Alice',
  regular: function() { return this.name; },
  arrow: () => this.name  // 'this' is outer scope!
};

console.log(obj.regular()); // 'Alice'
console.log(obj.arrow());   // undefined (or global)`,
    demo: {
      type: 'code-runner',
      label: 'Run arrow vs regular comparison:',
      options: [
        { id: 'run-arrow', label: 'Run Demo', code: '', show: '#arrow-demo' }
      ]
    }
  },
  11: {
    answer: 'A language has **first-class functions** when functions can be:\n1. Assigned to variables\n2. Passed as arguments to other functions\n3. Returned from other functions\n4. Stored in data structures\n\nJavaScript treats functions as first-class citizens, enabling functional programming patterns.',
    code: `// 1. Assigned to variable
const greet = function(name) { return 'Hi ' + name; };

// 2. Passed as argument
function apply(fn, val) { return fn(val); }
apply(greet, 'Alice'); // 'Hi Alice'

// 3. Returned from function
function makeGreeter() {
  return function(name) { return 'Hello ' + name; };
}
const greeter = makeGreeter();
greeter('Bob'); // 'Hello Bob'

// 4. Stored in array
const fns = [greet, greeter];`,
    demo: {
      type: 'code-runner',
      label: 'See first-class functions in action:',
      options: [
        { id: 'run-fn', label: 'Run', code: '', show: '#fn-demo' }
      ]
    }
  },
  12: {
    answer: 'A **first-order function** is a function that does NOT accept another function as an argument and does NOT return a function. It only operates on primitive values or objects. Most utility functions are first-order.',
    code: `// First-order function (no function args/return)
function double(x) { return x * 2; }
function formatDate(date) { return date.toISOString(); }

// These are NOT first-order (they're higher-order):
// map, filter, reduce, setTimeout, addEventListener`,
    demo: {
      type: 'code-runner',
      label: 'See first-order vs higher-order:',
      options: [
        { id: 'run', label: 'Run', code: '', show: '#fod-demo' }
      ]
    }
  },
  13: {
    answer: 'A **higher-order function** either:\n1. Takes one or more functions as arguments, OR\n2. Returns a function\n\nBuilt-in examples: `Array.map()`, `filter()`, `reduce()`, `setTimeout()`, `addEventListener()`',
    code: `// Takes a function as argument
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15

// Returns a function
function multiplyBy(factor) {
  return function(x) { return x * factor; };
}
const triple = multiplyBy(3);
console.log(triple(5)); // 15`,
    demo: {
      type: 'higer-order',
      label: 'See HOFs in action:',
      options: [
        { id: 'run-hof', label: 'Run', code: '', show: '#hof-demo' }
      ]
    }
  },
  14: {
    answer: 'A **unary function** is a function that accepts exactly **one argument**. Also called a single-parameter function. Examples: `Math.sqrt(x)`, `JSON.parse(str)`, `x => x * 2`.',
    code: `// Unary functions (1 parameter)
const square = x => x * x;
const cube = x => x * x * x;
Math.sqrt(25);    // 5
JSON.parse('{}'); // {}

// NOT unary:
Math.pow(2, 3);   // binary (2 params)
console.log(1, 2); // variadic (multiple)`,
    demo: {
      type: 'code-runner',
      label: 'Run to see unary functions:',
      options: [
        { id: 'run', label: 'Run', code: '', show: '#unary-demo' }
      ]
    }
  },
  15: {
    answer: '**Currying** transforms a function with multiple arguments into a sequence of nested functions, each taking a **single argument**. `f(a, b, c)` → `f(a)(b)(c)`. This enables partial application and function composition.',
    code: `// Normal function
function add(a, b, c) { return a + b + c; }

// Curried version
const curriedAdd = a => b => c => a + b + c;

console.log(curriedAdd(1)(2)(3)); // 6

// Partial application
const add5 = curriedAdd(5);
const add5And3 = add5(3);
console.log(add5And3(2)); // 10

// Real-world: logging with prefix
const log = prefix => msg => console.log(prefix, msg);
const errorLog = log('[ERROR]');
errorLog('Something broke!');`,
    demo: {
      type: 'currying',
      label: 'Step through currying:',
      options: [
        { id: 'step1', label: 'curriedAdd(1)', code: '', show: '#curry-demo' },
        { id: 'step2', label: 'curriedAdd(1)(2)', code: '', show: '#curry-demo' },
        { id: 'step3', label: 'curriedAdd(1)(2)(3)', code: '', show: '#curry-demo' }
      ]
    }
  },
  16: {
    answer: 'A **pure function** has two properties:\n1. **Same input → same output** (deterministic)\n2. **No side effects** (no mutation, no I/O, no API calls, no DOM changes)\n\nPure functions are predictable, testable, and cacheable.',
    code: `// PURE: same input, same output, no side effects
const add = (a, b) => a + b;
const double = arr => arr.map(n => n * 2);

// IMPURE: different output each time
Math.random();     // side effect: randomness
Date.now();        // impure: depends on system time

// IMPURE: mutates external state
let counter = 0;
const increment = () => counter++; // side effect!

// IMPURE: DOM manipulation
const updateUI = () => {
  document.body.innerHTML = 'changed'; // side effect!
};`,
    demo: {
      type: 'comparison',
      label: 'Pure vs Impure:',
      options: [
        { id: 'run', label: 'Compare', code: '', show: '#pure-demo' }
      ]
    }
  },
  17: {
    answer: '**Benefits of pure functions**:\n1. **Predictable** — same input always same output\n2. **Testable** — no mocking needed, just assert input→output\n3. **Cacheable/Memoizable** — results can be cached by input\n4. **Parallelizable** — no shared state, safe to run concurrently\n5. **Self-documenting** — all dependencies are explicit via parameters\n6. **Easier debugging** — no hidden state changes',
    code: `// Pure = easy to test
const add = (a, b) => a + b;
test('add(1,2) === 3', () => {
  expect(add(1, 2)).toBe(3);
});

// Pure = cacheable (memoization)
const memoize = fn => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    return cache[key] ?? (cache[key] = fn(...args));
  };
};
const memoAdd = memoize((a, b) => a + b);`,
    demo: {
      type: 'code-runner',
      label: 'See memoization in action:',
      options: [
        { id: 'run', label: 'Run Demo', code: '', show: '#benefits-demo' }
      ]
    }
  },
  18: {
    answer: 'The **`let` keyword** declares **block-scoped** variables. It was introduced in ES6 to fix issues with `var`. Key features:\n- Block-scoped (inside `{}`)\n- Can be **reassigned** but **not redeclared** in same scope\n- Has **Temporal Dead Zone** (TDZ) — cannot access before declaration\n- Not hoisted to the top (in practice)',
    code: `{
  let x = 10;
  console.log(x); // 10
}
// console.log(x); // ReferenceError! (block scope)

// Can reassign
let y = 5;
y = 10; // OK

// Cannot redeclare in same scope
// let y = 20; // SyntaxError!

// TDZ example
// console.log(z); // ReferenceError: TDZ
let z = 3;`,
    demo: {
      type: 'code-runner',
      label: 'Test let block scoping:',
      options: [
        { id: 'run', label: 'Run Demo', code: '', show: '#let-demo' }
      ]
    }
  },
  19: {
    answer: '**`let` vs `var`**:\n\n| Feature | `let` | `var` |\n|---------|-------|-------|\n| Scope | Block `{}` | Function |\n| Hoisting | TDZ (ReferenceError) | Hoisted as `undefined` |\n| Redeclare | No (SyntaxError) | Yes |\n| Window property | No | Yes (`window.varName`) |\n| Loop semantics | Fresh binding per iteration | Single binding |',
    code: `// Scope difference
if (true) {
  var a = 1;
  let b = 2;
}
console.log(a); // 1 (var leaks)
// console.log(b); // ReferenceError

// Loop difference
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 3, 3, 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j)); // 0, 1, 2
}`,
    demo: {
      type: 'comparison',
      label: 'See let vs var in loops:',
      options: [
        { id: 'run', label: 'Run Demo', code: '', show: '#varlet-demo' }
      ]
    }
  },
  20: {
    answer: 'The name **`let`** was chosen because:\n1. It follows the mathematical convention in algebra (`let x = 5`)\n2. It was already used in early programming languages (BASIC, Scheme)\n3. It reads naturally: "let x be 10"\n4. It matches the block-scoped semantics — "let this variable exist only here"',
    code: null,
    demo: {
      type: 'info',
      label: '',
      options: []
    }
  },
  21: {
    answer: 'To redeclare variables in a `switch` block without error, **wrap each case in curly braces `{}`**. This creates a block scope for each case, preventing the duplicate declaration error that occurs because all cases share the same scope.',
    code: `// ❌ This causes SyntaxError:
switch(x) {
  case 1:
    let val = 'one';
    break;
  case 2:
    let val = 'two'; // SyntaxError!
    break;
}

// ✅ Wrap each case in {}
switch(x) {
  case 1: {
    let val = 'one';
    break;
  }
  case 2: {
    let val = 'two'; // OK (different block)
    break;
  }
}`,
    demo: {
      type: 'code-runner',
      label: 'Test switch scoping:',
      options: [
        { id: 'run', label: 'Run Demo', code: '', show: '#switch-demo' }
      ]
    }
  },
  22: {
    answer: 'The **Temporal Dead Zone (TDZ)** is the period between entering a scope and the variable declaration where `let` and `const` variables exist but cannot be accessed. Accessing them in the TDZ throws a **ReferenceError**. `var` does NOT have a TDZ.',
    code: `// TDZ with let
{
  // TDZ starts here for 'x'
  // console.log(x); // ReferenceError!
  let x = 5; // TDZ ends here
  console.log(x); // 5
}

// No TDZ with var
{
  console.log(y); // undefined (hoisted)
  var y = 5;
}

// const has TDZ too
// console.log(z); // ReferenceError
const z = 10;`,
    demo: {
      type: 'tdz',
      label: 'Visualize TDZ:',
      options: [
        { id: 'step1', label: 'Before declaration', code: '', show: '#tdz-demo' },
        { id: 'step2', label: 'After declaration', code: '', show: '#tdz-demo' }
      ]
    }
  },
  23: {
    answer: '**IIFE** (Immediately Invoked Function Expression) is a function that runs **as soon as it is defined**. Syntax: `(function(){...})()` or `(()=>{...})()`. Used for:\n- Creating private scope (pre-ES6 module pattern)\n- Avoiding global namespace pollution\n- Executing async code immediately',
    code: `// Classic IIFE
(function() {
  const privateVar = 'secret';
  console.log('IIFE runs!');
})(); // 'IIFE runs!'

// Arrow IIFE
(() => {
  console.log('Arrow IIFE');
})();

// With parameters
((name) => {
  console.log('Hello ' + name);
})('Alice');

// Module pattern (pre-ES6)
const module = (() => {
  const private = 'secret';
  return {
    getSecret: () => private
  };
})();`,
    demo: {
      type: 'code-runner',
      label: 'Run IIFE examples:',
      options: [
        { id: 'run', label: 'Run IIFE', code: '', show: '#iife-demo' }
      ]
    }
  },
  24: {
    answer: 'Use these built-in functions for URL encoding/decoding:\n\n| Function | Use Case | Encodes |\n|----------|----------|--------|\n| `encodeURI()` | Full URLs | Everything except `:/?#!@&$=+;,` |\n| `decodeURI()` | Decode full URLs | — |\n| `encodeURIComponent()` | Query parameters | ALL special chars |\n| `decodeURIComponent()` | Decode params | — |',
    code: `const url = 'https://example.com/api';
const param = 'hello world & more';

// encodeURI preserves URL structure
encodeURI(url + '/' + param);
// 'https://example.com/api/hello%20world%20&%20more'

// encodeURIComponent encodes everything
encodeURIComponent(param);
// 'hello%20world%20%26%20more'

// For query strings, use encodeURIComponent!
const safeUrl = url + '?q=' + encodeURIComponent(param);
// 'https://example.com/api?q=hello%20world%20%26%20more'`,
    demo: {
      type: 'url-encoder',
      label: 'Type text and encode:',
      options: [
        { id: 'encode', label: 'Encode', code: '', show: '#url-demo' },
        { id: 'decode', label: 'Decode', code: '', show: '#url-demo' }
      ]
    }
  },
  25: {
    answer: '**Memoization** is an optimization technique that **caches the results** of expensive function calls based on their inputs. When the same input occurs again, the cached result is returned instead of recomputing. Works best with **pure functions**.',
    code: `// Generic memoize higher-order function
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('Cache hit!');
      return cache.get(key);
    }
    console.log('Computing...');
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Expensive function
const fib = memoize(n => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

fib(40); // Computes once, caches all sub-results`,
    demo: {
      type: 'memoization',
      label: 'See memoization speed difference:',
      options: [
        { id: 'run', label: 'Test Memoization', code: '', show: '#memo-demo' }
      ]
    }
  },
  26: {
    answer: '**Hoisting** is JavaScript\'s behavior of moving **declarations** to the top of their scope before code execution. \n- `var` declarations are hoisted and initialized as `undefined`\n- `let`/`const` are hoisted but NOT initialized (TDZ)\n- Function **declarations** are hoisted entirely\n- Function **expressions** are NOT hoisted (only the variable)',
    code: `// Hoisting with var
console.log(x); // undefined (not error!)
var x = 5;

// Hoisting with function declaration
foo(); // 'foo called!' (fully hoisted)
function foo() { console.log('foo called!'); }

// NOT hoisted (function expression)
// bar(); // TypeError: bar is not a function
var bar = function() { console.log('bar'); };

// let/const: hoisted but TDZ
// console.log(z); // ReferenceError
let z = 3;`,
    demo: {
      type: 'hoisting',
      label: 'Visualize hoisting:',
      options: [
        { id: 'demo', label: 'Show Hoisting', code: '', show: '#hoist-demo' }
      ]
    }
  },
  27: {
    answer: '**ES6 Classes** are syntactic sugar over JavaScript\'s existing prototype-based inheritance. They provide a cleaner, more familiar syntax for creating objects and handling inheritance. Key features: `constructor`, `extends`, `super`, `static` methods, getters/setters.',
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + ' makes a sound';
  }
  static category() {
    return 'Living being';
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // call parent constructor
    this.breed = breed;
  }
  speak() {
    return this.name + ' barks!';
  }
}

const rex = new Dog('Rex', 'Labrador');
console.log(rex.speak());        // 'Rex barks!'
console.log(Dog.category());     // 'Living being'`,
    demo: {
      type: 'class-demo',
      label: 'Explore class inheritance:',
      options: [
        { id: 'run', label: 'Run Demo', code: '', show: '#class-demo' }
      ]
    }
  },
  28: {
    answer: 'A **closure** is a function that **remembers its lexical scope** even after the outer function has returned. The inner function "closes over" the variables of its parent. Closures are the foundation of:\n- Data privacy (module pattern)\n- Function factories\n- Partial application / currying\n- Event handlers and callbacks',
    code: `// Closure: inner function remembers count
function createCounter() {
  let count = 0; // private variable
  return function() {
    count++;     // remembers 'count'
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Data privacy: count is NOT accessible
// console.log(counter.count); // undefined

// Classic closure problem (with var)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3,3,3
}
// Fix with closure
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i); // 0,1,2
}`,
    demo: {
      type: 'closure',
      label: 'Interactive closure demo:',
      options: [
        { id: 'create', label: 'Create Counter', code: '', show: '#closure-demo' },
        { id: 'increment', label: 'Increment', code: '', show: '#closure-demo' }
      ]
    }
  },
  29: {
    answer: '**ES6 Modules** allow you to split code into separate files, each with its own scope. Use `export` to expose variables/functions and `import` to use them in other files. Modules are **strict mode by default**, **deferred by default**, and support **static analysis** for tree shaking.',
    code: `// math.js
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default class Calculator { /* ... */ }

// app.js
import Calculator, { PI, add } from './math.js';
console.log(add(2, 3)); // 5

// Or import all
import * as MathUtils from './math.js';
console.log(MathUtils.PI);

// Dynamic import
const mod = await import('./math.js');`,
    demo: {
      type: 'code-runner',
      label: 'Module concept demo:',
      options: [
        { id: 'run', label: 'Demo', code: '', show: '#module-demo' }
      ]
    }
  },
  30: {
    answer: '**Why modules?**\n1. **Encapsulation** — each module has private scope, only exports what\'s needed\n2. **Reusability** — easily import/export code across files\n3. **Maintainability** — smaller, focused files are easier to manage\n4. **Dependency management** — explicit imports show dependencies\n5. **Avoids global pollution** — no more global variables\n6. **Tree shaking** — bundlers can remove unused exports',
    code: null,
    demo: {
      type: 'info',
      label: '',
      options: []
    }
  },
  31: {
    answer: '**Scope** determines where variables and functions are accessible in code. JS has these scopes:\n\n1. **Global Scope** — accessible everywhere\n2. **Function Scope** (`var`) — accessible within function\n3. **Block Scope** (`let`/`const`) — accessible within `{}`\n4. **Lexical Scope** — inner functions can access outer scope\n5. **Module Scope** — each module has its own top-level scope',
    code: `const global = 'global'; // Global scope

function outer() {
  const outerVar = 'outer'; // Function scope (outer)
  
  function inner() {
    const innerVar = 'inner'; // Function scope (inner)
    console.log(global);   // 'global'
    console.log(outerVar); // 'outer' (lexical scope)
  }
  
  inner();
}

if (true) {
  let blockVar = 'block'; // Block scope
  var functionVar = 'function'; // Still function scope!
}

// console.log(blockVar); // ReferenceError
console.log(functionVar); // 'function' (var leaks)`,
    demo: {
      type: 'scope',
      label: 'Visualize scope chain:',
      options: [
        { id: 'run', label: 'Show Scope', code: '', show: '#scope-demo' }
      ]
    }
  }
};

// Helper for questions without custom answers
function getDefaultAnswer(q) {
  const t = q.text.toLowerCase();
  if (t.includes('service worker')) return {
    answer: 'A **Service Worker** is a script that runs in the background, separate from the web page. It enables **offline support**, **push notifications**, and **background sync**. It acts as a programmable network proxy between the browser and the network.',
    code: null,
    demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('dom') && t.includes('service')) return {
    answer: 'Service Workers **cannot directly access the DOM**. They run in a separate thread. Communication with pages happens via **`postMessage()`**. The service worker receives messages and responds, but cannot manipulate the page directly.',
    code: null,
    demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('indexeddb')) return {
    answer: '**IndexedDB** is a low-level **NoSQL storage** API built into browsers. It stores large amounts of structured data (including files/blobs). Features: **indexes** for fast searching, **transactions** for data integrity, **asynchronous** operations (no blocking).',
    code: null,
    demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('web storage')) return {
    answer: '**Web Storage** provides two mechanisms: **`localStorage`** (persists across tabs/sessions, cleared manually) and **`sessionStorage`** (per-tab, cleared when tab closes). Both store **key-value pairs** as strings. Capacity ~5-10MB per origin.',
    code: null,
    demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('post message')) return {
    answer: '**`window.postMessage(message, targetOrigin)`** enables secure **cross-origin communication** between a window and another window/iframe. The receiving window listens for the `message` event and should always check `event.origin` for security.',
    code: null,
    demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('cookie')) {
    if (t.includes('delete')) return {
      answer: 'To **delete a cookie**, set its `expires` to a past date or `max-age=0`: `document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"`. The path must match the original cookie\'s path.',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
    if (t.includes('option')) return {
      answer: 'Cookie options: **`expires`** (expiration date), **`max-age`** (seconds from now), **`path`** (URL path), **`domain`** (subdomain), **`secure`** (HTTPS only), **`httpOnly`** (no JS access), **`sameSite`** (Strict/Lax/None for CSRF protection).',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
    if (t.includes('need')) return {
      answer: '**Why cookies?** HTTP is stateless — each request is independent. Cookies **maintain state** across requests: session management (login), personalization (preferences), tracking (analytics). They\'re automatically sent with every request to the domain.',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
    if (t.includes('difference') || t.includes('local') || t.includes('session')) return {
      answer: '**Cookies vs localStorage vs sessionStorage**:\n- **Cookies**: ~4KB, sent with every HTTP request, can be HttpOnly\n- **localStorage**: ~5-10MB, persists until cleared, NOT sent to server\n- **sessionStorage**: ~5-10MB, cleared on tab close, NOT sent to server',
      code: null, demo: { type: 'comparison', label: '', options: [] }
    };
    return {
      answer: 'A **Cookie** is a small text file (max ~4KB) stored by the browser. It\'s automatically sent with every HTTP request to the domain. Used for session management, personalization, and tracking. Can be `HttpOnly` (inaccessible to JS) and `Secure` (HTTPS only).',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
  }
  if (t.includes('promise')) {
    if (t.includes('state')) return {
      answer: 'A Promise has **three states**:\n1. **Pending** — initial state, not fulfilled or rejected yet\n2. **Fulfilled** — operation completed successfully (`.then()` is called)\n3. **Rejected** — operation failed (`.catch()` is called)\n\nOnce settled (fulfilled or rejected), a promise is **immutable**.',
      code: `const promise = new Promise((resolve, reject) => {
  // Pending state
  setTimeout(() => {
    resolve('Done!'); // → Fulfilled
    // reject('Error!'); // → Rejected
  }, 1000);
});`,
      demo: { type: 'promise-states', label: 'See promise states:', options: [
        { id: 'pending', label: 'Pending', code: '', show: '#promise-demo' },
        { id: 'resolve', label: 'Fulfilled', code: '', show: '#promise-demo' },
        { id: 'reject', label: 'Rejected', code: '', show: '#promise-demo' }
      ]}
    };
    if (t.includes('need')) return {
      answer: '**Why Promises?** They solve "callback hell" by providing:\n1. **Flat chaining** with `.then()` instead of nested callbacks\n2. **Centralized error handling** with `.catch()`\n3. **Composability** with `Promise.all()`, `Promise.race()`\n4. **Immutability** — once settled, state cannot change\n5. ** async/await** syntactic sugar on top of Promises',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
    if (t.includes('all')) return {
      answer: '**`Promise.all(iterable)`** takes an array of promises and:\n- **Resolves** when ALL promises resolve, returning an array of results\n- **Rejects** immediately when ANY single promise rejects\n\nUse case: fetch multiple API endpoints in parallel and wait for all.',
      code: `const p1 = Promise.resolve(1);
const p2 = new Promise(r => setTimeout(() => r(2), 100));
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then(results => console.log(results));
// [1, 2, 3] (after ~100ms)

// If any rejects, all reject:
Promise.all([
  Promise.resolve('ok'),
  Promise.reject('FAIL')
]).catch(err => console.log(err)); // 'FAIL'`,
      demo: { type: 'promise-all', label: 'Test Promise.all:', options: [
        { id: 'all-resolve', label: 'All resolve', code: '', show: '#promise-demo2' },
        { id: 'all-reject', label: 'One rejects', code: '', show: '#promise-demo2' }
      ]}
    };
    if (t.includes('race')) return {
      answer: '**`Promise.race(iterable)`** returns a promise that settles as soon as **the first** promise in the array settles (either resolves or rejects). Unlike `Promise.all`, it doesn\'t wait for all — just the fastest one.',
      code: `const slow = new Promise(r => setTimeout(() => r('slow'), 500));
const fast = new Promise(r => setTimeout(() => r('fast'), 100));

Promise.race([slow, fast])
  .then(result => console.log(result));
// 'fast' (fastest wins)`,
      demo: { type: 'promise-race', label: 'Test Promise.race:', options: [
        { id: 'race-demo', label: 'Race demo', code: '', show: '#promise-demo3' }
      ]}
    };
    if (t.includes('chain')) return {
      answer: '**Promise chaining** uses the fact that `.then()` always returns a new Promise. Each `.then()` receives the resolved value of the previous one. This creates a **flat chain** instead of nested callbacks, enabling sequential async operations.',
      code: `fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch('/api/posts/' + user.id))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err));

// Error propagates down the chain
// Any rejection skips to nearest .catch()`,
      demo: { type: 'code-runner', label: 'See promise chaining:', options: [
        { id: 'run', label: 'Run', code: '', show: '#chain-demo' }
      ]}
    };
    return {
      answer: 'A **Promise** represents the eventual result of an asynchronous operation. It\'s like a "promise" to provide a value in the future. Promises have 3 states: **pending**, **fulfilled**, **rejected**. They provide `.then()` for success and `.catch()` for errors.',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
  }
  if (t.includes('callback')) {
    if (t.includes('hell')) return {
      answer: '**Callback hell** (also called "Pyramid of Doom") occurs when callbacks are nested inside callbacks, creating deeply indented, unreadable code. Each level of nesting adds complexity and makes error handling difficult. Promises solve this.',
      code: `// ❌ Callback Hell
getUser(id, (err, user) => {
  if (err) handleError(err);
  else getPosts(user.id, (err, posts) => {
    if (err) handleError(err);
    else getComments(posts[0].id, (err, comments) => {
      if (err) handleError(err);
      else render(comments); // 4 levels deep!
    });
  });
});

// ✅ With Promises
getUser(id)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => render(comments))
  .catch(handleError);`,
      demo: { type: 'comparison', label: 'Compare callback hell vs promises:', options: [
        { id: 'run', label: 'Show Comparison', code: '', show: '#cb-demo' }
      ]}
    };
    return {
      answer: 'A **callback function** is a function passed as an argument to another function, to be **executed later** — usually after an asynchronous operation completes. Callbacks are the foundation of async JS but can lead to "callback hell" when nested deeply.',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
  }
  if (t.includes('strict mode')) {
    if (t.includes('need')) return {
      answer: '**Why strict mode?** It makes JavaScript more secure:\n- Prevents accidental global variables\n- Eliminates `this` coercion to the global object\n- Disables `with` statement\n- Makes `eval()` safer\n- Throws errors on duplicate parameter names\n- Prevents deleting non-configurable properties\n- More optimizable by the engine',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
    if (t.includes('declare')) return {
      answer: 'Declare strict mode with `"use strict";` at the top of a script or function. It must be the first statement (only comments allowed before it). Once in strict mode, **it cannot be cancelled**.',
      code: `// File-level strict mode
'use strict';
// All code here is strict

// Function-level strict mode
function strictFn() {
  'use strict';
  // Only this function is strict
}

// Module scripts are strict by default!
// <script type="module"> → automatic strict mode`,
      demo: { type: 'code-runner', label: 'Test strict mode:', options: [
        { id: 'run', label: 'Run', code: '', show: '#strict-demo' }
      ]}
    };
    return {
      answer: '**Strict mode** is a restricted subset of JavaScript that catches common mistakes. Enable it with `"use strict";`. Changes include: no undeclared variables, `this` is `undefined` in functions (not global), no `with`, no duplicate params, and more.',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
  }
  if (t.includes('typeof')) return {
    answer: 'The **`typeof` operator** returns a string indicating the type of the operand. **Caveat**: `typeof null === "object"` (historical bug). Use `Array.isArray()` for arrays.',
    code: `console.log(typeof 42);        // 'number'
console.log(typeof 'hello');   // 'string'
console.log(typeof true);      // 'boolean'
console.log(typeof undefined); // 'undefined'
console.log(typeof null);      // 'object' ⚠️
console.log(typeof {});        // 'object'
console.log(typeof []);        // 'object'
console.log(typeof function(){}); // 'function'
console.log(typeof Symbol());  // 'symbol'
console.log(typeof 1n);        // 'bigint'`,
    demo: { type: 'type-checker', label: 'Click to check types:', options: [
      { id: 'check', label: 'Check All Types', code: '', show: '#typeof-demo' }
    ]}
  };
  if (t.includes('null') && t.includes('undefined')) return {
    answer: '**`null` vs `undefined`**:\n- **`undefined`**: variable declared but not assigned a value, or property that doesn\'t exist\n- **`null`**: intentional empty value (developer-assigned "nothing")\n- `typeof null === "object"` (historic bug, can\'t be fixed)\n- `null == undefined` → `true`, but `null === undefined` → `false`',
    code: `let a;          // undefined (not assigned)
let b = null;   // null (intentional empty)

console.log(a);        // undefined
console.log(b);        // null
console.log(typeof a); // 'undefined'
console.log(typeof b); // 'object'  ⚠️

console.log(null == undefined);  // true
console.log(null === undefined); // false`,
    demo: { type: 'comparison', label: 'Compare null vs undefined:', options: [
      { id: 'run', label: 'Compare', code: '', show: '#null-demo' }
    ]}
  };
  if (t.includes('nan')) return {
    answer: '**`NaN`** (Not-a-Number) is a special value when math operations fail. It\'s the **only** JavaScript value not equal to itself: `NaN !== NaN`. Check with `Number.isNaN()` (not global `isNaN()` which coerces).',
    code: `console.log(0 / 0);          // NaN
console.log(parseInt('abc')); // NaN
console.log(Math.sqrt(-1));   // NaN

// NaN is never equal to itself!
console.log(NaN === NaN); // false
console.log(NaN == NaN);  // false

// Check correctly:
console.log(Number.isNaN(NaN));  // true
console.log(Number.isNaN('abc')); // false (no coercion)
console.log(isNaN('abc'));       // true (coerces first!)`,
    demo: { type: 'code-runner', label: 'Test NaN behavior:', options: [
      { id: 'run', label: 'Run', code: '', show: '#nan-demo' }
    ]}
  };
  if (t.includes('event')) {
    if (t.includes('captur')) return {
      answer: '**Event capturing** (also called "trickling") is the first phase of event propagation. The event starts from the root (`document`) and travels **down** to the target element. The capturing phase happens BEFORE the target and bubbling phases. Use `addEventListener(type, handler, true)` to listen during capture phase.',
      code: `// Capture phase listener (3rd arg = true)
document.addEventListener('click', () => {
  console.log('Capture: document');
}, true);

document.getElementById('btn').addEventListener('click', () => {
  console.log('Capture: button');
}, true);

// Order: document → html → body → button (capture)
// Then: button → body → html → document (bubble)`,
      demo: { type: 'event-flow', label: 'Visualize event phases:', options: [
        { id: 'capture', label: 'Capture', code: '', show: '#event-demo' },
        { id: 'bubble', label: 'Bubble', code: '', show: '#event-demo' }
      ]}
    };
    if (t.includes('bubbl')) return {
      answer: '**Event bubbling** is the default event propagation phase. After reaching the target, the event travels **up** through ancestors. This is the basis for **event delegation** — handling events on a parent instead of many children.',
      code: `parent.addEventListener('click', () => console.log('Parent clicked'));
child.addEventListener('click', () => console.log('Child clicked'));
// Click child: "Child clicked" then "Parent clicked" (bubbles up!)
// Stop bubbling: e.stopPropagation()`,
      demo: { type: 'code-runner', label: 'Event bubbling:', options: [{ id: 'run', label: 'Run', code: '', show: '#bubble-demo' }] }
    };
    if (t.includes('delegation')) return {
      answer: '**Event delegation** is a pattern where you attach a single event listener to a **parent element** instead of multiple listeners to individual children. It works because of **event bubbling**. Benefits: better performance, works for dynamically added elements.',
      code: `// ❌ Without delegation (many listeners)
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', () => handleClick(li));
});

// ✅ With delegation (single listener)
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    handleClick(e.target);
  }
});

// New <li> elements automatically handled!`,
      demo: { type: 'code-runner', label: 'See delegation:', options: [
        { id: 'run', label: 'Demo', code: '', show: '#delegation-demo' }
      ]}
    };
    if (t.includes('prevent') || t.includes('default')) return {
      answer: '**`event.preventDefault()`** cancels the default browser action for an event. Examples:\n- Clicking a link → prevents navigation\n- Submitting a form → prevents HTTP request\n- Right-click → prevents context menu\n\nNote: it does NOT stop event propagation.',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
    if (t.includes('stop')) return {
      answer: '**`event.stopPropagation()`** prevents the event from traveling further in the capture/bubble phases. Use with caution — it can break event delegation patterns. `stopImmediatePropagation()` also prevents other listeners on the same element.',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
    if (t.includes('flow')) return {
      answer: '**Event flow** has 3 phases:\n1. **Capture phase** — event travels from `window` → target element\n2. **Target phase** — event reaches the target element\n3. **Bubble phase** — event travels from target → `window`\n\nBy default, event listeners run during the **bubble phase**. Use `addEventListener(type, handler, true)` for capture phase.',
      code: null, demo: { type: 'event-flow', label: 'Visualize event flow:', options: [
        { id: 'show', label: 'Show Flow', code: '', show: '#flow-demo' }
      ]}
    };
  }
  if (t.includes('closure')) return {
    answer: 'A **closure** is created when a function retains access to variables from its parent scope, even after the parent has returned. Every function in JavaScript is a closure. Used for: data privacy, function factories, module pattern, event handlers.',
    code: null, demo: { type: 'closure', label: 'Closure demo:', options: [
      { id: 'demo', label: 'Demo', code: '', show: '#closure-demo' }
    ]}
  };
  if (t.includes('event loop')) return {
    answer: 'The **Event Loop** is the mechanism that allows JavaScript (single-threaded) to handle asynchronous operations. It continuously checks if the **call stack** is empty, and if so, moves callbacks from the **task queue** (or microtask queue) to the stack for execution.',
    code: null, demo: { type: 'event-loop', label: 'Visualize event loop:', options: [
      { id: 'run', label: 'Run', code: '', show: '#eloop-demo' }
    ]}
  };
  if (t.includes('call stack')) return {
    answer: 'The **Call Stack** is a LIFO (Last In, First Out) data structure that tracks function calls. When a function is called, its frame is **pushed** onto the stack. When it returns, it\'s **popped** off. Stack overflow occurs when the stack exceeds its limit (e.g., infinite recursion).',
    code: null, demo: { type: 'call-stack', label: 'Visualize call stack:', options: [
      { id: 'run', label: 'Show Stack', code: '', show: '#stack-demo' }
    ]}
  };
  if (t.includes('microtask')) return {
    answer: '**Microtasks** have higher priority than macrotasks. They are processed after each macrotask completes and before the next macrotask. Sources: Promise `.then()/catch()/finally()`, `queueMicrotask()`, `MutationObserver`. The microtask queue is **drained completely** before moving to the next macrotask.',
    code: null, demo: { type: 'code-runner', label: 'Microtask vs macrotask:', options: [
      { id: 'run', label: 'Run', code: '', show: '#micro-demo' }
    ]}
  };
  if (t.includes('debounc')) return {
    answer: '**Debouncing** delays function execution until a pause in events. The function runs only after `wait` milliseconds have passed since the **last** event. Use cases: search input, window resize, auto-save. The function is called once at the end of the burst.',
    code: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  fetch('/search?q=' + query);
}, 300);

// Only runs after user stops typing for 300ms`,
    demo: { type: 'debounce', label: 'Type to see debounce:', options: [
      { id: 'demo', label: 'Test', code: '', show: '#debounce-demo' }
    ]}
  };
  if (t.includes('throttl')) return {
    answer: '**Throttling** ensures a function executes at most once per specified interval. Unlike debounce (which resets the timer), throttle guarantees regular execution. Use cases: scroll events, resize handlers, game input, animation frames.',
    code: `function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage
const handleScroll = throttle(() => {
  console.log('Scroll!');
}, 200);

// Runs at most every 200ms, even if scrolling continuously`,
    demo: { type: 'throttle', label: 'See throttling in action:', options: [
      { id: 'demo', label: 'Test', code: '', show: '#throttle-demo' }
    ]}
  };
  if (t.includes('this')) return {
    answer: 'The **`this` keyword** refers to the object that is currently executing the function. Its value depends on **how the function is called**, not where it\'s defined:\n- Global context → `window` (or `undefined` in strict mode)\n- Method call → the owner object\n- Constructor `new` → the new instance\n- Arrow function → lexical scope (outer `this`)\n- `call`/`apply`/`bind` → explicitly set',
    code: null, demo: { type: 'this-demo', label: 'See \'this\' behavior:', options: [
      { id: 'global', label: 'Global this', code: '', show: '#this-demo' },
      { id: 'method', label: 'Method this', code: '', show: '#this-demo' },
      { id: 'arrow', label: 'Arrow this', code: '', show: '#this-demo' }
    ]}
  };
  if (t.includes('optional chain')) return {
    answer: '**Optional chaining (`?.`)** safely accesses nested properties without throwing an error if an intermediate value is `null` or `undefined`. Returns `undefined` instead of throwing `TypeError`. Also works for method calls `obj?.method?.()` and dynamic access `arr?.[index]`.',
    code: `const user = { profile: { name: 'Alice' } };

// Without optional chaining
const city = user && user.address && user.address.city;
// TypeError if address is missing

// With optional chaining
const city2 = user?.address?.city; // undefined

// Method calls
const result = obj?.method?.(); // undefined if no method

// Dynamic access
const value = arr?.[index];`,
    demo: { type: 'code-runner', label: 'Test optional chaining:', options: [
      { id: 'run', label: 'Run', code: '', show: '#optional-demo' }
    ]}
  };
  if (t.includes('nullish coalescing') || t.includes('??')) return {
    answer: '**Nullish coalescing (`??`)** returns the right-hand side only if the left-hand side is `null` or `undefined`. Unlike `||`, it DOES NOT treat `0`, `""`, or `false` as falsy. This makes it safer for default values.',
    code: `const value1 = 0;
const value2 = null;
const value3 = '';

// || operator
console.log(value1 || 'default'); // 'default' (0 is falsy)
console.log(value2 || 'default'); // 'default'

// ?? operator (better!)
console.log(value1 ?? 'default'); // 0 (0 is NOT null/undefined)
console.log(value3 ?? 'default'); // '' (empty string preserved)
console.log(value2 ?? 'default'); // 'default' (null → default)`,
    demo: { type: 'comparison', label: 'Compare || vs ??:', options: [
      { id: 'run', label: 'Compare', code: '', show: '#nullish-demo' }
    ]}
  };
  if (t.includes('spread operator')) return {
    answer: 'The **spread operator (`...`)** expands an iterable (array, string, object) into individual elements. Uses:\n- Clone arrays: `[...arr]`\n- Merge arrays: `[...a, ...b]`\n- Pass array as arguments: `Math.max(...nums)`\n- Clone objects: `{...obj}`\n- Merge objects: `{...a, ...b}`',
    code: null, demo: { type: 'spread', label: 'Visualize spread:', options: [
      { id: 'run', label: 'Show Spread', code: '', show: '#spread-demo' }
    ]}
  };
  if (t.includes('destructur')) return {
    answer: '**Destructuring** unpacks values from arrays or properties from objects into distinct variables. It makes code cleaner and enables swapping without temp variables. Works with nested structures, default values, and rest patterns.',
    code: `// Array destructuring
const [a, b, ...rest] = [1, 2, 3, 4];
console.log(a); // 1
console.log(b); // 2
console.log(rest); // [3, 4]

// Object destructuring
const { name, age, ...rest2 } = { name: 'Alice', age: 30, city: 'NYC' };
console.log(name); // 'Alice'
console.log(age);  // 30
console.log(rest2); // { city: 'NYC' }

// Default values
const [x = 10] = [];
const { y = 20 } = {};

// Swapping
[a, b] = [b, a];`,
    demo: { type: 'destructuring', label: 'Interactive destructuring:', options: [
      { id: 'demo', label: 'Demo', code: '', show: '#destruct-demo' }
    ]}
  };
  if (t.includes('map') || t.includes('set')) {
    if (t.includes('weak')) return {
      answer: '**WeakMap/WeakSet** hold **weak references** to their keys — they don\'t prevent garbage collection. Key differences from Map/Set:\n- Only objects as keys (WeakMap) or values (WeakSet)\n- **No iteration** methods (no `forEach`, `keys`, `values`, `entries`)\n- **No `.size`** property\n- Use case: storing private data tied to DOM elements without memory leaks',
      code: null, demo: { type: 'info', label: '', options: [] }
    };
    return {
      answer: '**Map** and **Set** are ES6 collection types:\n- **Map**: key-value pairs with any key type, preserves insertion order, has `.size`\n- **Set**: collection of unique values (no duplicates), also preserves order, has `.size`\n- Both are iterable and have `.forEach()`',
      code: null, demo: { type: 'collection', label: 'Explore Map/Set:', options: [
        { id: 'map', label: 'Map Demo', code: '', show: '#map-demo' },
        { id: 'set', label: 'Set Demo', code: '', show: '#map-demo' }
      ]}
    };
  }
  if (t.includes('async')) return {
    answer: '**`async` functions** always return a Promise. The `await` keyword pauses execution until the Promise settles, making async code look synchronous. `await` can only be used inside `async` functions (except top-level await in modules).',
    code: null, demo: { type: 'code-runner', label: 'Run async demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#async-demo' }
    ]}
  };
  if (t.includes('freeze')) return {
    answer: '**`Object.freeze(obj)`** makes an object **immutable**: cannot add, remove, or change properties. It\'s **shallow** — nested objects remain mutable. Use for: configuration objects, constants, state management, preventing mutation.',
    code: null, demo: { type: 'freeze', label: 'Test Object.freeze:', options: [
      { id: 'demo', label: 'Demo', code: '', show: '#freeze-demo' }
    ]}
  };
  if (t.includes('proxy')) return {
    answer: 'A **Proxy** wraps an object and intercepts operations like property access, assignment, deletion, function calls, etc. Used for: validation, logging, reactivity (Vue 3), caching, access control, data binding.',
    code: null, demo: { type: 'proxy', label: 'See proxy in action:', options: [
      { id: 'run', label: 'Run', code: '', show: '#proxy-demo' }
    ]}
  };
  if (t.includes('json.stringify') || t.includes('json parse')) return {
    answer: '**`JSON.stringify()`** converts a JS value to a JSON string. **`JSON.parse()`** converts a JSON string back to a JS value. Use `JSON.stringify(val, replacer, space)` for pretty-printing with the `space` parameter.',
    code: null, demo: { type: 'json-formatter', label: 'Try JSON formatting:', options: [
      { id: 'run', label: 'Format', code: '', show: '#json-demo' }
    ]}
  };
  if (t.includes('requestanimationframe')) return {
    answer: '**`requestAnimationFrame(callback)`** schedules code to run before the next browser repaint. It\'s the **preferred** way to create smooth animations — it syncs with the monitor\'s refresh rate (typically 60fps) and pauses when the tab is inactive (saves battery).',
    code: null, demo: { type: 'animation', label: 'See rAF animation:', options: [
      { id: 'start', label: 'Start', code: '', show: '#raf-demo' },
      { id: 'stop', label: 'Stop', code: '', show: '#raf-demo' }
    ]}
  };
  if (t.includes('structuredclone')) return {
    answer: '**`structuredClone(value)`** creates a **deep copy** of a value. It handles circular references, `Date`, `Map`, `Set`, `ArrayBuffer`, `Blob`, `File`, `ImageData`, and more. Better than `JSON.parse(JSON.stringify(obj))` because it preserves types and handles circular refs.',
    code: null, demo: { type: 'code-runner', label: 'Test structured clone:', options: [
      { id: 'run', label: 'Run', code: '', show: '#clone-demo' }
    ]}
  };
  if (t.includes('const') && t.includes('freeze')) return {
    answer: '**`const` vs `Object.freeze()`**:\n- **`const`** prevents **reassignment** of the variable binding: `const x = {}; x = {} // Error`\n- **`Object.freeze()`** prevents **mutation** of the object: `const x = Object.freeze({a: 1}); x.a = 2 // fails silently (or TypeError in strict)`\n- They solve different problems! Use both: `const frozen = Object.freeze({...})`',
    code: null, demo: { type: 'comparison', label: 'Test const vs freeze:', options: [
      { id: 'run', label: 'Compare', code: '', show: '#constfreeze-demo' }
    ]}
  };
  if (t.includes('globalthis')) return {
    answer: '**`globalThis`** provides a standard way to access the global object across all JavaScript environments:\n- Browser: `window`\n- Node.js: `global`\n- Web Workers: `self`\n\nBefore `globalThis`, you had to check which environment you were in. Now just use `globalThis` everywhere.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('obfuscation')) return {
    answer: '**Obfuscation** transforms readable code into intentionally unreadable code (renaming variables, string encoding, control flow flattening) to make reverse engineering harder. **Minification** just removes whitespace and shortens names for smaller file sizes. Obfuscation is NOT encryption — it can be reverse-engineered with effort.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('minification')) return {
    answer: '**Minification** removes unnecessary characters (whitespace, comments, newlines) and shortens variable names without changing functionality. Common tools: **Terser**, **UglifyJS**, **esbuild**, **Google Closure Compiler**. Reduces file size by 50-70% on average.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('polyfill')) return {
    answer: 'A **polyfill** is a piece of code that implements a **modern API** in older browsers that don\'t support it natively. Example: adding `Array.prototype.includes` for IE11. This is different from a **shim**, which intercepts existing API calls and changes their behavior.',
    code: null, demo: { type: 'code-runner', label: 'See polyfill example:', options: [
      { id: 'run', label: 'Run', code: '', show: '#polyfill-demo' }
    ]}
  };
  if (t.includes('babel')) return {
    answer: '**Babel** is a JavaScript **compiler/transpiler** that converts modern ES6+ code into backwards-compatible ES5 code for older browsers. It also handles JSX (React), TypeScript, and proposed language features via plugins/presets.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('node') && !t.includes('nodejs')) return {
    answer: '**Node.js** is a JavaScript runtime built on Chrome\'s **V8 engine** for server-side development. It\'s **non-blocking**, **event-driven**, and includes built-in modules (`fs`, `http`, `path`, `os`). Uses **npm** as its package manager.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('typescript')) return {
    answer: '**TypeScript** is a **typed superset** of JavaScript that compiles to plain JS. Adds: static types, interfaces, enums, generics, decorators. Benefits: catch errors at compile-time, better IDE support, self-documenting code, easier large-scale refactoring.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('deno')) return {
    answer: '**Deno** is a secure JavaScript/TypeScript runtime by Ryan Dahl (Node.js creator). Key features: **secure by default** (no file/network access without flags), **built-in TypeScript**, supports ES modules, has `deno fmt/lint/test` built-in.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('web worker')) {
    if (t.includes('check') && t.includes('support')) return {
      answer: '**Check Web Worker support**: Test if `window.Worker` exists: `if (typeof Worker !== "undefined") { /* supported */ }`. All modern browsers support Web Workers. Fallback: run the task on the main thread with UI blocking notices if unsupported.',
      code: `function supportsWorkers() {
  return typeof Worker !== 'undefined';
}

if (supportsWorkers()) {
  const worker = new Worker('task.js');
  worker.postMessage({ cmd: 'start' });
  worker.onmessage = (e) => {
    console.log('Result:', e.data);
  };
} else {
  console.log('Workers not supported. Running on main thread...');
  // Fallback: run synchronously (may block UI)
}`,
      demo: { type: 'code-runner', label: 'Check Worker support:', options: [{ id: 'run', label: 'Check', code: '', show: '#worker-support-demo' }] }
    };
    if (t.includes('example') || t.includes('give')) return {
      answer: '**Web Worker example**: A worker runs a separate script in a background thread. The main thread sends data via `postMessage()`, the worker processes it, and posts the result back. Workers cannot access the DOM but can use most Web APIs (fetch, IndexedDB, etc.).',
      code: `// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: [1, 2, 3, 4, 5], task: 'sum' });
worker.onmessage = (e) => {
  console.log('Result from worker:', e.data); // 15
};
worker.onerror = (e) => {
  console.error('Worker error:', e.message);
};

// worker.js
self.onmessage = (e) => {
  const { data, task } = e.data;
  if (task === 'sum') {
    const result = data.reduce((a, b) => a + b, 0);
    self.postMessage(result);
  }
};`,
      demo: { type: 'code-runner', label: 'Worker example:', options: [{ id: 'run', label: 'Show Code', code: '', show: '#worker-example-demo' }] }
    };
    if (t.includes('restriction') || t.includes('dom')) return {
      answer: '**Web Worker DOM restrictions**: Workers run in a separate thread and CANNOT:\n- Access the DOM (`document`, `window`, `parent`)\n- Use `alert()`, `confirm()`, `prompt()`\n- Access `localStorage` or `sessionStorage`\n\nThey CAN use: `fetch()`, `XMLHttpRequest`, `IndexedDB`, `WebSockets`, `setTimeout/setInterval`, `Canvas` (via OffscreenCanvas), `importScripts()`/`import()`',
      code: `// ❌ What workers CANNOT do:
// document.getElementById('foo');     // Error
// window.location;                    // Error
// localStorage.getItem('key');       // Error
// alert('Hello');                     // Error

// ✅ What workers CAN do:
self.postMessage('Hello from worker'); // Communicate
fetch('/api/data').then(r => r.json()); // HTTP
const db = self.indexedDB.open('db');   // Storage
importScripts('helper.js');            // Load scripts
setTimeout(() => self.postMessage('done'), 1000);`,
      demo: { type: 'code-runner', label: 'Worker restrictions:', options: [{ id: 'run', label: 'See Restrictions', code: '', show: '#worker-restrict-demo' }] }
    };
    return {
      answer: '**Web Workers** run scripts in **background threads** separate from the main UI thread. They cannot access the DOM. Communication is via `postMessage()`. Workers are ideal for CPU-intensive tasks (image processing, data parsing) that would otherwise block the UI.',
      code: `const worker = new Worker('worker.js');
worker.postMessage('Hello');
worker.onmessage = (e) => console.log(e.data);
// worker.js:
// self.onmessage = (e) => { self.postMessage('Hi!'); };`,
      demo: { type: 'code-runner', label: 'Web Worker demo:', options: [{ id: 'run', label: 'Run', code: '', show: '#worker-demo' }] }
    };
  }
  if (t.includes('ajax')) return {
    answer: '**AJAX** (Asynchronous JavaScript and XML) is a technique for sending/receiving data from the server **without page reload**. Modern replacement: **`fetch()` API** (returns a Promise) instead of old `XMLHttpRequest`. Data format is usually JSON now, not XML.',
    code: null, demo: { type: 'code-runner', label: 'AJAX concept demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#ajax-demo' }
    ]}
  };
  if (t.includes('abort') || t.includes('cancel')) return {
    answer: 'Use **`AbortController`** to cancel a fetch request: `const ctrl = new AbortController(); fetch(url, {signal: ctrl.signal}); ctrl.abort()`. The fetch Promise rejects with an `AbortError`. One controller can abort multiple requests.',
    code: null, demo: { type: 'code-runner', label: 'Abort fetch demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#abort-demo' }
    ]}
  };
  if (t.includes('generator')) return {
    answer: '**Generators** (`function*`) can pause execution with `yield` and resume later. They return an iterator. Each call to `.next()` runs until the next `yield`. `yield*` delegates to another generator. Used for: lazy evaluation, infinite sequences, async flow control.',
    code: null, demo: { type: 'code-runner', label: 'Generator demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#gen-demo' }
    ]}
  };
  if (t.includes('iterator')) return {
    answer: 'An **Iterator** is an object with a `next()` method that returns `{value, done}`. An **Iterable** has a `[Symbol.iterator]()` method that returns an iterator. Built-in iterables: arrays, strings, Map, Set. `for...of` loops use the iterator protocol.',
    code: null, demo: { type: 'code-runner', label: 'Iterator demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#iter-demo' }
    ]}
  };
  if (t.includes('compose') || t.includes('pipe')) return {
    answer: '**Compose** and **Pipe** combine multiple functions into one:\n- **Compose**: right-to-left `compose(f, g)(x) = f(g(x))`\n- **Pipe**: left-to-right `pipe(f, g)(x) = g(f(x))`\n\nBoth are fundamental to functional programming in JavaScript.',
    code: null, demo: { type: 'compose-pipe', label: 'See compose vs pipe:', options: [
      { id: 'run', label: 'Run', code: '', show: '#compose-demo' }
    ]}
  };
  if (t.includes('currying') || t.includes('curry')) return {
    answer: '**Currying** transforms a multi-argument function into a sequence of unary (single-argument) functions. Example: `add(a,b,c)` → `add(a)(b)(c)`. Enables partial application, function composition, and creating specialized functions from general ones.',
    code: null, demo: { type: 'currying', label: 'Currying step by step:', options: [
      { id: 'step', label: 'Step Through', code: '', show: '#curry-demo' }
    ]}
  };
  if (t.includes('mixin')) return {
    answer: '**Mixins** are a pattern for composing objects by **copying properties** from multiple source objects. Unlike class inheritance (single parent), mixins allow combining behaviors from multiple sources using `Object.assign(target, ...sources)` or spread syntax.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('shallow') && t.includes('deep')) return {
    answer: '**Shallow copy** copies top-level properties — nested objects still reference the same memory. **Deep copy** creates a completely independent clone. Methods:\n- Shallow: `{...obj}`, `Object.assign()`, `arr.slice()`\n- Deep: `structuredClone(obj)`, `JSON.parse(JSON.stringify(obj))` (has limitations - no functions, dates become strings)',
    code: null, demo: { type: 'comparison', label: 'Shallow vs deep:', options: [
      { id: 'run', label: 'Compare', code: '', show: '#copy-demo' }
    ]}
  };
  if (t.includes('seal')) return {
    answer: '**`Object.seal(obj)`** prevents adding/removing properties but allows **changing existing values**. It sets all properties\' `configurable: false`. Use when you want a fixed-shape object where values can still be updated.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('module pattern')) return {
    answer: 'The **Module Pattern** uses an IIFE + closures to create **private** and **public** members. Only what\'s returned is accessible outside. This was the standard pattern for encapsulation before ES6 modules.',
    code: null, demo: { type: 'code-runner', label: 'Module pattern demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#module-pat-demo' }
    ]}
  };
  if (t.includes('memory leak')) return {
    answer: '**Memory leaks** occur when memory is no longer needed but not freed. Common JS causes:\n1. **Global variables** — never garbage collected\n2. **Forgotten timers/intervals** — `setInterval` holding references\n3. **Detached DOM** — JS references to removed DOM elements\n4. **Event listeners** — not removed when element is removed\n5. **Closures** — holding large data in closure scope',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('hidden class')) return {
    answer: '**Hidden classes** are a V8 optimization. When objects share the same property structure (same properties in same order), they share a hidden class, enabling faster property access via **inline caching**. Adding or deleting properties creates a new hidden class transition.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('inline caching')) return {
    answer: '**Inline Caching** is a V8 optimization that caches the result of property lookups based on the object\'s **hidden class**. After the first lookup, subsequent accesses to the same property on objects of the same shape are extremely fast (direct memory offset instead of hash lookup).',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('tree shaking')) return {
    answer: '**Tree shaking** (dead code elimination) is a build-time optimization where unused exports are removed from the final bundle. It works because ES6 modules are **statically analyzable** — imports/exports are fixed at compile time (not dynamic like CommonJS `require`).',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('bom')) return {
    answer: '**BOM** (Browser Object Model) provides APIs to interact with the browser outside the DOM: `navigator` (browser info), `location` (URL), `history` (navigation), `screen` (display), `frames`, `setTimeout`, etc.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('pwa')) return {
    answer: '**PWAs** (Progressive Web Apps) are web applications that can behave like native apps using modern browser capabilities: **Service Workers** (offline), **Web App Manifest** (installable), **Push Notifications**, **Background Sync**. They work offline and can be installed on the home screen.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('v8')) return {
    answer: '**V8** is Google\'s open-source JavaScript engine written in C++. It **JIT compiles** JavaScript to machine code. Key optimizations: hidden classes, inline caching, turbofan (optimizing compiler), ignition (interpreter), generational garbage collector.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('observable') || t.includes('rxjs')) return {
    answer: '**Observables** are data streams that emit values over time. Unlike Promises (single value), Observables emit **multiple values** and are **lazy** (don\'t execute until subscribed). **RxJS** is the most popular library implementing Observables with operators for transformation, filtering, and combination.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('event loop')) return {
    answer: 'The **Event Loop** enables non-blocking I/O in single-threaded JavaScript. **Phases:**\n1. Execute current task on call stack\n2. Process **microtask queue** (Promise callbacks) until empty\n3. Pick next **macrotask** from task queue (setTimeout, events, I/O)\n4. Repeat\n\nMicrotasks have priority over macrotasks.',
    code: null, demo: { type: 'event-loop', label: 'Visualize event loop:', options: [
      { id: 'run', label: 'Run', code: '', show: '#eloop-demo' }
    ]}
  };
  if (t.includes('for...of') || t.includes('for...in')) return {
    answer: '**`for...of`** iterates over **values** of an iterable (arrays, strings, Map, Set). **`for...in`** iterates over enumerable **property keys** (strings) of an object. Use `for...of` for arrays, `for...in` for objects (with `hasOwnProperty` check).',
    code: null, demo: { type: 'comparison', label: 'Compare for...of vs for...in:', options: [
      { id: 'run', label: 'Run', code: '', show: '#for-demo' }
    ]}
  };
  if (t.includes('rest parameter')) return {
    answer: '**Rest parameter (`...args`)** captures all remaining arguments into a **real array**. Unlike `arguments` (array-like), rest parameters are actual arrays with array methods. Must be the **last** parameter in the function definition.',
    code: null, demo: { type: 'code-runner', label: 'Rest param demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#rest-demo' }
    ]}
  };
  if (t.includes('first class function')) return {
    answer: '**First-class functions** means functions are treated like any other value — they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures. This enables **higher-order functions** and **functional programming** patterns.',
    code: null, demo: { type: 'code-runner', label: 'First-class function demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#fc-demo' }
    ]}
  };
  if (t.includes('higher order function')) return {
    answer: '**Higher-order functions** take functions as arguments and/or return functions. Built-in examples: `Array.map()`, `Array.filter()`, `Array.reduce()`, `setTimeout()`. They enable **abstraction** — we tell the function WHAT to do, not HOW.',
    code: null, demo: { type: 'higher-order', label: 'HOF examples:', options: [
      { id: 'run', label: 'Run', code: '', show: '#hof-demo2' }
    ]}
  };
  if (t.includes('sort')) return {
    answer: '**`Array.sort()`** converts elements to strings and sorts lexicographically by default. Always pass a **compare function**: `arr.sort((a, b) => a - b)` for ascending, `arr.sort((a, b) => b - a)` for descending. The function returns negative (a before b), zero (equal), or positive (b before a).',
    code: null, demo: { type: 'sort-visualizer', label: 'See sorting in action:', options: [
      { id: 'asc', label: 'Ascending', code: '', show: '#sort-demo' },
      { id: 'desc', label: 'Descending', code: '', show: '#sort-demo' }
    ]}
  };
  if (t.includes('map') && t.includes('foreach')) return {
    answer: '**`map` vs `forEach`**:\n- **`map()`** returns a **new array** with transformed elements (used for transformation)\n- **`forEach()`** returns **`undefined`** (used for side effects like logging, DOM updates)\n- `map()` is chainable, `forEach()` is not\n- Choose `map` when you need a result, `forEach` when you just want to perform an action',
    code: null, demo: { type: 'comparison', label: 'Compare map vs forEach:', options: [
      { id: 'run', label: 'Run', code: '', show: '#mapforeach-demo' }
    ]}
  };
  if (t.includes('bind')) return {
    answer: '**Custom `bind` implementation**: `Function.prototype.bind` creates a new function with a fixed `this` context. You can implement it using `call` or `apply` with closure to remember the bound arguments.',
    code: null, demo: { type: 'code-runner', label: 'Custom bind demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#bind-demo' }
    ]}
  };
  if (t.includes('compose') || t.includes('pipe')) return {
    answer: '**Function Composition**: `compose(f, g)(x) = f(g(x))` (right-to-left). **Pipe**: `pipe(f, g)(x) = g(f(x))` (left-to-right). Both combine simple functions into complex ones. Libraries like Lodash have `_.flow()` (pipe) and `_.flowRight()` (compose).',
    code: null, demo: { type: 'compose-pipe', label: 'Compose vs pipe:', options: [
      { id: 'run', label: 'Run', code: '', show: '#compose-demo' }
    ]}
  };
  if (t.includes('thunk')) return {
    answer: 'A **thunk** is a function that wraps an expression to **delay its evaluation**. In Redux, async thunks are functions that return a function (instead of an action object) enabling side effects and async logic in action creators.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('pure') && t.includes('impure')) return {
    answer: '**Pure functions**: same input → same output, no side effects, no external state access. **Impure functions**: may produce different output for same input OR cause side effects. Pure functions are easier to test, cache, and reason about.',
    code: null, demo: { type: 'comparison', label: 'Pure vs impure:', options: [
      { id: 'run', label: 'Run', code: '', show: '#pureimpure-demo' }
    ]}
  };
  if (t.includes('accessor') || t.includes('getter') || t.includes('setter')) return {
    answer: '**Getters** and **Setters** are special methods that execute when a property is accessed or assigned. They allow **computed properties**, **validation**, and **encapsulation**. Define with `get`/`set` keywords or `Object.defineProperty()`.',
    code: null, demo: { type: 'code-runner', label: 'Getter/setter demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#accessor-demo' }
    ]}
  };
  if (t.includes('custom element') || t.includes('web component')) return {
    answer: '**Custom Elements** allow defining new HTML tags. Extend `HTMLElement` class, define lifecycle callbacks (`connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`), and register with `customElements.define()`.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('ecmascript')) return {
    answer: '**ECMAScript** (ES) is the standardized specification that JavaScript implements. Maintained by **TC39** committee. Major versions: ES3 (1999), ES5 (2009), ES6/ES2015 (major update), and annual releases since 2015 (ES2016–ES2024+).',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('debounc')) return {
    answer: '**Debouncing** prevents a function from firing too frequently by delaying execution until after a specified **quiet period**. Each new event resets the timer. Use for: search autocomplete, window resize handlers, form auto-save.',
    code: null, demo: { type: 'debounce', label: 'Type to test debounce:', options: [
      { id: 'demo', label: 'Test', code: '', show: '#debounce-demo' }
    ]}
  };
  if (t.includes('throttl')) return {
    answer: '**Throttling** limits a function to execute at most once in a specified interval. Unlike debounce (which waits for a pause), throttle fires regularly during continuous events. Use for: scroll handlers, game input, resize events.',
    code: null, demo: { type: 'throttle', label: 'See throttling:', options: [
      { id: 'demo', label: 'Test', code: '', show: '#throttle-demo' }
    ]}
  };
  if (t.includes('shadowing')) return {
    answer: '**Variable shadowing** occurs when a variable in an inner scope has the **same name** as one in an outer scope. The inner variable "shadows" the outer one. **Illegal shadowing** happens when `let` shadows a `let` in certain cases (like inside `switch` without braces).',
    code: null, demo: { type: 'code-runner', label: 'Shadowing demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#shadow-demo' }
    ]}
  };
  if (t.includes('remove event listener')) return {
    answer: '**Removing event listeners** is critical to prevent **memory leaks**. If you add a listener to a DOM element and the element is removed from the DOM, the element remains in memory (cannot be garbage collected) because the listener holds a reference. Always call `removeEventListener` when cleaning up.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('single threaded')) return {
    answer: 'JavaScript is **single-threaded** — it has one **call stack** and executes one piece of code at a time. The **Event Loop** handles asynchronous operations (like `setTimeout`, HTTP requests) by deferring their callbacks to task queues, which are processed when the stack is empty.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('reasynchron')) return {
    answer: '**Ways to handle async code**:\n1. **Callbacks** — simple but leads to callback hell\n2. **Promises** — flat chaining, `.then()/.catch()`\n3. **async/await** — syntactic sugar over Promises\n4. **Observables** — (RxJS) streams of values, cancellable\n5. **Event emitters** — `on`/`emit` pattern (Node.js)',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('symbol')) return {
    answer: '**Symbol** is a primitive type introduced in ES6, used to create **unique identifiers**. Every `Symbol()` is guaranteed to be unique. Useful for: object property keys (avoiding name collisions), defining custom iteration (`Symbol.iterator`), and "hidden" properties.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('bigint')) return {
    answer: '**BigInt** (`1n`) is a primitive type for integers of **arbitrary precision**. Regular numbers are limited to 2^53. BigInt can represent values beyond this limit. Created with `n` suffix or `BigInt()`. Cannot mix with regular numbers in operations.',
    code: null, demo: { type: 'code-runner', label: 'BigInt demo:', options: [
      { id: 'run', label: 'Run', code: '', show: '#bigint-demo' }
    ]}
  };
  if (t.includes('regex') || t.includes('regular expression')) {
    const isExe = t.includes('exec');
    return {
      answer: isExe
        ? '**`regex.exec(str)`** executes a search for a match. Returns detailed info (match, index, input) or `null`. With `g` flag, updates `regex.lastIndex` for each call — allowing iterative matching.'
        : '**Regular Expressions** are patterns for matching text. Create with `/pattern/flags` or `new RegExp()`. Methods: `test()` (boolean), `exec()` (details), `str.match()`, `str.replace()`, `str.split()`.',
      code: null,
      demo: { type: 'code-runner', label: 'RegEx demo:', options: [{ id: 'run', label: 'Run', code: '', show: '#regex-demo' }] }
    };
  }
  if (t.includes('json') && (t.includes('stringify') || t.includes('parse') || t.includes('what is json') || t.includes('need json'))) {
    return {
      answer: 'JSON (JavaScript Object Notation) is a **lightweight data interchange format**. It\'s used in APIs, configs, databases. Supports strings, numbers, objects, arrays, booleans, null. All modern languages can parse/generate JSON.',
      code: null,
      demo: { type: 'json-formatter', label: 'JSON demo:', options: [{ id: 'run', label: 'Format', code: '', show: '#json-demo' }] }
    };
  }
  // ── Missing topic handlers ──
  if (t.includes('server') && (t.includes('sent event') || t.includes('sse') || t.includes('push')) && !t.includes('worker')) {
    return {
      answer: '**Server-Sent Events (SSE)** allow a server to push real-time updates over a single HTTP connection using `text/event-stream`. The client uses `new EventSource(url)`. SSE is unidirectional (server → client). Supports auto-reconnection and custom event types.',
      code: `const source = new EventSource('/api/stream');
source.onmessage = (event) => console.log('Data:', event.data);
source.addEventListener('custom-event', (e) => console.log(e.data));
source.onerror = () => console.log('Connection error (auto-reconnect)');`,
      demo: { type: 'code-runner', label: 'SSE concept:', options: [{ id: 'run', label: 'Show Code', code: '', show: '#sse-demo' }] }
    };
  }
  if (t.includes('eval')) {
    return {
      answer: '**`eval(str)`** executes a string as JavaScript code. It\'s **dangerous** and **slow**: executes in the caller\'s scope (security risk), cannot be optimized by the JIT compiler, enables code injection attacks. **Avoid eval()** — use safer alternatives like `JSON.parse()`, `Function()`, or `new Function()` for dynamic code.',
      code: `// ❌ Dangerous: eval()
eval('console.log("Hello")'); // Works but avoid!

// ✅ Safer alternatives:
JSON.parse('{"a":1}');        // Parse JSON
const fn = new Function('x', 'return x * 2;'); // Dynamic function
const calc = (op, a, b) => ({ '+': a+b, '-': a-b }[op]);`,
      demo: { type: 'code-runner', label: 'eval() concept:', options: [{ id: 'run', label: 'Run', code: '', show: '#eval-demo' }] }
    };
  }
  if (t.includes('delete operator')) {
    return {
      answer: '**`delete` operator** removes a property from an object: `delete obj.prop`. Returns `true` if successful. Cannot delete: variables (declared with `var`/`let`/`const`), `Array` elements (creates sparse array, doesn\'t re-index), inherited properties, non-configurable properties (`Object.freeze()`/`seal()`).',
      code: `const obj = { a: 1, b: 2 };
delete obj.a;            // true (removed)
console.log(obj.a);      // undefined
console.log('a' in obj); // false

const arr = [1, 2, 3];
delete arr[1];           // true
console.log(arr);        // [1, empty, 3]
console.log(arr.length); // 3 (length unchanged!)

// Cannot delete variables
let x = 5;
delete x; // false (strict mode: TypeError)`,
      demo: { type: 'code-runner', label: 'delete operator:', options: [{ id: 'run', label: 'Run', code: '', show: '#delete-demo' }] }
    };
  }
  if (t.includes('window') && t.includes('document')) {
    return {
      answer: '**`window` vs `document`**: `window` is the browser\'s global object (the whole browser tab), while `document` is the DOM tree of the loaded webpage (inside `window`). `window` has properties like `location`, `history`, `navigator`, `screen`, `localStorage`. `document` is the root of the DOM API (`getElementById`, `createElement`, etc.).',
      code: `// window: the browser tab
console.log(window.innerHeight); // viewport height
window.location.href = '/new-page';
window.setTimeout(() => {}, 1000);

// document: the webpage content
document.title = 'New Title';
document.getElementById('app');
document.createElement('div');
document.querySelector('.class');

console.log(window.document === document); // true`,
      demo: { type: 'code-runner', label: 'window vs document:', options: [{ id: 'run', label: 'Run', code: '', show: '#win-doc-demo' }] }
    };
  }
  if (t.includes('access history')) {
    return {
      answer: '**Access browser history** via `window.history` (or just `history`). Methods: `history.back()` (go back), `history.forward()` (go forward), `history.go(n)` (n steps, negative for back). For SPAs, use `history.pushState(state, title, url)` to change URL without page reload and `popstate` event to handle navigation.',
      code: `// Navigation
history.back();      // Go back one page
history.forward();   // Go forward one page
history.go(-2);      // Go back 2 pages

// SPA URL manipulation (no page reload)
history.pushState({ page: 1 }, '', '?page=1');
history.replaceState({ page: 2 }, '', '?page=2');

window.addEventListener('popstate', (e) => {
  console.log('Navigated:', e.state);
});

console.log(history.length); // Number of entries`,
      demo: { type: 'code-runner', label: 'History API:', options: [{ id: 'run', label: 'Show Code', code: '', show: '#history-demo' }] }
    };
  }
  if (t.includes('caps lock')) {
    return {
      answer: '**Detect Caps Lock** by listening to the `keydown` event and checking `event.getModifierState(\'CapsLock\')`. Returns `true` if Caps Lock is on. Display a warning to the user when Caps Lock is on and they\'re typing in a password field.',
      code: `document.getElementById('password')
  .addEventListener('keydown', (e) => {
    if (e.getModifierState('CapsLock')) {
      console.log('⚠️ Caps Lock is ON');
      document.getElementById('caps-warning')
        .style.display = 'block';
    } else {
      document.getElementById('caps-warning')
        .style.display = 'none';
    }
  });`,
      demo: { type: 'code-runner', label: 'Caps Lock detection:', options: [{ id: 'run', label: 'Show Code', code: '', show: '#caps-demo' }] }
    };
  }
  if (t.includes('undeclared') && t.includes('undefined')) {
    return {
      answer: '**Undeclared vs Undefined**:\n- **Undeclared**: a variable that has NOT been declared with `var`/`let`/`const`. Accessing it throws a **ReferenceError**.\n- **Undefined**: a variable that IS declared but NOT assigned a value. Accessing it returns `undefined`.\n- In strict mode, assigning to an undeclared variable throws a ReferenceError too.',
      code: `// Undeclared variable
// console.log(x); // ReferenceError: x is not defined
// x = 5;          // In strict mode: ReferenceError

// Undefined variable
let y;             // declared but not assigned
console.log(y);    // undefined (no error)

// Check safely:
console.log(typeof z); // 'undefined' (safe, no error)

typeof x !== 'undefined' // Check if declared
  ? x
  : 'not defined';`,
      demo: { type: 'code-runner', label: 'Undeclared vs undefined:', options: [{ id: 'run', label: 'Run', code: '', show: '#undeclared-demo' }] }
    };
  }
  if (t.includes('global variable')) {
    if (t.includes('problem')) return {
      answer: '**Problems with global variables**:\n1. **Naming collisions** — multiple scripts may use the same name\n2. **Debugging difficulty** — any code can modify them\n3. **Memory leaks** — never garbage collected\n4. **Dependency issues** — unclear which code depends on them\n5. **Testing difficulty** — global state leaks between tests\n\nBetter approach: modules, closures, or dependency injection.',
      code: `// ❌ Global variables (BAD)
let counter = 0;  // Any function can modify
function inc() { counter++; }
function reset() { counter = 0; }

// ✅ Encapsulated (GOOD)
const CounterModule = (() => {
  let counter = 0; // Private
  return {
    inc: () => ++counter,
    reset: () => { counter = 0; },
    get: () => counter
  };
})();`,
      demo: { type: 'code-runner', label: 'Avoiding globals:', options: [{ id: 'run', label: 'Run', code: '', show: '#global-prob-demo' }] }
    };
    return {
      answer: '**Global variables** are declared outside any function/block and accessible everywhere. In browsers, global `var` declarations become properties of `window`. Globals should be minimized because they cause: naming collisions, hard-to-track mutations, and testing difficulties.',
      code: `// Global variables
var globalVar = 'I am global'; // window.globalVar
let globalLet = 'also global'; // NOT on window
const globalConst = 'same';    // NOT on window

console.log(globalVar);   // 'I am global'
console.log(window.globalVar); // 'I am global' (var only)
console.log(window.globalLet); // undefined (let/const)`,
      demo: { type: 'code-runner', label: 'Global variables:', options: [{ id: 'run', label: 'Run', code: '', show: '#global-demo' }] }
    };
  }
  if (t.includes('isfinite')) {
    return {
      answer: '**`isFinite(value)`** returns `false` if the value is `Infinity`, `-Infinity`, or `NaN`. Returns `true` for any finite number. The global version coerces string arguments to numbers first (non-numeric strings → `NaN` → returns `false`). Use `Number.isFinite()` (ES6) for strict checking without coercion.',
      code: `// Global isFinite() (coerces)
console.log(isFinite(42));        // true
console.log(isFinite(Infinity));  // false
console.log(isFinite(-Infinity)); // false
console.log(isFinite(NaN));       // false
console.log(isFinite('42'));      // true (coerces)
console.log(isFinite('abc'));     // false (NaN)

// Number.isFinite() (no coercion, ES6+)
console.log(Number.isFinite('42'));  // false!
console.log(Number.isFinite(42));    // true`,
      demo: { type: 'code-runner', label: 'isFinite() demo:', options: [{ id: 'run', label: 'Run', code: '', show: '#isfinite-demo' }] }
    };
  }
  if (t.includes('form') && t.includes('submit')) {
    return {
      answer: '**Submit a form with JS**: Call `form.submit()` to programmatically submit. To handle submission (prevent default), listen to the `submit` event and call `e.preventDefault()`. Validate fields with `checkValidity()`, get form data with `new FormData(form)`, and submit via `fetch()` for AJAX.',
      code: `// Programmatic form submission
document.getElementById('myForm').submit();

// Handle form submission (AJAX)
document.getElementById('myForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log('Submitted:', result);
  });`,
      demo: { type: 'code-runner', label: 'Form submission:', options: [{ id: 'run', label: 'Show Code', code: '', show: '#form-demo' }] }
    };
  }
  if (t.includes('operating system') || t.includes('os details')) {
    return {
      answer: '**Get OS details**: Use `navigator.userAgent` (string) or `navigator.platform` (deprecated but widely supported). For more reliable detection, use `navigator.userAgentData` (newer API, Chrome only). The userAgent string contains "Windows", "Mac", "Linux", "Android", "iPhone", etc.',
      code: `const ua = navigator.userAgent.toLowerCase();

const detectOS = () => {
  if (ua.includes('win')) return 'Windows';
  if (ua.includes('mac')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone')) return 'iOS';
  if (ua.includes('like mac')) return 'iOS';
  return 'Unknown';
};

console.log('OS:', detectOS());
console.log('Platform:', navigator.platform);

// Newer API (Chrome only)
navigator.userAgentData?.getHighEntropyValues(['platform'])
  .then(d => console.log('Platform:', d.platform));`,
      demo: { type: 'code-runner', label: 'OS detection:', options: [{ id: 'run', label: 'Run', code: '', show: '#os-demo' }] }
    };
  }
  if (t.includes('document load') && t.includes('domcontentloaded')) {
    return {
      answer: '**`DOMContentLoaded`** fires when the HTML is fully parsed and the DOM tree is built — no waiting for images, CSS, etc. **`load`** (or `window.onload`) fires when EVERYTHING is fully loaded: DOM, images, stylesheets, scripts, iframes. Use `DOMContentLoaded` for DOM manipulation, `load` for media-related operations.',
      code: `document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM ready (images may still load)');
  document.getElementById('app').textContent = 'Ready!';
});

window.addEventListener('load', () => {
  console.log('✅ Fully loaded (all resources done)');
  console.log('Image size:', document.querySelector('img').naturalWidth);
});

// Ready state check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // Already loaded
}`,
      demo: { type: 'code-runner', label: 'Page load events:', options: [{ id: 'run', label: 'Run', code: '', show: '#load-demo' }] }
    };
  }
  if (t.includes('native') && t.includes('host') && t.includes('user object')) {
    return {
      answer: '**Native objects** are built into JavaScript: `Object`, `Array`, `Function`, `Date`, `RegExp`, `Map`, `Promise`, etc. **Host objects** are provided by the environment: `window`, `document`, `console`, `XMLHttpRequest`, `localStorage`. **User objects** are defined by the developer in their own code.',
      code: `// Native objects (ECMAScript spec)
Array.isArray([]);       // true
new Date();               // Current date
new Map();                // ES6 Map
Promise.resolve('done');  // Promise

// Host objects (browser-specific)
console.log(window.innerWidth);  // Viewport width
document.getElementById('id');   // DOM element
new XMLHttpRequest();            // AJAX (host)

// User objects (your code)
const myObj = { name: 'Alice' };
class UserController { /* ... */ }`,
      demo: { type: 'code-runner', label: 'Object types:', options: [{ id: 'run', label: 'Run', code: '', show: '#native-demo' }] }
    };
  }
  if (t.includes('debugging') || t.includes('debug')) {
    return {
      answer: '**JavaScript debugging tools**:\n1. **Browser DevTools** (F12): Sources tab (breakpoints), Console (logging), Network tab (API calls)\n2. **`console.log()`**, `console.table()`, `console.time()`, `console.trace()`\n3. **`debugger`** statement — programmatic breakpoint\n4. **Breakpoints** in Sources tab: line, conditional, DOM change, XHR\n5. **React DevTools** / **Vue DevTools** for framework debugging',
      code: `// Console debugging
console.log('Simple log');
console.table([{name:'Alice'}, {name:'Bob'}]);
console.time('loop');
for (let i = 0; i < 1000000; i++) {}
console.timeEnd('loop'); // ~2-5ms

// Breakpoint
function calculate(a, b) {
  debugger; // Opens DevTools debugger
  return a + b;
}

// Stack trace
console.trace('Where was I called?');`,
      demo: { type: 'code-runner', label: 'Debugging tips:', options: [{ id: 'run', label: 'Run', code: '', show: '#debug-demo' }] }
    };
  }
  if (t.includes('attribute') && t.includes('property')) {
    return {
      answer: '**Attribute vs Property**: An **attribute** is the HTML source value (`<input value="foo">`), always a string, reflected via `getAttribute()`. A **property** is the DOM object\'s current value in memory (`element.value`), can be any type, changes dynamically. Attributes INITIALIZE properties, but properties can change independently.',
      code: `const input = document.querySelector('input');
input.setAttribute('value', 'initial');

// Property
console.log(input.value); // 'initial'
input.value = 'modified';
console.log(input.getAttribute('value')); // 'initial' (still!)
console.log(input.value); // 'modified' (changed!)

// class attribute vs className property
input.setAttribute('class', 'red');
console.log(input.className); // 'red' (property)
console.log(input.getAttribute('class')); // 'red'`,
      demo: { type: 'code-runner', label: 'Attributes vs properties:', options: [{ id: 'run', label: 'Run', code: '', show: '#attr-demo' }] }
    };
  }
  if (t.includes('same-origin policy')) {
    return {
      answer: '**Same-Origin Policy** (SOP) is a browser security mechanism that blocks scripts from accessing resources from a **different origin** (protocol + domain + port). Example: `https://siteA.com` cannot fetch `https://siteB.com/api` via AJAX. Bypassed with: **CORS** (server headers), **JSONP** (old hack), **Proxy server** (your server forwards requests), **PostMessage** (cross-window).',
      code: `// ❌ Blocked: different origin
fetch('https://other-site.com/api/data')
  .then(r => r.json())
  // Error: CORS policy blocks this

// ✅ Solution 1: CORS (server adds headers)
// Access-Control-Allow-Origin: *

// ✅ Solution 2: Proxy (your server)
fetch('/proxy?url=https://other-site.com/api')

// ✅ Solution 3: PostMessage (iframes)
otherWindow.postMessage('hello', 'https://other-site.com');`,
      demo: { type: 'code-runner', label: 'Same-origin policy:', options: [{ id: 'run', label: 'Show Code', code: '', show: '#sop-demo' }] }
    };
  }
  if (t.includes('!!') || t.includes('double exclamation')) {
    return {
      answer: '**`!!` (double NOT)** converts any value to its boolean equivalent. `!value` returns the inverse boolean, `!!value` returns the original truthiness. `!!x` is equivalent to `Boolean(x)`. Used to check if a value is "truthy" (exists, not empty, etc.).',
      code: `console.log(!!0);          // false (0 is falsy)
console.log(!!1);          // true
console.log(!!'');         // false (empty string falsy)
console.log(!!'hello');    // true
console.log(!!null);       // false
console.log(!!undefined);  // false
console.log(!!{});         // true (empty object is truthy)
console.log(!![]);         // true (empty array is truthy)
console.log(!!NaN);        // false

// Practical: ensure boolean
const userInput = '';
const hasValue = !!userInput; // false
// Same as: Boolean(userInput)`,
      demo: { type: 'code-runner', label: '!! (double NOT):', options: [{ id: 'run', label: 'Run', code: '', show: '#not-demo' }] }
    };
  }
  if (t.includes('undefined property') || t === 'what is undefined property') {
    return {
      answer: '**`undefined`** is both a **value** and a **type**. A property is `undefined` when:\n1. The variable is declared but not assigned\n2. The object property doesn\'t exist\n3. The array element at an index was never set\n4. A function reaches `return;` without a value\n\n`typeof x === \'undefined\'` safely checks if something is undefined.',
      code: `let x;             // undefined
const obj = { a: 1 };
console.log(obj.b);  // undefined (no property)

const arr = [1, 2];
console.log(arr[5]); // undefined (no element)

function foo() { return; }
console.log(foo());  // undefined

// Safe check:
console.log(typeof someUndefinedVar === 'undefined'); // true`,
      demo: { type: 'code-runner', label: 'Undefined property:', options: [{ id: 'run', label: 'Run', code: '', show: '#undefined-demo' }] }
    };
  }
  if (t.includes('null value')) {
    return {
      answer: '**`null`** is an intentional **absence of any object value**. It\'s a primitive type (though `typeof null === "object"` is a historic bug). Developers assign `null` to indicate "no value" intentionally, unlike `undefined` which means "not assigned". Use `value === null` to check for null.',
      code: `// null is intentionally assigned "nothing"
let user = null; // No user logged in

// Later, assign a value
user = { name: 'Alice' };

// Check for null
if (user === null) {
  console.log('No user');
}

// Weird behavior
console.log(typeof null);     // 'object' (bug!)
console.log(null === undefined); // false
console.log(null == undefined);  // true

// Common usage
const element = document.getElementById('maybe-exists');
if (element !== null) {
  // Element exists!
}`,
      demo: { type: 'code-runner', label: 'Null value:', options: [{ id: 'run', label: 'Run', code: '', show: '#null-val-demo' }] }
    };
  }
  if (t.includes('promise') && (t.includes('main rule') || t.includes('rule of promise'))) {
    return {
      answer: '**Main rules of Promises**:\n1. A Promise has 3 states: pending, fulfilled, rejected (settled once)\n2. `.then()` and `.catch()` always return a new Promise (chainable)\n3. Errors propagate down the chain until caught\n4. `.finally()` runs regardless of outcome\n5. Promises are **eager** — execute immediately upon creation\n6. Once settled, a Promise is **immutable** (state cannot change)\n7. Microtasks — Promise callbacks run BEFORE macrotasks (setTimeout)',
      code: `const p = new Promise((resolve, reject) => {
  // Rule: promise executor runs immediately
  console.log('Executor runs!');
  resolve('done');
});

// Rule: .then returns new Promise
p.then(val => val.toUpperCase())
 .then(val => console.log(val)); // 'DONE'

// Rule: errors propagate
p.then(() => { throw new Error('fail'); })
 .catch(err => console.log(err.message)); // 'fail'

// Rule: immutability
p.then(val => console.log(val)); // 'done' (always)`,
      demo: { type: 'code-runner', label: 'Promise rules:', options: [{ id: 'run', label: 'Run', code: '', show: '#promise-rules-demo' }] }
    };
  }
  if (t.includes('callback') && (t.includes('need') || t.includes('why'))) {
    return {
      answer: '**Why callbacks?** JavaScript is single-threaded and non-blocking. Callbacks allow code to run **after** an async operation completes without freezing the UI. They\'re the foundation of async JS. However, nested callbacks create "callback hell" — solved by Promises and async/await.',
      code: `// Without callbacks: blocking (BAD)
const data = readFileSync('file.txt'); // Blocks UI!
console.log(data);

// With callbacks: non-blocking (GOOD)
readFile('file.txt', (err, data) => {
  if (err) return console.error(err);
  console.log(data); // Runs when file is ready
});
console.log('This runs immediately, no blocking!');

// Common callback patterns:
button.addEventListener('click', () => {});
setTimeout(() => {}, 1000);
fetch('/api').then(res => res.json());`,
      demo: { type: 'code-runner', label: 'Why callbacks:', options: [{ id: 'run', label: 'Run', code: '', show: '#callback-need-demo' }] }
    };
  }
  if (t.includes('callback') && !t.includes('hell')) {
    return {
      answer: 'A **callback function** is a function passed as an argument to another function to be **executed later** — after an async operation completes, when an event fires, or after some processing finishes. Callbacks are the fundamental async pattern in JavaScript.',
      code: `// Simple callback
function greet(name, callback) {
  const message = 'Hello ' + name;
  callback(message); // Execute the callback
}
greet('Alice', (msg) => console.log(msg)); // 'Hello Alice'

// Async callback
setTimeout(() => {
  console.log('Runs after 1 second');
}, 1000);

// Event callback
button.addEventListener('click', () => {
  console.log('Button clicked!');
});`,
      demo: { type: 'code-runner', label: 'Callback function:', options: [{ id: 'run', label: 'Run', code: '', show: '#callback-demo' }] }
    };
  }
  if (t.includes('callback in callback')) {
    return {
      answer: '**Callback in callback** (nested callbacks): When one callback contains another callback. Each level of nesting represents a sequential async operation. 2-3 levels is manageable, but deeper nesting creates **callback hell** — unreadable, hard-to-debug pyramid-shaped code.',
      code: `// Callback in callback (2 levels, OK)
getUser(id, (err, user) => {
  if (err) return handleError(err);
  getPosts(user.id, (err, posts) => {
    if (err) return handleError(err);
    render(posts); // 2 levels deep
  });
});

// Deeper nesting = callback hell (4+ levels)
getUser(id, (err, user) => {
  getPosts(user.id, (err, posts) => {
    getComments(posts[0].id, (err, comments) => {
      getLikes(comments[0].id, (err, likes) => {
        render(likes); // 4 levels deep!
      });
    });
  });
});

// Solution: Promises flatten this`,
      demo: { type: 'code-runner', label: 'Nested callbacks:', options: [{ id: 'run', label: 'Run', code: '', show: '#callback-nest-demo' }] }
    };
  }
  if (t.includes('single threaded')) {
    return {
      answer: 'JavaScript is **single-threaded** — one call stack, one thread of execution. It cannot run two pieces of code simultaneously. Async operations (AJAX, setTimeout) are handled by the **Event Loop**: they run outside the main thread (browser APIs), and their callbacks are queued to run when the call stack is empty.',
      code: `// Single-threaded: sequential
console.log('1');  // Runs first
console.log('2');  // Runs second (after 1)

// Non-blocking via Event Loop
console.log('Start');
setTimeout(() => console.log('Async'), 0);
console.log('End');
// Output: Start, End, Async

// Blocking: freezes UI (single thread)
function block() {
  while(true) {} // Freezes everything!
}
// button clicks, animations, all blocked!`,
      demo: { type: 'code-runner', label: 'Single-threaded:', options: [{ id: 'run', label: 'Run', code: '', show: '#single-thread-demo' }] }
    };
  }
  if (t.includes('referential transparency')) {
    return {
      answer: '**Referential transparency** means an expression can be **replaced with its value** without changing the program\'s behavior. Pure functions are referentially transparent: `add(2, 3)` can be replaced with `5` anywhere. Impure functions (with side effects or randomness) are NOT referentially transparent.',
      code: `// Referentially transparent
const add = (a, b) => a + b;
// These are equivalent:
const result1 = add(2, 3) * 2;
const result2 = 5 * 2; // add(2,3) → 5
console.log(result1 === result2); // true

// NOT referentially transparent
const rand = () => Math.random();
// rand() cannot be replaced with its value
// because each call gives different result`,
      demo: { type: 'code-runner', label: 'Referential transparency:', options: [{ id: 'run', label: 'Run', code: '', show: '#ref-trans-demo' }] }
    };
  }
  if (t.includes('iife') || t.includes('immediately invoked')) {
    return {
      answer: '**IIFE** (Immediately Invoked Function Expression) runs as soon as it\'s defined. Syntax: `(function(){...})()` or `(()=>{...})()`. Used for: creating private scope (pre-ES6 module pattern), avoiding global pollution, executing async setup code, and the module pattern.',
      code: `// Classic IIFE
(function() {
  const private = 'secret';
  console.log('IIFE runs instantly!');
})();

// Arrow IIFE
(() => {
  console.log('Arrow IIFE');
})();

// Module pattern (pre-ES6)
const Counter = (() => {
  let count = 0; // private
  return {
    inc: () => ++count,
    dec: () => --count,
    val: () => count
  };
})();`,
      demo: { type: 'code-runner', label: 'IIFE examples:', options: [{ id: 'run', label: 'Run', code: '', show: '#iife-demo' }] }
    };
  }
  // ── Additional topic handlers ──
  if (t.includes('void 0') || t.includes('void(0)')) return {
    answer: '**`void 0`** evaluates the expression `0` and returns `undefined`. `void` is an operator that evaluates any expression and returns `undefined`. `void 0` is a common way to get the `undefined` value safely (before ES6, `undefined` could be reassigned). Used in hrefs: `<a href="javascript:void(0)">` to prevent navigation.',
    code: `console.log(void 0);        // undefined
console.log(void(0));       // undefined
console.log(void 'hello');  // undefined
console.log(void (1 + 1));  // undefined

// Before ES5, undefined could be reassigned:
undefined = 42; // (allowed pre-ES5)
console.log(void 0); // Always gives real undefined

// Common use: prevent link navigation
// <a href="javascript:void(0)" onclick="doSomething()">
`,
    demo: { type: 'code-runner', label: 'void 0:', options: [{ id: 'run', label: 'Run', code: '', show: '#void-demo' }] }
  };
  if (t.includes('compiled') || (t.includes('interpret') && !t.includes('for...'))) return {
    answer: 'JavaScript is an **interpreted language** (or **JIT-compiled** in modern engines). Traditionally interpreted line-by-line by the browser. Modern V8 uses **JIT (Just-In-Time) compilation**: source → bytecode (ignition interpreter) → optimized machine code (turbofan compiler) for hot functions.',
    code: `// JavaScript is interpreted/JIT-compiled
// No compilation step needed:
console.log('Run this directly, no build required!');

// But modern engines JIT-compile hot code:
function sum(n) {
  let total = 0;
  for (let i = 0; i < n; i++) total += i;
  return total;
}
// After several calls, V8 compiles this to machine code
sum(1000000);`,
    demo: { type: 'code-runner', label: 'Interpreted vs compiled:', options: [{ id: 'run', label: 'Run', code: '', show: '#compiled-demo' }] }
  };
  if (t.includes('case-sensitive')) return {
    answer: 'Yes, JavaScript is **case-sensitive**. `myVar`, `myvar`, `MyVar`, and `MYVAR` are four different variables. All keywords (`if`, `while`, `for`, `function`, etc.) must be written in lowercase. Built-in objects: `Math` (capital M), but `math` is not recognized. HTML attributes are NOT case-sensitive, but JS property references are.',
    code: `// These are DIFFERENT variables:
const myVar = 'lowercase';
const myVAR = 'UPPERCASE';
const MyVar = 'Capitalized';

console.log(myVar); // 'lowercase'
console.log(myVAR); // 'UPPERCASE'

// Keywords must be exact:
// If (true) // SyntaxError: 'If' not 'if'
// While (true) // SyntaxError

// Built-in objects:
console.log(Math.PI);   // 3.14159
// console.log(math.PI); // ReferenceError!`,
    demo: { type: 'code-runner', label: 'Case sensitivity:', options: [{ id: 'run', label: 'Run', code: '', show: '#case-demo' }] }
  };
  if ((t.includes('relation') || t.includes('difference') || t.includes('between')) && t.includes('java') && t.includes('javascript') && !t.includes('json') && !t.includes('redirect') && !t.includes('display') && !t.includes('current')) return {
    answer: '**Java** and **JavaScript** are completely different languages. Java is a compiled, statically-typed, class-based OOP language. JavaScript is an interpreted, dynamically-typed, prototype-based language. The name "JavaScript" was a marketing ploy by Netscape (Java was popular). They share C-like syntax but that\'s all.',
    code: `// JavaScript vs Java:
// Syntax similar, but fundamentally different

// JavaScript: dynamically typed
let x = 5;
x = 'hello'; // OK in JS

// Java: statically typed
// int x = 5;
// x = "hello"; // Compile error!

// JavaScript: prototype-based
const obj = { greet() { return 'Hi!'; } };

// Java: class-based
// class Greeter { String greet() { return "Hi!"; } }`,
    demo: { type: 'code-runner', label: 'Java vs JS:', options: [{ id: 'run', label: 'Run', code: '', show: '#javavsjs-demo' }] }
  };
  if (t.includes('what are events') || (t.includes('what is event') && !t.includes('loop') && !t.includes('captur') && !t.includes('bubbl') && !t.includes('delegation') && !t.includes('flow'))) return {
    answer: '**Events** are actions or occurrences that happen in the browser that JavaScript can respond to: user actions (click, keypress, scroll), browser actions (page load, resize), and system events (network status, device orientation). Use `addEventListener()` to handle events.',
    code: `// Common event types:
// Mouse: click, dblclick, mouseover, mouseout
// Keyboard: keydown, keyup, keypress
// Form: submit, change, input, focus, blur
// Document: DOMContentLoaded, load, resize, scroll
// Touch: touchstart, touchend, touchmove

// Handling events:
button.addEventListener('click', (e) => {
  console.log('Clicked!', e.target);
});

// Event object properties:
// e.type, e.target, e.currentTarget
// e.preventDefault(), e.stopPropagation()`,
    demo: { type: 'code-runner', label: 'JavaScript events:', options: [{ id: 'run', label: 'Run', code: '', show: '#events-overview-demo' }] }
  };
  if (t.includes('who created') || (t.includes('create') && t.includes('javascript') && !t.includes('object'))) return {
    answer: '**JavaScript was created by Brendan Eich** in May 1995 in just 10 days while at Netscape. It was originally called **Mocha**, then **LiveScript**, and finally **JavaScript** (a marketing move to ride Java\'s popularity). Eich later co-founded the Mozilla project.',
    code: `// JavaScript's creator: Brendan Eich
// Timeline:
// May 1995: Created in 10 days at Netscape
// Sep 1995: Released as LiveScript in Navigator 2.0
// Dec 1995: Renamed to JavaScript
// 1997: Standardized as ECMAScript
// 2009: ES5 (major update)
// 2015: ES6/ES2015 (biggest update)
// Annual releases since 2015

console.log('JavaScript by Brendan Eich (1995)');`,
    demo: { type: 'info', label: '', options: [] }
  };
  if (t.includes('stoppropagation') || (t.includes('stop') && t.includes('propagation'))) return {
    answer: '**`event.stopPropagation()`** prevents the event from traveling further in the DOM tree (stops both capturing and bubbling phases). This is useful when you want to handle an event on a specific element without triggering parent handlers. Use cautiously — it can break event delegation patterns.',
    code: `parent.addEventListener('click', () => console.log('Parent'));
child.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents parent from hearing this click
  console.log('Child only');
});
// Clicking child: 'Child only' (parent NOT triggered)

// stopImmediatePropagation() also prevents
// other listeners on the SAME element:
btn.addEventListener('click', () => console.log('A'));
btn.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
  console.log('B');
});
btn.addEventListener('click', () => console.log('C'));
// Click: 'A', 'B' (C never runs)`,
    demo: { type: 'code-runner', label: 'stopPropagation:', options: [{ id: 'run', label: 'Run', code: '', show: '#stopprop-demo' }] }
  };
  if (t.includes('return false')) return {
    answer: '**`return false`** in an event handler does 3 things:\n1. **`event.preventDefault()`** — prevents default browser action\n2. **`event.stopPropagation()`** — stops event bubbling\n3. **Stops callback execution** — returns early\n\nThis behavior is specific to inline event handlers (`onclick="return fn()"`). In modern `addEventListener`, `return false` does NOT prevent default — you must call `e.preventDefault()` explicitly.',
    code: `// Inline handler: return false prevents default + stops prop
// <a href="https://example.com" onclick="return false">No nav</a>

// In addEventListener, return false does NOTHING special:
document.querySelector('a').addEventListener('click', (e) => {
  // return false; // ❌ Does NOT prevent default!
  e.preventDefault(); // ✅ Correct way
  e.stopPropagation(); // ✅ Stop bubbling (if needed)
});`,
    demo: { type: 'code-runner', label: 'return false:', options: [{ id: 'run', label: 'Run', code: '', show: '#returnfalse-demo' }] }
  };
  if (t.includes('json') && t.includes('syntax')) return {
    answer: '**JSON syntax rules**:\n1. Data is in **name/value pairs** (`"key": value`)\n2. Keys must be **double-quoted strings**\n3. Values can be: string (double-quoted), number, boolean, null, object `{}`, array `[]`\n4. No trailing commas allowed\n5. No comments allowed\n6. No functions, undefined, NaN, Infinity\n7. Must use `\` for escaping special characters',
    code: `// ✅ Valid JSON
{
  "name": "Alice",
  "age": 30,
  "hobbies": ["reading", "coding"],
  "address": null,
  "active": true
}

// ❌ Invalid JSON
{
  name: "Alice",    // Keys must be quoted
  'age': 30,        // Single quotes not allowed
  "trailing": 1,    // No trailing comma!
  "fn": function(){} // No functions!
}`,
    demo: { type: 'code-runner', label: 'JSON syntax:', options: [{ id: 'run', label: 'Show Rules', code: '', show: '#json-syntax-demo' }] }
  };
  if (t.includes('cleartimeout')) return {
    answer: '**`clearTimeout(id)`** cancels a timeout previously set by `setTimeout()`. The `id` is the value returned by `setTimeout`. If the timeout has already fired, `clearTimeout` has no effect. After clearing, the callback will never execute. Essential for preventing memory leaks and race conditions.',
    code: `// Start a timeout
const timeoutId = setTimeout(() => {
  console.log('This will NOT run');
}, 5000);

// Cancel it before it fires
clearTimeout(timeoutId); // ✅ Cancelled!

// Practical: debounce input
let searchTimer;
input.addEventListener('input', () => {
  clearTimeout(searchTimer); // Cancel previous
  searchTimer = setTimeout(() => {
    console.log('Search for:', input.value);
  }, 300);
});`,
    demo: { type: 'code-runner', label: 'clearTimeout:', options: [{ id: 'run', label: 'Run', code: '', show: '#cleartimeout-demo' }] }
  };
  if (t.includes('clearinterval')) return {
    answer: '**`clearInterval(id)`** stops an interval timer started by `setInterval()`. The `id` is the value returned by `setInterval`. After clearing, the callback stops executing. Critical for preventing memory leaks — intervals keep running until explicitly stopped, even if the triggering element is removed from the DOM.',
    code: `// Start an interval
const intervalId = setInterval(() => {
  console.log('Tick:', Date.now());
}, 1000);

// Stop it after 5 seconds
setTimeout(() => {
  clearInterval(intervalId);
  console.log('Interval stopped');
}, 5000);

// Always save the ID for cleanup
// setInterval returns a unique ID
const id = setInterval(() => {}, 1000);
clearInterval(id);`,
    demo: { type: 'code-runner', label: 'clearInterval:', options: [{ id: 'run', label: 'Run', code: '', show: '#clearinterval-demo' }] }
  };
  if (t.includes('redirect') && (t.includes('new page') || t.includes('redirect'))) return {
    answer: '**Redirect to a new page** using:\n- `window.location.href = \'https://example.com\'` (most common)\n- `window.location.replace(\'url\')` (replaces history, can\'t go back)\n- `window.location.assign(\'url\')` (adds to history, can go back)\n- `window.open(\'url\', \'_self\')` (opens in same tab)',
    code: `// These redirect to a new page:

// 1. Most common (adds to history)
window.location.href = 'https://example.com';

// 2. Replace (no back button)
window.location.replace('https://example.com');

// 3. Assign (same as href)
window.location.assign('https://example.com');

// 4. Open in same tab
window.open('https://example.com', '_self');

// 5. Reload current page
location.reload();

// 6. With delay
setTimeout(() => {
  window.location.href = '/new-page';
}, 2000);`,
    demo: { type: 'code-runner', label: 'Page redirect:', options: [{ id: 'run', label: 'Run', code: '', show: '#redirect-demo' }] }
  };
  if (t.includes('string contains') || t.includes('substring') || t.includes('includes method')) return {
    answer: '**Check if string contains substring** using:\n- `str.includes(substr)` — returns boolean (ES6, best for simple checks)\n- `str.indexOf(substr) !== -1` — returns index or -1 (ES5 compatible)\n- `str.search(/pattern/)` — returns index or -1 (regex support)\n- `new RegExp(pattern).test(str)` — regex test (returns boolean)',
    code: `const str = 'Hello, World!';

// Best for simple checks (ES6+)
str.includes('World');  // true
str.includes('world');  // false (case-sensitive)
str.toLowerCase().includes('world'); // true

// ES5 compatible
str.indexOf('World') !== -1;  // true
str.indexOf('xyz') !== -1;    // false

// With regex
/world/i.test(str); // true (case-insensitive)
str.search(/world/i); // 7 (index of match)

// Multiple substrings
const hasHelloOrHi = /hello|hi/i.test(str);`,
    demo: { type: 'code-runner', label: 'String contains:', options: [{ id: 'run', label: 'Run', code: '', show: '#contains-demo' }] }
  };
  if (t.includes('validate') && t.includes('email')) return {
    answer: '**Validate email** using a regular expression. Email format: `local-part@domain`. Common regex: `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/` (basic), or more comprehensive patterns. For production, avoid overly complex regex — a basic format check + sending a verification email is more reliable.',
    code: `function validateEmail(email) {
  // Simple but effective regex
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email);
}

// Test
console.log(validateEmail('user@example.com')); // true
console.log(validateEmail('invalid'));          // false
console.log(validateEmail('@domain.com'));      // false
console.log(validateEmail('user@'));            // false

// HTML5 built-in validation
// <input type="email" required>
// input.checkValidity() returns boolean`,
    demo: { type: 'code-runner', label: 'Email validation:', options: [{ id: 'run', label: 'Run', code: '', show: '#email-demo' }] }
  };
  if (t.includes('current url') || (t.includes('get') && t.includes('url'))) return {
    answer: '**Get current URL** with `window.location.href` (full URL). Other properties: `location.protocol` (https:), `location.host` (example.com:443), `location.hostname` (example.com), `location.port` (443), `location.pathname` (/page), `location.search` (?query=string), `location.hash` (#section).',
    code: `// Full URL
console.log(window.location.href);
// 'https://example.com:443/page?q=hello#section'

// Individual parts
console.log(location.protocol);   // 'https:'
console.log(location.hostname);   // 'example.com'
console.log(location.port);       // '443'
console.log(location.pathname);   // '/page'
console.log(location.search);     // '?q=hello'
console.log(location.hash);       // '#section'

// Build URL object
const url = new URL(window.location.href);
console.log(url.searchParams.get('q')); // 'hello'`,
    demo: { type: 'code-runner', label: 'Get current URL:', options: [{ id: 'run', label: 'Run', code: '', show: '#url-get-demo' }] }
  };
  if (t.includes('location object') || t.includes('url properties')) return {
    answer: '**`window.location` properties**:\n- `href` — full URL\n- `protocol` — e.g. \'https:\'\n- `host` — hostname + port\n- `hostname` — domain name\n- `port` — port number\n- `pathname` — path after domain\n- `search` — query string (incl. ?)\n- `hash` — fragment (incl. #)\n- `origin` — protocol + hostname + port\n\nMethods: `assign()`, `replace()`, `reload()`, `toString()`.',
    code: `const loc = window.location;

console.log('Full URL:',  loc.href);
console.log('Protocol:',  loc.protocol);
console.log('Host:',      loc.host);
console.log('Hostname:',  loc.hostname);
console.log('Port:',      loc.port);
console.log('Path:',      loc.pathname);
console.log('Query:',     loc.search);
console.log('Hash:',      loc.hash);
console.log('Origin:',    loc.origin);

// Using URL API (modern):
const url = new URL(loc.href);
url.searchParams.forEach((v, k) => {
  console.log(k + '=' + v);
});`,
    demo: { type: 'code-runner', label: 'Location object:', options: [{ id: 'run', label: 'Run', code: '', show: '#location-demo' }] }
  };
  if (t.includes('query string') || t.includes('get query')) return {
    answer: '**Get query string values**: Use `URLSearchParams` API (modern): `new URLSearchParams(window.location.search).get(\'key\')`. Fallback: parse `window.location.search` manually with `split(\'&\')` and `split(\'=\')`. The `URLSearchParams` also supports `getAll()`, `has()`, `entries()`, iteration.',
    code: `// URL: https://example.com?name=Alice&age=30&hobby=coding

// Modern API (recommended)
const params = new URLSearchParams(window.location.search);
console.log(params.get('name'));   // 'Alice'
console.log(params.get('age'));    // '30'
console.log(params.has('hobby'));  // true
console.log(params.getAll('hobby')); // ['coding']

// Manual parsing (fallback)
const query = window.location.search.slice(1);
const pairs = query.split('&').map(p => p.split('='));
const obj = Object.fromEntries(pairs);
console.log(obj.name); // 'Alice'`,
    demo: { type: 'code-runner', label: 'Query string:', options: [{ id: 'run', label: 'Run', code: '', show: '#querystring-demo' }] }
  };
  if (t.includes('key exists') || (t.includes('check') && t.includes('object') && t.includes('key'))) return {
    answer: '**Check if key exists in object** using:\n1. `"key" in obj` — checks own AND inherited properties\n2. `obj.hasOwnProperty("key")` — checks own properties only (deprecated)\n3. `Object.hasOwn(obj, "key")` — ES2022+, recommended modern way\n4. `obj.key !== undefined` — but fails if the value is actually `undefined`',
    code: `const obj = { name: 'Alice', age: undefined };

// 1. 'in' operator (checks prototype chain too)
console.log('name' in obj);  // true
console.log('age' in obj);   // true (value IS undefined but key exists)
console.log('toString' in obj); // true (inherited!)

// 2. hasOwnProperty (own only)
console.log(obj.hasOwnProperty('name'));   // true
console.log(obj.hasOwnProperty('toString')); // false

// 3. Object.hasOwn (ES2022+, recommended)
console.log(Object.hasOwn(obj, 'name'));  // true

// 4. undefined check (⚠️ can be wrong)
console.log(obj.age !== undefined);        // false (age IS undefined)`,
    demo: { type: 'code-runner', label: 'Check key exists:', options: [{ id: 'run', label: 'Run', code: '', show: '#keyexists-demo' }] }
  };
  if (t.includes('loop through') || t.includes('enumerate')) return {
    answer: '**Loop through/enumerate object properties**:\n1. `for...in` — enumerates all enumerable properties (own + inherited) — use with `hasOwnProperty` check\n2. `Object.keys(obj)` — returns array of own enumerable string keys\n3. `Object.values(obj)` — returns array of own enumerable values\n4. `Object.entries(obj)` — returns array of `[key, value]` pairs\n5. `Object.getOwnPropertyNames(obj)` — all own keys (incl. non-enumerable)',
    code: `const obj = { a: 1, b: 2, c: 3 };

// 1. for...in (checks prototype!)
for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key, obj[key]); // a 1, b 2, c 3
  }
}

// 2. Object.keys
Object.keys(obj).forEach(k => console.log(k, obj[k]));

// 3. Object.entries (best for most cases)
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// 4. Object.values (just values)
Object.values(obj).forEach(v => console.log(v));`,
    demo: { type: 'code-runner', label: 'Enumerate object:', options: [{ id: 'run', label: 'Run', code: '', show: '#enumerate-demo' }] }
  };
  if (t.includes('empty object') && t.includes('test')) return {
    answer: '**Test for empty object**: Check if an object has no own enumerable properties:\n- `Object.keys(obj).length === 0 && obj.constructor === Object` (most reliable)\n- `JSON.stringify(obj) === \'{}\'` (simple but only for simple objects)\n- `Object.entries(obj).length === 0` (same as keys)\n- Note: `obj === {}` is always `false` (compares references, not content)',
    code: `function isEmpty(obj) {
  return Object.keys(obj).length === 0
    && obj.constructor === Object;
}

console.log(isEmpty({}));              // true
console.log(isEmpty({ a: 1 }));        // false
console.log(isEmpty(new Date()));      // false (constructor check)
console.log(isEmpty(null));            // throws! (add null check)

// Safer version:
function isEmptySafe(obj) {
  return obj != null &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    Object.keys(obj).length === 0;
}`,
    demo: { type: 'code-runner', label: 'Empty object test:', options: [{ id: 'run', label: 'Run', code: '', show: '#emptyobj-demo' }] }
  };
  if (t.includes('arguments object')) return {
    answer: '**`arguments`** is an array-like object (NOT a real array) available inside **non-arrow** functions. It contains all passed arguments. Array-like means it has a `length` property and indexed elements, but no array methods like `forEach`, `map`, `filter`. Convert to array: `Array.from(arguments)` or `[...arguments]`.',
    code: `function logArgs() {
  console.log(arguments); // [Arguments] { '0': 'a', '1': 'b' }
  console.log(arguments[0]); // 'a'
  console.log(arguments.length); // 2
  console.log(Array.isArray(arguments)); // false

  // Convert to real array:
  const arr1 = Array.from(arguments);
  const arr2 = [...arguments];
  console.log(Array.isArray(arr1)); // true
}
logArgs('a', 'b');

// Arrow functions don't have arguments:
const arrowFn = () => {
  // console.log(arguments); // ReferenceError!
};`,
    demo: { type: 'code-runner', label: 'Arguments object:', options: [{ id: 'run', label: 'Run', code: '', show: '#arguments-demo' }] }
  };
  if (t.includes('first letter') && t.includes('uppercase')) return {
    answer: '**Make first letter uppercase**: `str.charAt(0).toUpperCase() + str.slice(1)`. For multi-word strings, split by space and capitalize each word. If the string could be empty, check `str.length > 0` first or use optional chaining.',
    code: `function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log(capitalize('hello')); // 'Hello'

// Multi-word (capitalize each word)
function capitalizeWords(str) {
  return str.split(' ').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}
console.log(capitalizeWords('hello world')); // 'Hello World'

// Alternative (modern)
const cap = str => str ? str[0].toUpperCase() + str.slice(1) : '';`,
    demo: { type: 'code-runner', label: 'Capitalize string:', options: [{ id: 'run', label: 'Run', code: '', show: '#capitalize-demo' }] }
  };
  if (t.includes('current date') || t.includes('display date')) return {
    answer: '**Display current date**: `new Date()` creates a Date object for now. Format: `toLocaleDateString()` for locale-aware date, `toISOString()` for ISO 8601 format (`YYYY-MM-DD`), or use `getFullYear()`, `getMonth()` (0-indexed!), `getDate()` for custom formatting.',
    code: `const now = new Date();

// Built-in formats
console.log(now.toString());        // 'Fri May 15 2026 10:30:00 GMT+0530'
console.log(now.toDateString());    // 'Fri May 15 2026'
console.log(now.toISOString());     // '2026-05-15T05:00:00.000Z'
console.log(now.toLocaleDateString()); // '5/15/2026' (locale-dependent)
console.log(now.toLocaleString());  // '5/15/2026, 10:30:00 AM'

// Custom format
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, '0');
const d = String(now.getDate()).padStart(2, '0');
console.log(\`\${y}-\${m}-\${d}\`); // '2026-05-15'`,
    demo: { type: 'code-runner', label: 'Current date:', options: [{ id: 'run', label: 'Run', code: '', show: '#date-demo' }] }
  };
  if (t.includes('compare') && t.includes('date')) return {
    answer: '**Compare two dates** using comparison operators (`>`, `<`, `>=`, `<=`) — JavaScript converts Date objects to milliseconds (number) automatically. For equality, use `getTime()`: `date1.getTime() === date2.getTime()`. Direct `===` compares object references, NOT the date value.',
    code: `const d1 = new Date('2026-01-01');
const d2 = new Date('2026-06-15');
const d3 = new Date('2026-01-01');

// Comparison works with >, <, >=, <=
console.log(d2 > d1);  // true (June after Jan)
console.log(d1 < d2);  // true

// Equality: MUST use getTime()
console.log(d1 === d3);        // false (different objects!)
console.log(d1.getTime() === d3.getTime()); // true (same value)

// Difference in milliseconds
const diff = d2 - d1;
console.log(diff); // ms
console.log(diff / (1000 * 60 * 60 * 24)); // days

// Check if same day
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}`,
    demo: { type: 'code-runner', label: 'Compare dates:', options: [{ id: 'run', label: 'Run', code: '', show: '#comparedate-demo' }] }
  };
  if (t.includes('storage event')) return {
    answer: '**Storage event** fires on the `window` object when `localStorage` or `sessionStorage` is modified in a **different tab** of the same origin. The event does NOT fire in the tab that made the change. The event object has: `key`, `oldValue`, `newValue`, `url`, `storageArea` properties.',
    code: `// Listen for storage changes (from OTHER tabs)
window.addEventListener('storage', (e) => {
  console.log('Key changed:', e.key);
  console.log('Old value:', e.oldValue);
  console.log('New value:', e.newValue);
  console.log('URL:', e.url);
  console.log('Storage area:', e.storageArea);
});

// This change triggers the event in OTHER tabs
localStorage.setItem('theme', 'dark');

// Note: same-tab changes don't trigger 'storage'
// For same-tab reactivity, use custom events or polling`,
    demo: { type: 'code-runner', label: 'Storage event:', options: [{ id: 'run', label: 'Run', code: '', show: '#storage-event-demo' }] }
  };
  if (t.includes('session storage') && (t.includes('method') || t.includes('available'))) return {
    answer: '**`sessionStorage` methods**: Same API as `localStorage` — `setItem(key, val)`, `getItem(key)`, `removeItem(key)`, `clear()`, `key(index)`. The `length` property gives the number of items. Data persists only for the current tab/session and is cleared when the tab closes.',
    code: `// sessionStorage: per-tab, cleared on tab close
sessionStorage.setItem('token', 'abc123');
sessionStorage.setItem('theme', 'dark');

// Get
console.log(sessionStorage.getItem('token')); // 'abc123'

// Key by index
console.log(sessionStorage.key(0)); // First key

// Length
console.log(sessionStorage.length); // 2

// Remove one
sessionStorage.removeItem('token');

// Clear all
sessionStorage.clear();

// Iterate
for (let i = 0; i < sessionStorage.length; i++) {
  const k = sessionStorage.key(i);
  console.log(k, sessionStorage.getItem(k));
}`,
    demo: { type: 'code-runner', label: 'sessionStorage:', options: [{ id: 'run', label: 'Run', code: '', show: '#session-demo' }] }
  };
  // Generic fallback — generates a meaningful response based on question type
  const words = q.text.split(' ').filter(w => w.length > 2);
  const topicWords = words.slice(0, 5).join(' ');
  const shortTopic = topicWords.length > 50 ? topicWords.slice(0, 50) + '...' : topicWords;
  return {
    answer: `**${q.text}**

${shortTopic} in JavaScript. See the code example below for a practical demonstration.`,
    code: `// ${q.text}
// === Practical Example ===
// ${shortTopic} in JavaScript

// Example:
function demonstrate() {
  // Add your implementation here
  console.log('Explore ${q.text.replace(/'/g, "\\'")}');
}
demonstrate();`,
    demo: { type: 'code-runner', label: 'Learn about this:', options: [{ id: 'run', label: 'Run Demo', code: '', show: '#demo-' + q.id }] }
  };
}

// Build full question data with answers and demo configs
const fullQuestions = questions.map(q => {
  const enriched = answerMap[q.id] || getDefaultAnswer(q);
  return {
    id: q.id,
    text: q.text,
    answer: enriched.answer,
    code: enriched.code || `// ${q.text}`,
    demo: enriched.demo
  };
});

// Group into 10 chapters
const chapterDefs = [
  { id: 'ch01', title: 'JS Basics', icon: 'fab fa-js-square', color: 'yellow', desc: 'Objects, prototypes, call/apply/bind, JSON, arrays, functions, let/var, hoisting', start: 0, end: 48 },
  { id: 'ch02', title: 'Functions & Scope', icon: 'fas fa-code-branch', color: 'emerald', desc: 'First-class functions, higher-order, currying, pure functions, IIFE', start: 48, end: 96 },
  { id: 'ch03', title: 'DOM & Browser APIs', icon: 'fas fa-globe', color: 'blue', desc: 'Events, BOM, setTimeout, event delegation, JSON, PWAs, URL handling', start: 96, end: 144 },
  { id: 'ch04', title: 'Objects & Prototypes', icon: 'fas fa-cube', color: 'purple', desc: 'Freeze, seal, proxy, WeakSet, WeakMap, Object methods, descriptors', start: 144, end: 192 },
  { id: 'ch05', title: 'ES6+ Features', icon: 'fab fa-js-square', color: 'cyan', desc: 'Arrow functions, destructuring, spread/rest, iterators, generators, Map/Set', start: 192, end: 240 },
  { id: 'ch06', title: 'Arrays & Collections', icon: 'fas fa-layer-group', color: 'pink', desc: 'Array methods, sorting, typed arrays, loops, TypeScript, form validation', start: 240, end: 288 },
  { id: 'ch07', title: 'Event Loop & Concurrency', icon: 'fas fa-sync-alt', color: 'orange', desc: 'Event loop, call stack, microtasks, async/await, observables', start: 288, end: 336 },
  { id: 'ch08', title: 'Async & Storage', icon: 'fas fa-database', color: 'teal', desc: 'Web workers, service workers, IndexedDB, AJAX, fetch, debouncing', start: 336, end: 384 },
  { id: 'ch09', title: 'Design Patterns & FP', icon: 'fas fa-puzzle-piece', color: 'rose', desc: 'Pure functions, compose/pipe, module pattern, mixins, currying, polyfills', start: 384, end: 432 },
  { id: 'ch10', title: 'Modern JS & Edge Cases', icon: 'fas fa-star', color: 'amber', desc: 'Optional chaining, nullish coalescing, globalThis, structuredClone, shadowing', start: 432, end: 478 }
];

// Build chapters with questions
const chapters = chapterDefs.map((ch, i) => ({
  ...ch,
  questions: fullQuestions.slice(ch.start, ch.end),
  qStart: fullQuestions[ch.start]?.id ?? ch.start + 1,
  qEnd: fullQuestions[Math.min(ch.end, fullQuestions.length) - 1]?.id ?? ch.end
}));

// Write output files
const outDir = '.';
const allChapters = chapters.map((ch, i) => ({
  id: ch.id,
  title: ch.title,
  icon: ch.icon,
  color: ch.color,
  desc: ch.desc,
  qStart: ch.qStart,
  qEnd: ch.qEnd,
  count: ch.questions.length,
  file: `chapters/chapter.html?id=${i + 1}`
}));

// Write questions.json (all data)
fs.writeFileSync(
  path.join(outDir, 'questions.json'),
  JSON.stringify({ chapters, allQuestions: fullQuestions }, null, 2)
);

// Generate a simple chapter loader instructions
console.log(`✅ Generated questions.json with ${fullQuestions.length} questions`);
console.log(`✅ ${chapters.length} chapters configured`);

// Generate info file about the data structure
fs.writeFileSync(
  path.join(outDir, 'DATA_STRUCTURE.md'),
  `# JavaScript Cheatsheet Data Structure

## questions.json
Root object with:
- \`chapters\`: Array of 10 chapter objects
- \`allQuestions\`: Flat array of all 478 questions

### Chapter object:
- \`id\` (string): chapter id ex: "ch01"
- \`title\` (string): chapter title
- \`icon\` (string): Font Awesome icon class
- \`color\` (string): theme color key
- \`desc\` (string): chapter description
- \`start\` / \`end\`: question index range
- \`qStart\` / \`qEnd\`: question number range
- \`count\`: number of questions
- \`questions\`: array of question objects

### Question object:
- \`id\` (number): question number (1-478)
- \`text\` (string): question text
- \`answer\` (string): detailed answer (Markdown-friendly)
- \`code\` (string): code example
- \`demo\` (object): demo configuration
  - \`type\` (string): demo type
  - \`label\` (string): button label
  - \`options\` (array): interactive options
`
);
