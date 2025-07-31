export default function CardWriter({
  bouquet,
  setBouquet,
}: {
  bouquet: {
    flowers: any[];
    sender?: string;
    recipient?: string;
    message?: string;
  };
  setBouquet: (
    bouquet:
      | {
          flowers: any[];
          sender?: string;
          recipient?: string;
          message?: string;
        }
      | ((prev: {
          flowers: any[];
          sender?: string;
          recipient?: string;
          message?: string;
        }) => {
          flowers: any[];
          sender?: string;
          recipient?: string;
          message?: string;
        })
  ) => void;
}) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Write Your Card</h2>

      {/* White card container with black border */}
      <div className="bg-white border-2 border-black p-8 max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex flex-row items-left justify-left gap-2">
            <label htmlFor="recipient">Dear </label>
            <input
              id="recipient"
              value={bouquet.recipient || ""}
              onChange={(e) =>
                setBouquet((prev) => ({ ...prev, recipient: e.target.value }))
              }
              placeholder="Someone,"
              className="border-none bg-transparent focus:outline-none focus:ring-0"
            />{" "}
          </div>
          <div>
            <textarea
              id="message"
              value={bouquet.message || ""}
              onChange={(e) =>
                setBouquet((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="I have so much to tell you, but only this much space on this card! Still, you must know..."
              rows={5}
              className="w-full border-none bg-transparent focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex flex-col items-right justify-end gap-2">
            <label htmlFor="sender" className="text-right">
              Sincerely,
            </label>
            <input
              id="sender"
              value={bouquet.sender || ""}
              onChange={(e) =>
                setBouquet((prev) => ({ ...prev, sender: e.target.value }))
              }
              placeholder="Secret Admirer"
              className="border-none bg-transparent text-right focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
