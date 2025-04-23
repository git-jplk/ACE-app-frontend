import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import ChatPage from "./chat";
import PdfForm from "./form";
export default function Home() {
  return (
    <div>
      <ChatPage />
    </div>
  );
}
