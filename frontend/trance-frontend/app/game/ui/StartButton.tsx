import { FC } from "react"


interface StartButtonProps {
    startGame: () => void 
}

const StartButton: FC<StartButtonProps> = ({startGame}) => {
    return (
        <button 
            className='text-white text-2xl bg-blue-600 border-2 rounded-[15px] w-[100px]'
            onClick={startGame}>
            START GAME
        </button>
    )
}


export default StartButton;