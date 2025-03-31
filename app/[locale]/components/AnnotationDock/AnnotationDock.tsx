"use client";
import { useTranslations } from "next-intl";
import { themeType, Tools } from "../../types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  RiArrowLeftUpLine,
  RiArtboard2Line,
  RiCircleLine,
  RiEraserLine,
  RiMarkupLine,
  RiPencilLine,
  RiSquareLine,
  RiTriangleLine,
} from "react-icons/ri";
import { rgbToHex, toRGB } from "../../utils";

export default function AnnotationDock({
  color,
  setColor,
  showAnnotation,
  tool,
  setTool,
}: {
  color: themeType;
  setColor: Function;
  showAnnotation: boolean;
  tool: Tools;
  setTool: Function;
}) {
  const dockRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("PdfViewer.AnnotationDock");

  const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;

    setColor((prev: themeType) => ({ fg: toRGB(newColor), bg: prev.bg }));
  };

  const setCurrentTool = () => {
    const dock = dockRef.current;
    if (!dock) return;

    const dockChildren = Array.from(dock?.children);

    dockChildren.forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.add("selected");
      });

      if (element.classList.contains("selected")) {
        element.classList.remove("bg-transparent");
      } else {
        element.classList.add("bg-transparent");
      }

      element.classList.remove("selected");
    });
  };

  useEffect(() => {
    if (showAnnotation == true) {
      dockRef.current?.classList.remove("translate-x-52");
    } else {
      dockRef.current?.classList.add("translate-x-52");
    }

    setCurrentTool();
  }, [showAnnotation]);

  useEffect(setCurrentTool, [tool]);

  return (
    <div
      ref={dockRef}
      className={
        "fixed z-10 right-2 top-1/2 transform -translate-y-1/2 translate-x-52 flex flex-col p-2 gap-5 transition-transform duration-500 md:gap-5 bg-[rgba(0,0,0,0.5)] backdrop-blur-md w-fit h-fit rounded-xl items-center justify-center "
      }
    >
      <button
        title={t("title::pencil")}
        onClick={() => setTool(Tools.PENCIL)}
        className="p-2 hover:bg-red-900 bg-red-900 rounded-xl text-3xl cursor-pointer transition-colors duration-500"
      >
        <RiPencilLine />
      </button>
      <button
        title={t("title::marker")}
        onClick={() => setTool(Tools.MARKER)}
        className="p-2 hover:bg-green-900 bg-green-900 rounded-xl text-3xl cursor-pointer transition-colors duration-500"
      >
        <RiMarkupLine />
      </button>
      <button
        title={t("title::triangle")}
        onClick={() => setTool(Tools.TRIANGLE)}
        className="p-2 hover:bg-rose-900  bg-rose-900 rounded-xl text-3xl cursor-pointer transition-colors duration-500"
      >
        <RiTriangleLine />
      </button>
      <button
        title={t("title::rectangle")}
        onClick={() => setTool(Tools.RECTANGLE)}
        className="p-2 hover:bg-emerald-900  bg-emerald-900  rounded-xl text-3xl cursor-pointer transition-colors duration-500"
      >
        <RiSquareLine />
      </button>
      <button
        title={t("title::circle")}
        onClick={() => setTool(Tools.CIRCLE)}
        className="p-2 hover:bg-pink-900 bg-pink-900 rounded-xl text-3xl cursor-pointer transition-colors duration-500"
      >
        <RiCircleLine />
      </button>
      <button
        title={t("title::arrow")}
        onClick={() => setTool(Tools.ARROW)}
        className="p-2 hover:bg-blue-900 bg-blue-900 rounded-xl text-3xl cursor-pointer transition-colors duration-500"
      >
        <RiArrowLeftUpLine />
      </button>
      <button
        title={t("title::eraser")}
        onClick={() => setTool(Tools.ERASER)}
        className="p-2 hover:bg-purple-900 bg-purple-900 rounded-xl text-3xl cursor-pointer transition-colors duration-500"
      >
        <RiEraserLine />
      </button>
      <button
        title={t("title::clearCanvas")}
        onClick={() => setTool(Tools.CLEAR_CANVAS)}
        className="p-2 hover:bg-cyan-800  rounded-xl text-3xl cursor-pointer transition-colors duration-500"
      >
        <RiArtboard2Line />
      </button>
      <input
        title={t("title::color")}
        onChange={changeColor}
        className="rounded-xl w-7 h-7 border-none"
        value={rgbToHex(color.fg)}
        type="color"
      />
    </div>
  );
}
