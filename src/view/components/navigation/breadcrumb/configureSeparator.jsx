import React, { useState } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { monoBlue } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { configuredBreadcrumb } from "./code.js";

import { Card, Row, Col, Breadcrumb, Button } from "antd";
import { RiCodeSSlashLine } from "react-icons/ri";

export default function ConfiguredBreadcrumb() {
  const [checkedCode, setCheckedCode] = useState(false);
  const [codeClass, setCodeClass] = useState(false);

  function toggleChecked() {
    setTimeout(() => setCodeClass(!codeClass), 100);
    setCheckedCode(!checkedCode);
  }

  return (
    <Card className="hp-border-color-black-40">
      <Row>
        <Col className="hp-mb-16" lg={12} span={20}>
          <h4>Configuring the Separator</h4>
          <p className="hp-p1-body">
            The separator can be customized by setting the separator property:
            separator.x
          </p>
        </Col>

        <Col lg={12} span={4} className="hp-text-right">
          <Button
            onClick={toggleChecked}
            type="text"
            icon={<RiCodeSSlashLine className="hp-text-color-black-80" />}
          />
        </Col>

        <Col>
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>

            <Breadcrumb.Item href="#">
              Application Center
            </Breadcrumb.Item>

            <Breadcrumb.Item href="#">
              Application List
            </Breadcrumb.Item>

            <Breadcrumb.Item>An Application</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {checkedCode && (
        <SyntaxHighlighter
          language="javascript"
          className={`show-code hp-mt-24 ${codeClass && "show-code-active"}`}
          style={monoBlue}
        >
          {configuredBreadcrumb}
        </SyntaxHighlighter>
      )}
    </Card>
  );
}
