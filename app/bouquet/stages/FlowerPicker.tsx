"use client";

import { useState } from "react";
import Image from "next/image";
import { flowers } from "../../data/data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Type the flowers data from the imported data file
// This ensures type safety when working with flower objects
const flowersData = flowers as Array<{
  id: number;
  name: string;
  meaning: string;
  birthMonth: string;
  size: "small" | "medium" | "large";
  color?: string;
}>;

export default function FlowerPicker({
  bouquet,
  setBouquet,
}: {
  // Simplified bouquet state - just flower IDs and counts
  bouquet: {
    flowers: Array<{
      id: number;
      count: number;
    }>;
    letter: {
      sender: string;
      recipient: string;
      message: string;
    };
    greenery: number;
    timestamp: number;
    mode: string;
    flowerOrder: number[];
  };
  // Function to update the bouquet state
  setBouquet: React.Dispatch<
    React.SetStateAction<{
      flowers: Array<{ id: number; count: number }>;
      greenery: number;
      timestamp: number;
      mode: string;
      flowerOrder: number[];
      letter: {
        sender: string;
        recipient: string;
        message: string;
      };
    }>
  >;
}) {
  // Convert bouquet flowers array to a map for easier counting and display
  // This creates a lookup table: flowerId -> count
  const selectedFlowersMap: Record<number, number> = {};
  bouquet.flowers.forEach((flower) => {
    selectedFlowersMap[flower.id] = flower.count;
  });

  // Calculate total number of flowers in the bouquet
  const totalFlowers = Object.values(selectedFlowersMap).reduce(
    (sum, count) => sum + count,
    0
  );

  // Helper function to generate default flower order
  const generateDefaultFlowerOrder = (
    flowers: Array<{ id: number; count: number }>
  ) => {
    const totalFlowers = flowers.reduce((sum, flower) => sum + flower.count, 0);
    return Array.from({ length: totalFlowers }, (_, i) => i);
  };

  // Function to add a flower to the bouquet
  const addFlower = (flower: {
    id: number;
    name: string;
    meaning: string;
    birthMonth: string;
    size: "small" | "medium" | "large";
    color?: string;
  }) => {
    // Update bouquet state
    setBouquet((prev) => {
      // Check if this flower type already exists in the bouquet
      const existingFlower = prev.flowers.find((f) => f.id === flower.id);
      let newFlowers;

      if (existingFlower) {
        // If flower exists, increase its count
        newFlowers = prev.flowers.map((f) =>
          f.id === flower.id ? { ...f, count: f.count + 1 } : f
        );
      } else {
        // If flower doesn't exist, add it with count 1
        newFlowers = [...prev.flowers, { id: flower.id, count: 1 }];
      }

      // Generate new flower order for the updated flowers
      const newFlowerOrder = generateDefaultFlowerOrder(newFlowers);

      return {
        ...prev,
        flowers: newFlowers,
        flowerOrder: newFlowerOrder,
      };
    });
  };

  // Function to remove a flower from the bouquet
  const removeFlower = (flowerId: number) => {
    setBouquet((prev) => {
      // Find the flower to remove
      const existingFlower = prev.flowers.find((f) => f.id === flowerId);
      if (!existingFlower) return prev; // If flower doesn't exist, do nothing

      let newFlowers;
      if (existingFlower.count <= 1) {
        // If count is 1 or less, remove the flower entirely
        newFlowers = prev.flowers.filter((f) => f.id !== flowerId);
      } else {
        // If count is more than 1, decrease the count
        newFlowers = prev.flowers.map((f) =>
          f.id === flowerId ? { ...f, count: f.count - 1 } : f
        );
      }

      // Generate new flower order for the updated flowers
      const newFlowerOrder = generateDefaultFlowerOrder(newFlowers);

      return {
        ...prev,
        flowers: newFlowers,
        flowerOrder: newFlowerOrder,
      };
    });
  };

  return (
    <TooltipProvider disableHoverableContent delayDuration={0}>
      <div className="h-full text-center dfont-crimson">
        {/* Page title */}
        <h2 className="mb-4 uppercase text-md">Pick 6 to 10 BLOOMS</h2>

        {/* Help text - only show if flowers are selected */}
        {totalFlowers > 0 && (
          <p className="mb-8 text-sm opacity-50">
            Click on a flower's name to deselect it.
          </p>
        )}

        {/* Grid of available flowers */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 items-center min-h-[200px]">
          {flowersData.map((flower) => (
            <Tooltip key={flower.id}>
              <TooltipTrigger asChild>
                <button
                  className="flex relative flex-col items-center cursor-pointer"
                  onClick={(event) => {
                    event.preventDefault();
                    addFlower(flower);
                  }} // Add flower on click
                >
                  {/* Flower image container with dynamic sizing based on flower size */}
                  <div
                    className={`${
                      flower.size === "small"
                        ? "w-32 h-32"
                        : flower.size === "large"
                        ? "w-48 h-48"
                        : "w-40 h-40"
                    } flex items-center justify-center transition-transform duration-300 overflow-hidden ${
                      // Add selection effect
                      selectedFlowersMap[flower.id]
                        ? "transform -translate-y-2"
                        : ""
                    } hover:transform hover:-translate-y-2`}
                  >
                    {/* Flower image */}

                    <Image
                      src={
                        "/" + bouquet.mode + "/flowers/" + flower.name + ".png"
                      }
                      alt={flower.name}
                      width={
                        flower.size === "small"
                          ? 128
                          : flower.size === "large"
                          ? 192
                          : 160
                      }
                      height={
                        flower.size === "small"
                          ? 128
                          : flower.size === "large"
                          ? 192
                          : 160
                      }
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Count badge - shows how many of this flower are selected */}
                  {selectedFlowersMap[flower.id] && (
                    <div className="flex absolute top-0 right-0 justify-center items-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground sm:w-6 sm:h-6">
                      {selectedFlowersMap[flower.id]}
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                onPointerDownOutside={(e) => e.preventDefault()}
                side="bottom"
                sideOffset={8}
                className="z-10 p-2 w-40 rounded border shadow-lg bg-background border-primary sm:w-48"
              >
                <h3 className="font-bold uppercase text-md">{flower.name}</h3>
                <p className="text-sm">{flower.meaning}</p>
                <p className="text-sm">Birth Month: {flower.birthMonth}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Selected flowers summary */}
        <div className="mt-4">
          {/* List of selected flowers with counts - clickable to remove */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {Object.entries(selectedFlowersMap).map(([id, count]) => {
              const flower = flowersData.find(
                (f) => f.id === Number.parseInt(id)
              );
              if (!flower) return null;
              return (
                <div
                  key={id}
                  className="px-3 py-1 text-sm rounded-full border transition-colors cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => removeFlower(Number.parseInt(id))} // Remove flower on click
                >
                  {flower.name.toUpperCase()} x{count}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
