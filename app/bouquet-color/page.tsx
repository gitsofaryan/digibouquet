
"use client"

import { useState } from "react"
import FlowerPicker from "./components/FlowerPicker"
import BouquetCustomizer from "./components/BouquetCustomizer"
import CardWriter from "./components/CardWriter"
import ShareBouquet from "./components/ShareBouquet"
import Image from "next/image"

interface Bouquet {
  flowers: any[]
}

const steps = ["Pick Flowers", "Customize Bouquet", "Write Card", "Share"]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [bouquet, setBouquet] = useState<Bouquet>({
    flowers: [],
  })

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <main className="container mx-auto p-4 min-h-screen flex flex-col">
      <Image
        src="/new-digibouquet.png"
        alt="digibouquet"
        width={200}
        height={80}
        className="object-cover mx-auto mt-6"
        priority
      />
      <div className="flex-grow py-8">
        {currentStep === 0 && <FlowerPicker bouquet={bouquet} setBouquet={setBouquet} />}
        {currentStep === 1 && <BouquetCustomizer bouquet={bouquet} setBouquet={setBouquet} />}
        {currentStep === 2 && <CardWriter bouquet={bouquet} setBouquet={setBouquet} />}
        {currentStep === 3 && <ShareBouquet bouquet={bouquet} />}
      </div>
      <div className="m-auto flex flex-row justify-center gap-4">
        {currentStep > 0 && (
          <button onClick={prevStep} className="text-sm px-4 py-2 border border-[#000000]">
            BACK
          </button>
        )}
        {currentStep < steps.length - 1 && (
          <button onClick={nextStep} className="text-sm px-4 py-2 bg-[#000000] text-[#F5F5DC] ml-auto">
            NEXT
          </button>
        )}
      </div>
    </main>
  )
}

