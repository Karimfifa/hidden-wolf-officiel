import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/config';

const SheepComponent = ({ roomId }) => {
  const supabase = createClient();
  const [sheeps, setSheeps] = useState([]);

  // Function to get sheep data from Supabase
  async function getSheeps() {
    const { data, error } = await supabase
      .from('players')
      .select()
      .eq('roomId', roomId);
    if (data) {
      setSheeps(data);
    } else {
      alert(error);
    }
  }

  // Function to randomly change sheep positions
  function moveSheepsRandomly() {
    setSheeps(prevSheeps => {
      return prevSheeps.map(sheep => ({
        ...sheep,
        positionX: Math.random() * 100, // Change to your desired range
        positionY: Math.random() * 100, // Change to your desired range
      }));
    });
  }


  async function playersChange(){
    const {data,error} = await supabase
    .channel('playerchange')
    .on('postgres_changes',{event:'*',schema:'public',table:'players'},
    (payload) =>{
      getSheeps();
      console.log('room changed');
    }
    )
    .subscribe();
  }

  playersChange();
  useEffect(() => {
    // Get sheep data initially
    getSheeps();

    // Update sheep positions every 1 second
    const intervalId = setInterval(moveSheepsRandomly, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run effect only once

  return (
    <div className={`relative h-full w-full rounded-lg mb-56 overflow-hidden sheep-container`}>
      <div
        className="absolute top-0 left-0 h-full w-full rounded-md bg-gray-100 dark:bg-gray-800"
        style={{ backgroundImage: `url('https://img.freepik.com/premium-vector/mountain-game-background_22191-30.jpg?w=900')`, backgroundSize: 'cover' }}
      />
      {sheeps.map((sheep) => (
        <div
          key={sheep.id}
          className="sheep bg-transparent relative z-1 w-20"
          style={{ top: `${sheep.positionY}%`, left: `${sheep.positionX}%` }}
        >
          <Image src={'https://img.freepik.com/free-vector/cute-sheep-flat-cartoon-style_1308-112075.jpg?w=740&t=st=1715876293~exp=1715876893~hmac=d71c01a263dc2788430da2a9747a2282b24174201951fff9308a7d003daf8df0'} className='rounded-full' width={100} height={100}  />
          <i><h1 className='text-gray-800' >{sheep.playerName}</h1></i>
        </div>
      ))}
    </div>
  );
};

export default SheepComponent;
