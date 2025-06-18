'use client'
import React, { useEffect, useState } from "react";
import { Input } from "@heroui/react";
import KanjiViewer from '@/lib/kanjiViewer'
import { getUrlVars } from "@/lib/kanjivg";
import {
  getShowGroups,
  getShowRadicals,
  getNoShowSO,
} from "@/lib/kanjiViewer";

const KanjiStrokeViewer = ({ kanji, isSearch = false }) => {
  const [displayOrders, setDisplayOrders] = useState(true);
  const [radicals, setRadicals] = useState(false);
  const [colorGroups, setColorGroups] = useState(false);

  const [inputtedKanji, setInputtedKanji] = useState(kanji || " ");

  useEffect(() => {
    const urlVars = getUrlVars();
    const file = urlVars["file"];
    const cg = getShowGroups();
    const rad = getShowRadicals();
    const noso = getNoShowSO();

    if (cg) setColorGroups(true);
    if (rad) setRadicals(true);
    if (noso) setDisplayOrders(false);

    KanjiViewer.initialize(
      "kanjiViewer",
      displayOrders,
      radicals,
      colorGroups,
      isSearch ? inputtedKanji : kanji,
      file
    );
  }, [kanji, inputtedKanji, displayOrders, radicals, colorGroups]);

  const handleInputKanji = (input) => {
    // console.log({ input });
    if (input === undefined) {
      setInputtedKanji("");
    } else {
      setInputtedKanji(input);
    }
  };

  const handleCheckboxChange = (event) => {
    const checkboxName = event.target.name;

    switch (checkboxName) {
      case "displayOrders":
        setDisplayOrders(event.target.checked);
        break;
      case "radicals":
        setRadicals(event.target.checked);
        break;
      case "colorGroups":
        setColorGroups(event.target.checked);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    KanjiViewer.setStrokeOrdersVisible(displayOrders);
    KanjiViewer.setRadicals(radicals);
    KanjiViewer.setColorGroups(colorGroups);
    KanjiViewer.setKanji(inputtedKanji);
    KanjiViewer.refreshKanji();
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row-reverse items-center justify-center">
      <form
        id="kanjiViewerParams"
        action="#"
        className="form-horizontal"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <div
            id="viewer-controls"
            className="flex justify-center flex-col items-center gap-5"
          >
            <div id="kanji-etc">
              <div className={`${isSearch ? "" : "hidden"}`}>
                <label htmlFor="kanji">Search Kanji</label>
                <Input
                  className="viewer-input drop-shadow-md w-64"
                  type="text"
                  value={inputtedKanji}
                  id="kanji"
                  label="e.g. 線"
                  // readOnly
                  color="orange"
                  onValueChange={() =>
                    handleInputKanji(event.target.value.split("")[0])
                  }
                />
              </div>
              <div id="kanji-options" className=" flex-col hidden">
                <input
                  type="checkbox"
                  color="blue"
                  name="displayOrders"
                  id="displayOrders"
                  checked={displayOrders}
                  onChange={handleCheckboxChange}
                  label="Display stroke order"
                />

                <input
                  type="checkbox"
                  color="blue"
                  name="radicals"
                  id="radicals"
                  checked={radicals}
                  onChange={handleCheckboxChange}
                  label="Show radicals"
                />

                <input
                  type="checkbox"
                  color="blue"
                  name="colorGroups"
                  id="colorGroups"
                  checked={colorGroups}
                  onChange={handleCheckboxChange}
                  label="Show component groups"
                />
              </div>
            </div>
            <div id="kanji-actions" className=" flex flex-col items-center">
              <button
                id="animate"
                data-kanjivg-target="#kanji-svg"
                variant="outlined"
                size="sm"
                color="orange"
                className="kanjivg-button w-fit rounded-full border-2 border-primary px-5 text-sm py-2"
              >
                Animate
              </button>

              <a
                className="text-sm font-normal hover:text-orange-400 transition-all duration-250 text-gray-500 font-english-text p-2 mt-2 rounded bg-transparent text-center underline"
                href={isSearch ? `/viewer?kanji=${inputtedKanji}` :`/viewer?kanji=${kanji}`}
                target="_blank"
              >
                Check stroke information
              </a>
            </div>
          </div>
        </fieldset>
      </form>
      <div
        id="kanji-visuals"
        className="flex flex-col md:flex-row gap-5 justify-center"
      >
        <div
          id="kanji-image"
          className={`flex-4 modal-kanji ${isSearch && "search-view-form"}`}
        ></div>
      </div>
      <div
        id="kanji-visuals"
        className=" hidden flex-col md:flex-row gap-5 justify-center"
      >
        <div id="kanji-image" className="flex-4"></div>
        <div id="sub-images" className="flex-4 flex flex-col gap-3">
          <div id="radical-images"></div>
          <div
            id="group-images"
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default KanjiStrokeViewer;
