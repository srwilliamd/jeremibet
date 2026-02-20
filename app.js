
function limpiarNumero(v){
 if(!v) return NaN;
 return parseFloat(v.toString().replace(/\./g,'').replace(/,/g,'.'));
}

function formatCOP(n){
 return n.toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2});
}

function formatMilesInput(el){
 let raw=el.value.replace(/\D/g,'');
 if(!raw){el.value='';return;}
 el.value=raw.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}

function formatCuota(el){
 let d=el.value.replace(/\D/g,'');
 if(d.length>=2) el.value=d[0]+'.'+d.slice(1,3);
 else el.value=d;
}

function calcular(){
 let total=limpiarNumero(document.getElementById('total').value);
 let p=parseFloat(document.getElementById('porcentaje').value);
 let o1=parseFloat(document.getElementById('cuota1').value);
 let o2=parseFloat(document.getElementById('cuota2').value);

 if(!total||isNaN(p)||!o1||!o2) return;

 // 1) Ganancia objetivo por % manual
 let gananciaObjetivo = total * (p/100);

 // 2) Retorno objetivo
 let retorno = total + gananciaObjetivo;

 // 3) Apuestas crudas
 let a = retorno / o1;
 let b = retorno / o2;

 // 4) Normalizar inversión exacta
 let factor = total / (a + b);
 let s1 = a * factor;
 let s2 = b * factor;

 // 5) Resultado real
 let ingresoA = s1 * o1;
 let ingresoB = s2 * o2;
 let ingreso = Math.min(ingresoA, ingresoB);
 let beneficio = ingreso - total;
 let percentReal = (beneficio/total)*100;

 document.getElementById('stake1').innerText='$ '+formatCOP(s1);
 document.getElementById('stake2').innerText='$ '+formatCOP(s2);
 document.getElementById('ingreso').innerText='$ '+formatCOP(ingreso);
 document.getElementById('beneficio').innerText='$ '+formatCOP(beneficio);
 document.getElementById('percentReal').innerText=percentReal.toFixed(2)+' %';

 let estado=document.getElementById('estado');
 if(beneficio>0){
   estado.innerText='RENTABLE';
   estado.className='good';
 }else{
   estado.innerText='NO RENTABLE';
   estado.className='bad';
 }
}

document.getElementById('total').addEventListener('input',e=>{formatMilesInput(e.target);calcular();});
document.getElementById('cuota1').addEventListener('input',e=>{formatCuota(e.target);calcular();});
document.getElementById('cuota2').addEventListener('input',e=>{formatCuota(e.target);calcular();});
document.getElementById('porcentaje').addEventListener('input',calcular);

function hoy(){return new Date().toISOString().slice(0,10);}

function guardarGanancia(){
 let txt=document.getElementById('beneficio').innerText;
 if(!txt||txt==='—')return;
 let ben=parseFloat(txt.replace(/[^0-9,]/g,'').replace(/\./g,'').replace(',','.'));
 let data=JSON.parse(localStorage.getItem('jemi_hist')||'{}');
 let k=hoy();
 data[k]=(data[k]||0)+ben;
 localStorage.setItem('jemi_hist',JSON.stringify(data));
 renderHist();
}

function renderHist(){
 let data=JSON.parse(localStorage.getItem('jemi_hist')||'{}');
 let ul=document.getElementById('lista');
 ul.innerHTML='';
 let total=0;
 Object.keys(data).forEach(k=>{
 total+=data[k];
 let li=document.createElement('li');
 li.textContent=k+' → $ '+formatCOP(data[k]);
 ul.appendChild(li);
 });
 document.getElementById('totalAcum').innerText='$ '+formatCOP(total);
}

document.getElementById('guardar').onclick=guardarGanancia;
document.getElementById('verGanancias').onclick=()=>{
 document.getElementById('panelGanancias').classList.toggle('hidden');
 renderHist();
};
