import "./globals.css";
import { Toaster } from "react-hot-toast";
import QuaryClient from "../provider/QuaryClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <QuaryClient>
      <body >
          <Toaster position="top-right" reverseOrder={false} />
          <div className=" relative w-full min-h-screen ">
            {children}
          </div>
      </body>
        </QuaryClient>
    </html>
  );
}
