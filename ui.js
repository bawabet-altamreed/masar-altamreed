export function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
export function fmtDate(v){if(!v)return "—"; const d=v.toDate?v.toDate():new Date(v); return d.toLocaleDateString("ar-EG",{year:"numeric",month:"short",day:"numeric"});}
export function statusText(s){return ({active:"نشط",expired:"منتهي",suspended:"موقوف"}[s]||s||"—");}
export function logoutButton(){return `<button id="logoutBtn" class="btn danger">تسجيل الخروج</button>`;}
