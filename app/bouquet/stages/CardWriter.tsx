export default function CardWriter({
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
    flowerOrder?: number[];
  };
  // Function to update the bouquet state
  setBouquet: (
    bouquet:
      | {
          flowers?: Array<{ id: number; count: number }>;
          greenery?: number;
          timestamp?: number;
          mode?: string;
          flowerOrder?: number[];
          letter?: {
            sender?: string;
            recipient?: string;
            message?: string;
          };
        }
      | ((prev: {
          flowers: Array<{ id: number; count: number }>;
          greenery: number;
          timestamp: number;
          mode: string;
          flowerOrder?: number[];
          letter: {
            sender: string;
            recipient: string;
            message: string;
          };
        }) => any)
  ) => void;
}) {
  return (
    <div className="text-center">
      <div>
        <h2 className="text-md mb-8">WRITE THE CARD</h2>

        {/* White card container with black border */}
        <div className="bg-white border-2 border-black p-8 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex flex-row items-left justify-left gap-2">
              <label htmlFor="recipient">Dear </label>
              <input
                id="recipient"
                value={bouquet.letter.recipient || ""}
                onChange={(e) =>
                  setBouquet((prev) => ({
                    ...prev,
                    letter: {
                      ...prev.letter,
                      recipient: e.target.value,
                    },
                  }))
                }
                placeholder="Someone,"
                className="border-none bg-transparent focus:outline-none focus:ring-0"
              />{" "}
            </div>
            <div>
              <textarea
                id="message"
                value={bouquet.letter.message || ""}
                onChange={(e) =>
                  setBouquet((prev) => ({
                    ...prev,
                    letter: {
                      ...prev.letter,
                      message: e.target.value,
                    },
                  }))
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
                value={bouquet.letter.sender || ""}
                onChange={(e) =>
                  setBouquet((prev) => ({
                    ...prev,
                    letter: {
                      ...prev.letter,
                      sender: e.target.value,
                    },
                  }))
                }
                placeholder="Secret Admirer"
                className="border-none bg-transparent text-right focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
