import React from "react";

import { Row, Col } from "antd";

import PageContent from "../../../../layout/components/content/page-content";
import BasicBreadcrumb from "./basic";
import BreadcrumbWithIcon from "./icon";
import ConfiguredBreadcrumb from "./configureSeparator";

export default function Breadcrumb() {
  return (
    <Row gutter={[32, 32]} className="hp-mb-32">
      <Col span={24}>
        <PageContent
          title="Breadcrumb"
          desc="A breadcrumb displays the current location within a hierarchy. It allows going back to states higher up in the hierarchy."
          breadcrumb={[
            {
              title: "Components",
              link: "/components/components-page"
            },
            {
              title: "Navigation",
            },
            {
              title: "Breadcrumb",
            }
          ]}
        />
      </Col>

      <Col span={24}>
        <BasicBreadcrumb />
      </Col>

      <Col span={24}>
        <ConfiguredBreadcrumb />
      </Col>

      <Col span={24}>
        <BreadcrumbWithIcon />
      </Col>
    </Row>
  );
}