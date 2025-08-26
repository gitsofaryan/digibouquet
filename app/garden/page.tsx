// app/bouquet/page.tsx
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import BouquetOnly from "../../components/bouquet/BouquetOnly";

export default async function AllBouquetsPage() {
  const { data, error } = await supabase
    .from("bouquets")
    .select("*")
    .order("created_at", { ascending: false }); // optional: sort by latest

  if (error) {
    console.error("Error fetching bouquets:", error);
    return <div>Error fetching bouquets: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-6">
        <Link href="/">
          <Image
            src="/digibouquet.png"
            alt="digibouquet"
            width={200}
            height={80}
            className="object-cover mx-auto my-10"
            priority
          />
        </Link>
        <h2 className="text-md uppercase mb-4">OUR GARDEN</h2>
        <p className="text-sm opacity-50 mb-10">No bouquets found. Be the first to create one!</p>
        <Link href="/" className="text-blue-500 underline">Create a bouquet</Link>
      </div>
    );
  }

  console.log("Fetched bouquets:", data.length);

  // Transform database format to expected format
  const transformedData = data.map(bouquet => {
    let parsedLetter;
    try {
      parsedLetter = typeof bouquet.letter === 'string' 
        ? JSON.parse(bouquet.letter) 
        : bouquet.letter;
    } catch (e) {
      console.error('Failed to parse letter for bouquet:', bouquet.short_id, e);
      parsedLetter = { sender: "", recipient: "", message: "" };
    }

    return {
      ...bouquet,
      flowerOrder: bouquet.flower_order || [], // Map snake_case to camelCase
      letter: parsedLetter || { sender: "", recipient: "", message: "" }, // Ensure letter is an object
    };
  });

  return (
    <div className="text-center p-6">
      <Link href="/">
        <Image
          src="/digibouquet.png"
          alt="digibouquet"
          width={200}
          height={80}
          className="object-cover mx-auto my-10"
          priority
        />
      </Link>

      {/* Page title */}
      <h2 className="text-md uppercase mb-4 ">OUR GARDEN</h2>
      <p className="text-sm opacity-50 mb-10">Thanks for stopping by!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {transformedData.map((bouquet) => {
          // Add validation for individual bouquets
          if (!bouquet.short_id) {
            console.error('Bouquet missing short_id:', bouquet);
            return null;
          }
          
          return (
            <Link href={`/bouquet/${bouquet.short_id}`} key={bouquet.short_id}>
              <div className="hover:scale-105 transition-transform cursor-pointer">
                <div>
                  <BouquetOnly bouquet={bouquet} />
                </div>
                <p className="text-sm text-gray-500 m-10">
                  {new Date(bouquet.created_at || bouquet.timestamp).toLocaleDateString()}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
