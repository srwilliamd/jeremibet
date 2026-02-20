const casas=["BetPlay","Betano","Bwin","1xBet","Bet365","Codere","Betsson"];
function num(v){return parseFloat(v.replace(/,/g,'.'))}

function calcManual(){
let t=num(total.value||0),p=num(percent.value||0),a=num(oddA.value||0),b=num(oddB.value||0);
if(!t||!a||!b){manualResult.innerHTML="";return}
let sA=t/(1+(a/b)),sB=t-sA,ing=sA*a,gan=ing-t;
if(p>0){gan=t*(p/100);ing=t+gan}
manualResult.innerHTML=`<div class=resultBox>Apuesta A $${sA.toFixed(2)}<br>Apuesta B $${sB.toFixed(2)}<br>Ganancia $${gan.toFixed(2)}</div>`;
}
["total","percent","oddA","oddB"].forEach(id=>document.addEventListener("input",e=>{if(e.target.id===id)calcManual()}));

imageInput.addEventListener("change",async e=>{
let f=e.target.files[0]; if(!f)return;
status.innerText="Procesando imagen...";
let {data:{text}}=await Tesseract.recognize(f,'eng');
parse(text);
});

function parse(text){
let dec=text.match(/\d+\.\d+/g)||[];
let out="";
for(let i=0;i<dec.length;i+=2){
if(!dec[i+1])continue;
out+=`<div class=resultBox>
Cuota A ${dec[i]} vs Cuota B ${dec[i+1]}
<input placeholder="Monto invertir" oninput="calcDyn(this,${dec[i]},${dec[i+1]})">
<button onclick="saveGain(this)">Guardar ganancia</button>
<div class=resp></div>
</div>`;
}
results.innerHTML=out||"0 surebets detectadas";
}

function calcDyn(inp,a,b){
let t=num(inp.value||0); if(!t)return;
let sA=t/(1+(a/b)),sB=t-sA,ing=sA*a,gan=ing-t;
inp.nextElementSibling.nextElementSibling.innerHTML=`Apuesta A $${sA.toFixed(2)}<br>Apuesta B $${sB.toFixed(2)}<br>Ganancia $${gan.toFixed(2)}`;
inp.dataset.gan=gan.toFixed(2);
}

function saveGain(btn){
let g=parseFloat(btn.previousElementSibling.dataset.gan||0);
if(!g)return;
let d=new Date().toISOString().slice(0,10);
let hist=JSON.parse(localStorage.getItem("jemi_hist")||"{}");
hist[d]=(hist[d]||0)+g;
localStorage.setItem("jemi_hist",JSON.stringify(hist));
alert("Ganancia guardada");
}

function toggleHist(){
let ul=hist; ul.classList.toggle("hidden"); ul.innerHTML="";
let h=JSON.parse(localStorage.getItem("jemi_hist")||"{}");
Object.keys(h).forEach(k=>{
let li=document.createElement("li");
li.textContent=k+" → $"+h[k].toFixed(2);
ul.appendChild(li);
});
}
