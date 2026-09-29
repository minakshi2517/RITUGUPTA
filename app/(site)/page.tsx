import { HomeView } from "@/components/home/HomeView";
import { getSite } from "@/lib/data";
import { getSubstackPosts } from "@/lib/substack";

export default async function HomePage() {
  const site = await getSite();
  const substack = await getSubstackPosts(site.settings.substackUrl);
  return <HomeView {...site} substack={substack} />;
}
