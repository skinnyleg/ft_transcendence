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

  return (
    <div className="bg- p-2 rounded-md col-span-1 lg:col-span-3 mt-4 row-start-2 row-end-3 lg:col-span-3 h-full lg:space-x-4 lg:flex-row">
        <h4 className="text-xl font-bold  mb-0 font-white">
         Choose Themes</h4>
        <div className="flex overflow-x-auto mt-2 h-[260px]">
          <Swiper
          spaceBetween={10}
          slidesPerView={3}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}>
            {['/52.jpg', '/yo.jpg', '/yo1.jpg', '/42.jpg'].map((image, index) => (
              <SwiperSlide
                key={index}
                className="relative rounded-md">
                <img  onClick={() => updateStates(image)} src={image} className="w-full h-full rounded-md hover:cursor-pointer" />
                <Button radius="full" className="absolute bottom-2 right-10 left-10 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg hover:from-pink-400 hover:to-yellow-400"
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