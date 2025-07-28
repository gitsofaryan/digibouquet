"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Image from "next/image"

interface Flower {
  id: number
  name: string
  meaning: string
  birthMonth: string
  image: string
  size: "small" | "medium" | "large"
}

interface BouquetFlower extends Flower {
  count: number
}

interface Bouquet {
  flowers: BouquetFlower[]
}

interface FlowerPickerProps {
  bouquet: Bouquet
  setBouquet: (bouquet: Bouquet | ((prev: Bouquet) => Bouquet)) => void
}

const flowers: Flower[] = [
  { id: 1, name: "ORCHID", meaning: "Beauty", birthMonth: "October", image: "/flowers-full/orchid.png", size: "medium" },
  { id: 2, name: "TULIP", meaning: "Perfect love", birthMonth: "April", image: "/flowers-full/tulip.png", size: "medium" },
  { id: 3, name: "DAHLIA", meaning: "Elegance", birthMonth: "August", image: "/flowers-full/chrysanthemum.png", size: "small" },
  { id: 4, name: "ANEMONE", meaning: "Anticipation", birthMonth: "September", image: "/flowers-full/anemone.png", size: "medium" },
  { id: 5, name: "CARNATION", meaning: "Fascination", birthMonth: "January", image: "/flowers-full/carnation.png", size: "large" },
  { id: 6, name: "ZINNIA", meaning: "Lasting Affection", birthMonth: "July", image: "/flowers-full/zinnia.png", size: "medium" },
  { id: 7, name: "RANUNCULUS", meaning: "Radiant Charm", birthMonth: "March", image: "/flowers-full/ranunculus.png", size: "medium" },
  { id: 8, name: "SUNFLOWER", meaning: "Adoration", birthMonth: "August", image: "/flowers-full/sunflower.png", size: "large" },
  { id: 9, name: "LILY", meaning: "Purity", birthMonth: "May", image: "/flowers-full/lily.png", size: "large" },
  { id: 10, name: "DAISY", meaning: "Innocence", birthMonth: "April", image: "/flowers-full/daisy.png", size: "small" },
  { id: 11, name: "PEONY", meaning: "Romance", birthMonth: "May", image: "/flowers-full/peony.png", size: "medium" },
  { id: 12, name: "ROSE", meaning: "Love and passion", birthMonth: "June", image: "/flowers-full/rose.png", size: "medium" },
]

export default function FlowerPicker({ bouquet, setBouquet }: FlowerPickerProps) {
  const [hoveredFlower, setHoveredFlower] = useState<Flower | null>(null)

  // Convert bouquet flowers to a map for easier counting
  const selectedFlowersMap: Record<number, number> = {}
  bouquet.flowers.forEach(flower => {
    selectedFlowersMap[flower.id] = (selectedFlowersMap[flower.id] || 0) + flower.count
  })

  const totalFlowers = Object.values(selectedFlowersMap).reduce((sum, count) => sum + count, 0)

  const addFlower = (flower: Flower) => {
    if (totalFlowers >= 10) {
      toast({
        title: "Too many flowers!",
        description: "Your bouquet can have a maximum of 10 flowers.",
        action: <ToastAction altText="OK">OK</ToastAction>,
      })
      return
    }

    setBouquet((prev) => {
      const existingFlower = prev.flowers.find(f => f.id === flower.id)
      if (existingFlower) {
        // Update count of existing flower
        return {
          ...prev,
          flowers: prev.flowers.map(f => 
            f.id === flower.id 
              ? { ...f, count: f.count + 1 }
              : f
          )
        }
      } else {
        // Add new flower
        return {
          ...prev,
          flowers: [...prev.flowers, { ...flower, count: 1 }]
        }
      }
    })
  }

  const removeFlower = (flowerId: number) => {
    setBouquet((prev) => {
      const existingFlower = prev.flowers.find(f => f.id === flowerId)
      if (!existingFlower) return prev

      if (existingFlower.count <= 1) {
        // Remove flower entirely
        return {
          ...prev,
          flowers: prev.flowers.filter(f => f.id !== flowerId)
        }
      } else {
        // Decrease count
        return {
          ...prev,
          flowers: prev.flowers.map(f => 
            f.id === flowerId 
              ? { ...f, count: f.count - 1 }
              : f
          )
        }
      }
    })
  }

  return (
    <div className="text-center font-crimson">
      <h2 className="text-md uppercase mb-4 ">Pick Your Flowers</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-8 items-center min-h-[200px]">
        {flowers.map((flower) => (
          <div
            key={flower.id}
            className="relative cursor-pointer flex flex-col items-center"
            onMouseEnter={() => setHoveredFlower(flower)}
            onMouseLeave={() => setHoveredFlower(null)}
            onClick={() => addFlower(flower)}
          >
            <div
              className={`${
                "w-36 h-64"
              } flex items-center justify-center transition-transform duration-300 overflow-hidden ${
                hoveredFlower === flower || selectedFlowersMap[flower.id] ? "transform -translate-y-2" : ""
              }`}
            >
              <Image
                src={flower.image}
                alt={flower.name}
                width={flower.size === "small" ? 128 : flower.size === "large" ? 192 : 160}
                height={flower.size === "small" ? 128 : flower.size === "large" ? 192 : 160}
                className="object-cover"
                priority
              />
            </div>
            {selectedFlowersMap[flower.id] && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs ">
                {selectedFlowersMap[flower.id]}
              </div>
            )}
            {hoveredFlower === flower && (
              <div className="absolute top-full mt-2 bg-background border border-primary p-2 rounded shadow-lg z-10 w-40 sm:w-48">
                <h3 className="text-md font-bold ">{flower.name}</h3>
                <p className="text-sm ">{flower.meaning}</p>
                <p className="text-sm ">Birth Month: {flower.birthMonth}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
      <h3 className="text-md uppercase mb-6 ">Your Bouquet: {totalFlowers} BLOOMS</h3>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          
          {Object.entries(selectedFlowersMap).map(([id, count]) => {
            const flower = flowers.find((f) => f.id === Number.parseInt(id))
            if (!flower) return null
            return (
              <div
                key={id}
                className="border border-primary rounded text-primary rounded-full px-3 py-1 text-sm  cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => removeFlower(Number.parseInt(id))}
              >
                {flower.name} x{count}
              </div>
            )
          })}
        </div>
        {totalFlowers > 0 && (
          <p className="text-sm opacity-50 mt-6">We suggest 5 or 7 flowers, and at most 10. <br></br>Click on a flower name to deselect it.</p>
        )}
      </div>
    </div>
  )
}

