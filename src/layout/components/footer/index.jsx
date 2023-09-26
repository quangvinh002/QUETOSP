import { Col, Layout, Row } from "antd";

export default function MenuFooter() {
  const { Footer } = Layout;
  
  return (
    <Footer className="hp-bg-color-black-20 hp-bg-color-dark-90">
      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <p className="hp-badge-text hp-font-weight-600 hp-mb-0 hp-text-color-dark-30">
            COPYRIGHT ©2022 NAD, All rights Reserved
          </p>
        </Col>
      </Row>
    </Footer>
  );
};