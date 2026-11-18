// Kijkt versie.json na zoals de app het leest (src/bronupdate.js, parseManifest): anders negeert elke installatie het.
import fs from 'node:fs';
const fout = (m) => { console.error(`versie.json: ${m}`); process.exit(1); };
const tekst = fs.readFileSync(new URL('./versie.json', import.meta.url), 'utf8');
if (Buffer.byteLength(tekst) > 16 * 1024) fout('groter dan 16 KB');
let v;
try { v = JSON.parse(tekst); } catch { fout('geen geldige JSON'); }
if (!v || typeof v !== 'object' || Array.isArray(v)) fout('geen object');
if (v.app !== 'huishouden') fout('app moet "huishouden" zijn');
if (typeof v.versie !== 'string' || !/^\d{1,3}(\.\d{1,3}){1,2}$/.test(v.versie)) fout('versie heeft niet de vorm 2.12 of 2.12.1');
if (v.datum != null && !/^\d{4}-\d{2}-\d{2}$/.test(v.datum)) fout('datum niet als JJJJ-MM-DD');
if (!Array.isArray(v.nieuw) || v.nieuw.length > 8) fout('nieuw: een lijst van hoogstens 8 punten');
for (const x of v.nieuw) {
  if (!x || typeof x.titel !== 'string' || !x.titel.trim() || x.titel.length > 80) fout('elke titel: tekst van 1 tot 80 tekens');
  if (/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩]/.test(x.titel)) fout('stuur- of onzichtbare tekens in een titel');
  if (Object.keys(x).some((k) => k !== 'titel')) fout('alleen titels (geen andere velden)');
}
if (Object.keys(v).some((k) => !['app', 'versie', 'datum', 'nieuw'].includes(k))) fout('onbekend veld');
console.log(`versie.json in orde: versie ${v.versie}, ${v.nieuw.length} titels`);
