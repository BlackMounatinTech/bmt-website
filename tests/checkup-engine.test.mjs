import assert from 'node:assert/strict';
import {assess,questions,branch,tailoredPlan,trades} from '../checkup-engine.mjs';
const good={trade:'concrete',stage:'established',country:'ca',team:'small',revenue:'25to50',goal:'profit',timeline:'quarter',pain:'unknown',leadflow:'steady',quote_outcome:'winning',followup:'consistent',jobcost:'tracked',payment:'okay',capacity:'balanced',scope:'yes'};
const cases=[['healthy',good,'healthy'],['few leads',{...good,leadflow:'few'},'leads'],['followup gap',{...good,followup:'none'},'conversion'],['losing jobs',{...good,jobcost:'losses'},'pricing'],['payment pressure',{...good,payment:'blocked',capacity:'overloaded'},'cash'],['capacity before leads',{...good,goal:'grow',pain:'leads',leadflow:'few',capacity:'overloaded'},'capacity'],['unknown margin',{...good,jobcost:'unknown'},'measurement'],['unknown baseline',{...good,leadflow:'unknown',jobcost:'unknown',followup:'unknown',capacity:'unknown'},'measurement'],['prelaunch',{...good,stage:'planning'},'launch'],['own labour missing',{...good,pain:'pricing',p_owner:'no'},'pricing']];
for(const [name,a,expected] of cases)assert.equal(assess(a).primary,expected,name);
assert.equal(branch({...good,scope:'no'}),'healthy','Final scope answer must not change the question branch');
for(const [id] of trades){assert.equal(questions({...good,trade:id}).find(q=>q.id==='scope').help.includes(trades.find(t=>t[0]===id)[2]),true);}
for(const pain of ['pipeline','leads','conversion','pricing','cash','capacity','unknown']){const qs=questions({...good,pain});assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);}
const startup=questions({...good,stage:'planning'});assert(!startup.some(q=>q.id==='revenue'));assert(startup.some(q=>q.id==='launch_pricing'));
assert(tailoredPlan({...good,goal:'grow',jobcost:'losses'}).notes.some(x=>x.includes('grow')));
assert(tailoredPlan({...good,pain:'pricing',p_owner:'no'}).notes.some(x=>x.includes('own labour')));
console.log('PASS: 10 priority scenarios, all 16 trades, all 7 routing choices, startup route, branch stability and tailored advice.');

// Lead shortages and quote losses are distinct and may coexist.
const losing={...good,pain:'pipeline',leadflow:'few',quote_outcome:'ghost',followup:'consistent'};
assert.equal(assess(losing).primary,'pipeline');
assert.equal(assess({...good,quote_outcome:'ghost'}).primary,'conversion');
assert.equal(assess({...good,quote_outcome:'cheaper',c_comparison:'comparable'}).primary,'conversion','Cheaper competition does not prove bad job costing');
assert.equal(assess({...losing,payment:'blocked'}).primary,'cash');
assert.equal(assess({...losing,jobcost:'losses'}).primary,'pricing');
assert.equal(assess({...losing,capacity:'overloaded'}).primary,'capacity');
assert.equal(assess({...losing,jobcost:'unknown'}).primary,'pipeline','Unknown costs alone do not explain a reported shortage and quote losses');
assert.equal(assess({...losing,jobcost:'unknown',payment:'unknown',capacity:'unknown'}).primary,'measurement');
assert.equal(assess({...good,pain:'pipeline',quote_outcome:'winning'}).primary,'healthy','Concern alone must not manufacture a confirmed problem');
assert.equal(branch({...losing,pain:'leads'}),'pipeline','Spot both issues even when visitor picks leads');
assert.equal(branch({...losing,c_reason:'price',c_comparison:'assumed'}),'pipeline','Follow-up answers must not move the question branch');
assert(!assess(losing).secondary.some(s=>['leads','conversion'].includes(s.key)),'Avoid redundant secondary diagnoses');
const combined=questions(losing).map(q=>q.id);
assert(combined.includes('demand')&&combined.includes('c_comparison')&&combined.includes('c_fit'));
assert(tailoredPlan({...losing,c_comparison:'assumed'}).notes.some(t=>t.includes('Ghosting does not prove')));
assert(tailoredPlan({...losing,quote_outcome:'cheaper',c_comparison:'comparable'}).notes.some(t=>t.includes('price competition may be real')));
assert(tailoredPlan(losing).notes.some(t=>t.includes('already follow up consistently')));
assert(tailoredPlan({...losing,demand:'lower'}).notes.some(t=>t.includes('cannot verify market-wide demand')));
assert(tailoredPlan({...good,quote_outcome:'postponed'}).notes.some(t=>t.includes('delayed or cancelled')));
console.log('PASS: combined shortage/loss path, ghosting with consistent follow-up, cheaper-quote evidence, postponed work, competing priorities, branch stability and appropriate advice.');

assert.equal(assess({...good,quote_outcome:'unknown'}).primary,'measurement','Do not report healthy when quote outcomes are unknown');
