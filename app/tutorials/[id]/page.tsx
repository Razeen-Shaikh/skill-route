import TutorialPage from "@/components/tutorials/TutorialPage";

export default function Page({ params }: { params: { id: string } }) {
  return <TutorialPage tutorialId={params.id} />;
}
