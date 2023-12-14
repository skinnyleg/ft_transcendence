import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import {useState} from 'react';
import Image from 'next/image';
import 'swiper/css';
import {Button, ButtonGroup} from "@nextui-org/react";

interface ThemesProps {
  handleThemeChange: (theme: string) => void;
}

const Themes = ({ handleThemeChange }: ThemesProps) => {

  const [newtheme, setNewtheme] = useState('');

  const updateStates = (theme: string ) => {
    setNewtheme(theme);
    handleThemeChange(theme);
  };

  const breakPoints = {
    320: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
  }

  return (
    <div className="bg-accents p-2 rounded-md col-span-1 lg:col-span-3 mt-0 row-start-2 row-end-3 lg:col-span-3 h-[200px] lg:h-[360px] xl:h-[400px] md:h-[300px] lg:h-full lg:space-x-4 lg:flex-row">
        <h4 className="text-xl font-bold  mb-0 font-white">
         Choose Themes</h4>
        <div className="flex overflow-x-auto mt-2 lg:h-[260px] h-[190px]">
          <Swiper
          spaceBetween={10}
          slidesPerView={3}
          breakpoints={breakPoints}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}>
            {['/52.jpg', '/yo.jpg', '/yo1.jpg', '/42.jpg'].map((image, index) => (
              <SwiperSlide
                key={index}
                className="relative rounded-md">
                <img  onClick={() => updateStates(image)} src={image} className="w-full md:h-full h-[150px] lg:h-full rounded-md hover:cursor-pointer" />
                <Button radius="full" className="hidden lg:block absolute bottom-2 right-10 left-10 bg-gradient-to-tr from-main to-accents text-white shadow-lg 
                hover:from-accents hover:to-main hover:to-lightQuartzetext-white shadow-lg"
                  onClick={() => updateStates(image)}
                >
                  Choose
                </Button>
              
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
    </div>
  );
};

export default Themes;  