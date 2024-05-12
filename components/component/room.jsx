'use client'
import { Button } from "@/components/ui/button"
import { IoChatbubblesOutline } from "react-icons/io5";
import { DrawerTrigger, DrawerTitle, DrawerDescription, DrawerHeader, DrawerFooter, DrawerContent, Drawer } from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/nextjs"
import { LuVote } from "react-icons/lu";
import { IoExitOutline } from "react-icons/io5";
import Image from "next/image"
import Link from "next/link";
import { createClient } from "@/lib/supabase/config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Room() {

  const [room,setRoom] = useState([])

  const {user,isLoaded} = useUser();
  const currentUser = user?.fullName;
  const avatar = user?.imageUrl;

  const supabase = createClient();
  const querys = useSearchParams();

  const roomuid = querys.get('uid');


  useEffect(()=>{
    fetchRoomInfo();
  },[])


  async function fetchRoomInfo() {
    const {data,error} = await supabase
    .from('rooms')
    .select()
    .match({'roomUid':roomuid})
    .single();
    data ? setRoom(data) : console.log(error);
  }

  return (
    <main className="flex flex-col h-screen">
      <section className="flex-1 bg-gradient-to-br from-gray-900 to-gray-950 text-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
            <Image width={30} height={30} src={avatar} className="w-8 h-8 bg-[#ccc] rounded-full" />
            <span className="text-sm font-medium">{room.roomName}</span>
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">Room Rules</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>No cheating</li>
            <li>Be respectful to other players</li>
            <li>Vote for the player you think is the wolf</li>
          </ul>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">Online Players</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
              <Image width={40} height={40} src={avatar}  className="w-8 h-8 bg-[#ccc] rounded-full"  />
              <span className="text-sm font-medium">{currentUser}</span>
            </div>
            <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#ccc] rounded-full" />
              <span className="text-sm font-medium">Player 2</span>
            </div>
            <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#ccc] rounded-full" />
              <span className="text-sm font-medium">Player 3</span>
            </div>
            <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#ccc] rounded-full" />
              <span className="text-sm font-medium">Player 4</span>
            </div>
            <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#ccc] rounded-full" />
              <span className="text-sm font-medium">Player 5</span>
            </div>
            <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#ccc] rounded-full" />
              <span className="text-sm font-medium">Player 6h</span>
            </div>
          </div>
        </div>
        <div className="relative h-[400px] w-full rounded-lg mb-56  overflow-hidden">
          <Image width={100} height={100} src={'https://img.freepik.com/free-photo/close-up-image-fresh-spring-green-grass_1232-2759.jpg?t=st=1715378481~exp=1715382081~hmac=a67669d52958d2aecef229a530ed4b851ac3a13b4e847d066404d687b319e372&w=826'} className="absolute top-0 left-0 h-full w-full rounded-md bg-gray-100 dark:bg-gray-800">
            
          </Image>
        </div>
      </section>
      <div className="bg-gray-700 p-4 flex justify-between space-x-4 fixed bottom-0 w-full">
        <Link href="/">
          <Button className="bg-[#333] hover:bg-[#333]/90 focus:ring-[#333]" variant="secondary">
            Quit
            <IoExitOutline />
          </Button>
        </Link>
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
                <div className="flex items-center justify-between bg-[#333] rounded-md p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#ccc] rounded-full" />
                    <span className="text-sm font-medium">Player 1</span>
                  </div>
                  <Button className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]" variant="primary">
                    Vote
                  </Button>
                </div>
                <div className="flex items-center justify-between bg-[#333] rounded-md p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#ccc] rounded-full" />
                    <span className="text-sm font-medium">Player 2</span>
                  </div>
                  <Button className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]" variant="primary">
                    Vote
                  </Button>
                </div>
                <div className="flex items-center justify-between bg-[#333] rounded-md p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#ccc] rounded-full" />
                    <span className="text-sm font-medium">Player 3</span>
                  </div>
                  <Button className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]" variant="primary">
                    Vote
                  </Button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  )
}
