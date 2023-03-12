(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))n(c);new MutationObserver(c=>{for(const i of c)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(c){const i={};return c.integrity&&(i.integrity=c.integrity),c.referrerPolicy&&(i.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?i.credentials="include":c.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(c){if(c.ep)return;c.ep=!0;const i=r(c);fetch(c.href,i)}})();const F="https://api.nbp.pl/api/exchangerates/tables/a?format=json",e={inputFrom:document.getElementById("input-from"),inputTo:document.getElementById("input-to"),selectFrom:document.getElementById("select-from"),selectTo:document.getElementById("select-to"),codeSelectFrom:document.getElementById("select-from-code"),codeSelectTo:document.getElementById("select-to-code"),swapButton:document.getElementById("swap-button"),primaryRate:document.getElementById("primary-rate"),secondaryRate:document.getElementById("secondary-rate")};let u,a;window.addEventListener("load",E);e.inputFrom&&e.inputTo&&(e.inputFrom.addEventListener("input",t=>p(t,"From")),e.inputTo.addEventListener("input",t=>p(t,"To")));e.selectFrom&&e.selectTo&&(e.selectFrom.addEventListener("change",t=>f(t,"From")),e.selectTo.addEventListener("change",t=>f(t,"To")));e.swapButton&&e.swapButton.addEventListener("click",S);async function E(){try{const r=await(await(await fetch(F)).json())[0].rates,n=await g(r);e.selectFrom&&e.selectTo&&(await m(e.selectFrom,n),await m(e.selectTo,n),u=await n[33],a=await n[11],v())}catch(t){console.log(t)}}function g(t){const o=t;return o.push({currency:"złoty polski",code:"PLN",mid:1}),o.sort(I),o}function I(t,o){return t.currency<o.currency?-1:t.currency>o.currency?1:0}function m(t,o){o.map(n=>L(n)).forEach(n=>t.appendChild(n))}function L(t){const{currency:o,code:r,mid:n}=t,c=document.createElement("option"),i=o.replace(/\b[a-zA-Ząćęłńóśźż]\S*/g,s=>s.charAt(0).toUpperCase()+s.slice(1));return c.textContent=i,c.value=r,c.setAttribute("data-mid",String(n)),c}function p(t,o){let n=t.target.value;o==="From"?l(n,"From"):o==="To"&&l(n,"To")}function f(t,o){const r=t.target,n=r.value,i=r.options[r.selectedIndex].getAttribute("data-mid"),s=Number(i);o==="From"&&e.codeSelectFrom?(e.codeSelectFrom.textContent=n,u={code:n,mid:s},T("From")):o==="To"&&e.codeSelectTo&&(e.codeSelectTo.textContent=n,a={code:n,mid:s},T("To")),d()}function T(t){if(e.inputFrom instanceof HTMLInputElement&&e.inputTo instanceof HTMLInputElement){if(t==="From"){const o=e.inputFrom.value;l(o,"From")}else if(t==="To"){const o=e.inputFrom.value;l(o,"From")}}}function l(t,o){const r=y(u.mid,a.mid);e.inputFrom instanceof HTMLInputElement&&e.inputTo instanceof HTMLInputElement&&(o==="From"?t===""?e.inputTo.value="":e.inputTo.value=(Number(t)*r.primary).toFixed(2):o==="To"&&(t===""?e.inputFrom.value="":e.inputFrom.value=(Number(t)*r.primary).toFixed(2)))}function v(){e.selectFrom instanceof HTMLSelectElement&&e.selectTo instanceof HTMLSelectElement&&e.codeSelectFrom&&e.codeSelectTo&&(e.selectFrom.value=u.code,e.selectTo.value=a.code,e.codeSelectFrom.textContent=u.code,e.codeSelectTo.textContent=a.code),d()}function S(){h(),w(),d()}function h(){const t=u,o=a;e.selectFrom instanceof HTMLSelectElement&&e.selectTo instanceof HTMLSelectElement&&e.codeSelectFrom&&e.codeSelectTo&&(e.selectFrom.value=o.code,e.selectTo.value=t.code,e.codeSelectFrom.textContent=o.code,e.codeSelectTo.textContent=t.code),u=o,a=t}function w(){if(e.inputFrom instanceof HTMLInputElement&&e.inputTo instanceof HTMLInputElement){const t=e.inputFrom.value,o=e.inputTo.value;e.inputFrom.value=o,e.inputTo.value=t}}function d(){const t=u.code,o=a.code,r=y(u.mid,a.mid);e.primaryRate&&e.secondaryRate&&(e.primaryRate.textContent=`1 ${t} = ${r.primary} ${o}`,e.secondaryRate.textContent=`1 ${o} = ${r.secondary} ${t}`)}function y(t,o){return{primary:Number((t/o).toFixed(4)),secondary:Number((o/t).toFixed(4))}}