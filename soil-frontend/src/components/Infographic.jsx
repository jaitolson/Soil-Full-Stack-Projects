import React from "react";
import PropTypes from "prop-types";
import Lottie from "react-lottie";
import Card from "./Card";
import centralAnimationData from "../animations/central-animation.json";
import "../styles/Infographic.css";

const Infographic = ({ data }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: centralAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Ensure there are exactly 8 data items for the 3x3 grid excluding the center
  const gridData = [...data, ...Array(8 - data.length).fill({ topic: "Empty", description: "No content" })];

  return (
    <section className="infographic-container py-10 bg-gray-50">
      <div className="container mx-auto grid grid-cols-3 grid-rows-3 gap-4">
        {Array(9).fill().map((_, index) => {
          if (index === 4) {
            return (
              <div key={index} className="flex justify-center items-center">
                <Lottie options={defaultOptions} height={200} width={200} />
              </div>
            );
          } else {
            return (
              <div key={index} className="flex justify-center items-center">
                <Card {...gridData[index < 4 ? index : index - 1]} />
              </div>
            );
          }
        })}
      </div>
    </section>
  );
};

Infographic.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      topic: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Infographic;
