import React, { useEffect, useRef, useState } from "react";
import "./Grids.css";

const Grids = () => {
  const [activeGrids, setActiveGrids] = useState([]);
  let interval = useRef(null);

  const row1 = [1, 2, 3];
  const row2 = [4, 5, 6];
  const row3 = [7, 8, 9];

  const addGrid = (grid) => {
    setActiveGrids((prev) => {
      if (activeGrids.includes(grid))
        return prev.filter((gridId) => gridId != grid);

      return [...prev, grid];
    });
  };

  const Rows = ({ list }) => {
    return list.map((grid) => {
      return (
        <div
          key={grid}
          className={`grid ${activeGrids.includes(grid) ? "active" : ""}`}
          onClick={() => addGrid(grid)}
        ></div>
      );
    });
  };

  const startInterval = () => {
    interval.current = setInterval(() => {
      console.log("interval");
      setActiveGrids((prev) => {
        return prev.slice(0, -1);
      });
    }, 1000);
  };

  useEffect(() => {
    if (activeGrids.length === 0) {
      clearInterval(interval.current);
      interval.current = null;
    }

    if (activeGrids.length === 9) {
      startInterval();
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeGrids]);

  return (
    <div className="grids-container">
      <div className="grid-row">
        <Rows list={row1} />
      </div>
      <div className="grid-row">
        <Rows list={row2} />
      </div>
      <div className="grid-row">
        <Rows list={row3} />
      </div>
    </div>
  );
};

export default Grids;
