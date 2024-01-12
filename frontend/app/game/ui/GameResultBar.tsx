import PlayerInfo from "./PlayerInfo";
import MatchScore from "./MatchScore";
import { useState, useEffect, useContext } from "react";
import gameSocket, { GameContext } from "../../context/gameSockets";
import { playerInfo } from "../types/interfaces";


const GameResultBar = () => {

    // const [playerL, setPlayerL] = useState<playerInfo | undefined>(undefined);
    const {playerL, playerR} = useContext(GameContext);
    // const [playerL, setPlayerL] = useState<playerInfo | undefined>(undefined);
    // const [playerR, setPlayerR] = useState<playerInfo | undefined>(undefined);

    useEffect(() => {
        gameSocket.emit('players-data');
        gameSocket.on('players-info', (data: playerInfo[]) => {
            console.log('players-info =>=>> ', data);
            // setPlayerL(data[0]);
            // setPlayerR(data[1]);
        });


        return () => {
            gameSocket.off('players-info');
        };

    },[]);

    const obj1: playerInfoProps = {style: '', textPos: '', playerInfo: playerL};
    const obj2: playerInfoProps = {style:'flex-row-reverse', textPos:'text-end', playerInfo: playerR};
    return (
        <div className="bg-cyan-600  w-[100%] h-[18.5%] rounded-[10px] flex items-center justify-between">
            <PlayerInfo {...obj1}/>
            <MatchScore />
            <PlayerInfo {...obj2}/>
        </div>
    );
}

export default GameResultBar;