import assert from 'node:assert/strict';
import {assess,questions,branch,tailoredPlan,trades} from '../checkup-engine.mjs';
const good={trade:'concrete',stage:'established',country:'ca',team:'small',revenue:'25to50',goal:'profit',timeline:'quarter',pain:'unknown',leadflow:'steady',followup:'consistent',jobcost:'tracked',payment:'okay',capacity:'balanced',scope:'yes'};
const cases=[['healthy',good,'healthy'],['few leads',{...good,leadflow:'few'},'leads'],['followup gap',{...good,followup:'none'},'conversion'],['losing jobs',{...good,jobcost:'losses'},'pricing'],['payment pressure',{...good,payment:'blocked',capacity:'overloaded'},'cash'],['capacity before leads',{...good,goal:'grow',pain:'leads',leadflow:'few',capacity:'overloaded'},'capacity'],['unknown margin',{...good,jobcost:'unknown'},'measurement'],['unknown baseline',{...good,leadflow:'unknown',jobcost:'unknown',followup:'unknown',capacity:'unknown'},'measurement'],['prelaunch',{...good,stage:'planning'},'launch'],['own labour missing',{...good,pain:'pricing',p_owner:'no'},'pricing']];
for(const [name,a,expected] of cases)assert.equal(assess(a).primary,expected,name);
assert.equal(branch({...good,scope:'no'}),'healthy','Final scope answer must not change the question branch');
for(const [id] of trades){assert.equal(questions({...good,trade:id}).find(q=>q.id==='scope').help.includes(trades.find(t=>t[0]===id)[2]),true);}
for(const pain of ['leads','conversion','pricing','cash','capacity','unknown']){const qs=questions({...good,pain});assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);}
const startup=questions({...good,stage:'planning'});assert(!startup.some(q=>q.id==='revenue'));assert(startup.some(q=>q.id==='launch_pricing'));
assert(tailoredPlan({...good,goal:'grow',jobcost:'losses'}).notes.some(x=>x.includes('grow')));
assert(tailoredPlan({...good,pain:'pricing',p_owner:'no'}).notes.some(x=>x.includes('own labour')));
console.log('PASS: 10 priority scenarios, all 16 trades, all 6 routing choices, startup route, branch stability and tailored advice.');
