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
    <div className="bg-accents rounded-md lg:col-span-3 col-span-1 lg:w-full md:h-[250px] h-[250px] xl:h-[21vh] lg:h-[20vh] row-start-3 row-end-4 shadow-md">
      <h4 className="text-2xl p-2 text-gray-600 font-bold mb-10 ml-2">Power Ups</h4>
      <div className="flex p-2 overflow-x-auto h-[150px] md:h-[150px] xl:h-[15vh] lg:h-[15vh] mt-5">
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