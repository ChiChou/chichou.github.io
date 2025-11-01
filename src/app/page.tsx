import Link from "next/link";
import { addBasePath } from "@/app/lib/env";

export default function Home() {
  return (
    <div className="h-dvh w-screen bg-gray-950">
      <header className="relative flex size-full items-end overflow-hidden">
        <div className="relative z-30 2xl:m-40 max-2xl:m-20 max-xl:m-10  text-shadow-white text-white font-(family-name:--font-bebas-neue)">
          <h1 className="2xl:text-8xl xl:text-6xl max-xl:text-4xl animate-[landing_1s_ease-in-out]">
            CodeColorist
          </h1>
          <p className="2xl:text-6xl xl:text-4xl max-xl:text-xl text-gray-100 animate-[landing_1.5s_ease-in-out]">
            Security research and wannabe photographer
          </p>
          <div className="mt-6 font-light text-4xl">
            <Link
              href="/posts/page/1"
              className="text-gray-200 hover:text-red-300 mr-4 transition-colors animate-[landing_2s_ease-in-out]"
            >
              Posts
            </Link>
            <Link
              href="/talks"
              className="text-gray-200 hover:text-red-300 mr-4 transition-colors animate-[landing_2.5s_ease-in-out]"
            >
              Talks
            </Link>
          </div>
        </div>
        <video
          controls={false}
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          x-webkit-airplay="deny"
          autoPlay
          loop
          muted
          className="absolute z-10 h-dvh w-dvw object-cover"
        >
          <source
            src={addBasePath("/videos/venice-hdr.mp4")}
            type="video/mp4"
            media="(dynamic-range: high)"
          />
          <source
            src={addBasePath("/videos/venice-sdr.webm")}
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </header>
    </div>
  );
}
