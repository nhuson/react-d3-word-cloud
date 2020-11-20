import PropTypes from "prop-types";
import ReactFauxDom from "react-faux-dom";
import cloud from "d3-cloud";
import React, { useEffect } from "react";
import { select } from "d3-selection";

import { defaultFontSizeMapper } from "./defaultMappers";

const WordCloud = props => {
  WordCloud.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
      })
    ).isRequired,
    font: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    fontSizeMapper: PropTypes.func,
    height: PropTypes.number,
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    rotate: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    width: PropTypes.number,
    onWordClick: PropTypes.func,
    onWordMouseOut: PropTypes.func,
    onWordMouseOver: PropTypes.func,
    color: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  const defaultProps = {
    width: 700,
    height: 600,
    padding: 5,
    font: "serif",
    fontSizeMapper: defaultFontSizeMapper,
    rotate: 0,
    onWordClick: null,
    onWordMouseOver: null,
    onWordMouseOut: null
  };
  const wordCloud = ReactFauxDom.createElement("div");
  const {
    data,
    width,
    height,
    padding,
    font,
    fontSizeMapper,
    rotate,
    onWordClick,
    onWordMouseOver,
    onWordMouseOut,
    defaultColor
  } = props;
  const fillColor = (d, i) => (d.color ? d.color : defaultColor);
  const fontWeight = (d, i) => (d.fontWeight ? d.fontWeight : "normal");

  useEffect(() => {
    const layout = cloud()
      .size([width || defaultProps.width, height || defaultProps.height])
      .font(font ||defaultProps.font)
      .words(data)
      .padding(padding || defaultProps.padding)
      .rotate(rotate)
      .fontSize(fontSizeMapper)
      .on("end", words => {
        const texts = select(wordCloud)
          .append("svg")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
          .append("g")
          .attr(
            "transform",
            `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
          )
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", d => `${d.size}px`)
          .style("font-family", font)
          .style("fill", fillColor)
          .style("font-weight", fontWeight)
          .attr("text-anchor", "middle")
          .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
          .text(d => d.text);

        if (onWordClick) {
          texts.on("click", onWordClick);
        }
        if (onWordMouseOver) {
          texts.on("mouseover", onWordMouseOver);
        }
        if (onWordMouseOut) {
          texts.on("mouseout", onWordMouseOut);
        }
      });

    layout.start();
  }, []);

  // render based on new data
  return wordCloud.toReact();
};

export default WordCloud;
