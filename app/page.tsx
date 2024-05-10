'use client'
import Image from "next/image";
import AboutPage from "@/components/component/about-page";
import { useEffect, useState } from "react";
export default function Home() {

  const [isLoading, setIsLoading] = useState(0);
  useEffect(()=>{
    setIsLoading(1);
    console.log(isLoading);
  })

  return (
    <>
    <AboutPage />
    </>
   
  );
}
