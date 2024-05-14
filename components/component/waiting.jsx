  'use client'
  import { Button } from "@/components/ui/button"
  import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
  import { useUser } from "@clerk/nextjs"
  import { useRouter, useSearchParams } from "next/navigation";
  import {  useEffect,useState,useRef } from "react";
  import { createClient } from "@/lib/supabase/config";
  import usePreventBackWithoutConfirmation from '@/components/hooks/preventBack'
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
  } from "@/components/ui/alert"

  export default function Waiting() {

    const [rm, setRm] = useState([]);
    const [players,setPlayers] = useState([]);

    const [maxPlayers,setMaxplayers] = useState(0);
    const [currentPlayers,setCurrentplayers] = useState(0);

    const {user, isLoaded} = useUser();
    const currentUser = user?.fullName;
    const avatar = user?.imageUrl;
    const playerId = user?.id;

    const router = useRouter()

    const querys = useSearchParams();
    const uid = querys.get('uid');
    
    const supabase = createClient();

    const hasRunOnce = useRef(false); // Flag to track if the effect has run

    async function full(statu){
      

    }
    // Get room data by UID
    async function getRoomData(){
      try {
        const req = await fetch('http://localhost:3000/api/fetchRoomInfo',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            uid:uid,
          }
        })
        const res = await req.json();
        setRm(res.data);
        setMaxplayers(res.data.players);
        alert('room is' + res.full)
        if(res.full === 1){
          await supabase
          .from('rooms')
          .update({'roomstatus':'Full'})
          .eq('roomUid',uid)
          .single();
        }
        if(res.data.length == 0){
          router.push('/game');
        }
        if(res.data.roomstatus == 'play'){
          router.push(`/room?uid=${uid}`);
        }
        if(res.data.roomstatus==  'closed'){
          router.push('/closed')
        }
      } catch (error) {
        console.log('error fetch room info '+error);
      }
    }
    // Get all players in the same room
    async function getPlayerList(){
      try {
        const {data,error} = await supabase
        .from('players')
        .select('*')
        .eq('roomId',uid);
        if(data){
          setPlayers(data);
          setCurrentplayers(data.length);
        }
      } catch (error) {
        console.log('error get players'+error)
      }
    }

    async function upsert() {
    
      try {
        const { data, error } = await supabase
          .from('players')
          .select()
          .eq('roomId', uid)
          .eq('playerId', playerId);
    
        if (error) {
          throw error;
        }
    
        const existingPlayer = data.length > 0;
    
        if (existingPlayer) {
          return { playerExists: true }; // Player already exists
        } else {
          const { data: newPlayer, error: createError } = await supabase
            .from('players')
            .insert({'playerId':playerId,'playerName':currentUser,'roomId':uid,'avatar':avatar});
    
          if (createError) {
            throw createError;
          }
    
          return { playerExists: false, playerId: newPlayer[0].id }; // New player created
        }
      } catch (error) {
        console.error('Error checking or creating player:', error);
        return { error }; // Return error object if encountered
      }
    }
    
      
    
    
    useEffect(()=>{
      playersChanges();
      statusChange();
    },[])


    //Quit room
    async function quitRoom(){
      try {
        const {data,error } = await supabase 
        .from('players')
        .delete()
        .eq('playerName',currentUser);
        if (error) throw error('error for quit room' + error);
        data ? console.log('you quited') : console.log('No Data Found');
        window.location.href= '/game';
      } catch (error) {
        console.log('error quiting room')
      }
    } 

    //Close Room
    async function closeRoom(){
      if (window.confirm("Are you sure !")){
        const {data,error} = await supabase
        .from('rooms')
        .update({roomstatus:'closed'})
        .eq('roomUid',uid)
        .eq('roomCreator',currentUser);
        if(data){
          quitRoom();
        }
        router.push('/game')
      }
    }

    //Start game
    async function startGame() {
      try {
        const {data,error } = await supabase 
        .from('rooms')
        .update({roomstatus:'play'})
        .eq('roomUid',uid);
        if (error) throw error('error for play room' + error);
        data ? console.log('Room Has Been Started') : console.log('No Data Found');
      } catch (error) {
        console.log('error play rooms')
      }
    }




    //Room Players change
    async function playersChanges(){
      const {data,error} = await supabase
      .channel('roomPlayersChanges')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'players'},
        (payload) =>{
          getRoomData();
          getPlayerList();
        }
      )
      .subscribe();
    } 
    //Room Status change
    async function statusChange(){
      const {data,error}=await supabase
      .channel('roomstatuschange')
      .on('postgres_changes',{event:'*',schema:'public',table:'rooms'},
      (payload)=>{
        getRoomData();
      })
      .subscribe();
    }


    useEffect(() => {  
      if (isLoaded && !hasRunOnce.current) {
        upsert();
        getRoomData();
        getPlayerList();
        // checkMe(uid,playerId,currentUser,avatar); // Assuming this is optional
        hasRunOnce.current = true; // Set flag to prevent future runs
      }
    }, [isLoaded]);
    usePreventBackWithoutConfirmation(quitRoom);

    return (
      <div className="flex min-h-screen  w-full flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-950 px-4 py-8">
        <AlertDialog>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="mx-auto w-full max-w-md rounded-lg bg-gray-900 p-6 shadow-lg">
          <div className="flex flex-col  items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Waiting for players for <span className="text-gray-400 ">{rm.roomName}</span></h1>
              <p className="text-gray-400">Join the room and wait for the game to start.</p>
            </div>
            <div className="flex w-full flex-col items-start rounded-md bg-gray-800 px-4 py-3">
              <div className="mb-2 flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">{players.length} / {rm.players}  players in the room </span>
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                {
                  rm.roomCreator == currentUser ? (
                    <Button onClick={closeRoom} className="rounded-md px-4 py-2 text-sm font-medium bg-red-500 " variant="primary">
                      Close Game
                    </Button>
                  ) : (
                    <Button onClick={quitRoom} className="rounded-md px-4 py-2 text-sm font-medium bg-orange-500 " variant="primary">
                      Quit Game
                    </Button>
                  )
                }
                  
              </div>
              <div className="grid grid-cols-2 w-full items-center p-4 rounded-md gap-4">
                {
                  players.map((player)=>(
                    <>
                      <div key={player.id} className="w-full flex flex-col bg-gray-600 rounded-md p-2  ">
                          <Avatar>
                          <AvatarImage alt="Player 1" src={player.avatar} />
                          <AvatarFallback>P{player.id}</AvatarFallback>
                        </Avatar>
                        <div key={player.id} className="flex-1">
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
              rm.roomCreator == currentUser?(
                  <Button onClick={startGame} className="w-full rounded-md px-4 py-2 text-sm font-medium" variant="outline">
                    Start Game
                  </Button>
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
