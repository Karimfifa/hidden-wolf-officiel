'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/config";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Create() {
  const [rName, setRname] = useState('');
  const [chat, setChat] = useState(3);
  const [rounds, setRounds] = useState(3);
  const [players, setPlayers] = useState(3);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  async function create(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const currentUser = user?.fullName || "Anonymous"; // Fallback to Anonymous if no user name
      const response = await fetch('/api/createroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          name: rName,
          chat,
          rounds,
          players,
          creator: currentUser,
        },
      });
      const res = await response.json();
      if (res?.uId) {
        router.push(`/waiting?uid=${res.uId}`);
      } else {
        alert('Error: ' + JSON.stringify(res));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col p-3 items-center justify-center h-screen bg-gradient-to-br from-[#196670] to-[#265766] text-white" style={{backgroundImage: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)'}}>
      <form  style={{border:'1px solid gray'}} onSubmit={create} className="w-full drop-shadow-xl p-5 rounded-md max-w-md">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Game Waiting Room</h1>
            <p className="text-gray-400">Set your preferences and start the game</p>
          </div>
          <div className="space-y-4">
            <input
              onChange={(e) => setRname(e.target.value)}
              required
              type="text"
              placeholder="Room Name"
              className="w-full rounded-lg p-2 outline-none text-black"
            />
            <div className="flex items-center justify-between">
              <span className="font-medium">Players</span>
              <select
                className="text-black rounded-lg p-2"
                value={players}
                onChange={(e) => setPlayers(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Chat Time</span>
              <select
                className="text-black rounded-lg p-2"
                value={chat}
                onChange={(e) => setChat(Number(e.target.value))}
              >
                {[3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Rounds</span>
              <select
                className="text-black rounded-lg p-2"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
              >
                {[3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#196670] hover:bg-[#FFC75F]" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
}
