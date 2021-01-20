var elements={
    pages:{
        "splash":()=>{
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
                    <h1 id="intro">Introducing Hydra</h1>
                    <p id="tagline">The world's fastest, most lightweight, scalable, and versitile blockchain</p>
                    <div id="hydraInfo">
                        <section>
                            <h2>Fast</h2>
                            <h3>
                                Average Hydra block time is around 0.01 seconds, and will never slow down when chain size increases<br>
                                Faster than any blockchain on the market.
                            </h3>
                        </section>
                        <section>
                            <h2>Modular</h2>
                            <h3>
                                Hydra is ready out of the box for a veriety of business and industry use-cases.<br>

                            
                        </section>
                        <section>
                            <h2>Lightweight</h2>
                            <h3>Code to run a barebones hydra node is 2.16kb</h3>
                        </section>
                        <section>
                            <h2>Scalable</h2>
                            <h3>
                                Bitcoin chain size per 1,000,000 txs: 857 gigabytes<br>
                                Hydra chain size per 1,000,000 txs: 3.9 gigabytes

                            </h3>
                        </section>
                        <section>
                            <h2>Modular</h2>
                            <h3>
                                With hydra you have full control over functionality without having to worry about impacting security.<br>
                                Hydra is preconfigured for a veriety of different consensus protocols, including but not limited to: PoS, PoW, PoeT, Proof of Storage, among many others.<br>
                            </h3>
                        </section>
                        <section>
                            <h2>Secure</h2>
                            <h3>
                                Bitcoin chain size per 1,000,000 transactions: 857 gigabytes
                                Hydra chain size per 1,000,000 transactions: 3.9 gigabytes

                            </h3>
                        </section>
                        <section>
                            <h2>The future of blockchain is mobile</h2>
                            <h3>
                                Hydra is the world's first blockchain that can run an entire node in the browser, a feat that was not even possible until very recently.<br>
                                This means that you can distribute your code to your clients, and have them uphold your network without ever having to download anything.<br>
                                Because of this, Hydra is perfect for deploying blockchain-based mesh networks, and browser applications.
                            </h3>
                        </section>
                        <section>
                            <h2>Hydra is better</h2>
                            <h3>
                                Hydra is built with large scale enterprise in mind. <br><br>
                                Not only is the space and time complexity of Hydra far superior to anything availible, but because chaincode is all in webAssembely, this allows developers to develop systems in their favorite language.
                            </h3>
                        </section>
                    </div>
                    <div class="w50 button" onclick="location.hash='connect'">Connect</div>
                </div>
                `;
            }
            return r
        },
        'account': async()=>{
            try{
                let wb;
                if(!hydra.account){
                    location.hash="connect"
                    return false
                }
                else if(hydra.account.type=="web3"||hydra.account.type=="torus"){
                    try{
                        var p, n;

                        if(!hydra.balance){
                            await hydra.getBalance();
                        }
                        if(hydra.provider){
                            p=await hydra.provider;
                            n=await hydra.provider.network;
                            
                            wb=`
                            Provider:<br>${hydra.account.type||"none"}<br><br>
                            Selected Address:<br>${hydra.provider.provider.selectedAddress||"None: Please login to provider"}<br><br>
                            Network:<br>${n.name||"none"}<br><br>
                            Bal: ${hydra.account.balance}<br>`
                            /*
                            Provider Network: ${nn||"none"}<br>

                            Network ENS: ${(p.tetwork.ensAddress)||"none"}<br>

                            Selected Address: ${(p.getBalance(p.provider.selectedAddress))||"none"}<br>`
                            */
                        }else{
                            //await hydra.load();
                            wb=""
                            hux.load()
                            console.log(p, n, hydra.balance);
                        }
                        if(hydra.account.type=="web3"){
                            try{
                                await ethereum.send('eth_requestAccounts');
                            }catch(e){
                                console.log(e);
                            }
                        }

                    }catch(e){
                        console.log(e);
                        return elements.loading;
                    }
                }
                else if(hydra.account.type=="key"){
                    wb=`
                    Address: <input id="account_address" value='${hydra.wallet.address}'></input><div class="button" onclick="hux.copyKey()">Copy</div><br><br>`
                    
                }
                return`
                    <h1>Account Info:</h1>
                    <br><br>
                    `+wb+
                    `<div class="button" onclick="location.hash='chains'">Chains</div>`+
                    `<div class="button" onclick="hydra.clear();">Scrub</div>`;

            }catch(e){
                console.log(e);
                return elements.pages.connect();
            }
        },
        "connect":()=>{
            if(hydra.account){
                location.hash="account"
            }else{
                return `
                    No account could be found on this device, would you like to import or create a new one?
                    <input id="email" placeholder="e-mail"></input>
                    <div class="w50 button" onclick="hydra.connect('email');">Connect with Email</div>
                    <div class="w50 button" onclick="hydra.connect('web3');">Import From Provider (coinbase/metamask/web3)</div>
                    <div class="w50 button" onclick="hydra.connect('torus');">Connect with Torus</div>
                    <div class="w50 button" onclick="location.hash='import'">Import Key</div>
                    <div class="w50 button" onclick="hydra.connect('create');">Create New</div>
                `;
            }
        },
        "import":()=>{
            return `
                <input id="privateKey" placeholder="Private Key"></input>
                <div class="button">Import</div>
            `
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
                        <div class="chain button" onclick="hydra.addChain(1)">
                            +<br><br>Add all chains
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
                chain ip: ${hux.chainData()?hux.chainData().ip:"Chain could not be located"}<br><br>

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
                            <div class="chain button" onmouseup="hux.getChain()">
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
                                    <div class="chain button" onclick="hux.invoke(1000)">
                                        ChainCode Invoke x10000<br>(post)
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
                if(!hydra.balance){
                    await hydra.getBalance();
                }
                let address
                if(hydra.account.type=="key"){
                    address=hydra.wallet.address;
                }else if(hydra.provider){
                    address=hydra.provider.provider.selectedAddress;
                }
                let trasaction = {
                    from: address,
                    to: "0x0B749995DCC89674Eb04846e5063857062576386",
                    value: web3.toWei(0.0777, "ether")
                }
                let tx=JSON.stringify(trasaction);
                console.log(tx);
                return `
                        <h1>Welcome Home</h1>
                        <div>
                            Address: ${address}<br>
                            Balance: ${hydra.account.balance}<br>
                        </div>
                        <div>
                            <textarea id="tx">${tx}</textarea>
                            
                            <div class="button" onclick="hydra.sendTransaction(JSON.parse(document.getElementById('tx').value))">Send Transaction</div>
                        </div>
                `
            }
            else{
                return "please log in"
            }
        },
        404: function(){
            return "Page could not be loaded";
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
    "loading":`Loading...`
}