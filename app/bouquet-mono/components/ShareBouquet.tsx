"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Bouquet {
  flowers: any[]
}

interface ShareBouquetProps {
  bouquet: Bouquet
}

export default function ShareBouquet({ bouquet }: ShareBouquetProps) {
  const [shareLink, setShareLink] = useState("")

  const generateShareLink = async () => {
    const response = await fetch("/api/create-share-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bouquet),
    })
    const data = await response.json()
    setShareLink(data.shareLink)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Share Your Bouquet</h2>
      <Button onClick={generateShareLink}>Generate Share Link</Button>
      {shareLink && (
        <div className="mt-4">
          <Input value={shareLink} readOnly />
          <p className="mt-2 text-sm text-gray-500">Copy this link and share it with your Valentine!</p>
        </div>
      )}
    </div>
  )
}

