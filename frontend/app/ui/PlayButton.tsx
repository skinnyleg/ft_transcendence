interface PlayButtonProps { theme: string; PowerUp: string; }
import {Button, ButtonGroup} from "@nextui-org/react";

const PlayButton = ({ theme, PowerUp }:PlayButtonProps) => {

    return (
        <Button radius="full" className="absolute lg:bottom-20 bottom-10 right-10 left-10 lg:w-1/5 w-[100px] py-2 bg-gradient-to-tr from-lightQuartz to-accents text-white shadow-lg
        hover:from-accents hover:to-main">
            play
        </Button>
    )
};
export default PlayButton;