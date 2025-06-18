"use client";
import { getUrlVars } from "@/lib/kanjivg";
import KanjiViewer, {
  getNoShowSO,
  getShowGroups,
  getShowRadicals,
} from "@/lib/kanjiViewer";
import { Input } from "@heroui/react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const DetailViewer = () => {
  const [kanji, setKanji] = useState("");
  const [displayOrders, setDisplayOrders] = useState(true);
  const [radicals, setRadicals] = useState(true);
  const [colorGroups, setColorGroups] = useState(true);

  useEffect(() => {
    const urlVars = getUrlVars();
    const initialKanji = urlVars["kanji"] || "";
    setKanji(initialKanji);

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
      initialKanji,
      file
    );
  }, []);

  const handleKanjiChange = (event) => {
    setKanji(event.target.value.split("")[0]);
    // console.log(event.target.value.split('')[0]);
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
    KanjiViewer.setKanji(kanji);
    KanjiViewer.refreshKanji();
  };

  return (
    <>
      <div className="relative gap-5 flex min-h-screen flex-col items-center p-4">
        <form
          id="kanjiViewerParams"
          action="#"
          className="form-horizontal"
          onSubmit={handleSubmit}
        >
          <fieldset>
            <div
              id="viewer-controls"
              className="flex flex-col lg:flex-row justify-between items-center gap-5"
            >
              <div id="kanji-etc">
                <div>
                  <label htmlFor="kanji">Kanji</label>
                  <Input
                    className="viewer-input bg-white"
                    type="text"
                    value={kanji}
                    id="kanji"
                    label="e.g. 線"
                    onChange={handleKanjiChange}
                  />
                </div>
              </div>
              <div
                id="kanji-options"
                className="flex flex-col justify-start items-start"
              >
                <div className="flex gap-2 justify-center items-center">
                  <input
                    type="checkbox"
                    color="orange"
                    name="displayOrders"
                    id="displayOrders"
                    checked={displayOrders}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="displayOrders">Display stroke order</label>
                </div>

                <div className="flex gap-2 justify-center items-center">
                  <input
                    type="checkbox"
                    color="orange"
                    name="radicals"
                    id="radicals"
                    checked={radicals}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="radicals">Show radicals</label>
                </div>

                <div className="flex gap-2 justify-center items-center">
                  <input
                    type="checkbox"
                    color="orange"
                    name="colorGroups"
                    id="colorGroups"
                    checked={colorGroups}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="colorGroups">Show component groups</label>
                </div>
              </div>
              <div
                id="kanji-actions"
                className="flex flex-row lg:flex-col gap-3"
              >
                <button
                  id="submit"
                  className="kanjivg-button bg-info rounded-full text-white text-sm px-5 py-2"
                  type="submit"
                >
                  Load
                </button>
                <button
                  id="animate"
                  data-kanjivg-target="#kanji-svg"
                  className="kanjivg-button bg-gradient-radial rounded-full text-white text-sm px-5 py-2"
                >
                  Animate
                </button>
              </div>
            </div>
          </fieldset>
        </form>
        <div
          id="kanji-visuals"
          className=" flex flex-col md:flex-row gap-5 justify-center bg-white border-4 border-orange-400 rounded shadow-lg p-4 bg-gradient-to-br from-black via-gray-900 to-orange-900"
        >
          <div id="kanji-image" className="flex-4"></div>
          {(displayOrders || radicals || colorGroups) && (
            <div id="sub-images" className="flex-4 flex flex-col gap-3">
              <div id="radical-images"></div>
              <div
                id="group-images"
                className="grid grid-cols-2 lg:grid-cols-3 gap-4"
              ></div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-center my-4 font-english">
        Provided by{" "}
        <a
          className="text-orange-500 "
          target="_blank"
          href="https://kanjivg.tagaini.net/index.html"
        >
          KanjiVG
        </a>{" "}
      </p>
    </>
  );
};
export default DetailViewer;
