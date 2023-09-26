import React from "react";

import { Col, Row } from "antd";

export default function PageTitle(props) {
  const { pageTitle, pageText } = props;

  return (
    <Col span={24}>
      <Row>
        <Col span={24}>
          {pageTitle && <h1 className="hp-mb-8">{pageTitle}</h1>}
        </Col>

        <Col span={24}>
          {pageText && <p className="hp-mb-0 hp-p1-body">{pageText}</p>}
        </Col>
      </Row>
    </Col>
  );
}
