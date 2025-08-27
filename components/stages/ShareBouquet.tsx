import Image from "next/image";
import { flowers } from "../../data/data";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import Bouquet from "../bouquet/Bouquet";
import ShareButton from "../ui/ShareButton";
import { useBouquet } from "../../context/BouquetContext";
import type { Bouquet as BouquetType } from "@/types/bouquet";
import { useState } from "react";

export default function ShareBouquet() {
  const { bouquet } = useBouquet();
  const [isCreating, setIsCreating] = useState(false);
  const [createdBouquetId, setCreatedBouquetId] = useState<string | null>(null);
  
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
      console.log("Creating bouquet with data:", {
        short_id,
        mode: bouquet.mode,
        flowers: bouquet.flowers,
        letter: bouquet.letter,
        timestamp: new Date(bouquet.timestamp).toISOString(),
        greenery: bouquet.greenery,
        flower_order: bouquet.flowerOrder,
      });

      const { data, error } = await supabase
        .from("bouquets")
        .insert([
          {
            short_id: short_id,
            mode: bouquet.mode,
            flowers: bouquet.flowers,
            letter: bouquet.letter,
            timestamp: new Date(bouquet.timestamp).toISOString(),
            greenery: bouquet.greenery,
            flower_order: bouquet.flowerOrder,
          },
        ])
        .select(); // returns inserted row(s)

      if (error) {
        console.error("Supabase error details:", error);
        alert(`Failed to create bouquet: ${error.message || 'Unknown error'}`);
        return;
      }

      if (!data || data.length === 0) {
        console.error("No data returned from insert");
        alert("Failed to create bouquet. Please try again.");
        return;
      }

      console.log("Bouquet created successfully:", data[0]);
      
      // Set the created bouquet ID to show share options
      setCreatedBouquetId(short_id);
      
      // Optionally redirect after a delay
      setTimeout(() => {
        router.push(`/bouquet/${short_id}`);
      }, 5000); // 5 second delay to allow sharing
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // If bouquet was created, show share options
  if (createdBouquetId) {
    const shareUrl = `https://bouquit.vercel.app/bouquet/${createdBouquetId}`;
    const shareTitle = `Check out this beautiful bouquet from ${bouquet.letter?.sender || 'someone special'}!`;
    const shareDescription = bouquet.letter?.message || "I made this digital bouquet for you";

    return (
      <div className="text-center">
        <h2 className="text-md uppercase text-center mb-6">BOUQUET CREATED! 🎉</h2>
        <p className="text-sm text-gray-600 mb-8">Share your beautiful bouquet with others</p>
        
        <Bouquet bouquet={bouquet} />
        
        <div className="mt-8 space-y-4">
          <ShareButton 
            url={shareUrl}
            title={shareTitle}
            description={shareDescription}
          />
          
          <div className="text-sm text-gray-500">
            <p>You'll be redirected to your bouquet in a few seconds...</p>
            <button 
              onClick={() => router.push(`/bouquet/${createdBouquetId}`)}
              className="text-blue-500 underline"
            >
              Or click here to view now
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        className={`uppercase text-white px-5 py-3 ${isCreating
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-black hover:bg-gray-800"
          }`}
      >
        {isCreating ? "CREATING..." : "CREATE SHAREABLE LINK"}
      </button>
    </div>
  );
}
