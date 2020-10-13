import React, { useState } from "react";
import QueryBuilder from "../components/QueryBuilder";

import Visualizer from "./Visualizer";
import PropertySelector from "../components/PropertySelector";
import TemplateSelector from "../components/TemplateSelector";

const Explorer = (props) => {
  const [availableProperties, setAvailableProperties] = useState();
  const [activeProperties, setActiveProperties] = useState([]);

  return (
    <>
      <TemplateSelector setAvailibleProperties={setAvailableProperties} />
      <PropertySelector
        availibleProperties={availableProperties}
        setActiveProperties={setActiveProperties}
      />
      <QueryBuilder activeProperties={activeProperties} />
      <Visualizer activeProperties={activeProperties} />
    </>
  );
};

export default Explorer;
