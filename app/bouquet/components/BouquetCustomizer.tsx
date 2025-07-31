"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function BouquetCustomizer({
  bouquet,
  setBouquet,
  mode,
}: {
  // Bouquet state - contains all selected flowers with their counts and properties
  bouquet: {
    flowers: Array<{
      name: string;
      image: string;
      count: number;
      size: "small" | "medium" | "large";
    }>;
  };
  // Function to update the bouquet state
  setBouquet: (
    bouquet:
      | {
          flowers: Array<{
            name: string;
            image: string;
            count: number;
            size: "small" | "medium" | "large";
          }>;
        }
      | ((prev: {
          flowers: Array<{
            name: string;
            image: string;
            count: number;
            size: "small" | "medium" | "large";
          }>;
        }) => {
          flowers: Array<{
            name: string;
            image: string;
            count: number;
            size: "small" | "medium" | "large";
          }>;
        })
  ) => void;
  // Mode parameter - can be "mono" or "full" for different styling/behavior
  mode: string;
}) {
  // Store the randomized order of flowers for visual arrangement
  // This array contains indices that determine the visual order of flowers
  const [flowerOrder, setFlowerOrder] = useState<number[]>([]);

  // Function to randomize the arrangement of flowers
  const randomizeFlowers = () => {
    // Calculate total number of individual flowers (not flower types)
    const totalFlowers = bouquet.flowers.reduce(
      (sum, flower) => sum + flower.count,
      0
    );

    // Create an array of indices from 0 to totalFlowers-1
    const indices = Array.from({ length: totalFlowers }, (_, i) => i);

    // Fisher-Yates shuffle algorithm to randomize the order
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Update the flower order state
    setFlowerOrder(indices);
  };

  // Helper function to get flower dimensions based on size
  const getFlowerDimensions = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return 80;
      case "large":
        return 160;
      default:
        return 120;
    }
  };

  return (
    <div className="flex flex-col max-w-screen-lg mx-auto">
      {/* Left sidebar - contains customization controls */}
      <div className=" p-6">
        <h2 className="text-md uppercase text-center mb-6">
          Customize Your Bouquet
        </h2>
        <div className="space-y-8 flex flex-col items-center justify-center">
          {/* Randomize button - shuffles the flower arrangement */}
          <Button
            onClick={randomizeFlowers}
            className="uppercase"
            variant="default"
          >
            Randomize Arrangement
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center relative py-4 my-16">
        <div className="relative w-[500px] min-h-[420px]">
          {/* Bush background images - positioned absolutely to stay fixed */}
          {/* Bottom bush layer */}
          <Image
            src={`${mode}/bush/bush-1.png`}
            alt="bush background"
            width={500}
            height={500}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 -top-[100px]"
            priority
          />

          {/* Flower container - flowers can move around within this area */}
          <div className="flex flex-wrap w-[300px] justify-center items-center -space-x-4 -space-y-20 relative m-auto">
            {/* Map through each flower type and create individual flower instances */}
            {bouquet.flowers.flatMap(
              (
                flower: {
                  name: string;
                  image: string;
                  count: number;
                  size: "small" | "medium" | "large";
                },
                flowerIndex: number
              ) =>
                // For each flower type, create the specified number of instances
                Array(flower.count)
                  .fill(null)
                  .map((_, instanceIndex) => {
                    // Generate random rotation for each flower (-5 to +5 degrees)
                    const rotation = Math.random() * 10 - 5;

                    // Determine the visual order of this flower instance
                    // If flowerOrder exists, use it; otherwise use default order
                    const index = flowerOrder.length
                      ? flowerOrder[
                          flowerIndex * flower.count + instanceIndex
                        ] ?? flowerIndex * flower.count + instanceIndex
                      : flowerIndex * flower.count + instanceIndex;

                    // Get dimensions based on flower size
                    const dimensions = getFlowerDimensions(flower.size);

                    return (
                      <div
                        key={`${flowerIndex}-${instanceIndex}`}
                        className="flex items-center justify-center pt-4 relative"
                        style={{ order: index }} // CSS order property controls visual arrangement
                      >
                        {/* Individual flower image */}
                        <Image
                          src={`${mode}/flowers/${flower.name}.png`}
                          alt={flower.name}
                          width={dimensions}
                          height={dimensions}
                          className="relative z-10 transition-transform hover:scale-105"
                          style={{ transform: `rotate(${rotation}deg)` }} // Apply random rotation
                          priority
                        />
                      </div>
                    );
                  })
            )}
          </div>

          {/* Top bush layer - positioned above flowers */}
          <Image
            src={`${mode}/bush/bush-1-top.png`}
            alt="bush top"
            width={500}
            height={500}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 -top-[100px]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
