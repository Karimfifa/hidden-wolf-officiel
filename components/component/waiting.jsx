"use client";
import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/config";
import usePreventBackWithoutConfirmation from "@/components/hooks/preventBack";
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
import Counter from "@/components/component/counter";
import Invite from "@/components/component/invite";
import { motion } from "framer-motion";

export default function Waiting() {
  const [rm, setRm] = useState([]);
  const [players, setPlayers] = useState([]);

  const [maxPlayers, setMaxplayers] = useState(0);
  const [currentPlayers, setCurrentplayers] = useState(0);
  const [fulll, setFulll] = useState(false);

  const { user, isLoaded } = useUser();
  const currentUser = user?.fullName;
  const avatar = user?.imageUrl;
  const playerId = user?.id;

  const runOnce = useRef(false);

  const router = useRouter();

  const querys = useSearchParams();
  const uid = querys.get("uid");

  const supabase = createClient();

  const hasRunOnce = useRef(false); // Flag to track if the effect has run

  // Get room data by UID
  async function getRoomData() {
    try {
      const req = await fetch("https://hassali.vercel.app/api/fetchRoomInfo", {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          uid: uid,
        },
      });
      const res = await req.json();
      setRm(res.data);
      setMaxplayers(res.data.players);
      if (res.full === 1) {
        setFulll(true);
      } else {
        setFulll(false);
      }
      if (res.data.length == 0) {
        router.push("/game");
      }
    } catch (error) {
      console.log("error fetch room info " + error);
    }
  }
  // Get all players in the same room
  async function getPlayerList() {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("roomId", uid);
      if (data) {
        setPlayers(data);
        setCurrentplayers(data.length);
      }
    } catch (error) {
      console.log("error get players" + error);
    }
  }

  async function upsert() {
    try {
      const { data, error } = await supabase
        .from("players")
        .select()
        .eq("roomId", uid)
        .eq("playerId", playerId);

      if (error) {
        throw error;
      }

      const existingPlayer = data.length > 0;

      if (existingPlayer) {
        return { playerExists: true }; // Player already exists
      } else {
        const { data: newPlayer, error: createError } = await supabase
          .from("players")
          .insert({
            playerId: playerId,
            playerName: currentUser,
            roomId: uid,
            avatar: avatar,
          });

        if (createError) {
          throw createError;
        }

        return { playerExists: false, playerId: newPlayer[0].id }; // New player created
      }
    } catch (error) {
      console.error("Error checking or creating player:", error);
      return { error }; // Return error object if encountered
    }
  }

  useEffect(() => {
    playersChanges();
    statusChange();
  }, []);

  //Quit room
  async function quitRoom() {
    try {
      const { data, error } = await supabase
        .from("players")
        .delete()
        .eq("playerId", playerId)
        .eq("roomId", uid);
      if (error) throw error("error for quit room" + error);
      data ? console.log("you quited") : console.log("No Data Found");
      window.location.href = "/game";
    } catch (error) {
      console.log("error quiting room");
    }
  }

  //Close Room
  async function closeRoom() {
    if (window.confirm("Are you sure !")) {
      const { data, error } = await supabase
        .from("rooms")
        .update({ roomstatus: "closed" })
        .eq("roomUid", uid)
        .eq("roomCreator", currentUser);
      if (data) {
        quitRoom();
      }
      router.push("/game");
    }
  }

  //Start game
  async function startGame() {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .update({ roomstatus: "play" })
        .eq("roomUid", uid);
      if (error) throw error("error for play room" + error);
      data
        ? console.log("Room Has Been Started")
        : console.log("No Data Found");
    } catch (error) {
      console.log("error play rooms");
    }
  }

  // Play the join sound
  function joinSound() {
    const audio = new Audio("/assets/join.wav");
    audio.play();
  } // Play the out sound
  function outSound() {
    const audio = new Audio("/assets/out.wav");
    audio.play();
  }

  //Room Players change
  async function playersChanges() {
    const { data, error } = await supabase
      .channel("roomPlayersChanges")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        (payload) => {
          if (payload.new.roomId === uid ) {
            joinSound();
          } else if (
            payload.eventType == "DELETE" &&
            payload.new.roomId == uid
          ) {
            outSound();
          }
          console.log(payload);
          getRoomData();
          getPlayerList();
        }
      )
      .subscribe();
  }
  //Room Status change
  async function statusChange() {
    const { data, error } = await supabase
      .channel("roomstatuschange")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        (payload) => {
          getRoomData();
        }
      )
      .subscribe();
  }

  useEffect(() => {
    if (isLoaded && !hasRunOnce.current) {
      upsert();
      getRoomData();
      getPlayerList();
      hasRunOnce.current = true; // Set flag to prevent future runs
    }
  }, [isLoaded, fulll]);
  usePreventBackWithoutConfirmation(quitRoom);

  useEffect(() => {
    if (rm.roomstatus == "closed") {
      router.push("/closed");
    }
    if (!rm.roomstatus == "waiting") {
      router.push("/closed");
    }
    if(rm.roomstatus == 'play'){
      router.push('/room?uid='+rm.roomUid);
    }
  }, [rm.roomstatus]);
  async function roomFull(){
    if(players.length >= rm.players){
      const {data,error} = await  supabase
      .from('rooms')
      .update({roomstatus:'full'})
      .eq('roomUid',rm.roomUid);
    }else{
      const {data,error} = await  supabase
      .from('rooms')
      .update({roomstatus:'waiting'})
      .eq('roomUid',rm.roomUid);
      
    }
  }
    useEffect(()=>{
      roomFull();
  },[players,rm.players])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen w-full flex-col items-center justify-center  px-4 py-8"
      style={{backgroundImage: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)'}}
    >
      {rm.roomstatus == "play" ? <Counter target={rm.roomUid} /> : <></>}
      <div className="mx-auto w-full max-w-md rounded-lg bg-[#238373] p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold text-white">
              Waiting for players for{" "}
              <span className="text-gray-300">{rm.roomName}</span>
            </h1>
            <p className="text-gray-400">
              Join the room and wait for the game to start.
            </p>
          </div>
          <div className="w-full rounded-md  px-4 py-3" style={{border:'1px solid #00B287'}}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">
                  {players.length} / {rm.players} players in the room{" "}
                </span>
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>

              {rm.roomCreator == currentUser ? (
                <Button
                  onClick={closeRoom}
                  className="rounded-md bg-[#E23E4C] px-4 py-2 text-sm font-medium"
                  variant="primary"
                >
                  Close Game
                </Button>
              ) : (
                <Button
                  onClick={quitRoom}
                  className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium"
                  variant="primary"
                >
                  Quit Game
                </Button>
              )}
            </div>
            <div className="grid w-full grid-cols-2 gap-4 p-4">
              {players.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex h-10 w-full flex-col rounded-lg bg-gray-500 p-2"
                >
                  <div className="h-4 w-4 rounded-full bg-gray-600"></div>
                  <div className="mt-3 h-3 w-full bg-gray-600"></div>
                </motion.div>
              ) : (
                players.map((player) => (
                  <div
                    key={player.id}
                    className="flex flex-col rounded-md bg-gray-600 p-2"
                  >
                    <Avatar>
                      <AvatarImage alt="Player 1" src={player.avatar} />
                      <AvatarFallback>P{player.id}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-white">{player.playerName}</h3>
                      <p className="text-gray-400">{player.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {rm.roomCreator == currentUser ? (
            <div className="flex gap-2">
              <Button
                onClick={startGame}
                className="w-full rounded-md px-4 py-2 text-sm font-medium"
                variant="outline"
                style={{backgroundColor:'#2CD261'}}
              >
                Start Game
              </Button>
              {!fulll ? (
                <Invite
                  userId={playerId}
                  roomId={uid}
                  inviterName={currentUser}
                  inviterAvatar={avatar}
                  roomName={rm.roomName}
                  
                />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <span className="text-white">Waiting...</span>
          )}
        </div>
      </div>
    </motion.div>
  );
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6 a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
