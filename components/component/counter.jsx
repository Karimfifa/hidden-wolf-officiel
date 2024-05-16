import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Counter = ({target}) => {
    const [second, setSecond] = useState(0);
    const router = useRouter();
        useEffect(() => {
        const intervalId = setInterval(() => {
            if (second === 5) {
                router.push('/room?uid='+target);
                return ;
            }
            setSecond(prevSecond => prevSecond + 1);
        }, 1000);

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId);
    }, [second]); // Add `second` to dependency array to prevent potential issues

    return (
        <div className='w-full h-full z-30 font-bold flex-col bg-slate-800 text-gray-400 fixed flex justify-center items-center  '>
            <Image src='/assets/wolf.png' height={100} width={100} />
              <i>Ready ? {second}</i>  
            
            </div>
    );
};

export default Counter;
