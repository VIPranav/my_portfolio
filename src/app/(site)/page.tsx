import Hero from "@/components/home/Hero";
import ScrollStory from "@/components/home/ScrollStory";
import FeaturedWork from "@/components/home/FeaturedWork";
import StatsStrip from "@/components/home/StatsStrip";
import CtaBanner from "@/components/home/CtaBanner";
import { getProjects } from "@/lib/content";
export const revalidate = 60;
export default async function Home() {
  const projects = await getProjects();
  return (
    <>
      <Hero />
      <ScrollStory />
      <FeaturedWork projects={projects.filter((p) => p.featured).slice(0, 3)} />
      <StatsStrip />
      <CtaBanner />
    </>
  );
}
