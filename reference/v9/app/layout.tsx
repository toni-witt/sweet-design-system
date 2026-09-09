import type { Metadata } from "next";
import { V9Shell } from "@/components/v9/shell";
import "./v9.css";

export const metadata: Metadata = {
  title: "Sweet — Conduit",
  description: "The Conduit screens wearing the Sweet design language.",
};

export default function V9Layout({ children }: LayoutProps<"/v9">) {
  return <V9Shell>{children}</V9Shell>;
}
