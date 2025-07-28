import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CardWriter({ bouquet, setBouquet }) {
  return (
    <div className="max-w-md uppercase border border-primary p-10 mx-auto">
      <h2 className="text-lg mb-4 ">Write Your Card</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="sender" className="">From</Label>
          <Input
            id="sender"
            value={bouquet.sender}
            onChange={(e) => setBouquet((prev) => ({ ...prev, sender: e.target.value }))}
            placeholder="Your name"
          />
        </div>
        <div>
          <Label htmlFor="recipient" className="">To</Label>
          <Input
            id="recipient"
            value={bouquet.recipient}
            onChange={(e) => setBouquet((prev) => ({ ...prev, recipient: e.target.value }))}
            placeholder="Recipient's name"
          />
        </div>
        <div>
          <Label htmlFor="message" className="">Message</Label>
          <Textarea
            id="message"
            value={bouquet.message}
            onChange={(e) => setBouquet((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Write your message here..."
            rows={5}
          />
        </div>
      </div>
    </div>
  )
}

