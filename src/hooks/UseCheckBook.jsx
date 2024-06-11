import React, { useContext,useState,useEffect } from "react";


export default function UseCheckBook() {
    const [state, setState] = useState(() => new Set());    
    const [type_, setType_] = useState([0,0]);     
    const [handle, sethandle] = useState(0);  
    
    useEffect(() => {
        //console.log(state);                
    }, [state])

    useEffect(() => {
        setTimeout(()=>{setState(state)},300 )
        setState(new Set())
    }, [type_])

      const addItem = item => {
        sethandle(item)
        setState(prev => new Set(prev).add(item));
      }
    
      const removeItem = item => {
        setState(prev => {
          const next = new Set(prev);
          next.delete(item);
          return next;
        });
      }
      const resetCheckedBoxHandle=()=>{
        setState(new Set())

      }
    
    
      const checkedBoxHandle = (state_,value_ ,Type_)=>{
        setType_(Type_)
        if(state_)
        addItem(value_)
        else 
        removeItem(value_)
      }

      return[state,checkedBoxHandle,resetCheckedBoxHandle]
}


