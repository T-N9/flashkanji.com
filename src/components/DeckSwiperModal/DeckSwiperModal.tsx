"use client"
import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, Keyboard } from "swiper/modules";

/* Hook */
import { useContainer } from "./useContainer";
import DeckCard from "../cards/DeckCard";

export const DeckSwiperModal = () => {
  const {
    deckData,
    isDeckModalOpen,
    toggleDeckModal,
  } = useContainer();

  const isLoading=false

  return (
    <>
      {!isLoading && isDeckModalOpen && (
        <section
          className={`${
            isDeckModalOpen ? "opacity-100 visible" : "invisible opacity-0"
          } fixed top-0 left-0 z-[6000] transform duration-300 bg-slate-600 bg-opacity-75 backdrop-blur-md ease-out bottom-0 right-0 flex justify-center items-center`}
        >
          <div
            onClick={() => toggleDeckModal()}
            className="fixed top-0 left-0 bottom-0 right-0 bg-blue-gray-700 bg-opacity-60"
          ></div>
          <div className=" relative z-30">
            <Swiper
              pagination={{
                type: "fraction",
              }}
              slidesPerView={1}
              spaceBetween={50}
              navigation={true}
              keyboard={{
                enabled: true,
              }}
              loop={true}
              modules={[Pagination, Navigation, Keyboard]}
              className="flashSwiper"
            >
              {deckData?.map((item, index) => (
                <SwiperSlide key={index}>
                  <DeckCard key={index} item={item} isSwiped={true} isInfoShow={false} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
    </>
  );
};
