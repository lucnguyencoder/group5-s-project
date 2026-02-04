import React from "react";

function InformationTile({ icon, title, action }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xs bg-sidebar">
      <div className="mr-4">{icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="ml-24 text-right">{action}</div>
    </div>
  );
}

export default InformationTile;
