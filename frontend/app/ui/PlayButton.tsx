interface PlayButtonProps { theme: string; PowerUp: string; }
import {Button, ButtonGroup} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import gameSocket from "../game/[id]/ui/gameSockets";


const PlayButton = ({ theme, PowerUp }:PlayButtonProps) => {

    const router = useRouter()
    const redirectToGame = () => {
        gameSocket.emit('PlayQueue');
        gameSocket.on('InQueue', () => {
            router.push('/game')
        });
    };

    return (
        <Button 
        radius="full" 
        className="absolute lg:bottom-20 bottom-10 right-10 left-10 lg:w-1/5 w-[100px] py-2 bg-gradient-to-tr from-lightQuartz to-accents text-white shadow-lg hover:from-accents hover:to-main" 
        onClick={redirectToGame}>
            <h1 >PLAY</h1>
        </Button>
    )
};
export default PlayButton;