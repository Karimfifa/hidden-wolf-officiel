import { createClient } from "@/lib/supabase/config";
import { NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
  const userId = req.headers.get('userId');
  const fullname = req.headers.get('fullName');
  const avatar = req.headers.get('avatar');
  const email = req.headers.get('email');

  const supabase = createClient();

  const action = req.headers.get('action');

  try {
    const { data: checkUser, error: checkError } = await supabase
      .from('users')
      .select()
      .match({ 'userId': userId, 'fullname': fullname })
      .single();

    if (checkError) {
      console.error('Error checking user:', checkError);
      return res.status(500).json({ message: 'Error checking user' }); // Handle error
    }

    if (checkUser === null) {
      const { data: createData, error: createError } = await supabase
        .from('users')
        .insert({
          'userId': userId,
          'fullname': fullname,
          'avatar': avatar,
          'email': email,
        });

      if (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ message: 'Error creating user' }); // Handle error
      }

      return res.status(201).json({ message: 'User created successfully' }); // Informative response
    } else {
      return res.json({ message: 'User already exists' }); // Handle existing user
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'Internal server error' }); // Generic error for now
  }
}
