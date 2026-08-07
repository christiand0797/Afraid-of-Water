// Debug harness: stub DOM/canvas and execute the game script to catch runtime errors
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
global.fetch = ()=>{};
global.setInterval = ()=>0; global.clearInterval = ()=>{};
global.setTimeout = (fn)=>{ try{fn&&fn()}catch(e){} return 0; }; global.clearTimeout = ()=>{};

try {
  (new Function(script))();
  console.log('SCRIPT RAN WITHOUT TOP-LEVEL ERROR');
} catch (e) {
  console.log('TOP-LEVEL ERROR:', e.message);
  console.log(e.stack.split('\n').slice(0,6).join('\n'));
}
