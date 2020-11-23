var elements={
    pages:{
        ur:()=>{
            var r;
            try{
                if(hydra.account.type=="web3"){
                    ethereum.enable()
                }
                r=`
                <div>
                    <h1>Welcome back, `+(hydra.account.name||hydra.account.type+" user"||"user")+`</h1>
                    <div class="w50 button" onclick="location.hash='chains';">Chains</div>
                    <div class="w50 button" onclick="location.hash='playground';">Playground</div>
                    <div class="w50 button" onclick="location.hash='account';">Account</div>
                </div>
                `;
            }
            catch(e){
                r=`
                <div>
                    <h1>UR</h1>
                    <h2>The world's fastest CryptoCurrency</h2>
                    <div class="w50 button" onclick="location.hash='connect'">Connect</div>
                </div>
                `;
            }
            return r

        },
        splash: function(){
            var r;
            try{
                if(hydra.account.type=="web3"){
                    ethereum.enable()
                }
                r=`
                <div class="flex">
                    <div>
                        <div class="pointer" onclick="location.hash='chains';">
                            <img class="w50" src="assets/icons/chain.svg" />
                            <h2>Chains</h2>
                        </div>
                    
                    </div>
                    <div>
                        <div class="w50 button" onclick="location.hash='chains';">Chains</div>
                        <div class="w50 button" onclick="location.hash='playground';">Playground</div>
                        <div class="w50 button" onclick="location.hash='account';">Account</div>
                    </div>
                </div>
                `;
            }
            catch(e){
                r=`
                <div>
                    <h1>Welcome to the very first browser-based distributed blockchain network</h1>
                    <div class="w50 button" onclick="location.hash='connect'">Connect</div>
                </div>
                `;
            }
            return r
        },
        'account': async()=>{
            try{
                if(hydra.account.type=="web3"){
                    try{
                        
                        if(!hydra.balance){
                            await hydra.getBalance();
                        }
                        if(!hydra.provider){
                            await hydra.load();
                        }
                    
                        var p =await hydra.provider;
                        let n =await hydra.provider.network;
                        console.log(p, n, hydra.balance);
                        wb=`
                        Provider:<br>${hydra.account.type||"none"}<br><br>
                        Selected Address:<br>${hydra.provider.provider.selectedAddress||"None: Please login to provider"}<br><br>
                        Network:<br>${n.name||"none"}<br><br>
                        Bal: ${hydra.account.balance}<br>`/*
                        Provider Network: ${nn||"none"}<br>
                        
                        Network ENS: ${(p.tetwork.ensAddress)||"none"}<br>
                        Selected Address: ${(p.getBalance(p.provider.selectedAddress))||"none"}<br>`
                        */
                    }catch(e){
                        
                        await ethereum.enable();
                        hydra.load();
                        lux.changePage();
                    }
                }
                else if(hydra.account.type=="key"){
                    wb=`
                    Address: <div id="address" value='${hydra.account.wallets[0].signingKey.address}'>${hydra.account.wallets[0].signingKey.address}</div><div class="button" onclick="hux.copyKey()">Copy</div><br><br>`
                    //todo for loop wallets
                }
                return`
                    <h1>Account Info:</h1>
                    <br><br>
                    `+wb+
                    `<div class="button" onclick="location.hash='chains'">Chains</div>`+
                    `<div class="button" onclick="hydra.clear();">Scrub</div>`;

            }catch(e){
                console.log(e);
                return `
                    No Account Found, please connect
                    <div class="w50 button" onclick="location.hash='connect';">Connect</div>`
            }
        },
        "connect":()=>{
            try{
                return `<div>
                    <h1>Welcome back, `+JSON.parse(localStorage.user).name+`</h1>
                    <div class="w50 button" onclick="location.hash='chains';">Chains</div>
                    <div class="w50 button" onclick="location.hash='account';">Account</div>
                </div>`
            }catch(e){
                return `
                    No account could be found on this device, would you like to import or create a new one?
                    <div class="w50 button" onclick="hydra.connect('web3');">Import From Provider (coinbase/metamask/web3)</div>
                    <div class="w50 button" onclick="hydra.connect('create');">Create New</div>
                `;
            }
        },
        "chains": function(){
            if(hydra.account){
                var cb="";
                if(hydra.chains){
                    for(c in hydra.chains){
                        cb+=`<div class='chain button' onclick="location.hash='chain?${c}'">CHAIN<br>IP:`+hydra.chains[c].ip+"</div>"
                    }
                }
                return `
                    chains:<br><br>
                    <div id="chainBox" class="w1 flex">
                        ${cb}
                    </div>
                    <div class="w1 flex box">
                        <div class="chain button" onclick="location.hash='addChain'">
                            +<br><br>Add chain
                        </div>
                        <div class="chain button" onclick="location.hash='createChain'">
                            +<br><br>Create chain
                        </div>
                    </div>
                `
            }else{
                return `
                    chains:<br><br>
                    <div class="w1 flex">
                        No account found, please connect
                    </div>
                    <div class="w1 flex box">
                        <div class="chain button" onclick="location.hash='connect'">
                            Connect
                        </div>
                    </div>
                `

            }
        },
        "chain": function(c){
            console.log(c);
            hux.cid =c[1];
            setTimeout(hux.query, 1)
            return `
                chain ip: ${hux.chainData().ip}<br><br>

                <div class="flex wrap">
                    <div>
                        <div>
                            <div onclick="hux.blockStyle('b')">Blocks</div>
                            <div onclick="hux.blockStyle('d')">Details</div>
                        </div>
                        <div id="chainData">
                        </div>
                    </div>
                    <div>
                    
                        <h1>Chain Info</h1>
                        <div class="w1 box">
                            <div id="chainInfo">
                            </div>
                            <div class="br"></div>
                            <h2>Operation Info</h2>
                            <div id="opInfo">
                            </div>
                        </div>
                        <h1>Node Interaction</h1>
                        <div class="w1 box">
                            <div class="chain button" onmouseup="hux.query()">
                                QueryChain
                            </div>
                            <div class="flex">
                                <div>
                                    Query Endpoint<br>
                                    <input id="get" value="init"></input>

                                    <div class="chain button" onmouseup="hux.queryChain()">
                                        Query<br>(get)
                                    </div>
                                </div>
                                <div>
                                    Function to invoke<br>
                                    <input id="invoke" value="init"></input><br>
                                    Data to pass function<br>
                                    <input id="iData" value="testData"></input>
                                    <div class="chain button" onclick="hux.invoke()">
                                        ChainCode Invoke<br>(post)
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="chain button" onmouseup="location.hash='chains'">
                            Back to chains
                        </div>
                    </div>
                </div>
            `
        },
        "addChain": function(){
            return `
                <div>
                    Node IP:<br><input id="nodeIP"></input>
                    <div class="chain button" onclick="hydra.addChain()">
                        Add chain
                    </div>
                </div>
            `
        },
        "createChain": function(){
            return `
                <div>
                    Node IP:<br><input></input>
                    <div class="chain button" onclick="hydra.createChain()">
                        Create
                    </div>
                </div>
            `
        },
        "playground":async()=>{

            if(hydra.account){
                try{
                    if(!hydra.balance){
                        await hydra.getBalance();
                    }
                    let trasaction = {
                        from: web3.currentProvider.selectedAddress,
                        to: "0x0B749995DCC89674Eb04846e5063857062576386",
                        value: web3.toWei(0.0777, "ether")
                    }
                    let tx=JSON.stringify(trasaction);
                    console.log(tx);
                    return `
                            <h1>Welcome Home</h1>
                            <div>
                                Add: ${hydra.provider.provider.selectedAddress}<br>
                                Bal: ${hydra.account.balance}<br>
                            </div>
                            <div>
                                <textarea id="tx">${tx}</textarea>
                                
                                <div class="button" onclick="hydra.sendTransaction()">Send Transaction</div>
                            </div>
                    `
                }
                catch{
                    return "please log in to web3 Provider"
                }
            }
            else{
                return "please log in"
            }
        },
        404: function(){
            return `Could not find url hash endpoint`;
        }
    },
    "header": `
        <div id="hb" onclick="lux.sidebar()">
            <img src="assets/icons/menu.png"/>
        </div>
        <div id="hd" onclick="location.hash=''">HYDRA</div>
        <div id="ac" onclick="location.hash='account'">
            <img src="assets/icons/account.png"/>
        </div>
        <div class="br"></div>
    `,
    sidebar:`
        <div onclick="location.hash='splash';"><div>Home</div></div>
        <div onclick="location.hash='chains';"><div>Chains</div></div>
        <div onclick="location.hash='playground';"><div>Playground</div></div>
        <div class="br"></div>
        <div onclick="location.hash='account';"><div>Account</div></div>
    `,
    "urHeader":`
        <div id="hb" onclick="lux.sidebar()">
            <div></div>
            <div></div>
            <div></div>
        </div>
        Ur Explorer
        <div id="account">Acc</div>
    `,
    "loading":`Loading...`
}