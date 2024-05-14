import { createClient } from "@/lib/supabase/config";


export async function POST(req:Request){
    const supabase = createClient();
        let s:any ;
        const player = req.headers.get('playerId');
        const roomId = req.headers.get('roomId');
        const {data,error}:any = await supabase.from('players').
        delete()
        .eq('playerId',player)
        .eq('roomId',roomId);
        data ? s = 'Player Jquited'  : console.error(error);
        // console.log(player, roomId);
    return Response.json(
        {
            msg:'post ok',
            data:data,
            error,
        }
    )
}