import { Button } from "@/components/ui/button"
import { DrawerTrigger, DrawerTitle, DrawerDescription, DrawerHeader, DrawerClose, DrawerFooter, DrawerContent, Drawer } from "@/components/ui/drawer"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/config"
import { useEffect, useState } from "react";

export default function Invite({roomId ,roomName,userId,inviterName,inviterAvatar}) {
  const supabase = createClient();

  const [friends,setFriends] = useState([]);


   //get how much friends
  async function getFriends(){
    const {data,error} = await supabase
    .from('friends')
    .select()
    .eq('reqPlayerId',userId)
    .eq('resStatus','friends');
    data ? setFriends(data) : console.log('error get friends from invite ' + error);
  }

  //invite
  async function invite(receiverId,receiverName,receiverAvatar){
    const {data,error} = await supabase
    .from('invite')
    .insert({inviterId:userId,inviterName:inviterName,inviterAvatar:inviterAvatar,receiverId:receiverId,receiverName:receiverName,receiverAvatar:receiverAvatar,roomId:roomId,roomName:roomName})
  }

  useEffect(()=>{
    getFriends();
  },[])
  return (
    <Drawer defaultOpen>
      <DrawerTrigger asChild>
        <Button
          className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          variant="outline"
          style={{backgroundColor:'#008F92'}}
        >
          Invite Friends
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-md bg-gray-950 text-gray-50">
        <DrawerHeader>
          <DrawerTitle>Invite Friends</DrawerTitle>
          <DrawerDescription>Select friends to invite to the Hidden Wolf game.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-6 space-y-4 overflow-auto max-h-[400px]">
          {
            
            friends.map((friend)=>(
              <div key={friend.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="bg-gray-800">
                    <AvatarImage alt="Avatar" src={friend.resPlayerAvatar} />
                    <AvatarFallback>{friend.id}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.resPlayerName}</p>
                    <p className="text-sm text-gray-400">@{friend.resPlayerName}</p>
                  </div>
                </div>
                <Button
                onClick={()=>{invite(friend.resPlayerId,friend.resPlayerName,friend.resPlayerAvatar)}}
                  className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  size="sm"
                  variant="outline"
                >
                  Invite
                </Button>
              </div> 
            ))
          }
          
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              variant="outline"
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
