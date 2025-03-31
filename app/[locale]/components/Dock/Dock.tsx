"use client";
import { useTranslations } from "next-intl";
import { themeType, themeColors } from "../../types";
import { PDFDocumentProxy } from "pdfjs-dist";
import { MouseEvent, useEffect, useRef } from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArtboardLine,
  RiHome8Line,
} from "react-icons/ri";
import { rgbToHex } from "../../utils";

export default function Dock({
  bookIndex,
  currentPage,
  pdfDoc,
  setScale,
  setCurrentPage,
  theme,
  setShowAnnotation,
}: {
  bookIndex: number;
  currentPage: number;
  pdfDoc: PDFDocumentProxy;
  setScale: Function;
  setCurrentPage: Function;
  theme: themeType;
  setShowAnnotation: Function;
}) {
  const t = useTranslations("PdfViewer.Dock");
  const currentPageTheme =
    JSON.stringify(theme.bg) == JSON.stringify(themeColors.black);

  const ISSERVER = typeof window === "undefined";
  const dataMap = !ISSERVER
    ? JSON.parse(localStorage.getItem("dataMap") ?? "{}")
    : null;

  const onPageChange = (num: number) => {
    dataMap.books[bookIndex].userPrefs.lastViewedPage = num;

    localStorage.setItem("dataMap", JSON.stringify(dataMap));
  };

  const nextPage = () => {
    onPageChange(currentPage + 1);
    pdfDoc && currentPage < pdfDoc.numPages;
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    onPageChange(currentPage - 1);
    currentPage > 1;
    setCurrentPage(currentPage - 1);
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const scaleListRef = useRef<HTMLUListElement>(null);

  const changeButtonTheme = () => {
    if (!buttonRef.current) return;

    buttonRef.current.style.background = currentPageTheme
      ? rgbToHex(themeColors.white)
      : rgbToHex(themeColors.black);
  };

  const changeTheme = () => {
    changeButtonTheme();

    const currentTheme: themeType =
      JSON.stringify(theme.bg) == JSON.stringify(themeColors.white)
        ? { bg: themeColors.black, fg: themeColors.white }
        : { bg: themeColors.white, fg: themeColors.black };

    dataMap.books[bookIndex].userPrefs.theme = currentTheme;

    localStorage.setItem("dataMap", JSON.stringify(dataMap));
    document.location.reload();
  };

  const scaleMark = () => {
    const scaleList = scaleListRef.current;
    const scale = dataMap.books[bookIndex].userPrefs.scale;

    if (!scaleList || !scale) return;

    Array.from(scaleList.children).forEach((li) =>
      li.innerHTML == scale
        ? li.classList.add("text-gray-700", "font-extrabold")
        : li.classList.remove("text-gray-700", "font-extrabold"),
    );
  };

  const changeScale = (event: MouseEvent<HTMLLIElement>) => {
    const scale: string = event.currentTarget.innerText;

    setScale(Number(scale));
    dataMap.books[bookIndex].userPrefs.scale = scale;

    scaleMark();

    localStorage.setItem("dataMap", JSON.stringify(dataMap));
  };

  useEffect(() => {
    changeButtonTheme();
    scaleMark();
  }, [changeButtonTheme, scaleMark, theme]);

  return (
    <>
      <div className="fixed z-10 bottom-2 flex p-2 gap-5 md:gap-10 bg-[rgba(0,0,0,0.5)] backdrop-blur-md w-fit h-fit rounded-xl items-center justify-center">
        <a
          href="/"
          className="flex font-bold md:gap-5 cursor-pointer flex-col md:flex-row disabled:cursor-default disabled:text-gray-500 rounded-full items-center justify-center"
        >
          <RiHome8Line className="text-2xl text-center" />
          <b>{t("button::library")}</b>
        </a>
        <button
          className="flex font-bold cursor-pointer disabled:cursor-default disabled:text-gray-500 rounded-full items-center justify-center"
          onClick={prevPage}
          disabled={currentPage <= 1}
        >
          <RiArrowLeftSLine className="text-3xl" />
          &nbsp;{t("button::previous")}
        </button>
        <button
          className="flex font-bold text-center cursor-pointer disabled:text-gray-700 items-center justify-center rounded-full"
          onClick={nextPage}
          disabled={currentPage >= (pdfDoc?.numPages ?? -1)}
        >
          {t("button::next")}&nbsp;
          <RiArrowRightSLine className="text-3xl" />
        </button>
        <button
          title={t("title::scale")}
          onClick={(e) => e.currentTarget.focus()}
          className="group relative flex text-center cursor-pointer disabled:text-gray-700 items-center justify-center rounded-full"
        >
          <b>{"aA"}</b>
          <div
            onClick={(e) => e.currentTarget.focus()}
            className="absolute hidden group-focus:flex bottom-10 bg-[rgba(0,0,0,0.5)] backdrop-blur-md p-3 rounded-xl"
          >
            <ul ref={scaleListRef}>
              <li className="rounded-lg px-2" onClick={changeScale}>
                0.5
              </li>
              <li className="rounded-lg" onClick={changeScale}>
                1.0
              </li>
              <li className="rounded-lg" onClick={changeScale}>
                1.5
              </li>
              <li className="rounded-lg" onClick={changeScale}>
                2.0
              </li>
              <li className="rounded-lg" onClick={changeScale}>
                2.5
              </li>
              <li className="rounded-lg" onClick={changeScale}>
                3.0
              </li>
            </ul>
          </div>
        </button>
        <button
          title={t("title::draw")}
          className="cursor-pointer"
          onClick={() => {
            setShowAnnotation((prev: boolean) => !prev);
          }}
        >
          <RiArtboardLine className="text-2xl" />
        </button>
        <button
          title={t("title::theme")}
          className="rounded-full border border-white cursor-pointer w-8 h-8 "
          ref={buttonRef}
          onClick={changeTheme}
        ></button>
      </div>
      <b className="fixed top-2 right-2 p-2 rounded-xl bg-[rgba(0,0,0,0.5)] backdrop-blur-md">
        {t("pagesView", { current: currentPage, total: pdfDoc?.numPages })}
      </b>
    </>
  );
}
