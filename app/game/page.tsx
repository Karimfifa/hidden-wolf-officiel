import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import Rooms from '@/components/component/main-game-page';

export default async function page() {
    const user = await currentUser();
  return (
    <>
    <Rooms />
    </>
  )
}
