import React from "react";

export default function Skeleton({ h = 14, w = "100%" }) {
  return <div className="skel" style={{ height: h, width: w }} />;
}
