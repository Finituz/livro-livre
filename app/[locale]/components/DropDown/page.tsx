"use client";

import { ReactNode, RefObject, useRef } from "react";

export default function DropDown({
  buttonRef,
  title,
  children,
  buttonClassList,
  optionsClassList,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  title?: string;
  children: ReactNode;
  buttonClassList?: string;
  optionsClassList?: string;
}) {
  const optionsRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const toggleOptions = () => {
    const options = optionsRef.current;
    const layer = layerRef.current;

    if (!options || !layer) return;

    options.classList.toggle("invisible");
    options.classList.toggle("opacity-0");

    layer.classList.toggle("hidden");
  };

  return (
    <>
      <div
        onClick={toggleOptions}
        className="flex flex-col items-center justify-center"
      >
        <button
          ref={buttonRef}
          title={title}
          className={
            "rounded-xl cursor-pointer w-[48px] h-[48px] bg-cover bg-no-repeat border-2 border-white " +
            buttonClassList
          }
        ></button>
        <div
          ref={optionsRef}
          className={
            `absolute z-2 invisible opacity-0 border group-focus:flex top-14
                      bg-[rgba(0,0,0,0.5)] backdrop-blur-md p-3 rounded-xl
                      transition-opacity duration-800 ` + optionsClassList
          }
        >
          <ul className="flex flex-col w-fit min-w-52 gap-2">{children}</ul>
        </div>
      </div>
      <div
        onClick={toggleOptions}
        ref={layerRef}
        className="hidden opacity-0 fixed top-0 left-0 right-0 bottom-0"
      ></div>
    </>
  );
}
