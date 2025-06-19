import Header from "@/components/header";
import Sidebar1 from "@/components/sidebar1";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar1 />
        <div className="flex-1 bg-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
