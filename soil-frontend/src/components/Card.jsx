// Card.js
import React from "react";
import PropTypes from "prop-types";
import "../styles/Card.css";

const Card = ({ topic, description }) => {
  return (
    <div className="card">
      <h3 className="card-topic">{topic}</h3>
      <p className="card-description">{description}</p>
    </div>
  );
};

Card.propTypes = {
  topic: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Card;
