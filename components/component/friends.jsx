'use client'
import { Input } from "@/components/ui/input"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LiaUserFriendsSolid } from "react-icons/lia";
import { Toaster, toast } from 'sonner'
import { DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/config"
import { useState,useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import ListenToInvite from '@/components/component/listenToInvite';


export default function Friends() {

  const [users,setUsers] = useState([]);
  const [requests,setRequests] = useState([]);
  const [friends,setFriends] = useState([]);

  const supabase = createClient();

  const {user,isLoaded} = useUser();

  const currentUser = user?.fullName;
  const avatar = user?.imageUrl;
  const userId = user?.id;

  //get all players
  async function players() {
    const {data,error} = await supabase 
    .from('users')
    .select()
    .neq('fullname',currentUser);
    data ? setUsers(data) : console.log('error get players ' + error);
  }

  //send req
  async function req(resPlayerId,resPlayerName,resPlayerAvatar){
    const {data,error} = await supabase
    .from('friends')
    .select()
    .eq('reqPlayerId',userId)
    .eq('resPlayerId',resPlayerId)
    .eq('resStatus','friends');
    if(data.length ===  0){
      const {data:insreq,error:insreqE} = await supabase
      .from('friends')
      .insert({reqPlayerId:userId,resPlayerId:resPlayerId,reqPlayerAvatar:avatar,reqPlayerName:currentUser,resPlayerName:resPlayerName,resPlayerAvatar:resPlayerAvatar})
      .single();
      data ? console.log('request succeful') : console.log('req errror'  + error);
      toast.success('Request has been sent to ' + resPlayerName);
    }else{
      toast.warning('You are already friend for ' + resPlayerName);
    }
    
  }


  //requests 
  async function getRequests(){
    const {data,error} = await supabase
    .from('friends')
    .select()
    .eq('resPlayerId',userId)
    .eq('resStatus','wait');
    data ? setRequests(data) : console.log('error get requests ' + error);
    if(data.length > 0){
      toast(<div>You have new friends request</div>)
    }
  }

  //get how much friends
  async function getFriends(){
    const {data,error} = await supabase
    .from('friends')
    .select()
    .eq('reqPlayerId',userId)
    .eq('resStatus','friends');
    data ? setFriends(data) : console.log('error get friends ' + error);
  }

  //delete request
  async function deleteRequest(reqPlayerId){
    const {data,error} = await supabase
    .from('friends')
    .delete()
    .eq('resPlayerId',userId)
    .eq('reqPlayerId',reqPlayerId);
    data ? console.log('request deleted') : console.log('req errror'  + error);
  }

  //accept request
  async function acceptRequest(reqPlayerId){
    const {data,error} = await supabase
    .from('friends')
    .update({resStatus:'friends'})
    .eq('resPlayerId',userId)
    .eq('reqPlayerId',reqPlayerId);
    data ? console.log('request accepted') : console.log('req errror'  + error);
  }

  //friends changes listener
  async function friendListener(){
    const {data,error} = await supabase
    .channel('friendslistener')
    .on('postgres_changes',{event:'*',schema:'public',table:'friends'},(payload)=>{
      getRequests();
      getFriends();
      console.log('friend')
    })
    .subscribe();
  }


  // useEffect(()=>{
  // },[])

  useEffect(()=>{
    if(isLoaded){
      players();
      getRequests();
      getFriends();
    }
    friendListener();
  },[isLoaded])
  return (
    <div className="bg-gray-950 dark:bg-gray-950 p-6 rounded-lg shadow-md">
      <ListenToInvite />
      <Toaster richColors  />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Add Friends</h2>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10 pr-4 py-2 rounded-md border border-gray-200 border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 w-64 bg-gray-900 text-white dark:border-gray-800"
            placeholder="Search for friends"
            type="text"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {
          users.map((user)=>(
          <div className="flex items-center justify-between bg-gray-900 p-4 rounded-md shadow-sm">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage alt="John Doe" src={user.avatar}/>
                <AvatarFallback>{user.id}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-white">{user.fullname}</h3>
                <p className="text-gray-400 text-sm">@{user.fullname}</p>
              </div>
            </div>
            <Button onClick={()=>{req(user.userId,user.fullname,user.avatar)}} size="sm">Add</Button>
        </div> 
          ))
        }
      </div>
      <div className="flex  justify-between items-center mt-6">
        <Dialog >
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Friend Requests {requests.length > 0 ? ( <div className="w-30 h-30 ml-2 p-2 flex items-center  border-r-4 border-green-700 gap-1  rounded-full"><LiaUserFriendsSolid />{requests.length}</div> ): null}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>Friend Requests</DialogTitle>
              <DialogDescription>You have {requests.length} pending friend requests .</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 overflow-y-scroll" style={{ maxHeight: "300px" }}>
              {
                requests.map((request)=>(
                  <div className="flex items-center  justify-between bg-gray-900 p-4 rounded-md shadow-sm">
                    <div className="flex items-center  space-x-4">
                      <Avatar>
                        <AvatarImage alt="Sarah Johnson" src={request.reqPlayerAvatar} />
                        <AvatarFallback>{request.id}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-white">{request.reqPlayerName}</h3>
                        <p className="text-gray-400 text-sm">@{request.reqPlayerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button onClick={()=>{acceptRequest(request.reqPlayerId)}} size="sm" variant="outline">
                        Accept
                      </Button>
                      <Button onClick={()=>{deleteRequest(request.reqPlayerId)}} className="text-red-500" size="sm" variant="outline">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              }
              
              
              
            </div>
            <DialogFooter>
              <div>
                <Button variant="ghost">Close</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="text-white flex items-center gap-1 font-medium">You have {friends.length} friends <LiaUserFriendsSolid /></div>
      </div>
    </div>
  )
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
