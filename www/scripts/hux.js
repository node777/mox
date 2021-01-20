var hux={
    cid:0,
    account:()=>{
        if(location.hash=="account"){
            lux.changePage();
        }else{
            location.hash="account"
        }
    },
    connect: function(){
      if(hydra.account){
        location.hash="account";
      }
      else{
        location.hash = "connect";
      }
    },
    load:()=>{
        document.getElementById("content").innerHTML=elements.loading;
    },
    chainData: function(){
        return hydra.chains[this.cid]
    },
    get: function(){
        return hux.chainData().ip+"/query/"
    },
    post: function(){
        return hux.chainData().ip+"/invoke/"
    },
    getChain: function(){
        try{
            let r="";
            hydra.chains[this.cid].blocks=JSON.parse(hydra.get(hux.chainData().ip));
            console.log(hydra.chains[this.cid].blocks)
            let blocks=hydra.chains[this.cid].blocks;
            for(block in blocks){
                var b = blocks[block];
                console.log(b);
                if(block!=0){
                    r+=`
                        <div class='block box'>
                            <div>
                                Previous Hash:<br>${b.p}<br><br>
                                Signing Key:<br>${b.k}<br><br>
                                Timestamp:<br>${b.t}<br><br>
                                Function Invocation:<br>${b.i}<br><br>
                                Message Data:<br>${b.m}<br><br>
                                Block Signature:<br>${b.s}<br><br>
                                Block Hash:<br>${b.h}<br><br>
                            </div>
                        </div>`;
                }else{
                    r+=`
                        <div class='block box'>GENISIS BLOCK<br><br>`
                        for(d in b){
                            r+=`${d}: <br>${b[d]}<br><br>`;
                        }
                    r+=`</div>
                    `
                }
            }
            document.getElementById('chainData').innerHTML= r;
            document.getElementById('chainInfo').innerHTML= `Length: ${Object.keys(blocks).length}`;
        }catch(e){console.trace(e);alert(`Could not reach chain`)}
    },
    queryChain: function(){
        var d=hydra.get(hux.get()+document.getElementById('get').value);
        document.getElementById('opInfo').innerHTML= d;
    },
    invoke: function(a){
        if(a){
            for(i=0;i<a;i++){
                console.log("invoking");
                hux.invoke();
            }
        }else{
            var u =hux.post()+document.getElementById('invoke').value;
            var d=document.getElementById('iData').value;
            hydra.post(u, d);
        }
    },
    postResponse:(r)=>{
        document.getElementById("opInfo").innerHTML=r;
    },
    copyKey:()=>{
        var copyText = document.getElementById("account_address");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert("Copied the text: " + copyText.value);
    }, 
    blockStyle:()=>{
        document.styleSheets[1].disabled = !document.styleSheets[1].disabled;
    }
}