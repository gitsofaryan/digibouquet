import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-mono uppercase p-4">
      <div className="text-center max-w-2xl p-20 mx-auto">
        <Image
          src="color/flowers/peony.png"
          alt="anemone flower"
          width={100}
          height={100}
          className="object-cover mx-auto mb-6"
          priority
        />
        <Image
          src="digibouquet.png"
          alt="digibouquet"
          width={600}
          height={400}
          className="object-cover mx-auto"
          priority
        />
        <p className="text-sm mb-8">beautiful flowers delivered digitally</p>
        <div className="flex flex-col items-center justify-center">
          <Link
            href="/bouquet?mode=color"
            className="text-sm px-8 py-4 bg-[#000000] text-[#F5F5DC] hover:bg-[#0A0000]/90 m-2"
          >
            FULL BLOOM
          </Link>

          <Link
            href="/bouquet?mode=mono"
            className="text-sm px-8 py-4 border border-black text-[#000000] hover:bg-[#F5F5AC]/90 m-2"
          >
            MONO
          </Link>
        </div>
      </div>
    </div>
  );
}
