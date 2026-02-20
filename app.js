
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}

function limpiarNumero(v){
 if(!v) return NaN;
 return parseFloat(v.toString().replace(/\./g,'').replace(/,/g,'.'));
}

function formatCOP(n){
 return n.toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2});
}

function formatMilesInput(el){
 let raw = el.value.replace(/\D/g,'');
 if(!raw){el.value='';return;}
 el.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}

function formatCuota(el){
 let d = el.value.replace(/\D/g,'');
 if(d.length>=2){ el.value = d[0] + '.' + d.slice(1,3); }
 else{ el.value = d; }
}

function calcular(){
 let total = limpiarNumero(document.getElementById('total').value);
 let p = parseFloat(document.getElementById('porcentaje').value);
 let o1 = parseFloat(document.getElementById('cuota1').value);
 let o2 = parseFloat(document.getElementById('cuota2').value);
 if(!total||!p||!o1||!o2) return;

 let retorno = total * (1 + (p/100));
 let s1 = retorno / o1;
 let s2 = retorno / o2;
 let ben = retorno - total;

 document.getElementById('stake1').innerText = '$ ' + formatCOP(s1);
 document.getElementById('stake2').innerText = '$ ' + formatCOP(s2);
 document.getElementById('ingreso').innerText = '$ ' + formatCOP(retorno);
 document.getElementById('beneficio').innerText = '$ ' + formatCOP(ben);
}

document.getElementById('total').addEventListener('input',function(){formatMilesInput(this);calcular();});
document.getElementById('cuota1').addEventListener('input',function(){formatCuota(this);calcular();});
document.getElementById('cuota2').addEventListener('input',function(){formatCuota(this);calcular();});
document.getElementById('porcentaje').addEventListener('input',calcular);

function hoy(){
 let d=new Date();
 return d.toISOString().slice(0,10);
}

function guardarDia(){
 let benText = document.getElementById('beneficio').innerText;
 if(!benText || benText==='—') return;
 let ben = parseFloat(benText.replace(/[^0-9,]/g,'').replace(/\./g,'').replace(',','.'));
 if(!ben) return;
 let data = JSON.parse(localStorage.getItem('jemi_hist')||'{}');
 let key = hoy();
 data[key] = (data[key]||0) + ben;
 localStorage.setItem('jemi_hist', JSON.stringify(data));
 renderHist();
}

function renderHist(){
 let data = JSON.parse(localStorage.getItem('jemi_hist')||'{}');
 let ul = document.getElementById('lista');
 ul.innerHTML='';
 let total=0;
 Object.keys(data).sort().forEach(k=>{
   total+=data[k];
   let li=document.createElement('li');
   li.textContent = k + ' → $ ' + formatCOP(data[k]);
   ul.appendChild(li);
 });
 document.getElementById('totalAcum').innerText = '$ ' + formatCOP(total);
}

document.getElementById('guardar').addEventListener('click',guardarDia);
document.getElementById('verMas').addEventListener('click',()=>{
 document.getElementById('historial').classList.toggle('hidden');
 renderHist();
});

