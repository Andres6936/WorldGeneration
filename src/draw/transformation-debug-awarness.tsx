import { PropsWithChildren, useMemo } from "react";

export const TransformationDebugAwareness = (
  props: PropsWithChildren<{ active: boolean }>,
) => {
  const classBy = useMemo(() => props.active
    ? "transform:scale(0.75)|translateY(5%)|rotateX(30deg)|rotateZ(10deg) outline:2px|solid|transparent "
    : "transform:scale(1)|translateY(0%)|rotateX(0%)|rotateZ(0%) ", [props.active])

  return (
    <div
      className={`rel transform:preserve-3d will-change:transform ~easing:ease-out transition:transform|1s,outline|1s,box-shadow|1s,opacity|1s ${classBy}`}
    >
      {props.children}
    </div>
  );
};
