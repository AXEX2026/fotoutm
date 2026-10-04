function toUTM(lat,lon,fz){
const a=6378137,f=1/298.257223563,k0=.9996,e2=f*(2-f),ep=e2/(1-e2),z=fz?+fz:Math.floor((lon+180)/6)+1;
const l0=((z-1)*6-177)*Math.PI/180,p=lat*Math.PI/180,l=lon*Math.PI/180,s=Math.sin(p),t=Math.tan(p);
const N=a/Math.sqrt(1-e2*s*s),T=t*t,C=ep*Math.cos(p)**2,A=Math.cos(p)*(l-l0),e4=e2*e2,e6=e4*e2;
const M=a*((1-e2/4-3*e4/64-5*e6/256)*p-(3*e2/8+3*e4/32+45*e6/1024)*Math.sin(2*p)+(15*e4/256+45*e6/1024)*Math.sin(4*p)-35*e6/3072*Math.sin(6*p));
const E=k0*N*(A+(1-T+C)*A**3/6+(5-18*T+T*T+72*C-58*ep)*A**5/120)+5e5;
let n=k0*(M+N*t*(A*A/2+(5-T+9*C+4*C*C)*A**4/24+(61-58*T+T*T+600*C-330*ep)*A**6/720));
if(lat<0)n+=1e7;
return{e:E,n:n,zone:z,band:"CDEFGHJKLMNPQRSTUVWX"[Math.floor((lat+80)/8)]};}
const CT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc(b){let r=-1;for(let i=0;i<b.length;i++)r=CT[(r^b[i])&255]^(r>>>8);return(r^-1)>>>0}
function zip(fs){const en=new TextEncoder(),P=[],C=[];let o=0;
for(const f of fs){const nm=en.encode(f.name),c=crc(f.data),h=new DataView(new ArrayBuffer(30));
h.setUint32(0,0x04034b50,1);h.setUint16(4,20,1);h.setUint16(6,0x800,1);h.setUint32(14,c,1);h.setUint32(18,f.data.length,1);h.setUint32(22,f.data.length,1);h.setUint16(26,nm.length,1);
P.push(new Uint8Array(h.buffer),nm,f.data);
const d=new DataView(new ArrayBuffer(46));d.setUint32(0,0x02014b50,1);d.setUint16(4,20,1);d.setUint16(6,20,1);d.setUint16(8,0x800,1);d.setUint32(16,c,1);d.setUint32(20,f.data.length,1);d.setUint32(24,f.data.length,1);d.setUint16(28,nm.length,1);d.setUint32(42,o,1);
C.push(new Uint8Array(d.buffer),nm);o+=30+nm.length+f.data.length}
let cs=0;for(const x of C)cs+=x.length;const e=new DataView(new ArrayBuffer(22));
e.setUint32(0,0x06054b50,1);e.setUint16(8,fs.length,1);e.setUint16(10,fs.length,1);e.setUint32(12,cs,1);e.setUint32(16,o,1);
return new Blob([...P,...C,new Uint8Array(e.buffer)],{type:"application/zip"})}
const X=s=>String(s).replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
function colL(i){return String.fromCharCode(65+i)}
function xlsx(rows){const en=new TextEncoder();
const sh=rows.map((r,i)=>`<row r="${i+1}">`+r.map((v,j)=>typeof v==="number"?`<c r="${colL(j)}${i+1}"><v>${v}</v></c>`:`<c r="${colL(j)}${i+1}" t="inlineStr"><is><t>${X(v)}</t></is></c>`).join("")+"</row>").join("");
const W='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const F=[["[Content_Types].xml",W+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'],
["_rels/.rels",W+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
["xl/workbook.xml",W+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Registro" sheetId="1" r:id="rId1"/></sheets></workbook>'],
["xl/_rels/workbook.xml.rels",W+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],
["xl/worksheets/sheet1.xml",W+'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="14" width="18" customWidth="1"/></cols><sheetData>'+sh+'</sheetData></worksheet>']];
return zip(F.map(([name,t])=>({name,data:en.encode(t)})))}
function kml(nm,it){return '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>'+X(nm)+'</name>'+it.map(r=>`<Placemark><name>${X(r.code+" - "+r.nombre)}</name><description>${X(r.desc)}</description><Point><coordinates>${r.lon},${r.lat},${r.alt||0}</coordinates></Point></Placemark>`).join("")+'</Document></kml>'}
if(typeof module!=="undefined")module.exports={toUTM,zip,xlsx,kml};
