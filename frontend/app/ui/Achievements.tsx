import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Scrollbar, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';

// Sample data
const achievementsData = [
  { title: "Achievement 1", description: "Description 1", imageUrl: "../42.jpg" },
  { title: "Achievement 2", description: "Description 2", imageUrl: "../42.jpg" },
  { title: "Achievement 2", description: "Description 2", imageUrl: "../42.jpg" },
  { title: "Achievement 2", description: "Description 2", imageUrl: "../42.jpg" },
  { title: "Achievement 2", description: "Description 2", imageUrl: "../42.jpg" },
  // Add more achievements as needed
];

const Achievements = () => {
  return (
    <div className="bg-hardblue p-5 rounded-md lg:col-span-2 col-span-1 lg:col-start-4 lg:col-end-6 md:row-start-5 md:row-end-6 lg:row-start-1 lg:row-end-2 w-full h-[300px] shadow-md">
      <h4 className="text-xl font-bold mb-0">ACHIEVEMENTS</h4>
      <div className="flex-col space-y-4 p-4 overflow-hidden h-5/6 w-full">
      <Swiper
        direction={'vertical'}
        slidesPerView={'auto'}
        freeMode={true}
        scrollbar={true}
        mousewheel={true}
        modules={[FreeMode, Scrollbar, Mousewheel]}
        className="mySwiper"
      >
        <SwiperSlide>
          <h4>Achivemnets</h4>
          
        </SwiperSlide>
      </Swiper>
    </div>

    </div>
  );
};

export default Achievements;
