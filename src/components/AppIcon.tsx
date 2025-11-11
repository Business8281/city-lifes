import React from "react";

const AppIcon = () => {
  return (
    <div className="flex items-center justify-center w-40 h-40 bg-[#3E88A5] rounded-xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="white"
        className="w-24 h-24"
      >
        {/* Three buildings cityscape icon */}
        <path d="M96 160h96v32H96v-32zm0 64h96v32H96v-32zm0 64h96v32H96v-32zm0 64h96v32H96v-32z" />
        <path d="M64 128c0-17.67 14.33-32 32-32h128c17.67 0 32 14.33 32 32v352H64V128z" />
        <path d="M320 64h96v32h-96V64zm0 64h96v32h-96v-32zm0 64h96v32h-96v-32zm0 64h96v32h-96v-32zm0 64h96v32h-96v-32zm0 64h96v32h-96v-32z" />
        <path d="M288 32c0-17.67 14.33-32 32-32h128c17.67 0 32 14.33 32 32v448H288V32z" />
        <path d="M128 256h64v32h-64v-32zm0 64h64v32h-64v-32zm0 64h64v32h-64v-32z" />
      </svg>
    </div>
  );
};

export default AppIcon;
