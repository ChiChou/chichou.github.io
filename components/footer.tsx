import Image from "next/image";
import mastodonIcon from "bootstrap-icons/icons/mastodon.svg";
import githubIcon from "bootstrap-icons/icons/github.svg";
import linkedinIcon from "bootstrap-icons/icons/linkedin.svg";
import cameraIcon from "bootstrap-icons/icons/camera.svg";

export function Footer() {
  return (
    <footer className="mt-auto py-12">
      <div className="mx-auto px-4 space-y-4">
        <div className="flex justify-center gap-5">
          <a
            href="https://infosec.exchange/@codecolorist"
            rel="me noopener noreferrer"
            target="_blank"
            title="Mastodon"
            aria-label="Mastodon"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
        <p className="text-center text-sm text-muted-foreground/60">
          &copy; {new Date().getFullYear()} CodeColorist
        </p>
      </div>
    </footer>
  );
}
