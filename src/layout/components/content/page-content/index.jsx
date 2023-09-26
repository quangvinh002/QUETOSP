import React from "react";
import { Link } from "react-router-dom";

import { Breadcrumb, Col, Row } from "antd";

export default function PageContent(props) {
  const { title, breadcrumb, desc } = props;

  return (
    <Col span={24} className="hp-bg-black-bg hp-py-sm-32 hp-py-64 hp-px-sm-24 hp-px-md-48 hp-px-80 hp-overflow-hidden" style={{ borderRadius: 32 }}>
      <svg
        width={358}
        height={336}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hp-position-absolute-bottom-right hp-rtl-scale-x-n1"
      >
        <path
          d="M730.404 135.471 369.675-6.641l88.802 164.001-243.179-98.8 246.364 263.281-329.128-126.619 114.698 166.726-241.68-62.446"
          stroke="url(#a)"
          strokeWidth={40}
          strokeLinejoin="bevel"
        />
        <defs>
          <linearGradient
            id="a"
            x1={315.467}
            y1={6.875}
            x2={397.957}
            y2={337.724}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      <Row>
        <Col sm={12} span={24}>
          <Row>
            {
              title && (
                <Col span={24}>
                  <h1 className="hp-mb-0 hp-text-color-black-0">{title}</h1>
                </Col>
              )
            }

            {
              breadcrumb && (
                <Col span={24}>
                  <Breadcrumb className="hp-d-flex hp-flex-wrap hp-mt-24">
                    <Breadcrumb.Item>
                      <Link to="/" className="hp-text-color-black-0 hp-hover-text-color-primary-2">Home</Link>
                    </Breadcrumb.Item>

                    {
                      breadcrumb.map((item, index) => (
                        <Breadcrumb.Item key={index}>
                          <Link to={item.link ? item.link : '#'} className={`hp-text-color-black-0${item.link ? ' hp-hover-text-color-primary-2' : ''}`}>{item.title}</Link>
                        </Breadcrumb.Item>
                      ))
                    }
                  </Breadcrumb>
                </Col>
              )
            }

            {
              desc && (
                <Col span={24}>
                  <p className="h5 hp-mb-0 hp-mt-24 hp-text-color-black-0">{desc}</p>
                </Col>
              )
            }
          </Row>
        </Col>
      </Row>
    </Col>
  );
}
