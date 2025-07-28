import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CardWriter({ bouquet, setBouquet }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 italic">Write Your Card</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="sender" className="italic">From</Label>
          <Input
            id="sender"
            value={bouquet.sender}
            onChange={(e) => setBouquet((prev) => ({ ...prev, sender: e.target.value }))}
            placeholder="Your name"
            className="font-crimson italic"
          />
        </div>
        <div>
          <Label htmlFor="recipient" className="italic">To</Label>
          <Input
            id="recipient"
            value={bouquet.recipient}
            onChange={(e) => setBouquet((prev) => ({ ...prev, recipient: e.target.value }))}
            placeholder="Recipient's name"
            className="font-crimson italic"
          />
        </div>
        <div>
          <Label htmlFor="message" className="italic">Message</Label>
          <Textarea
            id="message"
            value={bouquet.message}
            onChange={(e) => setBouquet((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Write your message here..."
            rows={5}
            className="font-crimson italic"
          />
        </div>
      </div>
    </div>
  )
}

