export function Footer() {
  return (
    <footer className="mt-auto pt-8 pb-8">
      <div className="max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto px-4 2xl:px-8">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            <a
              href="https://github.com/chichou"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://infosec.exchange/@codecolorist"
              target="_blank"
              rel="me noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Mastodon
            </a>
            <a
              href="/feed.xml"
              className="hover:text-foreground transition-colors"
            >
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
