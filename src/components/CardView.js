import React, { useEffect, useState } from "react";
import { Card, Col, Row, Pagination } from "antd";
import { connect } from "react-redux";
import { fetch } from "../utils/OmekaS";
import { useCookies } from "react-cookie";

const chunk = (array, size) => {
  if (!array) return [];
  const firstChunk = array.slice(0, size);
  if (!firstChunk.length) {
    return array;
  }
  return [firstChunk].concat(chunk(array.slice(size, array.length), size));
};

const CardView = (props) => {
  const [cookies] = useCookies(["userInfo"]);

  const [items, setItems] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardGrid, setCardGrid] = useState(<></>);
  const [total, setTotal] = useState(0);

  const PAGESIZE = 20;

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await fetch(
        cookies.userInfo.host,
        props.query.endpoint,
        props.query.params,
        0,
        PAGESIZE
      );

      setItems(data);
    };

    fetchInitial();
  }, [props.query, cookies.userInfo.host]);

  useEffect(() => {
    setCards(
      items.map((item) => (
        <Card
          key={item["o:id"]}
          title={item["o:title"] ?? "(no 'title' found)"}
          bordered={false}
        >
          {props.activeProperties.map((property) => {
            const label = property["o:label"];
            const value = item[property["o:term"]];

            const line =
              value && value.length > 0 && value[0].type === "literal" ? (
                <p>
                  <b>{label}: </b> {value[0]["@value"]}
                </p>
              ) : (
                ""
              );

            return line;
          })}
        </Card>
      ))
    );
  }, [props.activeProperties, items]);

  useEffect(() => {
    const cardCols = cards.map((card, i) => (
      <Col key={i} span={6}>
        {card}
      </Col>
    ));
    const rows = chunk(cardCols, 4).map((chunk, i) => (
      <Row key={i} gutter={[16, 16]}>
        {chunk}
      </Row>
    ));

    setCardGrid(rows);
  }, [cards]);

  const handleChange = (page, pageSize) => {
    fetch(
      cookies.userInfo.host,
      props.query.endpoint,
      props.query.params,
      (page - 1) * pageSize,
      PAGESIZE
    ).then((data) => setItems(data));
  };

  return (
    <>
      {cardGrid}
      <Pagination
        defaultCurrent={1}
        total={props.query.size}
        onChange={handleChange}
      />
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    ...props,
    query: state.query,
  };
};

export default connect(mapStateToProps)(CardView);
