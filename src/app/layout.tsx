import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from './components/Navbar';
import "./globals.css";

const geistSans = localFont({
 src: "./fonts/Geist-Regular.otf",
  variable: "--font-geist-regular",

});

const geistMono = localFont({
 src: "./fonts/Geist-Bold.otf",
  variable: "--font-geist-bold",
});

export const metadata: Metadata = {
  title: 'Amana Bookstore',
  description: 'A modern online bookstore built with Next.js and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: In a real-world application, cart state would be managed globally using
  // Context API or a state management library like Zustand or Redux.
  // The cart item count for the Navbar is managed on the client-side within the component itself
  // to adhere to the project's constraint of not using Context API.
  // Each page interacting with the cart will manage its state via localStorage.

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 pt-16`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
