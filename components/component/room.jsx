'use client'
import { Button } from "@/components/ui/button"
import { IoChatbubblesOutline } from "react-icons/io5";
import { DrawerTrigger, DrawerTitle, DrawerDescription, DrawerHeader, DrawerFooter, DrawerContent, Drawer } from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/nextjs"
import { LuVote } from "react-icons/lu";
import { IoExitOutline } from "react-icons/io5";
import { GiTargetShot } from "react-icons/gi";

import { IoCloseCircleOutline } from "react-icons/io5";
import Image from "next/image"
import Link from "next/link";
import { createClient } from "@/lib/supabase/config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePreventBackWithoutConfirmation from '@/components/hooks/preventBack'


export default function Room() {

  const [room,setRoom] = useState([]);
  const [players,setPlayers] = useState([]);
  const [info,setInfo] = useState(false);

  const {user,isLoaded} = useUser();
  const currentUser = user?.fullName;
  const avatar = user?.imageUrl;

  const supabase = createClient();
  const querys = useSearchParams();

  const uid = querys.get('uid');

  const router = useRouter();

  const path = window.location.pathname;
  useEffect(() => {
    countPlayers();
  }, [isLoaded]);
  useEffect(()=>{
    if(info){
      fetchRoomInfo();
    }
  },[info])


  async function fetchRoomInfo() {
    const req = await fetch('http://localhost:3000/api/fetchRoomInfo',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        uid:uid,
      },
      cache:'no-store'
    })
    const res = await req.json();
      // alert(res.dl)
      
    if(!res.dl == 0){
      setRoom(res.data)
      if(!res.data.roomstatus == 'play'){
        alert('Room is closed');
        window.location.href = '/closed';
      }
    }else{
      window.location.href = '/closed'
    }
  }

  //Count players for thi room
  async function countPlayers(){
    const {data,error} = await supabase
    .from('players')
    .select()
    .match({'roomId':uid})
    .order('id',{ascending:false})
    data ? setPlayers(data) : console.log(error);
    if(data){
      setInfo(true);
    }
  }

  async function closeRoom(){
    if (window.confirm("Are you sure !")){
      const {data,error} = await supabase
      .from('rooms')
      .delete()
      .eq('roomUid',uid)
      .eq('roomCreator',currentUser);
      if(data){
        quitRoom();

      }
    }
  }
  //Quit room   
  async function quitRoom(){
    const {data,error} = await supabase
    .from('players')
    .delete()
    .eq('roomId',uid)
    .eq('playerName',currentUser);
    router.push('/game')
  }

  async function roomChanges(){
    const {data,error} = await supabase
    .channel('roomChanges')
    .on('postgres_changes',{event:'DELETE',schema:'public',table:'rooms'},
    (payload) =>{
      fetchRoomInfo();
      console.log('room changed');
    }
    )
    .subscribe();
  }
  roomChanges();
  async function playersChange(){
    const {data,error} = await supabase
    .channel('playerchange')
    .on('postgres_changes',{event:'*',schema:'public',table:'players'},
    (payload) =>{
      fetchRoomInfo();
      countPlayers();
      console.log('room changed');
    }
    )
    .subscribe();
  }

  playersChange();
  usePreventBackWithoutConfirmation(quitRoom);
  return (
    <main className="flex flex-col h-screen">
      <section className="flex-1 bg-gradient-to-br from-gray-900 to-gray-950 text-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
            <Image width={30} height={30} src={avatar} className="w-8 h-8 bg-[#ccc] rounded-full" />
            <span className="text-sm font-medium">{room.roomName}</span>
          </div>
        </div>
        {/* <div className="bg-gray-700 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">Room Rules</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>No cheating</li>
            <li>Be respectful to other players</li>
            <li>Vote for the player you think is the wolf</li>
          </ul>
        </div> */}
        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">Online Players {players.length}/{room.players}  </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
              players.map((player)=>(
                
                <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
                  <Image width={40} height={40} src={player.avatar}  className="w-8 h-8 bg-[#ccc] rounded-full"  />
                  <span className="text-sm font-medium">{player.playerName}</span>
                  {
                    // room.roomCreator == player.playerName ? (<GiTargetShot />) : ''
                  }
                </div>
              ))
            }
          </div>
        </div>
        <div className="relative h-[400px] w-full rounded-lg mb-56  overflow-hidden">
          <Image width={100} height={100} src={'https://img.freepik.com/free-photo/close-up-image-fresh-spring-green-grass_1232-2759.jpg?t=st=1715378481~exp=1715382081~hmac=a67669d52958d2aecef229a530ed4b851ac3a13b4e847d066404d687b319e372&w=826'} className="absolute top-0 left-0 h-full w-full rounded-md bg-gray-100 dark:bg-gray-800">
            
          </Image>
        </div>
      </section>
      <div className="bg-gray-700 p-4 flex justify-between space-x-4 fixed bottom-0 w-full">
        {
          room.roomCreator == currentUser ? (
            <Button onClick={closeRoom} className="bg-[#333] hover:bg-[#333]/90 p-2 focus:ring-[#333]" variant="secondary">
              Close room
            <IoCloseCircleOutline />
          </Button>
          ):(
            <Button onClick={quitRoom} className="bg-[#333] hover:bg-[#333]/90 p-2 focus:ring-[#333]" variant="secondary">
              Quit room
            <IoExitOutline />
          </Button>
          )
        }
          
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="bg-[#333] hover:bg-[#333]/90 focus:ring-[#333]" variant="secondary">
              Chat
              <IoChatbubblesOutline />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-[#0a2a4d] text-white p-6 w-full max-w-md" side="left">
            <DrawerHeader>
              <DrawerTitle>Chat</DrawerTitle>
              <DrawerDescription>Chat with other players in the game.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#ccc] rounded-full" />
                  <div>
                    <p className="font-medium">Player 1</p>
                    <p className="text-sm text-[#ccc]">Hey, let's work together!</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#ccc] rounded-full" />
                  <div>
                    <p className="font-medium">Player 2</p>
                    <p className="text-sm text-[#ccc]">I'm the wolf, watch out!</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#ccc] rounded-full" />
                  <div>
                    <p className="font-medium">Player 3</p>
                    <p className="text-sm text-[#ccc]">I think Player 2 is lying.</p>
                  </div>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <div className="flex items-center space-x-2">
                <Textarea className="flex-1" placeholder="Type your message..." />
                <Button className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]" variant="primary">
                  Send
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]" variant="primary">
              Vote
              <LuVote />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-[#0a2a4d] text-white p-6 w-full max-w-md" side="right">
            <DrawerHeader>
              <DrawerTitle>Vote</DrawerTitle>
              <DrawerDescription>Vote for the player you think is the wolf.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                {
                  players.map((player) => (
                    <div className="flex items-center justify-between bg-[#333] rounded-md p-3">
                      <div className="flex items-center space-x-3">
                        <Image src={player.avatar} width={30} height={30} className="w-8 h-8 bg-[#ccc] rounded-full" />
                        <span className="text-sm font-medium">{player.playerName}</span>
                      </div>
                      <Button className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]" variant="primary">
                        Vote
                      </Button>
                    </div>
                  ))
                }
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  )
}
