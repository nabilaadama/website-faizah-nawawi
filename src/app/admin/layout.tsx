import Sidebar from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow z-50">
        <Sidebar />
      </aside>

      <main className="ml-64 flex-1 p-8 bg-gray-100 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

