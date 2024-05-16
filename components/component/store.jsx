'use client'
import { Button } from "@/components/ui/button"
import { GiCoins } from "react-icons/gi";
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/config";
import ListenToInvite from '@/components/component/listenToInvite';


export default function Store() {
  
  const [userD, setUserd]  = useState([]);
  const [coins,setCoins] = useState()
  
  const supabase = createClient()
  const {user,isLoaded} = useUser();

  // Fetch user data on page
  async function userData(){
    try {
      const currentUser = await user?.fullName;
      const userId = await user?.id;

      const {data,error} = await supabase
      .from('users')
      .select()
      .match({'fullname':currentUser,'userId':userId})
      .single();
      data ? setUserd(data) : console.error('Error fetching data', error);
    } catch (error) {
      alert(error)
    }
  }
  useEffect(()=>{
    userData()
  },[isLoaded,user])
  return (
    <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-gray-50">
      <ListenToInvite />
      <div className="container grid gap-8 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Wolf Game Store</h1>
            <p className="text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore our collection of Wolf-themed gaming gear and accessories.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50">
              <span>
                Your coins: 
                {
                  // userD.map((user)=>(
                  //   ' '+user.coins 
                  // ))
                  userD.coins
                }
              </span>
            </div>
            <Link href={'https://buy.stripe.com/test_6oE7vZ2VA99ucBW3cc'}>
              <Button size="sm" variant="outline">
                Buy Coins
              </Button>
            </Link>
            
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Cloak"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://opengameart.org/sites/default/files/styles/thumbnail/public/enemies-preview.png"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Cloak</h3>
              <p className="text-sm leading-none text-gray-300">Stealthy Outerwear</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Helm"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://opengameart.org/sites/default/files/styles/thumbnail/public/Fenrir_Wolf_Injury_sprite_preview.png"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Helm</h3>
              <p className="text-sm leading-none text-gray-300">Fierce Headgear</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Bow"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://opengameart.org/sites/default/files/styles/thumbnail/public/PixelSheep.png"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Bow</h3>
              <p className="text-sm leading-none text-gray-300">Precise Ranged Weapon</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Staff"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://game-icons.net/icons/ffffff/000000/1x1/lorc/wolf-howl.svg"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Staff</h3>
              <p className="text-sm leading-none text-gray-300">Powerful Magical Focus</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Shield"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://game-icons.net/icons/ffffff/000000/1x1/lorc/werewolf.svg"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Shield</h3>
              <p className="text-sm leading-none text-gray-300">Sturdy Defense</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Boots"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://game-icons.net/icons/ffffff/000000/1x1/delapouite/sherlock-holmes.svg"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Boots</h3>
              <p className="text-sm leading-none text-gray-300">Agile Footwear</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Gloves"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://img.freepik.com/free-vector/hand-drawn-werewolf-illustration_52683-96412.jpg?t=st=1713905008~exp=1713908608~hmac=0aa2ded4e9016f88723cc043db575c8e4a8b7eec1fdb40577fbfa813ab7d8693&w=740"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Gloves</h3>
              <p className="text-sm leading-none text-gray-300">Dexterous Handwear</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Armor"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://img.freepik.com/free-vector/flat-design-werewolf-illustration_23-2149649077.jpg?t=st=1713905056~exp=1713908656~hmac=ab8f4634966ecd47e279819d5dae6938a6903080854da247ca601100a6226591&w=740"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Armor</h3>
              <p className="text-sm leading-none text-gray-300">Rugged Protection</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Sword"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://img.freepik.com/premium-vector/sheep_912382-16.jpg?w=740"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Sword</h3>
              <p className="text-sm leading-none text-gray-300">Legendary Weapon</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View</span>
            </Link>
            <img
              alt="Wolf Amulet"
              className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              height={150}
              src="https://img.freepik.com/premium-photo/3d-cartoon-sheep-wearing-clothes-glasses-hat-jacket_175994-6814.jpg?w=900"
              width={150}
            />
            <div className="flex-1 py-2">
              <h3 className="font-semibold tracking-tight">Wolf Amulet</h3>
              <p className="text-sm leading-none text-gray-300">Mystical Pendant</p>
              <Button className="mt-2" size="sm" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
