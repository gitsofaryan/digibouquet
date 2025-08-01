// app/bouquet/[id]/page.tsx
import { supabase } from "@/lib/supabase"; // we'll make this below
import Image from "next/image";
import BouquetOnly from "../bouquet/components/BouquetOnly";
import Link from "next/link";

interface Params {
  params: {
    id: string;
  };
}

export default async function BouquetPage({ params }: Params) {
  const { id } = params;

  const { data, error } = await supabase
    .from("bouquets")
    .select()
    .eq("id", id)
    .single();

  if (error || !data) {
    return <div>404 - Bouquet not found</div>;
  }

  return (
    <div className="text-center p-6">
      {/* Logo/Branding */}
      <Link href="/">
        <Image
          src="/digibouquet.png"
          alt="digibouquet"
          width={140}
          height={80}
          className="object-cover mx-auto my-10"
          priority
        />
      </Link>{" "}
      <BouquetOnly bouquet={data} />
      <p className="text-sm text-gray-500">
        made with digibouquet, a tool by{" "}
        <Link
          href="https://x.com/pau_wee_"
          className="text-sm underline text-gray-500 mt-2"
        >
          @pau_wee_
        </Link>
      </p>
      <Link href="" className="text-sm underline text-gray-500 mt-2">
        make a bouquet now!
      </Link>
    </div>
  );
}
