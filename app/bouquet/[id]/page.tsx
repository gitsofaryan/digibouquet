// app/bouquet/[id]/page.tsx
import { supabase } from "@/lib/supabase"; // we'll make this below
import Bouquet from "../../../components/bouquet/Bouquet";
import ShareButton from "../../../components/ui/ShareButton";
import Image from "next/image";
import Link from "next/link";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function BouquetPage(props: Params) {
  const params = await props.params;
  const { id } = params;

  const { data, error } = await supabase
    .from("bouquets")
    .select()
    .eq("short_id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching bouquet:", error);
    return <div>404 - Bouquet not found</div>;
  }

  console.log("Raw data from Supabase:", data);

  // Transform database format to expected format
  let bouquetData;
  try {
    bouquetData = {
      ...data,
      flowerOrder: data.flower_order || [], // Map snake_case to camelCase
      letter: typeof data.letter === 'string'
        ? JSON.parse(data.letter)
        : data.letter || { sender: "", recipient: "", message: "" }, // Ensure letter is an object
    };
  } catch (e) {
    console.error('Error parsing bouquet data:', e);
    return <div>Error loading bouquet data</div>;
  }

  // Validate essential data
  if (!bouquetData.flowers || !Array.isArray(bouquetData.flowers)) {
    return <div>Invalid bouquet data</div>;
  }

  console.log("Transformed bouquet data:", bouquetData);

  // Get the full URL for sharing
  const currentUrl = `https://bouquit.vercel.app/bouquet/${id}`;
  const shareTitle = `Check out this beautiful bouquet from ${bouquetData.letter?.sender || 'someone special'}!`;
  const shareDescription = bouquetData.letter?.message || "I made this digital bouquet for you";

  return (
    <div className="text-center p-6 bg-[#F9F9EE]">
      {/* Logo/Branding */}
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
  

      <h2 className="text-lg mb-14 ">Hi, I made this bouquet for you!</h2>
      <Bouquet bouquet={bouquetData} />
      
      {/* Share button also at the bottom for mobile */}
      <div className="mt-4 mb-6 ml-[60%]">
        <ShareButton 
          url={currentUrl}
          title={shareTitle}
          description={shareDescription}
        />
      </div>
      <p className="text-sm text-gray-500">
        made with <a href="https://bouquit.vercel.app/"><span className="text-blue-950 underline">bouquit</span></a>, a tool by{" "}
        <Link
          href="https://instagram.com/arien_jain"
          className="text-sm underline text-gray-500 mt-2"
        >
          @arien_jain
        </Link>
      </p>
      <Link href="/" className="text-sm underline text-gray-500 mt-2">
        make a bouquet now!
      </Link>
    </div>
  );
}
