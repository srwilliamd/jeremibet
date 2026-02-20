
const casas=["BetPlay","Betano","Bwin","1xBet","Betsson","Codere","Bet365"];

function limpiar(v){return parseFloat(v.replace(/\./g,'').replace(',','.'));}

function calc(total,p,o1,o2){
 let gan=total*(p/100);
 let retorno=total+gan;
 let a=retorno/o1;
 let b=retorno/o2;
 let f=total/(a+b);
 let s1=a*f,s2=b*f;
 let ingreso=Math.min(s1*o1,s2*o2);
 return {s1,s2,ingreso,ganancia:ingreso-total};
}

document.getElementById("uploadImage").addEventListener("change", async e=>{
 const file=e.target.files[0];
 document.getElementById("status").innerText="Leyendo imagen...";
 const { data:{ text }} = await Tesseract.recognize(file,'eng');
 document.getElementById("status").innerText="Procesando texto...";
 parseSurebets(text);
});

function parseSurebets(text){
 const lines=text.split("\n").map(l=>l.trim()).filter(l=>l);
 const bets=[];
 for(let i=0;i<lines.length;i++){
   if(lines[i].includes("%")){
     const p=parseFloat(lines[i]);
     let o1=null,o2=null,c1="",c2="";
     for(let j=i+1;j<i+8 && j<lines.length;j++){
        const l=lines[j];
        const dec=l.match(/\d\.\d{2}/);
        casas.forEach(c=>{ if(l.includes(c)){ if(!c1) c1=c; else c2=c; }});
        if(dec){ if(!o1) o1=parseFloat(dec[0]); else if(!o2) o2=parseFloat(dec[0]); }
     }
     if(p && o1 && o2) bets.push({p,o1,o2,c1,c2});
   }
 }
 renderBets(bets);
}

function renderBets(bets){
 const cont=document.getElementById("surebets");
 cont.innerHTML="<h4>"+bets.length+" surebets detectadas</h4>";
 bets.forEach((b,i)=>{
   const div=document.createElement("div");
   div.className="surebet";
   div.innerHTML=`
   <b>Surebet #${i+1} — ${b.p}%</b><br>
   ${b.c1||""} ${b.o1} vs ${b.c2||""} ${b.o2}<br>
   <input placeholder="Monto invertir" id="m${i}">
   <button onclick="calcBet(${i},${b.p},${b.o1},${b.o2})">Calcular</button>
   <div id="r${i}"></div>`;
   cont.appendChild(div);
 });
}

window.calcBet=function(i,p,o1,o2){
 const total=limpiar(document.getElementById("m"+i).value);
 if(!total) return;
 const r=calc(total,p,o1,o2);
 document.getElementById("r"+i).innerHTML=
 `Apuesta A: $${r.s1.toFixed(2)}<br>
  Apuesta B: $${r.s2.toFixed(2)}<br>
  Ganancia: $${r.ganancia.toFixed(2)}`;
}
