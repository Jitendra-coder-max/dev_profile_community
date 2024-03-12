import React, {useState, useEffect} from 'react';


const Mycom = ()=> {

    const [count,setCount] = useState(0)
   
     useEffect(()=>{
    console.log(count)
    return () => {
        console.log('Cleanup function ran');
        // Perform cleanup actions here, such as unsubscribing from subscriptions or removing event listeners
    };
    },[count]);

    return (
        <div>
        <h1>Hii </h1>
        <button onClick={()=>   setCount(count+1)}> Click</button>
        </div>



    );


};

export default Mycom;