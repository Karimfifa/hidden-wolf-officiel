'use client'
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { createClient } from "@/lib/supabase/config";
import Loading from "@/components/component/skeleton";
import { Toaster, toast } from "sonner";
import ListenToInvite from "@/components/component/listenToInvite";
import Navigation from "./navigation";
import { motion } from "framer-motion";

export default function Rooms() {
  const { user, isLoaded } = useUser();
  const currentUser = user?.fullName;
  const playerId = user?.id;
  const avatar = user?.imageUrl;
  const email = user?.primaryEmailAddress;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function fetchRooms() {
    const { data, error } = await supabase
      .from("rooms")
      .select()
      .order("id", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    setRooms(data || []);
    setLoading(true);
  }

  async function userExist() {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("userId", playerId)
      .single();
    if (error) {
      console.log("error getting players: " + error);
    }
    if (data) {
      console.log(playerId + " already exists");
    } else {
      const { data: upsert, error: upsertError } = await supabase
        .from("users")
        .insert(
          {
            userId: playerId,
            fullname: currentUser,
            avatar: avatar,
            email: email,
          },
          { onConflict: "userId", ignoreDuplicates: "true" }
        );
      upsertError
        ? toast.error("error upserting user" + JSON.stringify(error))
        : toast.success("user upsert success");
    }
  }

  useEffect(() => {
    async function roomsChange() {
      const { data, error } = await supabase
        .channel("rooms-check-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "rooms",
          },
          (payload) => {
            fetchRooms();
          }
        )
        .subscribe();

      if (error) {
        console.error(error);
        return;
      }

      return () => {
        data?.unsubscribe();
      };
    }
    roomsChange();
  }, [isLoaded, user]);

  useEffect(() => {
    fetchRooms();
    if (isLoaded) {
      userExist();
    }
  }, [isLoaded]);

  useEffect(() => {
    // function lobby() {
    //   const audio = new Audio("/assets/lobby.mp3");
    //   audio.play();
    // }
    // lobby();
  }, []);

  return (
    <div
      key="1"
      className="flex flex-col h-screen bg-gray-900"
      style={{backgroundImage:('url("./assets/ori.gif")'),backgroundSize:'cover'}}
    >
      
      <ListenToInvite />
      <Toaster richColors />
      <main className="flex-1 overflow-auto text-white">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-8 lg:p-10">
          {!loading ? (
            <Loading />
          ) : rooms.length == 0 ? (
            <div className="flex w-screen h-screen items-center justify-center">
              <i>
                We Think We Are Hated by People because we have <br /> 0 Rooms
              </i>
            </div>
          ) : null}
          {rooms.map((room) => (
            <motion.div
              dragConstraints={{ top: -50, bottom: 100, left: -100, right: 100 }}
              drag
              key={room.id}
              initial={{opacity:0}}
              animate={{opacity:1}}
              transition={{duration:0.5}}
              whileHover={{scale:0.9}}
            >
              <div className="bg-gradient-to-l  from-[#40916c] to-[#2a6f97] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {room.roomName}
                      </h2>
                      <p className="text-[#cccccc] mt-2">
                        Created by {room.roomCreator}
                      </p>
                    </div>
                    <GamepadIcon className="text-white h-6 w-6" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    {room.roomstatus === "play" ? (
                      <span className="px-3 py-1 bg-red-600 text-white font-medium rounded-full text-sm">
                        Playing
                      </span>
                    ) : room.roomstatus === "waiting" ? (
                      <>
                        <span className="px-3 py-1 bg-green-600 text-white font-medium rounded-full text-sm">
                          {room.roomstatus}
                        </span>
                        <Link
                          className="flex items-center"
                          value={room.roomUid}
                          href={`waiting?uid=${room.roomUid}`}
                          size="sm"
                          variant="primary"
                        >
                          join
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Link>
                      </>
                    ) : room.roomstatus == "full" ? (
                      <span className="px-3 py-1 bg-orange-600 text-white font-medium rounded-full text-sm">
                        {room.roomstatus}
                      </span>
                    ) : room.roomstatus == "closed" ? (
                      <span className="px-3 py-1 bg-red-900 text-white font-medium rounded-full text-sm">
                        Finished
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-600 text-white font-medium rounded-full text-sm">
                        Ghost Room
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </main>
      <Navigation />
    </div>
  );
}

function ArrowRightIcon(props) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function Dice1Icon(props) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M12 12h.01" />
    </svg>
  );
}

function GamepadIcon(props) {
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
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function ShoppingBagIcon(props) {
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
