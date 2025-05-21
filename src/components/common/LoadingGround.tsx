import React from "react";
import LoadingKanjiCard from "../cards/LoadingKanjiCard";
import LoadingJukugoCard from "../cards/LoadingJukugoCard";

export const LoadingGround = ({ mode } : {mode : number}) => {
  /* mode 1 = flash ground
     mode 2 = jukugo ground
  */
  return (
    <>
      {mode === 1 && (
        <div className=" max-w-[1280px] flex justify-center items-center flex-wrap  gap-6">
          {Array.from({ length: 5 }, (_, index) => index + 1).map(
            (item, index) => {
              return (
                <LoadingKanjiCard key={index}/>
              );
            }
          )}
        </div>
      )}
      {mode === 2 && (
        <div className="grid lg:max-w-[1280px] w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, index) => index + 1).map(
            (item, index) => {
              return (
                <LoadingJukugoCard key={index}/>
              );
            }
          )}
        </div>
      )}
    </>
  );
};
