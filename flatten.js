function flatten(v){
    var r=``;
    if(v===undefined){
    }
    if(v===null){
      r+=`null`
    }
    else if(Array.isArray(v)){
      let i=0;
      for(subV in v){
        i++
      }
  
      r+=`[`
        for(subV in v){
          //console.log(i);
          r+=flatten(v[subV])
          i--;
          if(i>0){
            r+=`,`
          }
        }
      r+=`]`
    }
    else if(typeof v === 'object'){
      let i=0;
      for(subV in v){
        i++
      }
  
      r+=`{`
      for(subV in v){
        //console.log(i);
        r+=`${subV}:${flatten(v[subV])}`
        i--;
        if(i>0){
          r+=`,`
        }
      }
      r+=`}`
      
      if(v.length){
  
      }
    }
    else if(typeof v === 'string' || v instanceof String){
      r+=v;
    }
    else if (v instanceof Function){
      r+=v.toString();
    }
    else{
      r+=JSON.stringify(v);
    }
    //console.log(r);
    return r;
}

module.exports=flatten;