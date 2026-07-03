import { Urbanist } from 'next/font/google';
import Carrusel from './components/carrusel';
import 'bootstrap/dist/css/bootstrap.min.css';
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/footer/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const urbanist = Urbanist({ subsets: ['latin'] });

// Aquí no usamos "use client"
export const metadata = {
    title: "Vinsalud",
    description: "Centro Medico",
    icons: {
        icon: "/logo.png",
    },
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${urbanist.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="min-h-screen bg-slate-50">
            <Navbar></Navbar>
            <main className="pb-16">{children}</main>
          </div>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
