
import BottomBar from "@/components/buttombar";
 
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=" w-full">
        {children}
      <BottomBar />
    </main>
  );
}
