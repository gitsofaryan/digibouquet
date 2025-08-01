"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Image from "next/image";
import { flowers } from "../../data/data";

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
  mode,
}: {
  // Bouquet state - contains all selected flowers with their counts
  bouquet: {
    flowers: Array<{
      id: number;
      name: string;
      meaning: string;
      birthMonth: string;
      size: "small" | "medium" | "large";
      color?: string;
      count: number;
    }>;
  };
  // Function to update the bouquet state
  setBouquet: (
    bouquet:
      | {
          flowers: Array<{
            id: number;
            name: string;
            meaning: string;
            birthMonth: string;
            size: "small" | "medium" | "large";
            color?: string;
            count: number;
          }>;
        }
      | ((prev: {
          flowers: Array<{
            id: number;
            name: string;
            meaning: string;
            birthMonth: string;
            size: "small" | "medium" | "large";
            color?: string;
            count: number;
          }>;
        }) => {
          flowers: Array<{
            id: number;
            name: string;
            meaning: string;
            birthMonth: string;
            size: "small" | "medium" | "large";
            color?: string;
            count: number;
          }>;
        })
  ) => void;
  // Mode parameter - can be "mono" or "full" for different styling/behavior
  mode: string;
}) {
  // Track which flower is currently being hovered over for tooltip display
  const [hoveredFlower, setHoveredFlower] = useState<{
    id: number;
    name: string;
    meaning: string;
    birthMonth: string;
    size: "small" | "medium" | "large";
    color?: string;
  } | null>(null);

  // Convert bouquet flowers array to a map for easier counting and display
  // This creates a lookup table: flowerId -> count
  const selectedFlowersMap: Record<number, number> = {};
  bouquet.flowers.forEach((flower) => {
    selectedFlowersMap[flower.id] =
      (selectedFlowersMap[flower.id] || 0) + flower.count;
  });

  // Calculate total number of flowers in the bouquet
  const totalFlowers = Object.values(selectedFlowersMap).reduce(
    (sum, count) => sum + count,
    0
  );

  // Function to add a flower to the bouquet
  const addFlower = (flower: {
    id: number;
    name: string;
    meaning: string;
    birthMonth: string;
    size: "small" | "medium" | "large";
    color?: string;
  }) => {
    // Check if bouquet already has maximum flowers (10)
    if (totalFlowers >= 10) {
      toast({
        title: "Too many flowers!",
        description: "Your bouquet can have a maximum of 10 flowers.",
        action: <ToastAction altText="OK">OK</ToastAction>,
      });
      return;
    }

    // Update bouquet state
    setBouquet((prev) => {
      // Check if this flower type already exists in the bouquet
      const existingFlower = prev.flowers.find((f) => f.id === flower.id);
      if (existingFlower) {
        // If flower exists, increase its count
        return {
          ...prev,
          flowers: prev.flowers.map((f) =>
            f.id === flower.id ? { ...f, count: f.count + 1 } : f
          ),
        };
      } else {
        // If flower doesn't exist, add it with count 1
        return {
          ...prev,
          flowers: [...prev.flowers, { ...flower, count: 1 }],
        };
      }
    });
  };

  // Function to remove a flower from the bouquet
  const removeFlower = (flowerId: number) => {
    setBouquet((prev) => {
      // Find the flower to remove
      const existingFlower = prev.flowers.find((f) => f.id === flowerId);
      if (!existingFlower) return prev; // If flower doesn't exist, do nothing

      if (existingFlower.count <= 1) {
        // If count is 1 or less, remove the flower entirely
        return {
          ...prev,
          flowers: prev.flowers.filter((f) => f.id !== flowerId),
        };
      } else {
        // If count is more than 1, decrease the count
        return {
          ...prev,
          flowers: prev.flowers.map((f) =>
            f.id === flowerId ? { ...f, count: f.count - 1 } : f
          ),
        };
      }
    });
  };

  return (
    <div className="text-center  dfont-crimson h-full">
      {/* Page title */}
      <h2 className="text-md uppercase mb-4 ">Pick SOME Flowers</h2>

      {/* Grid of available flowers */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 items-center min-h-[200px]">
        {flowersData.map((flower) => (
          <div
            key={flower.id}
            className="relative cursor-pointer flex flex-col items-center"
            onMouseEnter={() => setHoveredFlower(flower)} // Show tooltip on hover
            onMouseLeave={() => setHoveredFlower(null)} // Hide tooltip on leave
            onClick={() => addFlower(flower)} // Add flower on click
          >
            {/* Flower image container with dynamic sizing based on flower size */}
            <div
              className={`${
                mode === "full"
                  ? "w-[150px] h-[258px]"
                  : flower.size === "small"
                  ? "w-32 h-32"
                  : flower.size === "large"
                  ? "w-48 h-48"
                  : "w-40 h-40"
              } flex items-center justify-center transition-transform duration-300 overflow-hidden ${
                // Add hover/selection effect
                hoveredFlower === flower || selectedFlowersMap[flower.id]
                  ? "transform -translate-y-2"
                  : ""
              }`}
            >
              {/* Flower image */}
              <Image
                src={"/" + mode + "/flowers/" + flower.name + ".png"}
                alt={flower.name}
                width={
                  mode === "full"
                    ? 500
                    : flower.size === "small"
                    ? 128
                    : flower.size === "large"
                    ? 192
                    : 160
                }
                height={
                  mode === "full"
                    ? 850
                    : flower.size === "small"
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
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs ">
                {selectedFlowersMap[flower.id]}
              </div>
            )}

            {/* Tooltip - shows flower details on hover */}
            {hoveredFlower === flower && (
              <div className="absolute top-full mt-2 bg-background border border-primary p-2 rounded shadow-lg z-10 w-40 sm:w-48">
                <h3 className="text-md font-bold ">
                  {flower.name.toUpperCase()}
                </h3>
                <p className="text-sm ">{flower.meaning}</p>
                <p className="text-sm ">Birth Month: {flower.birthMonth}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected flowers summary */}
      <div className="mt-4">
        {/* List of selected flowers with counts - clickable to remove */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {Object.entries(selectedFlowersMap).map(([id, count]) => {
            const flower = flowersData.find(
              (f) => f.id === Number.parseInt(id)
            );
            if (!flower) return null;
            return (
              <div
                key={id}
                className="border border-primary rounded text-primary rounded-full px-3 py-1 text-sm  cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => removeFlower(Number.parseInt(id))} // Remove flower on click
              >
                {flower.name.toUpperCase()} x{count}
              </div>
            );
          })}
        </div>

        {/* Help text - only show if flowers are selected */}
        {totalFlowers > 0 && (
          <p className="text-sm opacity-50 mt-6">
            Pick 5 to 10 blooms. Click on a flower's name to deselect it.
          </p>
        )}
      </div>
    </div>
  );
}
