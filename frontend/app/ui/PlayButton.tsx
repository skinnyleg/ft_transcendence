interface PlayButtonProps { theme: string; PowerUp: string; }
import {Button, ButtonGroup} from "@nextui-org/react";

const PlayButton = ({ theme, PowerUp }:PlayButtonProps) => {

    return (
        <Button radius="full" className="absolute lg:bottom-20 bottom-10 right-10 left-10 lg:w-1/5 w-[100px] py-2 bg-gradient-to-tr from-pink-500 to-purple-400 to-blue-500 text-white shadow-lg
        hover:from-pink-400 hover:to-pink-300 hover:to-yellow-500">
            play
        </Button>
    )
};
export default PlayButton;