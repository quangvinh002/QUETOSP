import React, { useState } from "react";

import { Card, Row, Col, Dropdown, Menu } from "antd";
import { RiMoreFill } from "react-icons/ri";
import Chart from "react-apexcharts";

export default function AnalyticsRevenueRadarCard() {
  const menu = (
    <Menu>
      <Menu.Item>Last 28 Days</Menu.Item>
      <Menu.Item>Last 6 Month</Menu.Item>
      <Menu.Item>Last Year</Menu.Item>
    </Menu>
  );

  const [data] = useState({
    series: [
      {
        name: "Sales",
        data: [80, 50, 30, 40, 100, 20],
      },
      {
        name: "Expense",
        data: [20, 30, 40, 80, 20, 80],
      },
    ],
    options: {
      chart: {
        id: "revenue-radar-card",
        fontFamily: "Manrope, sans-serif",
        height: 350,

        type: "radar",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        dropShadow: {
          enabled: true,
          blur: 4,
          left: 1,
          top: 1,
          opacity: 0.1,
        },
      },
      fill: {
        opacity: [1, 1],
      },
      stroke: {
        show: false,
        width: 0,
      },
      markers: {
        size: 0,
      },

      colors: ["rgba(85, 177, 243, 0.8)", "rgba(0, 247, 191, 0.8)"],

      labels: ["Marketing", "Payments", "Bills"],

      dataLabels: {
        enabled: false,
      },
      yaxis: {
        show: false,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },

      plotOptions: {
        radar: {
          polygons: {
            connectorColors: "#fff",
          },
        },
      },
      legend: {
        itemMargin: {
          horizontal: 12,
          vertical: 16,
        },
        horizontalAlign: "center",
        position: "bottom",
        fontSize: "12px",
        fontWeight: "medium",

        markers: {
          radius: 12,
        },
      },
    },
  });

  return (
    <Card className="hp-border-color-black-40 hp-card-6 hp-pb-24">
      <Row>
        <Col span={24}>
          <Row justify="space-between" align="top">
            <Row align="middle">
              <h5 className="hp-mr-8 hp-mb-0">Revenue </h5>
              <p className="hp-badge-text hp-mb-0">Last 6 Months</p>
            </Row>

            <Col>
              <Dropdown overlay={menu} trigger={["click"]}>
                <RiMoreFill size={24} onClick={(e) => e.preventDefault()} className="hp-text-color-dark-0" />
              </Dropdown>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <div
            id="revenue-radar-card"
            className="hp-d-flex-full-center hp-donut-chart"
          >
            <Chart
              options={data.options}
              series={data.series}
              type="radar"
              height="85%"
              legend="legend"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}
