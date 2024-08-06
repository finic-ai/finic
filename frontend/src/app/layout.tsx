"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import {ReactFlowProvider} from "@xyflow/react"
import { ThemeProvider } from "@material-tailwind/react";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        </head>
      </head>
      <ReactFlowProvider>
        <body className={inter.className}>
          {children}
        </body>
      </ReactFlowProvider>
    </html>
  );
}
