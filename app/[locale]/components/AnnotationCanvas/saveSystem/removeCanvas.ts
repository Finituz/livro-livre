import { setDataMapIfExistsInCloud } from "@/app/[locale]/googleAPI";
import { dataMapType } from "@/app/[locale]/types";
import { identifierCode } from "@/app/[locale]/utils";

export const removeCanvas = (bookIndex: number, currentPage: number) => {
  try {
    const dataMap: dataMapType = JSON.parse(
      localStorage.getItem("dataMap") ?? "null",
    );
    const annotationIndex = dataMap.books[
      bookIndex
    ].userPrefs.pagesAnnotation.findIndex(
      (annotation) => annotation.pageNum == currentPage,
    );

    dataMap.books[bookIndex].userPrefs.pagesAnnotation.splice(
      annotationIndex,
      1,
    );

    localStorage.setItem("dataMap", JSON.stringify(dataMap));
    setDataMapIfExistsInCloud("metadata.json", identifierCode);
  } catch (e) {
    console.error(e);
  }
};
