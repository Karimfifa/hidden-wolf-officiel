import { createClient } from "@/lib/supabase/config";


export async function POST(req:Request){
    const supabase = createClient();
    try {
        const player = req.headers.get('player');
        const roomId = req.headers.get('roomId');
        const {data,error}:any = await supabase.from('players').insert({
            playerName: player,
            roomId:roomId,
        })
        data ? console.log('Player Joined Succes')  : console.error(error);
        console.log(player, roomId);
    } catch (error) {
        console.log(error);
    }
    return Response.json(
        {
            msg:'post ok',
        }
    )
}