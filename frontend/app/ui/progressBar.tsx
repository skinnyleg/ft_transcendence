import { Progress } from "@nextui-org/react";

interface ProgressBarProps {
    level: number;
}

const  ProgressBar = ({ level }: ProgressBarProps) => {
    return(
        <div className="w-full bg-white rounded-xl">
  <div
    className="h-full bg-green-400 rounded-xl text-white text-center"
    style={{
        background: `linear-gradient(to right, #3af8c7 ${level}%, #00ced1 ${level}%)`,
      }}
      role="progressbar"
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={21}
  >
    {level}%
  </div>
</div>
    ) 
}

export default ProgressBar;