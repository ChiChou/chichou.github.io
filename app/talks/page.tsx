import { getAllTalks, type Talk } from "@/lib/talks";
import { FileText, Video, Calendar, FileCode, Sparkles } from "lucide-react";
import Image from "next/image";

function TalkCard({ talk }: { talk: Talk }) {
  const linkIcons: Record<keyof typeof talk.links, React.ReactNode> = {
    event: <Calendar className="w-3.5 h-3.5" />,
    slides: <FileText className="w-3.5 h-3.5" />,
    paper: <FileCode className="w-3.5 h-3.5" />,
    recording: <Video className="w-3.5 h-3.5" />,
    parody: <Sparkles className="w-3.5 h-3.5" />,
  };

  const linkLabels: Record<keyof typeof talk.links, string> = {
    event: "Event",
    slides: "Slides",
    paper: "Paper",
    recording: "Video",
    parody: "Parody",
  };

  return (
    <article className="group">
      {/* Cover */}
      <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
        {talk.cover ? (
          <picture>
            <source srcSet={`${talk.cover}.avif`} type="image/avif" />
            <source srcSet={`${talk.cover}.webp`} type="image/webp" />
            <Image
              src={`${talk.cover}.jpg`}
              alt={talk.title}
              width={800}
              height={450}
              className="w-full h-full object-cover"
            />
          </picture>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted/50">
            <div className="text-center px-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {talk.conference}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{talk.conference}</span>
          <span className="opacity-50">/</span>
          <span>{talk.year}</span>
        </div>

        <h2 className="font-medium leading-snug">{talk.title}</h2>

        <p className="text-sm text-muted-foreground">
          {talk.speakers.join(", ")}
        </p>

        {Object.keys(talk.links).length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            {(Object.entries(talk.links) as [keyof typeof talk.links, string][])
              .filter(([, url]) => url)
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {linkIcons[key]}
                  <span>{linkLabels[key]}</span>
                </a>
              ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function TalksPage() {
  const talks = getAllTalks();

  return (
    <main className="max-w-4xl mx-auto px-4 pb-16 min-h-[calc(100vh-80px)]">
      <header className="py-8">
        <h1 className="text-3xl font-bold tracking-tight">Talks</h1>
        <p className="text-muted-foreground mt-2">
          Conference presentations and research talks
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {talks.map((talk) => (
          <TalkCard key={talk.slug} talk={talk} />
        ))}
      </div>
    </main>
  );
}
