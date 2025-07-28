"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"

interface Flower {
  name: string
  image: string
  count: number
  size: "small" | "medium" | "large"
  color?: string
}

interface Bouquet {
  flowers: Flower[]
}

interface BouquetCustomizerProps {
  bouquet: Bouquet
  setBouquet: (bouquet: Bouquet | ((prev: Bouquet) => Bouquet)) => void
}

const flowerColors = [
  { 
    name: "Pink", 
    value: "pink", 
    gradient: "radial-gradient(circle, rgba(244, 114, 182, 0.9) 0%, rgba(244, 114, 182, 0.3) 30%, rgba(244, 114, 182, 0) 60%)"
  },
  { 
    name: "Purple", 
    value: "purple", 
    gradient: "radial-gradient(circle, rgba(168, 85, 167, 0.8) 0%, rgba(168, 85, 247, 0.3) 30%, rgba(168, 85, 247, 0) 60%)"
  },
  { 
    name: "Blue", 
    value: "blue", 
    gradient: "radial-gradient(circle, rgba(126, 165, 250, 0.9) 0%, rgba(96, 165, 250, 0.3) 30%, rgba(96, 165, 250, 0) 60%)"
  },
  { 
    name: "Light Blue", 
    value: "light-blue", 
    gradient: "radial-gradient(circle, rgba(147, 197, 253, 0.9) 0%, rgba(147, 197, 253, 0.3) 30%, rgba(147, 197, 253, 0) 60%)"
  },
  { 
    name: "Peach", 
    value: "peach", 
    gradient: "radial-gradient(circle, rgba(255, 182, 193, 0.9) 0%, rgba(255, 182, 193, 0.3) 30%, rgba(255, 182, 193, 0) 60%)"
  },
  { 
    name: "Cream", 
    value: "cream", 
    gradient: "radial-gradient(circle, rgba(255, 248, 220, 0.9) 0%, rgba(255, 248, 220, 0.3) 30%, rgba(255, 248, 220, 0) 60%)"
  },
  { 
    name: "Yellow", 
    value: "yellow", 
    gradient: "radial-gradient(circle, rgba(234, 179, 8, 0.9) 0%, rgba(234, 179, 8, 0.3) 30%, rgba(234, 179, 8, 0) 60%)"
  },
  { 
    name: "Red", 
    value: "red", 
    gradient: "radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(239, 68, 68, 0.3) 30%, rgba(239, 68, 68, 0) 60%)"
  },
]

export default function BouquetCustomizer({ bouquet, setBouquet }: BouquetCustomizerProps) {
  const [flowerOrder, setFlowerOrder] = useState<number[]>([])
  const [selectedFlowerIndex, setSelectedFlowerIndex] = useState<number | null>(null)

  // Initialize flowers with random colors if they don't have one
  const initializeFlowersWithRandomColors = () => {
    const updatedFlowers = bouquet.flowers.map(flower => ({
      ...flower,
      color: flower.color || flowerColors[Math.floor(Math.random() * flowerColors.length)].value
    }))
    setBouquet(prev => ({ ...prev, flowers: updatedFlowers }))
  }

  // Initialize random colors on first render
  useEffect(() => {
    if (bouquet.flowers.some(flower => !flower.color)) {
      initializeFlowersWithRandomColors()
    }
  }, [])

  const randomizeFlowers = () => {
    const totalFlowers = bouquet.flowers.reduce((sum, flower) => sum + flower.count, 0)
    const indices = Array.from({ length: totalFlowers }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    setFlowerOrder(indices)
  }

  const updateFlowerColor = (color: string) => {
    if (selectedFlowerIndex !== null) {
      setBouquet((prev) => ({
        ...prev,
        flowers: prev.flowers.map((flower, index) => 
          index === selectedFlowerIndex 
            ? { ...flower, color } 
            : flower
        )
      }))
    }
  }

  const getFlowerPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI
    const radius = 120
    const x = Math.cos(angle) * radius + 150
    const y = Math.sin(angle) * radius + 150
    return `translate(${x}px, ${y}px) translate(-50%, -50%)`
  }

  const getSelectedFlower = () => {
    if (selectedFlowerIndex === null) return null
    return bouquet.flowers[selectedFlowerIndex]
  }

  const selectedFlower = getSelectedFlower()

  const getFlowerDimensions = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small": return 80
      case "large": return 160
      default: return 120
    }
  }

  return (
    <div className="grid grid-cols-3 h-full border border-primary">
      <div className="col-span-1 p-6 border-r border-primary">
        <h2 className="text-md uppercase mb-6 ">Customize Your Bouquet</h2>
        <div className="space-y-8">
          <Button 
            onClick={randomizeFlowers}
            className="w-full "
            variant="outline"
          >
            Randomize Arrangement
          </Button>

          {selectedFlower && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold  mb-2">Selected Flower</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ 
                      background: flowerColors.find(c => c.value === selectedFlower.color)?.gradient || flowerColors[0].gradient 
                    }}
                  ></div>
                  <span className="">{selectedFlower.name}</span>
                </div>
              </div>
              
              <div>
                <Label className="block mb-2 ">Flower Color</Label>
                <RadioGroup
                  value={selectedFlower.color || "pink"}
                  onValueChange={updateFlowerColor}
                  className="grid grid-cols-2 gap-2"
                >
                  {flowerColors.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.value} id={`color-${color.value}`} />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ background: color.gradient }}
                      ></div>
                      <Label htmlFor={`color-${color.value}`} className="text-sm ">
                        {color.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {!selectedFlower && (
            <div className="text-center text-gray-500 ">
              Click on a flower to customize its color
            </div>
          )}
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <div className="relative w-[400px]">
          <div className="flex flex-wrap justify-center items-center w-full -space-x-4 -space-y-20">
            {bouquet.flowers.flatMap((flower: Flower, flowerIndex: number) =>
              Array(flower.count)
                .fill(null)
                .map((_, instanceIndex) => {
                  const rotation = Math.random() * 10 - 5;
                  const index = flowerOrder.length ? 
                    flowerOrder[flowerIndex * flower.count + instanceIndex] ?? 
                    (flowerIndex * flower.count + instanceIndex) : 
                    (flowerIndex * flower.count + instanceIndex);
                  
                  const flowerColor = flower.color || "pink";
                  const colorConfig = flowerColors.find(c => c.value === flowerColor) || flowerColors[0];
                  const dimensions = getFlowerDimensions(flower.size);
                  
                  return (
                    <div
                      key={`${flowerIndex}-${instanceIndex}`}
                      className="flex items-center justify-center pt-4 relative"
                      style={{ order: index }}
                      onClick={() => setSelectedFlowerIndex(flowerIndex)}
                    >
                      {/* Colored background div with radial gradient */}
                      <div 
                        className="absolute rounded-full z-0"
                        style={{ 
                          width: `${dimensions}px`,
                          height: `${dimensions}px`,
                          background: colorConfig.gradient
                        }}
                      />
                      
                      {/* Flower image positioned above the colored div */}
                      <Image
                        src={flower.image}
                        alt={flower.name}
                        width={dimensions}
                        height={dimensions}
                        className="relative z-10 cursor-pointer transition-transform hover:scale-105"
                        style={{ transform: `rotate(${rotation}deg)` }}
                        priority
                      />
                    </div>
                  )
                })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

