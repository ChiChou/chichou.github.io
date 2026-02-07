import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/config";
import mastodonIcon from "bootstrap-icons/icons/mastodon.svg";
import githubIcon from "bootstrap-icons/icons/github.svg";
import linkedinIcon from "bootstrap-icons/icons/linkedin.svg";
import cameraIcon from "bootstrap-icons/icons/camera.svg";

export default function Home() {
  return (
    <div className="h-dvh w-screen bg-gray-950">
      <header className="relative flex size-full items-end overflow-hidden">
        <div className="relative z-30 2xl:m-40 max-2xl:m-20 max-xl:m-10 text-white font-bold">
          <h1 className="2xl:text-8xl xl:text-6xl max-xl:text-4xl animate-landing drop-shadow-lg">
            CodeColorist
          </h1>
          <p className="2xl:text-6xl xl:text-4xl max-xl:text-xl text-gray-100 animate-landing-delayed drop-shadow-md">
            Security research and wannabe photographer
          </p>
          <nav className="mt-6 font-light text-4xl max-xl:text-2xl flex gap-4">
            <Link
              href="/blog"
              className="text-gray-200 hover:text-red-300 transition-colors animate-landing-nav drop-shadow-md"
            >
              Blog
            </Link>
            <Link
              href="/talks"
              className="text-gray-200 hover:text-red-300 transition-colors animate-landing-nav-delayed drop-shadow-md"
            >
              Talks
            </Link>
          </nav>
          <div className="mt-4 flex gap-5 animate-landing-nav-delayed">
            <a
              href="https://infosec.exchange/@codecolorist"
              rel="me noopener noreferrer"
              target="_blank"
              title="Mastodon"
              aria-label="Mastodon"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={mastodonIcon}
                alt=""
                width={24}
                height={24}
                className="invert"
              />
            </a>
            <a
              href="https://github.com/chichou"
              rel="noopener noreferrer"
              target="_blank"
              title="GitHub"
              aria-label="GitHub"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={githubIcon}
                alt=""
                width={24}
                height={24}
                className="invert"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/codecolorist/"
              rel="noopener noreferrer"
              target="_blank"
              title="LinkedIn"
              aria-label="LinkedIn"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={linkedinIcon}
                alt=""
                width={24}
                height={24}
                className="invert"
              />
            </a>
            <a
              href="https://unsplash.com/@0xcc"
              rel="noopener noreferrer"
              target="_blank"
              title="Unsplash"
              aria-label="Unsplash"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={cameraIcon}
                alt=""
                width={24}
                height={24}
                className="invert"
              />
            </a>
          </div>
        </div>
        <div className="absolute z-20 inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent" />
        <video
          controls={false}
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          autoPlay
          loop
          muted
          className="absolute z-10 h-dvh w-dvw object-cover"
        >
          <source
            src={resolveImageUrl("/videos/venice-hdr.mp4")}
            type="video/mp4"
            media="(dynamic-range: high)"
          />
          <source
            src={resolveImageUrl("/videos/venice-sdr.webm")}
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </header>
    </div>
  );
}
