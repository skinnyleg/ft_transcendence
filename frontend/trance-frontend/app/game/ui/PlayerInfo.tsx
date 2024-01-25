import { playerInfo, playerInfoProps } from "../types/interfaces";

const PlayerInfo: React.FC<playerInfoProps> = ({style, textPos, playerInfo}) => {

    return (
        <div className={`flex items-center h-full w-[20%] rounded-lg self-start ${style}`}>
            <div className="rounded-lg bg-cyan-900 max-w-[50%] max-h-[80%] min-w-[30%] min-h-[40%]">
                <img src={playerInfo?.picture} className="w-full h-full rounded-lg"/>
            </div>
            <div className={textPos}>
                <span className={`box-decoration-slice bg-gradient-to-r from-cyan-900 to-cyan-600 text-white text-lg lg:text-2xl self-start`}>
                    {playerInfo?.name}<br />
                </span>
                <span className={` hidden lg:inline-block box-decoration-slice bg-gradient-to-r from-cyan-900 to-cyan-600 text-white text-2xl self-end`}>
                    PING PONG ZONE
                </span>
            </div>
        </div>
    );
}

export default PlayerInfo;