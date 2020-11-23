var hux={
    cid:0,
    chainData: function(){
        return hydra.chains[this.cid]
    },
    get: function(){
        return hux.chainData().ip+"/query/"
    },
    post: function(){
        return hux.chainData().ip+"/invoke/"
    },
    query: function(){
        try{
            let r="";
            let blockObj=hydra.get(hux.chainData().ip);
            console.log(blockObj);
            let blocks=JSON.parse(blockObj);
            for(block in blocks){
                var b = blocks[block];
                if(block!=0){
                    console.log(b);
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
                }
                else{
                    r+=`
                        <div class='block box'>`
                        for(d in b){
                            r+=`${d}: <br>${b[d]}<br><br>`;
                        }
                    r+=`</div>
                    `
                }
            }
            document.getElementById('chainData').innerHTML= r;
            document.getElementById('chainInfo').innerHTML= `Length: ${Object.keys(blocks).length}`;
        }catch(e){console.log(e);alert(`Could not reach chain`)}
    },
    queryChain: function(){
        var d=hydra.get(hux.get()+document.getElementById('get').value);
        document.getElementById('opInfo').innerHTML= d;
    },
    invoke: function(){
        var u =hux.post()+document.getElementById('invoke').value;
        var d=document.getElementById('iData').value;
        hydra.post(u, d);
    },
    postResponse:(r)=>{
        document.getElementById("opInfo").innerHTML=r;
    },
    copyKey:()=>{
        var copyText = document.getElementById("address").value;
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert("Copied the text: " + copyText.value);
    }, 
    blockStyle:()=>{
        document.styleSheets[1].disabled = !document.styleSheets[1].disabled;
    }
}