import {test} from 'node:test';
import assert from 'node:assert/strict';
import {angle,radians} from '../lib/model.ts';
for (const damping of [.1,.3,1,2,3]) test(`EDO, condições iniciais e convergência ζ=${damping}`,()=>{const p={initial:radians(20),damping,frequency:1};assert.ok(Math.abs(angle(0,p)-p.initial)<1e-12);const h=.0001;assert.ok(Math.abs((angle(h,p)-angle(0,p))/h)<.0001);for(const t of [.5,2,5,12]){const y=angle(t,p),v=(angle(t+h,p)-angle(t-h,p))/(2*h),a=(angle(t+h,p)-2*y+angle(t-h,p))/(h*h);assert.ok(Math.abs(a+2*damping*v+y)<1e-6)}assert.ok(Math.abs(angle(300,p))<1e-10)});
test('Continuidade perto do regime crítico',()=>{for(const t of [0,1,5,20])for(const z of [.999999,1.000001])assert.ok(Math.abs(angle(t,{initial:1,damping:z,frequency:1})-angle(t,{initial:1,damping:1,frequency:1}))<1e-6)});
