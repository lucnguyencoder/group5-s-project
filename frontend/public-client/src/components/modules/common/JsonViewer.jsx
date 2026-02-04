import React from "react";

function JsonViewer({ json }) {
  return (
    <pre>
      <code>{JSON.stringify(json, null, 2)}</code>{" "}
    </pre>
  );
}

export default JsonViewer;
