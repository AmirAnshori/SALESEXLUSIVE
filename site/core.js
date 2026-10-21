(function(root){
const clean=v=>String(v??'').normalize('NFKC').trim().replace(/\s+/g,' '), key=v=>clean(v).toUpperCase();
function number(v){if(typeof v==='number')return v;let s=clean(v).replace(/Rp\s*/i,'').replace(/\s/g,'');if(!s)return NaN;if(s.includes(',')&&s.includes('.'))s=s.lastIndexOf(',')>s.lastIndexOf('.')?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');else if(s.includes(','))s=/^-?\d{1,3}(,\d{3})+$/.test(s)?s.replace(/,/g,''):s.replace(',','.');return Number(s);}
function dpp(v){if(typeof v==='number')return v*1000;const s=clean(v);if(/^-?\d+(?:\.\d{1,3})?$/.test(s))return Number(s)*1000;return number(s);}
function date(v){let s=clean(v);if(/^\d{4}-\d{2}-\d{2}/.test(s))return s.slice(0,10);let m=s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);if(m)return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;return '';}
function prepare(master,raw,cutoff){let stores=[], map=new Map(),byName=new Map(),audit={input:raw.length-1,headers:0,future:0,invalid:0,outliers:0,unmatched:0,ambiguous:0,numericScaled:0,valid:0,outliers:0};
for(const r of master.slice(1)){if(!clean(r[2]))continue;let id=key(r[0])+'|'+key(r[2]);if(map.has(id))continue;let s={id,name:clean(r[2]),distributor:clean(r[0]),sales:clean(r[1]),area:clean(r[9]),grade:clean(r[3])};map.set(id,stores.length);stores.push(s);let n=key(r[2]);byName.set(n,[...(byName.get(n)||[]),id]);}
let skus=[],sm=new Map(),ag=new Map(),max='',min='9999';
for(const r of raw.slice(1)){if(key(r[0])==='TANGGAL'){audit.headers++;continue;}let dt=date(r[0]),q=number(r[8]),v=dpp(r[10]);if(!dt||!Number.isFinite(q)||!Number.isFinite(v)){audit.invalid++;continue;}if(dt>cutoff){audit.future++;continue;}if(q!==0 && Math.abs(v/q)>1000000){audit.outliers++;continue;}
let name=clean(r[4]||r[3]),dist=clean(r[13]||r[2]),id=key(dist)+'|'+key(name),si=map.get(id);
if(si===undefined){let options=byName.get(key(name))||[];if(options.length===1){si=map.get(options[0]);}else{audit.unmatched++;if(options.length>1)audit.ambiguous++;continue;}}
let code=clean(r[11]||r[6]),sn=clean(r[12]||r[7]||'SKU tanpa nama'),sk=code||key(sn);if(!sm.has(sk)){sm.set(sk,skus.length);skus.push({code,name:sn});}let ki=sm.get(sk),month=dt.slice(0,7),ak=[si,ki,month].join('|');if(!ag.has(ak))ag.set(ak,[si,ki,month,0,0,'']);let a=ag.get(ak);a[3]+=q;a[4]+=v;if(q>0&&dt>a[5])a[5]=dt;audit.valid++;if(typeof r[10]==='number'||/^-?\d+(?:\.\d{1,3})?$/.test(clean(r[10])))audit.numericScaled++;max=dt>max?dt:max;min=dt<min?dt:min;
}return {stores,skus,rows:[...ag.values()].map(a=>{a[4]=Math.round(a[4]*100)/100;return a;}),audit,max,min,cutoff};}
function csv(t){let rows=[],row=[],s='',quoted=false;for(let i=0;i<t.length;i++){let c=t[i];if(c==='"'){if(quoted&&t[i+1]==='"'){s+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(s);s='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&t[i+1]==='\n')i++;row.push(s);if(row.some(Boolean))rows.push(row);row=[];s='';}else s+=c;}row.push(s);if(row.some(Boolean))rows.push(row);if(rows[0])rows[0][0]=rows[0][0].replace(/^\uFEFF/,'');return rows;}
function months(end,count){let [y,m]=end.split('-').map(Number);return Array.from({length:count},(_,i)=>{let d=new Date(Date.UTC(y,m-count+i,1));return d.toISOString().slice(0,7);});}
root.SalesCore={prepare,csv,number,dpp,months};if(typeof module!=='undefined')module.exports=root.SalesCore;
})(globalThis);
