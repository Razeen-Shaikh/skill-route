import Sidebar from "@/components/tutorials/Sidebar";

export default function TutorialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Persistent */}
      <aside className="w-120 border-r border-border p-6 fixed top-18 overflow-y-auto h-[calc(100vh-4.5rem)]">
        <Sidebar />
      </aside>
      {/* Dynamic Content */}
      <main className="flex-1 h-[calc(100vh-4.5rem)] overflow-y-auto ml-120">
        {children}
      </main>
    </div>
  );
}
