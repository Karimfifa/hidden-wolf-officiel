'use client '
import { useEffect, useState } from 'react'
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/config";
import { Toaster, toast } from 'sonner'
import InvitationPopup from '@/components/component/invitation-popup'

export default function ListenToInvite() {

  const [open,setOpen] = useState(false);
  const [invite , setInvite] = useState([]);
  const [popupOpen, setPopupOpen] = useState(true);


    const { user,isLoaded } = useUser();
    const currentUser = user?.fullName;
    const playerId = user?.id;


    const supabase = createClient();


    // Function to handle closing the popup
      const handleClosePopup = () => {
        setPopupOpen(false);
      };
     //invitations
  async function invitations(){
    const { data, error } = await supabase
    .from('invite')
    .select()
    .eq('receiverId',playerId)
    .order('id', { ascending: false })
    .neq('inviterId',playerId)
    .order('id',{ascending:false});
    if(data.length > 0){
      setOpen(true);
      setInvite(data[0]);
      setTimeout(()=>{
        setOpen(false);
      },9000)
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
      open ? <InvitationPopup onClose={handleClosePopup} receiver={playerId} sender={invite.inviterName} roomId={invite.roomId} roomName={invite.roomName} />   : null
    }
        <Toaster richColors  />

    </>
    )
}
