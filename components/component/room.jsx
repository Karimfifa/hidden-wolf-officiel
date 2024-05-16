'use client'
import { Button } from "@/components/ui/button"
import { IoChatbubblesOutline } from "react-icons/io5";
import { DrawerTrigger, DrawerTitle, DrawerDescription, DrawerHeader, DrawerFooter, DrawerContent, Drawer } from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/nextjs"
import { LuVote } from "react-icons/lu";
import { IoExitOutline } from "react-icons/io5";
import { GiTargetShot } from "react-icons/gi";
import { Toaster, toast } from 'sonner'
import { IoCloseCircleOutline } from "react-icons/io5";
import Image from "next/image"
import Link from "next/link";
import { createClient } from "@/lib/supabase/config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePreventBackWithoutConfirmation from '@/components/hooks/preventBack'
import { IoSendOutline } from "react-icons/io5";
import SheepComponent from './sheeps'

export default function Room() {

  const [room,setRoom] = useState([]);
  const [players,setPlayers] = useState([]);
  const [info,setInfo] = useState(false);

  const [msgs , setMsgs] =  useState([]);
  const [msg , setMsg] =  useState("");

  const {user,isLoaded} = useUser();
  const playerId = user?.id;
  const currentUser = user?.fullName;
  const avatar = user?.imageUrl;

  const supabase = createClient();
  const querys = useSearchParams();

  const uid = querys.get('uid');

  const router = useRouter();

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

  async function getMsgs(){
    const {data,error} = await supabase
    .from('chat')
    .select()
    .eq('roomId',uid)
    .order('id',{ascending:false});
    if(data){
      setMsgs(data)
    }
  }
    // Play the notification sound
    function notification(){
      const audio = new Audio('/assets/chat.mp3');
      audio.play();
    }
  async function sendMsg(e){
    try {
        e.preventDefault();
        if (!supabase) {
            throw new Error('Supabase is not initialized');
        }
        const { data, error } = await supabase
            .from('chat')
            .insert({
                'senderId': playerId,
                'senderName': currentUser,
                'senderAvatar': avatar,
                'roomId': uid,
                'msg': msg
            });
            setMsg('')
        if (error) {
            throw error;
        }
        if (data) {
            setMsg('');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
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

  async function chatChanges(){
    const {data,error} = await supabase
    .channel('chat-changes')
    .on('postgres_changes',{event:'*',schema:'public',table:'chat'},
    (payload) =>{
      fetchRoomInfo();
      countPlayers();
      getMsgs();
      console.log('chat changed');
      if(payload.new.senderId != playerId){
        // alert('new message from  au ser')
        notification();
        toast(<div className="" ><Image className="rounded-full" alt="notiimg" width={30} height={30} src={payload.new.senderAvatar} /><br />
          <span><i className="text-gray-400 text-xl" >{payload.new.senderName}</i></span><br />
          <b><span>{payload.new.msg}</span></b>
        </div>,{closeButton:true,invert:true,duration:3000,action:'good'})
      }
    }
    )
    .subscribe();
  }
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
  useEffect(()=>{
    if(isLoaded){
      chatChanges();
    }
    playersChange();
    roomChanges();
  },[isLoaded,playerId])
  // usePreventBackWithoutConfirmation(quitRoom);
  return (
    <main className="flex flex-col h-screen">
      <section className="flex-1 bg-gradient-to-br from-gray-900 to-gray-950 text-white  p-6 space-y-4">
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
        <div className="relative h-screen w-full overflow-hidden  pb-20 ">
          {/* <Image width={100} height={100} src='/assets/farm.png' className="absolute top-0 left-0 h-full w-full rounded-md bg-gray-100 dark:bg-gray-800" />
          <div className="sheep">sheep 1</div> */}
          <SheepComponent roomId={uid} />
        </div>
      </section>
      <div className="h-screen" ></div>
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
          <Toaster />
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="bg-[#333] hover:bg-[#333]/90 focus:ring-[#333]" variant="secondary">
              Chat
              <IoChatbubblesOutline />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-gray-400 text-white p-6 w-full max-w-md" side="left">
            <DrawerHeader>
              <DrawerTitle>Chat</DrawerTitle>
              <DrawerDescription>Hey, let's work together!</DrawerDescription>
            </DrawerHeader>
            <div className="flex overflow-auto" style={{ maxHeight: "400px" }}> {/* Set a fixed height and enable overflow scrolling */}
              <div className="space-y-4 h-auto overflow-y-auto pr-2" style={{ width: "calc(100% + 16px)" }}> {/* Add padding to compensate for scrollbar */}
                {
                  msgs.map((msg)=>(
                    <div className="flex items-start space-x-3 break-all" key={msg.id}> {/* Enable word break for long messages */}
                      <Image height={30} width={30} src={msg.senderAvatar} className="w-8 h-8 bg-[#ccc] rounded-full" />
                        <div>
                          <p className="font-medium">@{msg.senderName}</p>
                          <p className="text-sm text-[#ccc]">{msg.msg}</p>
                        </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <DrawerFooter>
              <div className="flex items-center space-x-2">
                <form onSubmit={sendMsg} className="flex w-full gap-1" >
                  <input value={msg} onChange={(e)=>{setMsg(e.currentTarget.value);}} className="flex-1 rounded-md bg-gray-500 text-white outline-none p-2" placeholder="Type your message..." />
                  <Button type="submit" className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]" variant="primary">
                    <IoSendOutline />
                  </Button>
                </form>
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
