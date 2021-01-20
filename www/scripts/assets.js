var mure={
    address:"0x61d2510e49c7647fc6ec2a6EAB7C233664103B11",
    abi:[
        {
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "address payable",
                    "name": "recipient",
                    "type": "address"
                }
            ],
            "name": "widthdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "MurePurchaced",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ],
    contract:()=>{
        let address= mure.address;
        console.log(address);
        return new ethers.Contract(mure.address, mure.abi, hydra.signer)
    },
    query:async()=>{
        let contract=mure.contract();
        let res=await contract.MurePurchaced(hydra.provider.provider.selectedAddress);
        let r=ethers.BigNumber.from(res["_hex"]).toString();
        console.log(r);
    },
    deposit:async ()=>{
        
        let contract=mure.contract();
        let res=await contract.deposit({
            gasLimit: 420000,
            value: 1000000000000000
        });
        console.log(res);
    }
}