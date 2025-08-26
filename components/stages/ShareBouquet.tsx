import Image from "next/image";
import { flowers } from "../../data/data";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import Bouquet from "../bouquet/Bouquet";
import { useBouquet } from "../../context/BouquetContext";
import type { Bouquet as BouquetType } from "@/types/bouquet";
import { useState } from "react";

export default function ShareBouquet() {
  const { bouquet } = useBouquet();
  const [isCreating, setIsCreating] = useState(false);
  // Helper function to get flower dimensions based on size
  const getFlowerDimensions = (size: string) => {
    switch (size) {
      case "small":
        return 80;
      case "large":
        return 160;
      default:
        return 120; // medium
    }
  };

  const router = useRouter();

  const handleCreateBouquet = async (bouquet: BouquetType) => {
    setIsCreating(true);
    const short_id = nanoid(8);

    try {
      const { data, error } = await supabase
        .from("bouquets")
        .insert([
          {
            short_id: short_id,
            mode: bouquet.mode,
            flowers: bouquet.flowers,
            letter: bouquet.letter,
            timestamp: bouquet.timestamp,
            greenery: bouquet.greenery,
            flowerOrder: bouquet.flowerOrder,
          },
        ])
        .select(); // returns inserted row(s)

      if (error) {
        console.error("Error creating bouquet:", error);
        alert("Failed to create bouquet. Please try again.");
        return;
      }

      if (!data || data.length === 0) {
        console.error("No data returned from insert");
        alert("Failed to create bouquet. Please try again.");
        return;
      }

      // Use the short_id we generated for the URL
      router.push(`/bouquet/${short_id}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-md uppercase text-center mb-10">SEND THE BOUQUET</h2>

      <Bouquet bouquet={bouquet} />
      <button
        onClick={() => {
          console.log("Sending bouquet");
          handleCreateBouquet(bouquet);
        }}
        disabled={isCreating}
        className={`uppercase text-white px-5 py-3 ${
          isCreating 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {isCreating ? "CREATING..." : "CREATE SHAREABLE LINK"}
      </button>
    </div>
  );
}
