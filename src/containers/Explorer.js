import React, { useState } from "react";
import QueryBuilder from "../components/QueryBuilder";

import { Layout, Row, Col, Divider } from "antd";

import Visualizer from "./Visualizer";
import PropertySelector from "../components/PropertySelector";
import TemplateSelector from "../components/TemplateSelector";

const Explorer = (props) => {
  const [availableProperties, setAvailableProperties] = useState();
  const [activeProperties, setActiveProperties] = useState([]);

  const { Header, Footer, Sider, Content } = Layout;

  return (
    <>
    <Layout>
      <Sider width = {500}>
        <TemplateSelector setAvailableProperties={setAvailableProperties} />
        <QueryBuilder activeProperties={activeProperties} />
      </Sider>
      <Layout>
        <Header><PropertySelector
        availableProperties={availableProperties}
        setActiveProperties={setActiveProperties}
      /></Header>
      <Content><Visualizer activeProperties={activeProperties} /></Content>
      </Layout>
      
      
      
    </Layout>
  </>
  );
};

export default Explorer;
