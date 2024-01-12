import { useState, useEffect } from "react";
import gameSocket from "../../context/gameSockets";

const MatchScore = () => {
    return null;

    // const [scores, setScore] = useState({playerL: 0, playerR: 0});

    // useEffect(() => {
        
    //     gameSocket.on('score-update', (data) => {
    //         setScore(data);
    //     });

    //     return () => {
    //         gameSocket.off('score-update');
    //     };

    // },[]);
    
    // return (
    //     <div className="flex flex-row justify-center rounded-lg h-[50%] w-[30%] space-x-[2.5%]">
    //         <div className="bg-cyan-100 rounded-lg text-3xl flex justify-center items-center h-[65%] w-[15%]">{scores.playerL}</div>
    //         <div className=" text-3xl flex justify-center items-center h-[65%] text-cyan-900"> VS </div>
    //         <div className="bg-cyan-100 rounded-lg text-3xl flex justify-center items-center  h-[65%] w-[15%]">{scores.playerR}</div>
    //     </div>
    // );
};

export default MatchScore;