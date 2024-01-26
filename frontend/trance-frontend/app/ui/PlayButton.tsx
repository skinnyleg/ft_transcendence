interface PlayButtonProps { theme: string; PowerUp: string; gameType_: string}
import {Button, ButtonGroup} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { GameContext, gameSocketContext } from "../context/gameSockets";
import { useContext } from "react";


const PlayButton = ({ theme, PowerUp, gameType_ }:PlayButtonProps) => {

    const router = useRouter()
    const {setGameType} = useContext(GameContext);
    const gameSocket = useContext(gameSocketContext)

    const redirectToGame = () => {
        if (gameType_ === 'QUEUE')
        {
            gameSocket.emit('SaveSettings', {theme: theme, powerUp: PowerUp});
            gameSocket.on('saved', () => { router.push('/game') });
        }
        else if (gameType_ === 'BOT')
        {
            gameSocket.emit('PlayBot', {theme: theme, powerUp: PowerUp});
            router.push('/game/bot');
        }
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