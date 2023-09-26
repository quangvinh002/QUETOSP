import React from "react";

import { Row, Col } from "antd";
import Countdown from "react-countdown";

import Line from "../line";
import Footer from "../footer";

export default function ComingSoon() {
  const Completionist = () => <span>You are good to go!</span>;
  const timerClass = "hp-d-block hp-font-weight-300 hp-text-color-primary-1";
  const timerTextClass = "hp-d-block hp-font-weight-300 hp-text-color-black-100 hp-text-color-dark-30 h4";

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <Row align="middle" justify="center">
          <div className="hp-comingsoon-timer-item">
            <span className={timerClass}>{days}</span>
            <span className={timerTextClass}>DAYS</span>
          </div>

          <div className="hp-comingsoon-timer-item">
            <span className={timerClass}>{hours}</span>
            <span className={timerTextClass}>HOURS</span>
          </div>

          <div className="hp-comingsoon-timer-item">
            <span className={timerClass}>{minutes}</span>
            <span className={timerTextClass}>MINUTES</span>
          </div>

          <div className="hp-comingsoon-timer-item">
            <span className={timerClass}>{seconds}</span>
            <span className={timerTextClass}>SECONDS</span>
          </div>
        </Row>
      );
    }
  };

  return (
    <Row className="hp-text-center hp-overflow-hidden">
      <Line />
      <Col className="hp-error-content hp-py-32" span={24}>
        <Row className="hp-h-100" align="middle" justify="center">
          <Col>
            <h2 className="h1 hp-mb-16">We are launching soon</h2>

            <Countdown date="2030-02-01" renderer={renderer} />
          </Col>
        </Row>
      </Col>

      <Footer />
    </Row>
  );
}
