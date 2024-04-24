import { SignIn } from "@clerk/nextjs";
 
export default function Page() {

  return(
    <>
    <main className="py-24 bg-gradient-to-r from-[#3B2F4A] to-[#7A5D7E]" >
        <section className=" flex justify-center items-center">
            <SignIn  />
        </section>
    </main>
  </>
  )
  
}