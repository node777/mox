var lux={
    consoleEnabled:false,
    t:document.getElementById("content"),
    changePage: async function(x){
        var h=(location.hash||"#splash");
        lux.sidebar(1);
        lux.t.innerHTML=elements.loading;
        var hwa=h.split("#")[1];
        var a=hwa.split("?");
        var p=a[0];
        document.body.id = p;
        lux.t.innerHTML = await elements.pages[p](a?a:null)||elements.pages["404"]();
    },
    setup: async function(){
        let s=["header","sidebar","footer"]
        for(i in s){
            console.log(i)
            document.getElementById(s[i]).innerHTML=elements[s[i]];
        }
        await hydra.load();
        await lux.changePage();
        window.addEventListener("hashchange", this.changePage, false);
    },
    sidebar:(l)=>{
        if(l){
            document.getElementById("sidebar").style="";
            document.getElementById("overlay").style="";
        }else{
            document.getElementById("sidebar").style="width:310px";
            document.getElementById("overlay").style="display:initial;opacity:40%";
        }
    },
    console:(l)=>{
        if(lux.consoleEnabled==true){
            document.getElementById("consoleIcon").style="";
            document.getElementById("networkConsole").style="";
            document.getElementById("content").style="";
            lux.consoleEnabled=false;
        }else{
            document.getElementById("consoleIcon").style="bottom:190px;-webkit-filter: invert(100%);filter: invert(100%);";
            document.getElementById("networkConsole").style="height: 256px";
            document.getElementById("content").style="bottom:256px";
            lux.consoleEnabled=true;
        }
    }
}
window.ethereum.on('accountsChanged', function (accounts) {
    lux.changePage();
  });
lux.setup();