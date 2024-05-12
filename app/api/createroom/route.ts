import { createClient } from "@/lib/supabase/config";


export async function POST(req:Request){
    const supabase = createClient();
    function generateUniqueId() {
        return Date.now().toString(36);
    }      
    const uId = generateUniqueId();
    try {
        const name = req.headers.get('name');
        const chat = req.headers.get('chat');
        const rounds = req.headers.get('rounds');
        const players = req.headers.get('players');
        const creator = req.headers.get('creator')  // Get the name of the logged in player
        console.log(name , chat , rounds , players , creator)
        const {data,error}:any = await supabase.from('rooms').insert({
            roomName:name,
            roomCreator:creator,
            roomUid:uId,
            chat:chat,
            rounds:rounds,
        })
        data ? console.log('Room Created')  : console.error(error);
    } catch (error) {
        console.log(error);
    }
    return Response.json(
        {
            msg:'post ok',
            uId:uId
            
        }
    )
}