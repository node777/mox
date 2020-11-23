
var networkConsole = {
    pos:0,
    t: document.getElementById("networkConsole"),
    i:function(e){
        console.log("user input: "+e.key);
        switch(e.key){
            case "Backspace": 
                if(networkConsole.t.selectionStart>networkConsole.pos){
                    return true;
                }
                else{
                    return false;
                }
                
            case "Tab":
                networkConsole.t.value+=`\t`;
                return false;
                
            case "Enter":
                let t=networkConsole.t.value.substr(networkConsole.pos, networkConsole.t.value.length);
                this.log();
                if(this.inputCallback){
                    var c = this.inputCallback;
                    this.inputCallback=undefined;
                    c(t);
                }
                else{
                    //if(t!==""){
                        this.execute(t);
                    //}
                }
                return false;
            case "ArrowUp":
                //clear current command
                networkConsole.t.value=networkConsole.t.value.substr(0, networkConsole.pos);
                //write last command
                networkConsole.t.value+=this.lastCommand;
                return false
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
                return true;
            default:
                if(networkConsole.t.selectionStart>networkConsole.pos-1){
                    return true;
                }
                else{
                    return false;
                }

        }
    },
    log: function(m){
        networkConsole.t.value+=`${(m||"")}\n>`;
        this.pos=networkConsole.t.value.length;
        networkConsole.t.scrollTop = networkConsole.t.scrollHeight;
    },
    input: function(m, callback){
        //console.log("input setting up");
        this.inputCallback = callback;
        networkConsole.t.value+=`${m}`;
        this.pos=networkConsole.t.value.length;
        networkConsole.t.scrollTop = networkConsole.t.scrollHeight;
        console.log(this.inputCallback);
    },
    execute: function(c){
        if(c!=""){
            this.lastCommand=c;
            let cl=c.split(" ");
            if(this.commands[cl[0]]){
                this.log(`executing command ${cl[0]}`);
                this.commands[cl[0]](cl||null);
            }
            else{
                this.log(`the command ${c} could not be found`);
            }
        }
    },
    commands: {
        clear: function(){
            networkConsole.t.value="";
            networkConsole.log(`Network Console`);
        },
        feedMe: function(){
            networkConsole.input("feed me text ", function(r){
                networkConsole.log(`you said ${r}`);
            });
        },
        cp: function(p){
            b=p[1].split("?");
            if(elements.pages[b[0]]){
                networkConsole.log(`changing page to ${b[0]}${b[1]?" with parameter "+b[1]:""}`);
                location.hash=p[1];
            }else{
                networkConsole.log(`page ${p[1]} could not be found`);
            }
        }
    }
}
networkConsole.log("Network Console:");