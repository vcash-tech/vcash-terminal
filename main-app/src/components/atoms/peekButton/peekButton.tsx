import React from "react"

type PeekButtonProps = {
  buttonContent: React.ReactNode;
  handleClick: () => void;
  side?: "left" | "right"; // optional, defaults to 'right'
};

export default function PeekButton({
  buttonContent,
  handleClick,
  side = "right",
}: PeekButtonProps) {
  return (
    <button
      className={`peek-button ${side === "left" ? "peek-left" : "peek-right"}`}
      onClick={handleClick}
    >
      <div className="peek-button-content">{buttonContent}</div>
    </button>
  )
}
