"use client";

import dynamic from "next/dynamic";
import type { BookData } from "./BookstoreContent";

const Bookshelf3D = dynamic(() => import("./Book3D"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
      }}
    >
      Loading 3D Bookshelf...
    </div>
  ),
});

export default function BookScene({
  books,
  selectedId,
  onSelect,
  onColorExtracted,
}: {
  books: BookData[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onColorExtracted: (bookId: string, color: string) => void;
}) {
  return (
    <Bookshelf3D
      books={books}
      selectedId={selectedId}
      onSelect={onSelect}
      onColorExtracted={onColorExtracted}
    />
  );
}
