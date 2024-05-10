'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/config";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Create() {
  const [rName, setRname] = useState('');
  const [chat, setChat] = useState(3);
  const [rounds, setRounds] = useState(3);
  const [players, setPlayers] = useState(3);
  const { user } = useUser();
  const supabase = createClient();

  async function create(e) {
    e.preventDefault();
    try {
      const currentUser= user?.fullName || ''; // Get the current user's name
      alert(currentUser);

      const request = await fetch('http://localhost:3000/api/createroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          name: rName,
          chat: chat,
          rounds: rounds,
          players: players,
          creator: currentUser,
        },
      });
      const res = await request.json();
      // Handle response...
    } catch (error) {
      alert(error);
    }
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <form onSubmit={create} className="w-full max-w-md">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Game Waiting Room</h1>
            <p className="text-gray-400">Set your preferences and start the game</p>
          </div>
          <div className="space-y-4">
            <input onChange={(e)=>setRname(e.target.value)} required type="text" placeholder="Room Name" className="w-full rounded-lg p-2 outline-none text-black" />

            <div className="flex items-center justify-between">
              <span className="font-medium">Players</span>
              <select className="text-black" onChange={(e) => setPlayers(e.target.value)}>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Chat Time</span>
              <select className="text-black" onChange={(e ) => setChat(e.target.value)}>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Round</span>
              <select className="text-black" onChange={(e) => setRounds(e.target.value)}>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full hover:bg-slate-700"><Link href={`/room?uid=876523`}>Create</Link></Button>
        </div>
      </form>
    </div>
  );
}
