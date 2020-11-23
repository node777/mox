var lux={
    t:document.getElementById("content"),
    changePage: async function(x){
        lux.t.innerHTML=elements.loading;
        var h=(location.hash||"#splash");
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
        document.getElementById("header").innerHTML=elements.header;
        window.addEventListener("hashchange", this.changePage, false);
    }
}
window.ethereum.on('accountsChanged', function (accounts) {
    lux.setup();
  });

lux.setup();
