"use client";
import { useSession } from "next-auth/react";
import { bookType, dataMapType, Orders, Visuals } from "../../types";
import { useEffect, useState } from "react";
import { identifierCode, saveFile } from "@/app/[locale]/utils";
import { downloadFile, setDataMapIfExistsInCloud } from "../../googleAPI";
import Image from "next/image";
import SignInGoogle from "../SignInGoogle/SignInGoogle";
import { RiLoader4Line } from "react-icons/ri";
import { useTranslations } from "next-intl";
import LibraryFilters, {
  sortLibrary,
  visualizationType,
} from "../LibraryFilters/LibraryFilters";

export default function Library({
  refreshLibrary,
  setRefreshLibrary,
  searchValue,
}: {
  refreshLibrary: boolean;
  setRefreshLibrary: Function;
  searchValue: string;
}) {
  const { data: session, status } = useSession();
  const t = useTranslations("Library");

  const [visual, setVisual] = useState<Visuals>(Visuals.GRID);
  const [order, setOrder] = useState<Orders>(Orders.ASCENDENT);

  const [tagFilter, setTagFilter] = useState<Array<string>>([]);

  const saveBooks = () => {
    try {
      const dataMap: dataMapType = JSON.parse(
        localStorage.getItem("dataMap") ?? "null",
      );

      dataMap.books.map(async ({ id, bookCoverId }: bookType) => {
        const isDownloaded = localStorage.getItem(id);
        if (isDownloaded) return;

        const book = await downloadFile(id, "book");
        const cover = await downloadFile(bookCoverId, "book cover");

        if (book.ok && cover.ok) {
          const bookBody = await book.blob();
          const coverBody = await cover.blob();
          if (!bookBody || !coverBody) return;

          saveFile(id, bookBody);
          saveFile(bookCoverId, coverBody);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!session) return;

    const getVisual: string | null = localStorage.getItem("visual");
    const getOrder: string | null = localStorage.getItem("order");

    if (getVisual) setVisual(Visuals[getVisual as keyof typeof Visuals]);

    if (getOrder) setOrder(Orders[getOrder as keyof typeof Orders]);

    setDataMapIfExistsInCloud("metadata.json", identifierCode);

    saveBooks();
  }, [session]);

  const AddBook = () => {
    return (
      <div className="flex flex-col items-center gap-10 justify-center text-3xl absolute left-1/2 top-1/2 transform  -translate-1/2">
        {t("message::addNewBook")}
        <Image src="/imgs/newbook.svg" alt="" width={250} height={250} />
      </div>
    );
  };

  const CantFindTerm = () => {
    return (
      <div className="flex flex-col items-center gap-10 justify-center text-3xl text-center absolute left-1/2 top-1/2 transform  -translate-1/2">
        {t("message::bookNotFound", { searchValue })}
        <Image
          src="/imgs/cantfind.svg"
          alt="some books"
          width={250}
          height={250}
        />
      </div>
    );
  };

  const GetBooks = () => {
    try {
      const dataMap = JSON.parse(localStorage.getItem("dataMap") ?? "null");

      const booksFilter = dataMap.books
        .filter((book: bookType) => {
          const s = searchValue.toLowerCase();
          return (
            book.title.toLowerCase().includes(s) ||
            book.id.toLowerCase().includes(s) ||
            (book.tags &&
              book.tags.some(
                (tag: string) => tag != "" && tag.includes(searchValue),
              )) ||
            book.author.includes(searchValue) ||
            book.releaseDate.includes(searchValue) ||
            searchValue == ""
          );
        })
        .sort((a: bookType, b: bookType) =>
          sortLibrary(order, tagFilter, a, b),
        );

      const books = booksFilter.map((book: bookType) =>
        visualizationType(visual, book),
      );

      console.log(tagFilter);
      if (dataMap.books.length <= 0) {
        // if there is no book
        return <AddBook />;
      }

      if (books.length <= 0) {
        // if the searchValue is not in card
        return <CantFindTerm />;
      }

      return books;
    } catch (e) {
      console.log(e);
    }
  };

  const LoadingOrNoSession = () => {
    return (
      <div className="flex flex-col text-center items-center gap-10 justify-center text-3xl absolute left-1/2 top-1/2 transform  -translate-1/2">
        {status == "loading" ? (
          <RiLoader4Line className="animate-spin text-7xl duration-500" />
        ) : (
          <>
            {t("message::login")}
            <Image
              src="/imgs/library.svg"
              alt="some books"
              width={250}
              height={250}
            />
            <SignInGoogle />
          </>
        )}
      </div>
    );
  };

  const isGridClassList =
    visual == Visuals.GRID
      ? "grid pb-36 gap-12 md:px-5 py-5 place-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8"
      : "flex flex-col mt-10 p-4 gap-2";

  return (
    <div className="w-full p-4 md:pr-20">
      {session ? (
        <LibraryFilters
          setTagFilter={setTagFilter}
          setVisual={setVisual}
          setOrder={setOrder}
        />
      ) : null}
      <div className={isGridClassList}>
        {session || (session && refreshLibrary) ? (
          <GetBooks />
        ) : (
          <LoadingOrNoSession />
        )}
      </div>
    </div>
  );
}
