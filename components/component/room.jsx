"use client";
import { Button } from "@/components/ui/button";
import { IoChatbubblesOutline, IoExitOutline, IoCloseCircleOutline, IoSendOutline } from "react-icons/io5";
import {
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
  DrawerFooter,
  DrawerContent,
  Drawer,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { LuVote } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter  } from "next/navigation";
import usePreventBackWithoutConfirmation from "@/components/hooks/preventBack";
import SheepComponent from "./sheeps.jsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert";
import { Toaster, toast } from "sonner";
import {motion} from 'framer-motion';

export default function Room() {
  const [imExist, setImexist] = useState(true);
  const [room, setRoom] = useState([]);
  const [players, setPlayers] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState("");
  const [w, setW] = useState(false); //wolf is run

  const { user, isLoaded } = useUser();
  const playerId = user?.id;
  const currentUser = user?.fullName;
  const avatar = user?.imageUrl;

  const supabase = createClient();
  const querys = useSearchParams();
  const { path } = querys;

  const uid = querys.get("uid");

  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      imPlayerOfThisRoom();
      chatChanges();
      playersChange();
      roomChanges();
      fetchRoomInfo();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (imExist) {
      countPlayers();
    }
  }, [isLoaded, imExist]);

  useEffect(() => {
    if (players.length > 0 && room.roomCreator && !w && room.wolf === 0) {
      setWolf();
      setW(true);
    }
  }, [players, room.roomCreator, room.wolf]);

  useEffect(() => {
      if (room.roomstatus === "closed" || room.roomstatus === "finished" ) {
        router.push("/closed");
    }
  }, [room.roomstatus]);

  async function setWolf() {
    const wolf = Math.floor(Math.random() * players.length);
    if (room.roomCreator === currentUser) {
      const { data, error } = await supabase
        .from("rooms")
        .update({ wolf: players[wolf].playerId })
        .eq("roomUid", uid);
      data ? toast.success('wolf is' + players[wolf]) : toast.error(error);
      if (players[wolf].playerId === playerId) {
        playSosSound();
      }
    }
  }

  async function imPlayerOfThisRoom() {
    const { data, error } = await supabase
      .from("players")
      .select()
      .eq("roomId", uid)
      .eq("playerId", playerId);
    setImexist(data.length > 0);
  }

  async function fetchRoomInfo() {
    const { data, error } = await supabase
      .from("rooms")
      .select()
      .eq("roomUid", uid)
      .single();
    if (data) {
      setRoom(data);
    }
  }

  async function countPlayers() {
    const { data, error } = await supabase
      .from("players")
      .select()
      .match({ roomId: uid })
      .order("id", { ascending: false });
    setPlayers(data || []);
  }

  async function closeRoom() {
    if (window.confirm("Are you sure!")) {
      const { data, error } = await supabase
        .from("rooms")
        .update({'roomstatus':'closed'})
        .eq("roomUid", uid)
        .eq("roomCreator", currentUser);
      if (data) {
        fetchRoomInfo();
        quitRoom();
      }
    }
  }

  async function quitRoom() {
    const { data, error } = await supabase
      .from("players")
      .delete()
      .eq("playerName", currentUser);
    router.push("/game");
  }

  async function getMsgs() {
    const { data, error } = await supabase
      .from("chat")
      .select()
      .eq("roomId", uid)
      .order("id", { ascending: false });
    setMsgs(data || []);
  }

  function notification() {
    const audio = new Audio("/assets/chat.mp3");
    audio.play();
  }

  function playSosSound() {
    const audio = new Audio("/assets/SOS.wav");
    audio.play();
  }

  async function sendMsg(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from("chat").insert({
        senderId: playerId,
        senderName: currentUser,
        senderAvatar: avatar,
        roomId: uid,
        msg: msg,
      });
      setMsg("");
      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async function roomChanges() {
    const { data, error } = await supabase
      .channel("roomChanges")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "rooms" },
        fetchRoomInfo
      )
      .subscribe();
  }

  async function chatChanges() {
    const { data, error } = await supabase
      .channel("chat-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat" },
        (payload) => {
          fetchRoomInfo();
          countPlayers();
          getMsgs();
          if (payload.new.senderId !== playerId) {
            notification();
            toast(
              <div className="">
                <Image
                  className="rounded-full"
                  alt="notiimg"
                  width={30}
                  height={30}
                  src={payload.new.senderAvatar}
                />
                <br />
                <span>
                  <i className="text-gray-400 text-xl">
                    {payload.new.senderName}
                  </i>
                </span>
                <br />
                <b>
                  <span>{payload.new.msg}</span>
                </b>
              </div>,
              {
                closeButton: true,
                invert: true,
                duration: 3000,
                action: "good",
              }
            );
          }
        }
      )
      .subscribe();
  }

  async function playersChange() {
    const { data, error } = await supabase
      .channel("playerchange")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => {
          fetchRoomInfo();
          countPlayers();
        }
      )
      .subscribe();
  }

  return (
    <main className="flex flex-col h-screen" style={{backgroundImage: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)'}}>
      {room.wolf === playerId ? <h1>you are wolf</h1> : null}
      {!imExist ? router.push("/closed") : null}
      <section className="flex-1 bg-gradient-to-br   text-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3">
            <Image
              width={30}
              height={30}
              src={avatar}
              className="w-8 h-8 bg-[#ccc] rounded-full"
            />
            <span className="text-sm font-medium">{room.roomName}</span>
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">
            Online Players {players.length}/{room.players}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {players.map((player) => (
              <div className="bg-[#333] rounded-md p-3 flex items-center space-x-3" key={player.playerId}>
                <Image
                  width={40}
                  height={40}
                  src={player.avatar}
                  className="w-8 h-8 bg-[#ccc] rounded-full"
                  />
                  <span className="text-sm font-medium">{player.playerName}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="relative h-screen w-full overflow-hidden pb-20">
          <SheepComponent roomId={uid} userId={playerId } />
        </div>
      </section>
      <div className="h-screen"></div>
      <motion.div 
        className="relative"
        initial={{opacity:0,}}
        animate={{opacity:1}}
        transition={{duration:0.7}}
      >
      <div className="bg-gray-700 p-4 z-10 flex justify-between space-x-4 fixed bottom-0 w-full">
        {room.roomCreator === currentUser ? (
          <Button
            onClick={closeRoom}
            className="bg-[#333] hover:bg-[#333]/90 p-2 focus:ring-[#333]"
            variant="secondary"
          >
            Close room
            <IoCloseCircleOutline />
          </Button>
        ) : (
          <Button
            onClick={quitRoom}
            className="bg-[#333] hover:bg-[#333]/90 p-2 focus:ring-[#333]"
            variant="secondary"
          >
            Quit room
            <IoExitOutline />
          </Button>
        )}
        <Toaster />
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="bg-[#333] hover:bg-[#333]/90 focus:ring-[#333]"
              variant="secondary"
            >
              Chat
              <IoChatbubblesOutline />
            </Button>
          </DrawerTrigger>
          <DrawerContent
            className="bg-gray-400 text-white p-6 w-full max-w-md"
            side="left"
          >
            <DrawerHeader>
              <DrawerTitle>Chat</DrawerTitle>
              <DrawerDescription>Hey, let's work together!</DrawerDescription>
            </DrawerHeader>
            <div className="flex overflow-auto" style={{ maxHeight: "400px" }}>
              <div
                className="space-y-4 h-auto overflow-y-auto pr-2"
                style={{ width: "calc(100% + 16px)" }}
              >
                {msgs.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{opacity:1,y:0}}
                    transition={{duration:0.5}}
                  >
                      <div className="flex items-start space-x-3 break-all">
                      <Image
                        height={30}
                        width={30}
                        src={msg.senderAvatar}
                        className="w-8 h-8 bg-[#ccc] rounded-full"
                      />
                      <div>
                        <p className="font-medium">@{msg.senderName}</p>
                        <p className="text-sm text-[#ccc]">{msg.msg}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <DrawerFooter>
              <div className="flex items-center space-x-2">
                <form onSubmit={sendMsg} className="flex w-full gap-1">
                  <input
                    value={msg}
                    onChange={(e) => setMsg(e.currentTarget.value)}
                    className="flex-1 rounded-md bg-gray-500 text-white outline-none p-2"
                    placeholder="Type your message..."
                  />
                  <Button
                    type="submit"
                    className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]"
                    variant="primary"
                  >
                    <IoSendOutline />
                  </Button>
                </form>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]"
              variant="primary"
            >
              Vote
              <LuVote />
            </Button>
          </DrawerTrigger>
          <DrawerContent
            className="bg-[#0a2a4d] text-white p-6 w-full max-w-md"
            side="right"
          >
            <DrawerHeader>
              <DrawerTitle>Vote</DrawerTitle>
              <DrawerDescription>Vote for the player you think is the wolf.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                {players.map((player) => (
                  <div className="flex items-center justify-between bg-[#333] rounded-md p-3" key={player.playerId}>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={player.avatar}
                        width={30}
                        height={30}
                        className="w-8 h-8 bg-[#ccc] rounded-full"
                      />
                      <span className="text-sm font-medium">{player.playerName}</span>
                    </div>
                    <Button
                      className="bg-[#0a2a4d] hover:bg-[#0a2a4d]/90 focus:ring-[#0a2a4d]"
                      variant="primary"
                    >
                      Vote
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      </motion.div>
    </main>
  );
}
