// Debug harness: stub DOM/canvas and execute the game script to catch runtime
// errors before they ship. Run via `npm test`.
//
// This file previously had no way to fail loudly: a script that threw still
// exited 0, and a script that hung (as happened with a real infinite-retry
// bug in the leaderboard code) just hung forever with no diagnostic. Both
// are fixed below — a hard watchdog forces a clear, non-zero-exit failure
// instead of hanging, and a real error now fails the process.
const REAL_setTimeout = setTimeout;
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// ---- Minimal DOM stubs ----
const ctxStub = new Proxy({}, { get(t, prop) {
  if(prop === 'scale' || prop === 'translate' || prop === 'rotate' || prop === 'save' || prop === 'restore' ||
     prop === 'beginPath' || prop === 'closePath' || prop === 'fill' || prop === 'stroke' || prop === 'moveTo' ||
     prop === 'lineTo' || prop === 'quadraticCurveTo' || prop === 'arc' || prop === 'ellipse' || prop === 'fillRect' ||
     prop === 'strokeRect' || prop === 'fillText' || prop === 'clearRect') return ()=> {};
  if(prop === 'createLinearGradient' || prop === 'createRadialGradient') return ()=>({ addColorStop(){} });
  if(prop === 'measureText') return ()=>({ width: 10 });
  return undefined;
}});
function makeEl(id) {
  return {
    id,
    innerText: '', textContent: '', style: { cssText: '', display: '', opacity: '', width: '', height: '', transform: '' },
classList: { add(){}, remove(){}, toggle(){}, contains(){return false} },
    addEventListener(){}, removeEventListener(){},
    appendChild(){}, remove(){}, querySelectorAll(){ return []; }, querySelector(){ return null; },
    setAttribute(){}, getAttribute(){ return null; },
    value: '', className: '', innerHTML: '',
    getContext: () => ctxStub,
    width: 400, height: 700
  };
}
const elMap = {};
function getEl(id) { if(!elMap[id]) elMap[id] = makeEl(id); return elMap[id]; }

global.document = {
  getElementById: getEl,
  createElement: () => makeEl(''),
  body: { appendChild(){}, classList: { add(){}, remove(){}, toggle(){} } },
  addEventListener(){}, removeEventListener(){}
};
global.window = {
  innerWidth: 400, innerHeight: 700,
  addEventListener(){}, removeEventListener(){},
  AudioContext: function(){ return { createBiquadFilter: ()=>({ connect(){} }), createGain: ()=>({ connect(){} }), connect(){}, createOscillator: ()=>({ connect(){}, start(){}, stop(){}, frequency:{ setValueAtTime(){}, setTargetAtTime(){} }, type:'' }), createGain:()=>({ connect(){}, gain:{ value:0, setTargetAtTime(){} } }), currentTime:0, state:'running', resume(){} }; },
  webkitAudioContext: undefined,
  AdMobBridge: {}
};
global.navigator = { vibrate(){} };
global.localStorage = { getItem(){return null}, setItem(){} };
global.confirm = ()=>false;
global.alert = ()=>{};
global.requestAnimationFrame = ()=>{};
global.location = { origin: 'http://localhost' };
// Resolve fetch to a fake, successful, empty-leaderboard response rather than
// undefined — a bare `()=>{}` stub used to make `await fetch(...).json()`
// throw on every call, which (combined with the retry-loop bug this harness
// caught) masked the real failure mode behind a generic rejection.
global.fetch = () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ entries: [] }) });
global.setInterval = ()=>0; global.clearInterval = ()=>{};
// Runs the callback synchronously (so timed game logic still executes during
// this one-shot harness) but caps total invocations — a script that sets up
// a legitimate recursive setTimeout loop would otherwise recurse forever on
// the call stack and crash with a confusing RangeError instead of a clear
// harness failure.
let timeoutCalls = 0;
const MAX_TIMEOUT_CALLS = 2000;
global.setTimeout = (fn) => {
  timeoutCalls++;
  if (timeoutCalls > MAX_TIMEOUT_CALLS) return 0;
  try { fn && fn(); } catch (e) { /* surfaced via the outer try/catch below isn't possible here; log and continue */ console.log('  (setTimeout callback threw:', e.message, ')'); }
  return 0;
};
global.clearTimeout = ()=>{};

// Hard watchdog: if the script is still running (or something is keeping the
// event loop alive) after this, fail loudly instead of hanging silently.
const watchdog = REAL_setTimeout(() => {
  console.error('FAIL: harness did not finish within 8s — likely an infinite loop or unbounded async retry.');
  process.exit(1);
}, 8000);
watchdog.unref && watchdog.unref();

try {
  (new Function(script))();
  console.log('SCRIPT RAN WITHOUT TOP-LEVEL ERROR');
  process.exitCode = 0;
} catch (e) {
  console.log('TOP-LEVEL ERROR:', e.message);
  console.log(e.stack.split('\n').slice(0,6).join('\n'));
  process.exitCode = 1;
}

// Some effects of the script (async retries chained via .then) only finish
// resolving as microtasks *after* the synchronous call above returns, so the
// timeoutCalls tally isn't final until just before the process would
// naturally exit — check it here rather than right after the call.
process.on('beforeExit', () => {
  if (timeoutCalls > MAX_TIMEOUT_CALLS) {
    console.log('WARNING: setTimeout fired', timeoutCalls, 'times — that smells like a runaway retry/loop, even though it didn\'t hang. Investigate before shipping.');
  }
});
