export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2>Admin Pages</h2>
      {children}
    </div>
  );
}
