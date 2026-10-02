"use client";

import FlowingMenu from "@/components/home/FlowingMenu";

const chapters = [
  {
    text: "Development",
    link: "/skills#development",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&h=400&fit=crop&sat=-100&auto=format",
  },
  {
    text: "Art",
    link: "/skills#art",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&h=400&fit=crop&sat=-100&auto=format",
  },
  {
    text: "Design",
    link: "/skills#design",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=600&h=400&fit=crop&sat=-100&auto=format",
  },
  {
    text: "Video",
    link: "/skills#video-&-3d",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&h=400&fit=crop&sat=-100&auto=format",
  },
  {
    text: "3D",
    link: "/skills#video-&-3d",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&h=400&fit=crop&sat=-100&auto=format",
  },
] as const;

export default function ScrollStory() {
  return (
    <section id="disciplines" className="scroll-story flowing-skills-section">
      <div className="container flowing-skills-heading">
        <div>
          <p className="eyebrow">THE TOOLKIT</p>
          <h2>Disciplines in motion.</h2>
        </div>
        <p className="body-copy">
          Development, art, design, video, and 3D are the pieces I use to turn
          an idea into something finished.
        </p>
      </div>
      <div className="container flowing-skills-menu">
        <div className="flowing-skills-frame">
          <FlowingMenu
            items={chapters}
            speed={18}
            bgColor="rgba(7,8,11,0.55)"
            marqueeBgColor="#f5f5f7"
            marqueeTextColor="#07080b"
            borderColor="rgba(255,255,255,0.16)"
          />
        </div>
      </div>
    </section>
  );
}
