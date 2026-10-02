import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const COOKIE='__Host-etched-admin';
const signed=(value,secret)=>createHmac('sha256',secret).update(value).digest('base64url');
const equal=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)};
function sessionValid(value,secret){if(!value||value.length>512)return false;const [expiry,nonce,signature,...extra]=value.split('.');return !extra.length&&/^\d+$/.test(expiry)&&/^[a-f0-9]{32}$/.test(nonce||'')&&Number(expiry)>Date.now()&&Number(expiry)<=Date.now()+43200000&&equal(signature||'',signed(`${expiry}.${nonce}`,secret))}
const shell=(title,content)=>`<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} · Etched Laser Studio</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/admin-ui.css"></head><body><header><a class="brand" href="/">etched<span>.</span><small>LASER STUDIO</small></a><span>Studio admin</span></header>${content}</body></html>`;
const login=(message='')=>shell('Admin login',`<main class="login"><span class="eyebrow">PRIVATE STUDIO</span><h1>Welcome back.</h1><p>Sign in to manage your quotes and invoices.</p>${message?`<p class="error" role="alert">${message}</p>`:''}<form method="post" action="/admin/login"><label>Admin password<input name="password" type="password" autocomplete="current-password" required maxlength="256" autofocus></label><button class="primary">Sign in</button></form><a class="back" href="/">Back to website</a></main>`);
export default async function handler(req,res){
res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('Vercel-CDN-Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Vary','Cookie');
const secret=process.env.ADMIN_PASSWORD;const query=new URL(req.url,'https://local.invalid').searchParams;let path=String(req.query?.path??query.get('path')??'dashboard').replace(/^\/+|\/+$/g,'');
const send=(status,body,type='text/html; charset=utf-8')=>{res.statusCode=status;res.setHeader('Content-Type',type);res.end(body)};
const redirect=to=>{res.statusCode=303;res.setHeader('Location',to);res.end()};
if(!secret||secret.length<16)return send(503,shell('Admin locked','<main class="login"><span class="eyebrow">PRIVATE STUDIO</span><h1>Admin area locked.</h1><p>The admin login is awaiting configuration. Public visitors cannot access the invoicing tools.</p><a class="back" href="/">Back to website</a></main>'));
if(req.method==='POST'){
const origin=req.headers.origin;const host=req.headers.host;if(!origin||new URL(origin).host!==host)return send(403,'Request not allowed.','text/plain');
if(path==='logout'){res.setHeader('Set-Cookie',`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);return redirect('/admin')}
if(path!=='login')return send(405,'Method not allowed.','text/plain');
let body=req.body;if(!body){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>2048)return send(413,'Request too large.','text/plain')}body=Object.fromEntries(new URLSearchParams(raw))}else if(typeof body==='string')body=Object.fromEntries(new URLSearchParams(body));
const candidate=String(body?.password||'');if(candidate.length>256||!equal(signed(candidate,secret),signed(secret,secret))){await new Promise(resolve=>setTimeout(resolve,1000));return send(401,login('That password was not recognised.'))}
const payload=`${Date.now()+43200000}.${randomBytes(16).toString('hex')}`;res.setHeader('Set-Cookie',`${COOKIE}=${payload}.${signed(payload,secret)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`);return redirect('/admin');
}
if(req.method!=='GET'&&req.method!=='HEAD')return send(405,'Method not allowed.','text/plain');
const cookies=Object.fromEntries(String(req.headers.cookie||'').split(';').map(x=>{let i=x.indexOf('=');return[x.slice(0,i).trim(),x.slice(i+1)]}));
if(!sessionValid(cookies[COOKIE],secret)){if(path==='dashboard'||path==='login')return send(200,login());return redirect('/admin')}
if(path==='login')return redirect('/admin');
const files={'dashboard':['dashboard.html','text/html; charset=utf-8'],'dashboard.js':['dashboard.js','text/javascript; charset=utf-8'],'invoicing':['invoicing/index.html','text/html; charset=utf-8'],'invoicing/index.html':['invoicing/index.html','text/html; charset=utf-8'],'invoicing/app.js':['invoicing/app.js','text/javascript; charset=utf-8'],'invoicing/style.css':['invoicing/style.css','text/css; charset=utf-8'],'invoicing/vendor/jspdf.js':['invoicing/vendor/jspdf.js','text/javascript; charset=utf-8']};
if(!Object.hasOwn(files,path))return send(404,'Not found.','text/plain');try{const [file,type]=files[path];send(200,req.method==='HEAD'?'':await readFile(join(process.cwd(),'private',file)),type)}catch{send(500,'Admin page unavailable. Please try again.','text/plain')}
}
