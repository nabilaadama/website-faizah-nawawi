export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shop-layout">
      <header className="shop-header">{/* Shop navigation */}</header>
      <main className="shop-main">{children}</main>
      <footer className="shop-footer">{/* Shop footer */}</footer>
    </div>
  );
}