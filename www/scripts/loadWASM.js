let squarer;

function loadWasm(fileName) {
  return fetch(fileName)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => {return new WebAssembly.Instance(module) });
};
  
loadWasm('wasm/squarer.wasm').then(instance => {
    squarer = instance.exports._Z7squareri;
    console.log('Finished compiling! Ready when you are...');
}); 
squarer(2).then(function(r){
    networkConsole.log(r);
});