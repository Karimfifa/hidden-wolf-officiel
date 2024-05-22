import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/config';

const SheepComponent = ({ roomId, userId }) => {
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

  async function playersChange() {
    const {data} = await supabase
      .channel('playerchange')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' },
        (p) => {
          getSheeps(); // Fetch sheep data whenever there's a change in players
          console.log('players changed');
        }
      )
      .subscribe();

    
  }
  useEffect(()=>{
    playersChange();
  },[])
  useEffect(() => {
    // Get sheep data initially
    
    getSheeps();
  }, [roomId]); // Add roomId as a dependency to re-subscribe if it changes

  // Function to handle key press events for moving the user's sheep
  const handleKeyPress = async (event) => {
    if (!sheeps.some(sheep => sheep.playerId === userId)) return; // Ensure the user has a sheep to move

    const updatedSheeps = sheeps.map(sheep => {
      if (sheep.playerId === userId) {
        let newX = sheep.positionX;
        let newY = sheep.positionY;
        switch (event.key) {
          case 'ArrowUp':
            newY = Math.max(0, sheep.positionY - 1);
            break;
          case 'ArrowDown':
            newY = Math.min(100, sheep.positionY + 1);
            break;
          case 'ArrowLeft':
            newX = Math.max(0, sheep.positionX - 1);
            break;
          case 'ArrowRight':
            newX = Math.min(100, sheep.positionX + 1);
            break;
          default:
            break;
        }
        // Update the new position in the database
        supabase
          .from('players')
          .update({ positionX: newX, positionY: newY })
          .eq('playerId', userId)
          .eq('roomId', roomId)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating position:', error);
            }
          });
        return { ...sheep, positionX: newX, positionY: newY };
      }
      return sheep;
    });
    setSheeps(updatedSheeps);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [sheeps, handleKeyPress]);

  return (
    <div className={`relative h-full w-full rounded-lg mb-56 overflow-hidden sheep-container`}>
      <div
        className="absolute top-0 left-0 h-full w-full rounded-md bg-gray-100 dark:bg-gray-800"
        style={{ backgroundImage: `url('https://img.freepik.com/premium-vector/mountain-game-background_22191-30.jpg?w=900')`, backgroundSize: 'cover', opacity: 0.5 }}
      />
      {sheeps.map((sheep) => (
        <div
          key={sheep.playerId}
          className="sheep bg-white relative z-10 w-20"
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
