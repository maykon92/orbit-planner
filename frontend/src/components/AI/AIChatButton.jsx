import { Fab } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useEffect, useRef, useState } from "react";

const AIChatButton = ({ onClick }) => {
  const buttonRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [moved, setMoved] = useState(false);

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("aiButtonPosition");

    if (saved) return JSON.parse(saved);

    return {
      x: window.innerWidth - 100,
      y: window.innerHeight - 110,
    };
  });

  useEffect(() => {
    localStorage.setItem("aiButtonPosition", JSON.stringify(position));
  }, [position]);

  const handlePointerDown = (e) => {
    setDragging(true);
    setMoved(false);

    buttonRef.current.dataset.offsetX = e.clientX - position.x;
    buttonRef.current.dataset.offsetY = e.clientY - position.y;
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;

    setMoved(true);

    const offsetX = Number(buttonRef.current.dataset.offsetX);
    const offsetY = Number(buttonRef.current.dataset.offsetY);

    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;

    setPosition({
      x: Math.max(12, Math.min(newX, maxX)),
      y: Math.max(12, Math.min(newY, maxY)),
    });
  };

  const handlePointerUp = () => {
    setDragging(false);

    if (!moved) {
      onClick();
    }
  };

  return (
    <Fab
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      sx={{
        position: "fixed",
        left: position.x,
        top: position.y,
        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        color: "#fff",
        width: 70,
        height: 70,
        boxShadow: "0 20px 40px rgba(37,99,235,0.45)",
        zIndex: 9999,
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",

        "&:hover": {
          background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
        },
      }}
    >
      <AutoAwesomeIcon sx={{ fontSize: 34 }} />
    </Fab>
  );
};

export default AIChatButton;