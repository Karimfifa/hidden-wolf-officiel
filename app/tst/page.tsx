import { createClient } from "@/lib/supabase/config";

export default function Page() {
  // Create Supabase client instance
  const supabase = createClient();

  supabase
.channel("public:currently_searching")
.on(
  "postgres_changes",
  { event: "*", schema: "public", table: "tst" },
  (payload) => {
    console.log('new event');
  }
)
.subscribe();

  return (
    <h1>hello</h1>
  );
}
