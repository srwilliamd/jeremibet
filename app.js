function calculateManual(){
let total=parseFloat(document.getElementById("total").value);
let percent=parseFloat(document.getElementById("percent").value);
let oddA=parseFloat(document.getElementById("oddA").value);
let oddB=parseFloat(document.getElementById("oddB").value);

if(!total||!oddA||!oddB){
document.getElementById("manualResult").innerHTML="";
return;
}

let stakeA=total/(1+(oddA/oddB));
let stakeB=total-stakeA;

let income=stakeA*oddA;
let profit=income-total;

if(percent>0){
profit=total*(percent/100);
income=total+profit;
}

document.getElementById("manualResult").innerHTML=`
<div class="resultBox">
Apuesta A: $${stakeA.toFixed(2)}<br>
Apuesta B: $${stakeB.toFixed(2)}<br>
Ingresos: $${income.toFixed(2)}<br>
Ganancia: $${profit.toFixed(2)}
</div>`;
}

["total","percent","oddA","oddB"].forEach(id=>{
document.addEventListener("input",e=>{
if(e.target.id===id) calculateManual();
});
});

document.getElementById("imageInput").addEventListener("change",async function(e){
const file=e.target.files[0];
if(!file)return;
document.getElementById("status").innerText="Procesando imagen...";
const {data:{text}}=await Tesseract.recognize(file,'eng');
parseSurebets(text);
});

function parseSurebets(text){
let matches=text.match(/\d+\.\d+/g);
if(!matches){
document.getElementById("results").innerHTML="0 surebets detectadas";
return;
}

let container="";

for(let i=0;i<matches.length;i+=2){
if(matches[i+1]){
container+=`
<div class="resultBox">
Surebet detectada<br>
Cuota A: ${matches[i]}<br>
Cuota B: ${matches[i+1]}<br>
<input type="number" placeholder="Monto total" oninput="calculateDynamic(this, ${matches[i]}, ${matches[i+1]})">
<div class="dynamicResult"></div>
</div>`;
}}

document.getElementById("results").innerHTML=container;
}

function calculateDynamic(input,oddA,oddB){
let total=parseFloat(input.value);
if(!total)return;

let stakeA=total/(1+(oddA/oddB));
let stakeB=total-stakeA;

let income=stakeA*oddA;
let profit=income-total;

input.nextElementSibling.innerHTML=`
Apuesta A: $${stakeA.toFixed(2)}<br>
Apuesta B: $${stakeB.toFixed(2)}<br>
Ganancia: $${profit.toFixed(2)}`;
}
