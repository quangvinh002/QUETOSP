import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Button } from "antd";

import Line from "../line";
import Footer from "../footer";

export default function Error500() {
  return (
    <Row className="hp-text-center hp-overflow-hidden">
      <Line />
      <Col className="hp-error-content hp-py-32" span={24}>
        <Row className="hp-h-100" align="middle" justify="center">
          <Col>
            <h1 className="hp-error-content-title hp-font-weight-300 hp-text-color-black-bg hp-text-color-dark-0 hp-mb-0">
              500
            </h1>

            <h2 className="h1 hp-mb-16">Something went wrong.</h2>

            <p className="hp-mb-32 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0">We are trying to fix the problem.</p>

            <Link to="/">
              <Button type="primary">Back to Home</Button>
            </Link>
          </Col>
        </Row>
      </Col>

      <Footer />
    </Row>
  );
}
