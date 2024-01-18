import PlayerInfo from "./PlayerInfo";
import MatchScore from "./MatchScore";
import { useState, useEffect, useContext } from "react";
import { GameContext, gameSocketContext } from "../../context/gameSockets";
import { playerInfo, playerInfoProps } from "../types/interfaces";


const GameResultBar = () => {

    const {playerL, playerR} = useContext(GameContext);
    const gameSocket = useContext(gameSocketContext)

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