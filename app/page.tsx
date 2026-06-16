import HomeContent from "@/app/HomeContent";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();

  return <HomeContent isAuthenticated={!!session} />;
}
