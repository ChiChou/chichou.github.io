export interface Talk {
  title: string;
  conference: string;
  year: number;
  speakers: string[];
  links: {
    slides?: string;
    paper?: string;
    recording?: string;
    parody?: string;
    event?: string;
  };
}

export const talks: Talk[] = [
  {
    title: "Hack Different: Pwning iOS 14 with Generation Z Bugz",
    conference: "BlackHat USA",
    year: 2021,
    speakers: ["Zhi Zhou (@CodeColorist)", "Jundong Xie (@Jdddong)"],
    links: {
      event:
        "https://www.blackhat.com/us-21/briefings/schedule/#hack-different-pwning-ios--with-generation-z-bugz-23002",
      slides:
        "https://i.blackhat.com/USA21/Wednesday-Handouts/us-21-Hack-Different-Pwning-IOS-14-With-Generation-Z-Bug.pdf",
      paper:
        "https://i.blackhat.com/USA21/Wednesday-Handouts/us-21-Hack-Different-Pwning-IOS-14-With-Generation-Z-Bug-wp.pdf",
      recording: "https://www.youtube.com/watch?v=fLXc5PJdtp0",
      parody: "https://codecolor.ist/mistune/",
    },
  },
  {
    title: "See No Eval: Runtime Dynamic Code Execution in Objective-C",
    conference: "RWCTF",
    year: 2021,
    speakers: ["Zhi Zhou (@CodeColorist)"],
    links: {
      slides:
        "https://speakerdeck.com/chichou/see-no-eval-runtime-dynamic-code-execution-in-objective-c",
    },
  },
  {
    title: "Cross-Site Escape: Pwning macOS Safari Sandbox the Unusual Way",
    conference: "BlackHat EU",
    year: 2020,
    speakers: ["Zhi Zhou (@CodeColorist)"],
    links: {
      event:
        "https://www.blackhat.com/eu-20/briefings/schedule/#cross-site-escape-pwning-macos-safari-sandbox-the-unusual-way-21133",
      slides:
        "https://i.blackhat.com/eu-20/Thursday/eu-20-Zhou-Cross-Site-Escape-Pwning-MacOS-Safari-Sandbox-The-Unusual-Way.pdf",
      recording: "https://www.youtube.com/watch?v=cBAd1as6grQ",
    },
  },
  {
    title: "I Want to Break Free: Unusual Logic Safari Sandbox Escapes",
    conference: "TyphoonCon",
    year: 2019,
    speakers: ["Zhi Zhou (@CodeColorist)"],
    links: {
      slides:
        "https://speakerdeck.com/chichou/i-want-to-break-free-unusual-logic-safari-sandbox-escape",
    },
  },
  {
    title: "ModJack: Hijacking the macOS Kernel",
    conference: "HITB Amsterdam",
    year: 2019,
    speakers: ["Zhi Zhou (@CodeColorist)"],
    links: {
      event:
        "https://archive.conference.hitb.org/hitbsecconf2019ams/sessions/modjack-hijacking-the-macos-kernel/",
      slides:
        "https://conference.hitb.org/hitbsecconf2019ams/materials/D2T2%20-%20ModJack%20-%20Hijacking%20the%20MacOS%20Kernel%20-%20Zhi%20Zhou.pdf",
      recording: "https://www.youtube.com/watch?v=OVT1DrSiLWQ",
    },
  },
  {
    title:
      "Many Birds, One Stone: Exploiting a Single SQLite Vulnerability Across Multiple Software",
    conference: "BlackHat USA",
    year: 2017,
    speakers: [
      "Siji Feng (a.k.a slipper)",
      "Zhi Zhou (@CodeColorist)",
      "Kun Yang (@KelwinYang)",
    ],
    links: {
      event:
        "https://www.blackhat.com/us-17/briefings/schedule/#many-birds-one-stone-exploiting-a-single-sqlite-vulnerability-across-multiple-software-7024",
      slides:
        "https://www.blackhat.com/docs/us-17/wednesday/us-17-Feng-Many-Birds-One-Stone-Exploiting-A-Single-SQLite-Vulnerability-Across-Multiple-Software.pdf",
      recording: "https://www.youtube.com/watch?v=Kqv8S1BQYwE",
    },
  },
];
