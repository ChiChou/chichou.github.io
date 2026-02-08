import Image from "next/image";
import mastodonIcon from "bootstrap-icons/icons/mastodon.svg";
import githubIcon from "bootstrap-icons/icons/github.svg";
import linkedinIcon from "bootstrap-icons/icons/linkedin.svg";
import cameraIcon from "bootstrap-icons/icons/camera.svg";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 py-8">
      <div className="max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto px-4 2xl:px-8">
        <div className="flex justify-center gap-6">
          <a
            href="https://infosec.exchange/@codecolorist"
            rel="me noopener noreferrer"
            target="_blank"
            title="Mastodon"
            aria-label="Mastodon"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Image
              src={mastodonIcon}
              alt=""
              width={24}
              height={24}
              className="dark:invert"
              aria-hidden="true"
            />
          </a>
          <a
            href="https://github.com/chichou"
            rel="noopener noreferrer"
            target="_blank"
            title="GitHub"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Image
              src={githubIcon}
              alt=""
              width={24}
              height={24}
              className="dark:invert"
              aria-hidden="true"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/codecolorist/"
            rel="noopener noreferrer"
            target="_blank"
            title="LinkedIn"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Image
              src={linkedinIcon}
              alt=""
              width={24}
              height={24}
              className="dark:invert"
              aria-hidden="true"
            />
          </a>
          <a
            href="https://unsplash.com/@0xcc"
            rel="noopener noreferrer"
            target="_blank"
            title="Unsplash"
            aria-label="Unsplash"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Image
              src={cameraIcon}
              alt=""
              width={24}
              height={24}
              className="dark:invert"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
