import { createClient } from "@/lib/supabase/config";

export async function POST(req: Request) {
  let dl = 0;
  let full = 0;
  let playersInRoom = 0;
  const supabase = createClient();
  const uid = req.headers.get('uid');
    const {data,error} = await supabase
    .from('rooms')
    .select()
    .eq('roomUid',uid)
    .single();
    // room.length < 0 ? router.push('./404') : '';
    if(data){
      dl = 1;
    }
    
    const {data:players,error:playersError} = await supabase
      .from('players')
      .select('*')
      .eq('roomId',uid)
      if(players){
        playersInRoom = players.length;
        if(playersInRoom  >=  data.players){
          full = 1;
        }
      }
      
  return Response.json({msg:'ff',data,dl,full})

}
