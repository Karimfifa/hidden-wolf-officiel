'use client'
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {  useEffect,useState } from "react";
import { createClient } from "@/lib/supabase/config";

export default function Waiting() {

  const [room, setRoom] = useState([]);
  const [players,setPlayers] = useState([]);

  const {user, isLoaded} = useUser();
  const currentUser = user?.fullName;
  const avatar = user?.imageUrl;
  const playerId = user?.id;

  const router = useRouter()

  const querys = useSearchParams();
  const uid = querys.get('uid');
  
  const supabase = createClient();


  useEffect(()=>{
    if (isLoaded) {
      fetchRoomInfo();
      countPlayers();
      playerJoined();
    }
    listenToPlayers();
  },[isLoaded])



  //Functions
  async function playerJoined(){

    const {data,error} = await supabase
    .from('players')
    .insert({'playerId':playerId,'playerName':currentUser,'roomId':uid,'status':'ready',avatar:avatar})
    data ? console.log('player joinde suuces')  : console.log(error);
  }
  //Room info 
  async function fetchRoomInfo() {
    const {data,error} = await supabase
    .from('rooms')
    .select()
    .eq('roomUid',uid)
    .single();
    data ? setRoom(data) : console.log(error);
    
  }
  //Count players for thi room
  async function countPlayers(){
    const {data,error} = await supabase
    .from('players')
    .select()
    .match({'roomId':uid})
    .order('id',{ascending:false})
    data ? setPlayers(data) : console.log(error);
  }

  async function quitRoom(){
    const {data,error} = await supabase
    .from('players')
    .delete()
    .eq('roomId',uid)
    .eq('playerName',currentUser);
    router.push('/game')
  }
  async function closeRoom(){
    if (window.confirm("Are you sure !")){
      const {data,error} = await supabase
      .from('rooms')
      .delete()
      .eq('roomId',uid)
      .eq('playerName',currentUser);
      router.push('/game')
    }
  }

  async function listenToPlayers(){ 
  await  supabase
  .channel('listenToPlayers')
  .on('postgres_changes',
    {event:'*',schema:'public',table:'players'},
    (payload)=>{
      console.log('user change');
      countPlayers();
    }
    )
    .subscribe();
  }
  return (
    <div className="flex min-h-screen  w-full flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-950 px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-lg bg-gray-900 p-6 shadow-lg">
        <div className="flex flex-col  items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Waiting for players for <span className="text-gray-400 ">{room.roomName}</span></h1>
            <p className="text-gray-400">Join the room and wait for the game to start.</p>
          </div>
          <div className="flex w-full flex-col items-start rounded-md bg-gray-800 px-4 py-3">
            <div className="mb-2 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">{players.length} / {room.rounds} players in the room</span>
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              {
                room.roomCreator == currentUser ? (
                  <Button onClick={closeRoom} className="rounded-md px-4 py-2 text-sm font-medium bg-red-500 " variant="primary">
                    Close Game
                  </Button>
                ) : (
                  <Button onClick={quitRoom} className="rounded-md px-4 py-2 text-sm font-medium bg-red-500 " variant="primary">
                    Quit Game
                  </Button>
                )
              }
                
            </div>
            <div className="grid grid-cols-2 w-full items-center bg-slate-700 p-4 rounded-md gap-4">
              {
                players.map((player)=>(
                  <>
                    <div className="w-full flex flex-col bg-gray-600 rounded-md p-2  ">
                        <Avatar>
                        <AvatarImage alt="Player 1" src={player.avatar} />
                        <AvatarFallback>P{player.id}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-white">{player.playerName}</h3>
                        <p className="text-gray-400">{player.status}</p>
                      </div>
                    </div>
                  </>
                    
                ))
              }
            </div>
          </div>
          {
            room.roomCreator == currentUser?(
              <Link className="w-full" href={`room?uid=${uid}`}>
                <Button className="w-full rounded-md px-4 py-2 text-sm font-medium" variant="outline">
                  Start Game
                </Button>
              </Link>
            ):(
              <span>Waiting...</span>
            )
          }
          
          
        </div>
      </div>
    </div>
  )
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
