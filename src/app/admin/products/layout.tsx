export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8 bg-gray-100">{children}</div>
    </div>
  );
}
