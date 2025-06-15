import { DataProvider } from "@/Context/DataContext";
import { SettingsProvider } from "@/Context/SettingsContext";
import ThemeDetector from "@/components/Settings/ThemeDetector";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider>
      <DataProvider>
        <ThemeDetector />
        <Component {...pageProps} />
      </DataProvider>
    </SettingsProvider>
  );
}