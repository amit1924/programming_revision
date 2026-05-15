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
    if (t.includes('capture')) return {
      answer: '**Event capturing** (also called "trickling") is the first phase of event propagation. The event starts from the root (`document`) and travels **down** to the target element. Use `addEventListener(type, handler, true)` to listen during capture phase.',
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
      code: null, demo: { type: 'info', label: '', options: [] }
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
  if (t.includes('web worker')) return {
    answer: '**Web Workers** run scripts in **background threads** separate from the main UI thread. They cannot access the DOM. Communication is via `postMessage()`. Workers are ideal for CPU-intensive tasks (image processing, data parsing) that would otherwise block the UI.',
    code: null, demo: { type: 'info', label: '', options: [] }
  };
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
  // Generic fallback
  const words = q.text.split(' ');
  const topic = words.slice(0, 4).join(' ');
  return {
    answer: `**${q.text}** — ${topic}... This concept is important in JavaScript. See the interactive demo below for a visual explanation with code examples.`,
    code: `// ${q.text}\n// See the interactive demo below`,
    demo: { type: 'code-runner', label: 'Test this concept:', options: [{ id: 'run', label: 'Run Demo', code: '', show: '#demo-' + q.id }] }
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
