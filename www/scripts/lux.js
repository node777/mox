var lux={
    consoleEnabled:false,
    t:document.getElementById("content"),
    changePage: async function(x){
        if(document.getElementById("ur")){
            var h=(location.hash||"#ur");
        }else{
            var h=(location.hash||"#splash");
        }
        lux.sidebar(1);
        lux.t.innerHTML=elements.loading;
        var hwa=h.split("#")[1];
        var a=hwa.split("?");
        var p=a[0];
        console.log(a);
        document.body.id = p;
        lux.t.innerHTML = await elements.pages[p](a?a:null)||elements.pages["404"]();
    },
    setup: async function(){

        await hydra.load();
        await lux.changePage();
        if(document.getElementById("ur")){
            document.getElementById("header").innerHTML=elements.urHeader;
        }else{
            document.getElementById("header").innerHTML=elements.header;
        }
        document.getElementById("sidebar").innerHTML=elements.sidebar;
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
            //setTimeout(document.getElementById("consoleIcon").onclick=lux.console(), 1000);
        }else{
            document.getElementById("consoleIcon").style="bottom:190px;-webkit-filter: invert(100%);filter: invert(100%);";
            document.getElementById("networkConsole").style="height: 256px";
            document.getElementById("content").style="bottom:256px";
            lux.consoleEnabled=true;
            //setTimeout(document.getElementById("consoleIcon").onclick=lux.console(1), 1000);
        }
    }
}
window.ethereum.on('accountsChanged', function (accounts) {
    lux.setup();
  });

lux.setup();
