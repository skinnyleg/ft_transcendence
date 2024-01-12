import { playerInfo } from "../types/interfaces";

export type playerInfoProps = {
    style: string,
    textPos: string,
    playerInfo: playerInfo | undefined,
}

const PlayerInfo: React.FC<playerInfoProps> = ({style, textPos, playerInfo}) => {
    return null;

    // return (
    //     <div className={`flex items-center h-full w-[20%] rounded-lg self-start ${style}`}>
    //         <div className="rounded-lg bg-cyan-900 w-[50%] h-[80%]">
    //             <img src={playerInfo?.picture} className=" w-full h-full rounded-lg"/>
    //         </div>
    //         <div className={textPos}>
    //             <span className={`box-decoration-slice bg-gradient-to-r from-cyan-900 to-cyan-600 text-white text-2xl self-start`}>
    //                 {playerInfo?.name}<br />
    //             </span>
    //             <span className={`box-decoration-slice bg-gradient-to-r from-cyan-900 to-cyan-600 text-white text-2xl self-end`}>
    //                 PING PONG ZONE
    //             </span>
    //         </div>
    //     </div>
    // );
}

export default PlayerInfo;