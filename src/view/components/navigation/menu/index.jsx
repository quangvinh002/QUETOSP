import React from "react";

import { Row, Col } from "antd";

import PageContent from "../../../../layout/components/content/page-content";
import TopNavigationMenu from "./TopNavigation";
import InlineMenu from "./inline";
import VerticalMenu from "./vertical";
import CollapsedMenu from "./collapsed";

export default function Menu() {
  return (
    <Row gutter={[32, 32]} className="hp-mb-32">
      <Col span={24}>
        <PageContent
          title="Menu"
          desc="A versatile menu for navigation"
          breadcrumb={[
            {
              title: "Components",
              link: "/components/components-page"
            },
            {
              title: "Navigation",
            },
            {
              title: "Menu",
            }
          ]}
        />
      </Col>

      <Col span={24}>
        <TopNavigationMenu />
      </Col>

      <Col span={24}>
        <InlineMenu />
      </Col>

      <Col span={24}>
        <VerticalMenu />
      </Col>

      <Col span={24}>
        <CollapsedMenu />
      </Col>
    </Row>
  );
}
