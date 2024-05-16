'use client '
import { useEffect, useState } from 'react'
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/config";
import { Toaster, toast } from 'sonner'
import InvitationPopup from '@/components/component/invitation-popup'

export default function ListenToInvite() {

  const [open,setOpen] = useState(false);
  const [invite , setInvite] = useState([]);

    const { user,isLoaded } = useUser();
    const currentUser = user?.fullName;
    const playerId = user?.id;

    const supabase = createClient();



     //invitations
  async function invitations(){
    const { data, error } = await supabase
    .from('invite')
    .select()
    .eq('receiverId',playerId)
    .order('id',{ascending:false});
    if(data.length > 0){
      setOpen(true);
      setInvite(data[0]);
      setTimeout(()=>{
        setOpen(false);
      },9000)
      // toast.info(data[0].inviterName + ' Invite you to ' + data[0].roomName);
    }
  }
  //inviite listener
  async function inviteListener(){
    const { data, error } = await supabase
    .channel('inviteListener')
    .on('postgres_changes',{event:'*',schema:'public',table:'invite'},(payload)=>{
      invitations();
    })
    .subscribe();
  }
  useEffect(()=>{
    if(isLoaded){
      inviteListener();
    }
  },[isLoaded])
  return (
    <>
    {
      open ? <InvitationPopup sender={invite.inviterName} roomId={invite.roomId} roomName={invite.roomName} />   : null
    }
        <Toaster richColors  />

    </>
    )
}
