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
    <div className="bg-accents rounded-md col-span-1 row-start-2 row-end-3 lg:col-span-3 md:h-[350px] h-[350px] xl:h-[95%] lg:h-[95%] lg:flex-row">
        <h4 className="text-xl font-bold pl-[2%] pt-[2%] text-gray-200">Choose Themes</h4>
        <div className="flex overflow-x-auto h-[200px] md:h-[200px] xl:h-[70%] lg:h-[70%] w-[95%] pl-[2%]">
          <Swiper
          spaceBetween={10}
          slidesPerView={3}
          breakpoints={breakPoints}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={(swiper) => console.log(swiper)}
          >
            {['/52.jpg', '/yo.jpg', '/yo1.jpg'].map((image, index) => (
              <SwiperSlide
                key={index}
                className="relative rounded-md">
                <img  onClick={() => updateStates(image)} src={image} className="w-full md:h-full h-[150px] lg:h-full rounded-md hover:cursor-pointer" />
                <Button radius="full" className="hidden lg:block absolute bottom-2 right-10 left-10 bg-gradient-to-tr from-main to-accents text-white shadow-lg 
                hover:from-accents hover:to-main hover:to-lightQuartzetext-white"
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