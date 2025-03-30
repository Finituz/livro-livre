"use client";
import { useSearchParams } from "next/navigation";
import PdfJs from "../components/PDFViewer/page";

export default function Page() {
  const params = useSearchParams();
  const id = params.get("id");
  if (!id) return;

  const ISSERVER = typeof window === "undefined";
  const book = !ISSERVER ? localStorage.getItem(id) : null;

  if (id && book) {
    return <PdfJs src={book} bookId={id} />;
  }
}
