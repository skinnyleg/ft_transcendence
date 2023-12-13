import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useState } from 'react';

interface PowerUpsProps { handlePowerUpChange:(powerup: string) => void; }

const PowerUps = ({handlePowerUpChange}: PowerUpsProps) => {

  const [powerup, setPowerup] = useState('');
  const powerupshandle = (newPowerup : string) => {
    console.log(newPowerup);
    setPowerup(newPowerup);
    handlePowerUpChange(newPowerup);
  }
  const powerups = ['FireBall', 'IceBall', 'LightningBall', 'WaterBall', 'EarthBall', 'AirBall'];

  return (
    <div className="bg-accents p-2 rounded-md lg:col-span-3 col-span-1 lg:h-[200px] lg:w-full xl:h-[250px] h-[200px] lg:mt-20 mt-10 row-start-3 row-end-4 shadow-md">
      <h4 className="text-2xl text-gray-600 font-bold mb-10 ml-2">Power Ups</h4>
      <div className="flex overflow-x-auto lg:h-[150px] h-[100px] mt-5">
        <Swiper
          slidesPerView={4}
          pagination={{ clickable: true }}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
          width={500}
          >
          {['/52.jpg', '/yo.jpg', '/yo1.jpg', '/42.jpg', '/yo1.jpg', '/yo.jpg'].map((image, index) => (
            <SwiperSlide 
            key={index}
            className="relative rounded-md">
                <img onClick={() => powerupshandle(powerups[index])} src={image} className="w-[100px] h-[100px] rounded-full" />
          </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PowerUps;