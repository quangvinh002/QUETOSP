import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router";

import { useDispatch, useSelector } from "react-redux";
import {
  contentWidth,
  direction,
  layoutChange,
  navigationBg,
  navigationFull,
  sidebarCollapseButton,
  sidebarCollapsed,
  theme,
} from "../../../redux/customise/customiseActions";

import { Row, Col, Button, Tag } from "antd";
import { RiCloseFill } from "react-icons/ri";
import { motion } from "framer-motion/dist/framer-motion";

export default function CustomiseTheme() {
  const [active, setActive] = useState(false);

  // Redux
  const customise = useSelector((state) => state.customise);
  const dispatch = useDispatch();

  // Location
  const location = useHistory();

  // Theme Active
  let themeRef = useRef(null);
  themeRef = [];

  const [themeLocal, setThemeLocal] = useState();
  const [themeClickCheck, setThemeClickCheck] = useState(false);

  function themeRefActive(e) {
    if (e == "light") {
      themeRef[0].classList.add("active");
      themeRef[1].classList.remove("active");
    }

    if (e == "dark") {
      themeRef[1].classList.add("active");
      themeRef[0].classList.remove("active");
    }
  }

  useEffect(() => {
    if (themeClickCheck == false) {
      if (location.location.search == "?theme=dark") {
        localStorage.setItem("theme", "dark");
        setThemeLocal("dark");
        themeRefActive("dark");
      } else if (location.location.search == "?theme=light") {
        localStorage.setItem("theme", "light");
        setThemeLocal("light");
        themeRefActive("light");
      }
    }

    if (localStorage) {
      setThemeLocal(localStorage.getItem("theme"));
    }

    if (themeLocal) {
      themeRefActive(themeLocal);
    } else {
      themeRefActive(customise.theme);
    }
  }, [themeRefActive]);

  function themeClick(index) {
    setThemeClickCheck(true);

    if (index == 0) {
      document.querySelector("body").classList.replace("dark", "light");
      localStorage.setItem("theme", "light");
      setThemeLocal("light");

      dispatch(theme("light"));
    } else {
      document.querySelector("body").classList.replace("light", "dark");
      localStorage.setItem("theme", "dark");
      setThemeLocal("dark");

      dispatch(theme("dark"));
    }

    for (let i = 0; i < themeRef.length; i++) {
      if (index == i) {
        themeRef[i].classList.add("active");
      } else {
        themeRef[i].classList.remove("active");
      }
    }
  }

  // Direction Active
  let directionRef = useRef(null);
  directionRef = [];

  useEffect(() => {
    if (location.location.search == "?direction=ltr") {
      directionRef[0].classList.add("active");
      directionRef[1].classList.remove("active");
    } else if (location.location.search == "?direction=rtl") {
      directionRef[1].classList.add("active");
      directionRef[0].classList.remove("active");
    } else if (customise.direction == "ltr") {
      directionRef[0].classList.add("active");
      directionRef[1].classList.remove("active");
    } else if (customise.direction == "rtl") {
      directionRef[1].classList.add("active");
      directionRef[0].classList.remove("active");
    }
  }, []);

  function directionClick(index) {
    if (index == 0) {
      dispatch(direction("ltr"));
      document.querySelector("html").setAttribute("dir", "ltr");
    } else {
      dispatch(direction("rtl"));
      document.querySelector("html").setAttribute("dir", "rtl");
    }

    for (let i = 0; i < directionRef.length; i++) {
      if (index == i) {
        directionRef[i].classList.add("active");
      } else {
        directionRef[i].classList.remove("active");
      }
    }
  }

  // Width Active
  let widthRef = useRef(null);
  widthRef = [];

  useEffect(() => {
    if (location.location.search == "?width=full") {
      widthRef[0].classList.add("active");
      widthRef[1].classList.remove("active");

      dispatch(contentWidth("full"));
    } else if (location.location.search == "?width=boxed") {
      widthRef[1].classList.add("active");
      widthRef[0].classList.remove("active");

      dispatch(contentWidth("boxed"));
    } else if (customise.contentWidth == "full") {
      widthRef[0].classList.add("active");
      widthRef[1].classList.remove("active");
    } else if (customise.contentWidth == "boxed") {
      widthRef[1].classList.add("active");
      widthRef[0].classList.remove("active");
    }
  }, []);

  function widthClick(index) {
    if (index == 0) {
      dispatch(contentWidth("full"));
    } else {
      dispatch(contentWidth("boxed"));
    }

    for (let i = 0; i < widthRef.length; i++) {
      if (index == i) {
        widthRef[i].classList.add("active");
      } else {
        widthRef[i].classList.remove("active");
      }
    }
  }

  // Navigation Active
  let navigationRef = useRef(null);
  navigationRef = [];

  let navigationChild1Ref = useRef(null);
  navigationChild1Ref = [];

  let navigationChild2Ref = useRef(null);
  navigationChild2Ref = [];

  const [child1Svg, setChild1Svg] = useState(0);
  const [child2Svg, setChild2Svg] = useState(0);

  useEffect(() => {
    if (location.location.search == "?vertical=collapse") {
      dispatch(layoutChange("VerticalLayout"));

      navigationRef[0].classList.add("active");
    }

    if (location.location.search == "?vertical=mini") {
      dispatch(layoutChange("VerticalLayout"));
      dispatch(sidebarCollapseButton(false));
      dispatch(sidebarCollapsed(true));

      setChild1Svg(0);

      navigationChild1Ref[0].classList.remove("active");
      navigationChild1Ref[0].classList.remove("active-check");
      navigationChild1Ref[1].classList.add("active");
      navigationChild1Ref[1].classList.add("active-check");
    }

    if (location.location.search == "?vertical=menu") {
      dispatch(layoutChange("VerticalLayout"));
      dispatch(sidebarCollapseButton(false));

      navigationRef[0].classList.add("active");
    }

    //--

    if (location.location.search == "?horizontal=menu") {
      dispatch(layoutChange("HorizontalLayout"));

      navigationRef[1].classList.add("active");
      navigationRef[0].classList.remove("active");

      navigationChild1Ref[0].classList.remove("active");
      navigationChild2Ref[0].classList.add("active");
    }

    if (location.location.search == "?horizontal=full") {
      dispatch(layoutChange("HorizontalLayout"));
      dispatch(navigationFull(true));

      navigationRef[1].classList.add("active");
      navigationRef[0].classList.remove("active");

      navigationChild1Ref[0].classList.remove("active");
      navigationChild2Ref[1].classList.add("active");
    }

    if (location.location.search == "?horizontal=bg") {
      dispatch(layoutChange("HorizontalLayout"));
      dispatch(navigationFull(true));
      dispatch(navigationBg(true));

      navigationRef[1].classList.add("active");
      navigationRef[0].classList.remove("active");

      navigationChild1Ref[0].classList.remove("active");
      navigationChild2Ref[2].classList.add("active");
    }

    //--

    if (location.location.search == "") {
      if (customise.layout == "VerticalLayout") {
        navigationRef[0].classList.add("active");
        navigationRef[1].classList.remove("active");

        for (let i = 0; i < navigationChild2Ref.length; i++) {
          navigationChild2Ref[i].classList.remove("active");
        }

        navigationChild1Ref[0].classList.add("active");

        //--

        if (customise.sidebarCollapsed == false) {
          setChild1Svg(0);

          navigationChild1Ref[0].classList.add("active");
          navigationChild1Ref[1].classList.remove("active");
        }

        if (customise.sidebarCollapsed == true) {
          setChild1Svg(1);

          navigationChild1Ref[1].classList.add("active");
          navigationChild1Ref[0].classList.remove("active");
        }

        if (customise.sidebarCollapseButton == false) {
          setChild1Svg(2);

          navigationChild1Ref[0].classList.remove("active");
          navigationChild1Ref[1].classList.remove("active");
          navigationChild1Ref[2].classList.add("active");
        }
      }

      if (customise.layout == "HorizontalLayout") {
        navigationRef[1].classList.add("active");
        navigationRef[0].classList.remove("active");

        for (let i = 0; i < navigationChild1Ref.length; i++) {
          navigationChild1Ref[i].classList.remove("active");
        }

        //--

        if (customise.navigationFull == true) {
          setChild2Svg(1);

          navigationChild2Ref[0].classList.remove("active");
          navigationChild2Ref[1].classList.add("active");
          navigationChild2Ref[2].classList.remove("active");
        }

        if (customise.navigationBg == true) {
          setChild2Svg(2);

          navigationChild2Ref[0].classList.remove("active");
          navigationChild2Ref[1].classList.remove("active");
          navigationChild2Ref[2].classList.add("active");
        }

        if (
          customise.navigationFull == false &&
          customise.navigationBg == false
        ) {
          setChild2Svg(0);

          navigationChild2Ref[0].classList.add("active");
          navigationChild2Ref[1].classList.remove("active");
          navigationChild2Ref[2].classList.remove("active");
        }
      }
    }
  }, []);

  function navigationClick(index) {
    for (let i = 0; i < navigationRef.length; i++) {
      if (index == i) {
        navigationRef[i].classList.add("active");
      } else {
        navigationRef[i].classList.remove("active");
      }
    }

    if (index == 0) {
      dispatch(layoutChange("VerticalLayout"));

      for (let i = 0; i < navigationChild2Ref.length; i++) {
        navigationChild2Ref[i].classList.remove("active");
      }

      for (let i = 0; i < navigationChild1Ref.length; i++) {
        if (navigationChild1Ref[i].classList.contains("active-check")) {
          navigationChild1Ref[i].classList.add("active");
        } else {
          navigationChild1Ref[i].classList.remove("active");
        }
      }
    }

    if (index == 1) {
      dispatch(layoutChange("HorizontalLayout"));

      for (let i = 0; i < navigationChild1Ref.length; i++) {
        navigationChild1Ref[i].classList.remove("active");
      }

      for (let i = 0; i < navigationChild2Ref.length; i++) {
        if (navigationChild2Ref[i].classList.contains("active-check")) {
          navigationChild2Ref[i].classList.add("active");
        } else {
          navigationChild2Ref[i].classList.remove("active");
        }
      }
    }
  }

  function navigationChild1Click(index) {
    navigationRef[0].classList.add("active");
    navigationRef[1].classList.remove("active");

    setChild1Svg(index);

    dispatch(layoutChange("VerticalLayout"));

    if (index == 0) {
      dispatch(sidebarCollapseButton(true));
      dispatch(sidebarCollapsed(false));
    } else if (index == 1) {
      dispatch(sidebarCollapseButton(true));
      dispatch(sidebarCollapsed(true));
    } else {
      dispatch(sidebarCollapseButton(false));
    }

    for (let i = 0; i < navigationChild1Ref.length; i++) {
      if (index == i) {
        navigationChild1Ref[i].classList.add("active");
        navigationChild1Ref[i].classList.add("active-check");
      } else {
        navigationChild1Ref[i].classList.remove("active");
        navigationChild1Ref[i].classList.remove("active-check");
      }
    }

    for (let i = 0; i < navigationChild2Ref.length; i++) {
      navigationChild2Ref[i].classList.remove("active");
    }
  }

  function navigationChild2Click(index) {
    navigationRef[1].classList.add("active");
    navigationRef[0].classList.remove("active");

    setChild2Svg(index);

    dispatch(layoutChange("HorizontalLayout"));

    if (index == 0) {
      dispatch(navigationFull(false));
      dispatch(navigationBg(false));
    } else if (index == 1) {
      dispatch(navigationFull(true));
      dispatch(navigationBg(false));
    } else {
      dispatch(navigationFull(false));
      dispatch(navigationBg(true));
    }

    for (let i = 0; i < navigationChild2Ref.length; i++) {
      if (index == i) {
        navigationChild2Ref[i].classList.add("active");
        navigationChild2Ref[i].classList.add("active-check");
      } else {
        navigationChild2Ref[i].classList.remove("active");
        navigationChild2Ref[i].classList.remove("active-check");
      }
    }

    for (let i = 0; i < navigationChild1Ref.length; i++) {
      navigationChild1Ref[i].classList.remove("active");
    }
  }

  return (
    <div className={`hp-theme-customise ${active && "active"}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "tween", duration: 0.5, delay: 0.2 }}
        className="hp-theme-customise-button"
        onClick={() => setActive(!active)}
      >
        <div className="hp-theme-customise-button-bg">
          <svg
            width="48"
            height="121"
            viewBox="0 0 48 121"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38.6313 21.7613C46.5046 11.6029 47.6987 2.40985 48 0V61H0C1.03187 53.7789 1.67112 44.3597 13.2122 37.7607C22.0261 32.721 32.4115 29.7862 38.6313 21.7613Z"
              fill="white"
            />
            <path
              d="M38.6058 99.5632C46.502 109.568 47.6984 118.627 48 121V61H0C1.03532 68.1265 1.67539 77.4295 13.3283 83.9234C22.1048 88.8143 32.3812 91.6764 38.6058 99.5632Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="hp-theme-customise-button-icon">
          <span>
            <span></span>
            <span></span>
            <span></span>
          </span>

          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.19 0H5.81C2.17 0 0 2.17 0 5.81V14.18C0 17.83 2.17 20 5.81 20H14.18C17.82 20 19.99 17.83 19.99 14.19V5.81C20 2.17 17.83 0 14.19 0ZM5.67 3.5C5.67 3.09 6.01 2.75 6.42 2.75C6.83 2.75 7.17 3.09 7.17 3.5V7.4C7.17 7.81 6.83 8.15 6.42 8.15C6.01 8.15 5.67 7.81 5.67 7.4V3.5ZM7.52282 14.4313C7.31938 14.5216 7.17 14.7132 7.17 14.9358V16.5C7.17 16.91 6.83 17.25 6.42 17.25C6.01 17.25 5.67 16.91 5.67 16.5V14.9358C5.67 14.7132 5.5206 14.5216 5.31723 14.4311C4.36275 14.0064 3.7 13.058 3.7 11.95C3.7 10.45 4.92 9.22 6.42 9.22C7.92 9.22 9.15 10.44 9.15 11.95C9.15 13.0582 8.47913 14.0066 7.52282 14.4313ZM14.33 16.5C14.33 16.91 13.99 17.25 13.58 17.25C13.17 17.25 12.83 16.91 12.83 16.5V12.6C12.83 12.19 13.17 11.85 13.58 11.85C13.99 11.85 14.33 12.19 14.33 12.6V16.5ZM13.58 10.77C12.08 10.77 10.85 9.55 10.85 8.04C10.85 6.93185 11.5209 5.98342 12.4772 5.55873C12.6806 5.46839 12.83 5.27681 12.83 5.05421V3.5C12.83 3.09 13.17 2.75 13.58 2.75C13.99 2.75 14.33 3.09 14.33 3.5V5.06421C14.33 5.28681 14.4794 5.47835 14.6828 5.56885C15.6372 5.9936 16.3 6.94195 16.3 8.05C16.3 9.55 15.08 10.77 13.58 10.77Z"
              fill="#0010F7"
            />
          </svg>
        </div>
      </motion.div>

      <div className="hp-theme-customise-container hp-bg-black-0 hp-bg-dark-90">
        <div className="hp-theme-customise-container-body hp-pb-md-96 hp-py-24 hp-px-24">
          <Row className="hp-theme-customise-container-body-item">
            <Col span={24} className="hp-mb-16">
              <span className="hp-d-block hp-caption hp-text-color-black-60">
                THEME
              </span>
              <span className="hp-d-block h5 hp-text-color-black-100 hp-text-color-dark-0">
                Dark & Light
              </span>
            </Col>

            <Col span={24}>
              <Row gutter={[24, 24]}>
                <Col md={12} span={24}>
                  <div
                    className="hp-theme-customise-container-body-item-svg active"
                    ref={(ref) => {
                      themeRef[0] = ref;
                    }}
                    onClick={() => themeClick(0)}
                  >
                    <svg
                      width="244"
                      height="150"
                      viewBox="0 0 244 150"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="1" y="1" width="242" height="148" fill="white" />
                      <rect
                        width="37"
                        height="138"
                        transform="translate(6 6)"
                        fill="#DFE6E9"
                      />
                      <path
                        d="M33.7528 18.2807C32.9591 18.059 32.6126 18.0257 32.6126 18.0257C32.4785 18.0036 31.9531 17.9149 31.2377 17.8928C30.6676 17.8041 30.0751 17.6489 29.6839 17.3275C29.2591 16.9728 28.5437 16.3632 28.2642 16.2192C28.2531 16.2081 28.2419 16.2081 28.2307 16.2081C27.1576 15.4433 25.8497 15 24.4413 15C22.8316 15 21.3672 15.5653 20.227 16.5073C19.9029 16.7512 19.5116 17.0837 19.2434 17.3164C18.8521 17.6489 18.2597 17.793 17.6896 17.8817C16.9742 17.9038 16.4488 18.0036 16.3146 18.0147C16.3146 18.0147 16.0017 18.0479 15.2639 18.2474C14.9397 18.3361 14.9062 18.7794 15.208 18.9235C15.208 18.9235 15.2192 18.9235 15.2192 18.9346C15.6998 19.1673 16.1581 19.5442 16.7282 20.4419C17.4101 21.5059 17.5331 22.182 17.969 23.2017C18.6733 26.1277 21.3002 28.3 24.4301 28.3C27.4482 28.3 29.9969 26.2828 30.8129 23.5231C31.3718 22.315 31.4501 21.6167 32.199 20.4419C32.7691 19.5442 33.2274 19.1673 33.7081 18.9346C33.7416 18.9235 33.7751 18.9013 33.8087 18.8902C34.0881 18.7683 34.0546 18.3582 33.7528 18.2807ZM21.8814 23.4012C20.9872 23.1573 20.4283 22.3372 20.4283 22.3372C20.4283 22.3372 21.3896 21.6389 22.2839 21.8827C23.1781 22.1266 23.67 23.2127 23.67 23.2127C23.67 23.2127 22.7757 23.645 21.8814 23.4012ZM27.2023 23.4012C26.308 23.645 25.4138 23.2017 25.4138 23.2017C25.4138 23.2017 25.8944 22.1155 26.7999 21.8717C27.6942 21.6278 28.6555 22.3261 28.6555 22.3261C28.6555 22.3261 28.0966 23.1684 27.2023 23.4012Z"
                        fill="#B2BEC3"
                      />
                      <rect
                        width="191"
                        height="13"
                        transform="translate(47 6)"
                        fill="#DFE6E9"
                      />
                      <rect
                        width="191"
                        height="122"
                        transform="translate(47 22)"
                        fill="#DFE6E9"
                      />
                      <rect
                        x="1"
                        y="1"
                        width="242"
                        height="148"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>

                    <div className="hp-theme-customise-container-body-item-svg-check">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16.9987"
                          cy="17.0007"
                          r="14.1667"
                          fill="white"
                        />
                        <path
                          d="M16.9987 2.83398C9.1872 2.83398 2.83203 9.18915 2.83203 17.0007C2.83203 24.8122 9.1872 31.1673 16.9987 31.1673C24.8102 31.1673 31.1654 24.8122 31.1654 17.0007C31.1654 9.18915 24.8102 2.83398 16.9987 2.83398ZM16.9987 28.334C10.7498 28.334 5.66536 23.2496 5.66536 17.0007C5.66536 10.7517 10.7498 5.66732 16.9987 5.66732C23.2476 5.66732 28.332 10.7517 28.332 17.0007C28.332 23.2496 23.2476 28.334 16.9987 28.334Z"
                          fill="#2D3436"
                        />
                        <path
                          d="M14.1674 19.2479L10.9105 15.9966L8.91016 18.0026L14.1702 23.2514L23.6704 13.7512L21.6672 11.748L14.1674 19.2479Z"
                          fill="#2D3436"
                        />
                      </svg>
                    </div>
                  </div>
                </Col>

                <Col md={12} span={24}>
                  <div
                    className="hp-theme-customise-container-body-item-svg hp-position-relative"
                    ref={(ref) => {
                      themeRef[1] = ref;
                    }}
                    onClick={() => themeClick(1)}
                  >
                    <svg
                      width="244"
                      height="150"
                      viewBox="0 0 244 150"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="244" height="150" fill="#111314" />
                      <rect
                        width="37"
                        height="138"
                        transform="translate(6 6)"
                        fill="#2D3436"
                      />
                      <path
                        d="M33.7528 18.2807C32.9591 18.059 32.6126 18.0257 32.6126 18.0257C32.4785 18.0036 31.9531 17.9149 31.2377 17.8928C30.6676 17.8041 30.0751 17.6489 29.6839 17.3275C29.2591 16.9728 28.5437 16.3633 28.2642 16.2192C28.2531 16.2081 28.2419 16.2081 28.2307 16.2081C27.1576 15.4433 25.8497 15 24.4413 15C22.8316 15 21.3672 15.5653 20.227 16.5073C19.9029 16.7512 19.5116 17.0837 19.2434 17.3164C18.8521 17.6489 18.2597 17.793 17.6896 17.8817C16.9742 17.9038 16.4488 18.0036 16.3146 18.0147C16.3146 18.0147 16.0017 18.0479 15.2639 18.2474C14.9397 18.3361 14.9062 18.7794 15.208 18.9235C15.208 18.9235 15.2192 18.9235 15.2192 18.9346C15.6998 19.1673 16.1581 19.5442 16.7282 20.4419C17.4101 21.5059 17.5331 22.182 17.969 23.2017C18.6733 26.1277 21.3002 28.3 24.4301 28.3C27.4482 28.3 29.9969 26.2828 30.8129 23.5231C31.3718 22.315 31.4501 21.6167 32.199 20.4419C32.7691 19.5442 33.2274 19.1673 33.7081 18.9346C33.7416 18.9235 33.7751 18.9013 33.8087 18.8902C34.0881 18.7683 34.0546 18.3582 33.7528 18.2807ZM21.8814 23.4012C20.9872 23.1573 20.4283 22.3372 20.4283 22.3372C20.4283 22.3372 21.3896 21.6389 22.2839 21.8827C23.1781 22.1266 23.67 23.2127 23.67 23.2127C23.67 23.2127 22.7757 23.645 21.8814 23.4012ZM27.2023 23.4012C26.308 23.645 25.4138 23.2017 25.4138 23.2017C25.4138 23.2017 25.8944 22.1155 26.7999 21.8717C27.6942 21.6278 28.6555 22.3261 28.6555 22.3261C28.6555 22.3261 28.0966 23.1684 27.2023 23.4012Z"
                        fill="#F7FAFC"
                      />
                      <rect
                        width="191"
                        height="13"
                        transform="translate(47 6)"
                        fill="#2D3436"
                      />
                      <rect
                        width="191"
                        height="122"
                        transform="translate(47 22)"
                        fill="#2D3436"
                      />
                      <rect width="244" height="150" stroke="#DFE6E9" />
                    </svg>

                    <div className="hp-theme-customise-container-body-item-svg-check">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16.9987"
                          cy="17.0007"
                          r="14.1667"
                          fill="white"
                        />
                        <path
                          d="M16.9987 2.83398C9.1872 2.83398 2.83203 9.18915 2.83203 17.0007C2.83203 24.8122 9.1872 31.1673 16.9987 31.1673C24.8102 31.1673 31.1654 24.8122 31.1654 17.0007C31.1654 9.18915 24.8102 2.83398 16.9987 2.83398ZM16.9987 28.334C10.7498 28.334 5.66536 23.2496 5.66536 17.0007C5.66536 10.7517 10.7498 5.66732 16.9987 5.66732C23.2476 5.66732 28.332 10.7517 28.332 17.0007C28.332 23.2496 23.2476 28.334 16.9987 28.334Z"
                          fill="#2D3436"
                        />
                        <path
                          d="M14.1674 19.2479L10.9105 15.9966L8.91016 18.0026L14.1702 23.2514L23.6704 13.7512L21.6672 11.748L14.1674 19.2479Z"
                          fill="#2D3436"
                        />
                      </svg>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="hp-theme-customise-container-body-item">
            <Col span={24} className="hp-mb-16">
              <span className="hp-d-block hp-caption hp-text-color-black-60">
                LAYOUT DIRECTION
              </span>
              <span className="hp-d-block h5 hp-text-color-black-100 hp-text-color-dark-0">
                LTR & RTL
              </span>
            </Col>

            <Col span={24}>
              <Row gutter={[24, 24]}>
                <Col md={12} span={24}>
                  <div
                    className="hp-theme-customise-container-body-item-svg active"
                    ref={(ref) => {
                      directionRef[0] = ref;
                    }}
                    onClick={() => directionClick(0)}
                  >
                    <svg
                      width="244"
                      height="150"
                      viewBox="0 0 244 150"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="244" height="150" fill="white" />
                      <rect
                        width="37"
                        height="138"
                        transform="translate(6 6)"
                        fill="#DFE6E9"
                      />
                      <path
                        d="M33.7528 18.2807C32.9591 18.059 32.6126 18.0257 32.6126 18.0257C32.4785 18.0036 31.9531 17.9149 31.2377 17.8928C30.6676 17.8041 30.0751 17.6489 29.6839 17.3275C29.2591 16.9728 28.5437 16.3633 28.2642 16.2192C28.2531 16.2081 28.2419 16.2081 28.2307 16.2081C27.1576 15.4433 25.8497 15 24.4413 15C22.8316 15 21.3672 15.5653 20.227 16.5073C19.9029 16.7512 19.5116 17.0837 19.2434 17.3164C18.8521 17.6489 18.2597 17.793 17.6896 17.8817C16.9742 17.9038 16.4488 18.0036 16.3146 18.0147C16.3146 18.0147 16.0017 18.0479 15.2639 18.2474C14.9397 18.3361 14.9062 18.7794 15.208 18.9235C15.208 18.9235 15.2192 18.9235 15.2192 18.9346C15.6998 19.1673 16.1581 19.5442 16.7282 20.4419C17.4101 21.5059 17.5331 22.182 17.969 23.2017C18.6733 26.1277 21.3002 28.3 24.4301 28.3C27.4482 28.3 29.9969 26.2828 30.8129 23.5231C31.3718 22.315 31.4501 21.6167 32.199 20.4419C32.7691 19.5442 33.2274 19.1673 33.7081 18.9346C33.7416 18.9235 33.7751 18.9013 33.8087 18.8902C34.0881 18.7683 34.0546 18.3582 33.7528 18.2807ZM21.8814 23.4012C20.9872 23.1573 20.4283 22.3372 20.4283 22.3372C20.4283 22.3372 21.3896 21.6389 22.2839 21.8827C23.1781 22.1266 23.67 23.2127 23.67 23.2127C23.67 23.2127 22.7757 23.645 21.8814 23.4012ZM27.2023 23.4012C26.308 23.645 25.4138 23.2017 25.4138 23.2017C25.4138 23.2017 25.8944 22.1155 26.7999 21.8717C27.6942 21.6278 28.6555 22.3261 28.6555 22.3261C28.6555 22.3261 28.0966 23.1684 27.2023 23.4012Z"
                        fill="#B2BEC3"
                      />
                      <g clipPath="url(#clip0-534597)">
                        <rect
                          width="191"
                          height="13"
                          transform="translate(47 6)"
                          fill="#DFE6E9"
                        />
                      </g>
                      <rect
                        width="191"
                        height="122"
                        transform="translate(47 22)"
                        fill="#DFE6E9"
                      />
                      <path
                        d="M123.92 92V74.72H126.812V89.288H134.444V92H123.92ZM138.718 92V77.432H133.126V74.72H147.202V77.432H141.61V92H138.718ZM149.601 92V74.72H156.741C156.909 74.72 157.125 74.728 157.389 74.744C157.653 74.752 157.897 74.776 158.121 74.816C159.121 74.968 159.945 75.3 160.593 75.812C161.249 76.324 161.733 76.972 162.045 77.756C162.365 78.532 162.525 79.396 162.525 80.348C162.525 81.756 162.169 82.968 161.457 83.984C160.745 84.992 159.653 85.616 158.181 85.856L156.945 85.964H152.493V92H149.601ZM159.525 92L156.117 84.968L159.057 84.32L162.801 92H159.525ZM152.493 83.264H156.621C156.781 83.264 156.961 83.256 157.161 83.24C157.361 83.224 157.545 83.192 157.713 83.144C158.193 83.024 158.569 82.812 158.841 82.508C159.121 82.204 159.317 81.86 159.429 81.476C159.549 81.092 159.609 80.716 159.609 80.348C159.609 79.98 159.549 79.604 159.429 79.22C159.317 78.828 159.121 78.48 158.841 78.176C158.569 77.872 158.193 77.66 157.713 77.54C157.545 77.492 157.361 77.464 157.161 77.456C156.961 77.44 156.781 77.432 156.621 77.432H152.493V83.264Z"
                        fill="#B2BEC3"
                      />
                      <rect width="244" height="150" stroke="#2D3436" />
                      <defs>
                        <clipPath id="clip0-534597">
                          <rect
                            width="191"
                            height="13"
                            fill="white"
                            transform="translate(47 6)"
                          />
                        </clipPath>
                      </defs>
                    </svg>

                    <div className="hp-theme-customise-container-body-item-svg-check">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16.9987"
                          cy="17.0007"
                          r="14.1667"
                          fill="white"
                        />
                        <path
                          d="M16.9987 2.83398C9.1872 2.83398 2.83203 9.18915 2.83203 17.0007C2.83203 24.8122 9.1872 31.1673 16.9987 31.1673C24.8102 31.1673 31.1654 24.8122 31.1654 17.0007C31.1654 9.18915 24.8102 2.83398 16.9987 2.83398ZM16.9987 28.334C10.7498 28.334 5.66536 23.2496 5.66536 17.0007C5.66536 10.7517 10.7498 5.66732 16.9987 5.66732C23.2476 5.66732 28.332 10.7517 28.332 17.0007C28.332 23.2496 23.2476 28.334 16.9987 28.334Z"
                          fill="#2D3436"
                        />
                        <path
                          d="M14.1674 19.2479L10.9105 15.9966L8.91016 18.0026L14.1702 23.2514L23.6704 13.7512L21.6672 11.748L14.1674 19.2479Z"
                          fill="#2D3436"
                        />
                      </svg>
                    </div>
                  </div>
                </Col>

                <Col md={12} span={24}>
                  <div
                    className="hp-theme-customise-container-body-item-svg"
                    ref={(ref) => {
                      directionRef[1] = ref;
                    }}
                    onClick={() => directionClick(1)}
                  >
                    <svg
                      width="244"
                      height="150"
                      viewBox="0 0 244 150"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="244" height="150" fill="white" />
                      <rect
                        width="37"
                        height="138"
                        transform="translate(201 6)"
                        fill="#DFE6E9"
                      />
                      <path
                        d="M228.753 18.2807C227.959 18.059 227.613 18.0257 227.613 18.0257C227.478 18.0036 226.953 17.9149 226.238 17.8928C225.668 17.8041 225.075 17.6489 224.684 17.3275C224.259 16.9728 223.544 16.3633 223.264 16.2192C223.253 16.2081 223.242 16.2081 223.231 16.2081C222.158 15.4433 220.85 15 219.441 15C217.832 15 216.367 15.5653 215.227 16.5073C214.903 16.7512 214.512 17.0837 214.243 17.3164C213.852 17.6489 213.26 17.793 212.69 17.8817C211.974 17.9038 211.449 18.0036 211.315 18.0147C211.315 18.0147 211.002 18.0479 210.264 18.2474C209.94 18.3361 209.906 18.7794 210.208 18.9235C210.208 18.9235 210.219 18.9235 210.219 18.9346C210.7 19.1673 211.158 19.5442 211.728 20.4419C212.41 21.5059 212.533 22.182 212.969 23.2017C213.673 26.1277 216.3 28.3 219.43 28.3C222.448 28.3 224.997 26.2828 225.813 23.5231C226.372 22.315 226.45 21.6167 227.199 20.4419C227.769 19.5442 228.227 19.1673 228.708 18.9346C228.742 18.9235 228.775 18.9013 228.809 18.8902C229.088 18.7683 229.055 18.3582 228.753 18.2807ZM216.881 23.4012C215.987 23.1573 215.428 22.3372 215.428 22.3372C215.428 22.3372 216.39 21.6389 217.284 21.8827C218.178 22.1266 218.67 23.2127 218.67 23.2127C218.67 23.2127 217.776 23.645 216.881 23.4012ZM222.202 23.4012C221.308 23.645 220.414 23.2017 220.414 23.2017C220.414 23.2017 220.894 22.1155 221.8 21.8717C222.694 21.6278 223.655 22.3261 223.655 22.3261C223.655 22.3261 223.097 23.1684 222.202 23.4012Z"
                        fill="#B2BEC3"
                      />
                      <g clipPath="url(#clip0-316602)">
                        <rect
                          width="191"
                          height="13"
                          transform="translate(6 6)"
                          fill="#DFE6E9"
                        />
                      </g>
                      <rect
                        width="191"
                        height="122"
                        transform="translate(6 22)"
                        fill="#DFE6E9"
                      />
                      <path
                        d="M80.68 92V74.72H87.82C87.988 74.72 88.204 74.728 88.468 74.744C88.732 74.752 88.976 74.776 89.2 74.816C90.2 74.968 91.024 75.3 91.672 75.812C92.328 76.324 92.812 76.972 93.124 77.756C93.444 78.532 93.604 79.396 93.604 80.348C93.604 81.756 93.248 82.968 92.536 83.984C91.824 84.992 90.732 85.616 89.26 85.856L88.024 85.964H83.572V92H80.68ZM90.604 92L87.196 84.968L90.136 84.32L93.88 92H90.604ZM83.572 83.264H87.7C87.86 83.264 88.04 83.256 88.24 83.24C88.44 83.224 88.624 83.192 88.792 83.144C89.272 83.024 89.648 82.812 89.92 82.508C90.2 82.204 90.396 81.86 90.508 81.476C90.628 81.092 90.688 80.716 90.688 80.348C90.688 79.98 90.628 79.604 90.508 79.22C90.396 78.828 90.2 78.48 89.92 78.176C89.648 77.872 89.272 77.66 88.792 77.54C88.624 77.492 88.44 77.464 88.24 77.456C88.04 77.44 87.86 77.432 87.7 77.432H83.572V83.264ZM101.156 92V77.432H95.5637V74.72H109.64V77.432H104.048V92H101.156ZM112.278 92V74.72H115.17V89.288H122.802V92H112.278Z"
                        fill="#B2BEC3"
                      />
                      <rect width="244" height="150" stroke="#DFE6E9" />
                      <defs>
                        <clipPath id="clip0-316602">
                          <rect
                            width="191"
                            height="13"
                            fill="white"
                            transform="translate(6 6)"
                          />
                        </clipPath>
                      </defs>
                    </svg>

                    <div className="hp-theme-customise-container-body-item-svg-check">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16.9987"
                          cy="17.0007"
                          r="14.1667"
                          fill="white"
                        />
                        <path
                          d="M16.9987 2.83398C9.1872 2.83398 2.83203 9.18915 2.83203 17.0007C2.83203 24.8122 9.1872 31.1673 16.9987 31.1673C24.8102 31.1673 31.1654 24.8122 31.1654 17.0007C31.1654 9.18915 24.8102 2.83398 16.9987 2.83398ZM16.9987 28.334C10.7498 28.334 5.66536 23.2496 5.66536 17.0007C5.66536 10.7517 10.7498 5.66732 16.9987 5.66732C23.2476 5.66732 28.332 10.7517 28.332 17.0007C28.332 23.2496 23.2476 28.334 16.9987 28.334Z"
                          fill="#2D3436"
                        />
                        <path
                          d="M14.1674 19.2479L10.9105 15.9966L8.91016 18.0026L14.1702 23.2514L23.6704 13.7512L21.6672 11.748L14.1674 19.2479Z"
                          fill="#2D3436"
                        />
                      </svg>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="hp-theme-customise-container-body-item">
            <Col span={24} className="hp-mb-16">
              <span className="hp-d-block hp-caption hp-text-color-black-60">
                CONTENT WIDTH
              </span>
              <span className="hp-d-block h5 hp-text-color-black-100 hp-text-color-dark-0">
                Full Width & Boxed
              </span>
            </Col>

            <Col span={24}>
              <Row gutter={[24, 24]}>
                <Col md={12} span={24}>
                  <div
                    className="hp-theme-customise-container-body-item-svg"
                    ref={(ref) => {
                      widthRef[0] = ref;
                    }}
                    onClick={() => widthClick(0)}
                  >
                    <svg
                      width="244"
                      height="150"
                      viewBox="0 0 244 150"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="1" y="1" width="242" height="148" fill="white" />
                      <rect
                        width="37"
                        height="138"
                        transform="translate(6 6)"
                        fill="#DFE6E9"
                      />
                      <path
                        d="M33.7528 18.2807C32.9591 18.059 32.6126 18.0257 32.6126 18.0257C32.4785 18.0036 31.9531 17.9149 31.2377 17.8928C30.6676 17.8041 30.0751 17.6489 29.6839 17.3275C29.2591 16.9728 28.5437 16.3632 28.2642 16.2192C28.2531 16.2081 28.2419 16.2081 28.2307 16.2081C27.1576 15.4433 25.8497 15 24.4413 15C22.8316 15 21.3672 15.5653 20.227 16.5073C19.9029 16.7512 19.5116 17.0837 19.2434 17.3164C18.8521 17.6489 18.2597 17.793 17.6896 17.8817C16.9742 17.9038 16.4488 18.0036 16.3146 18.0147C16.3146 18.0147 16.0017 18.0479 15.2639 18.2474C14.9397 18.3361 14.9062 18.7794 15.208 18.9235C15.208 18.9235 15.2192 18.9235 15.2192 18.9346C15.6998 19.1673 16.1581 19.5442 16.7282 20.4419C17.4101 21.5059 17.5331 22.182 17.969 23.2017C18.6733 26.1277 21.3002 28.3 24.4301 28.3C27.4482 28.3 29.9969 26.2828 30.8129 23.5231C31.3718 22.315 31.4501 21.6167 32.199 20.4419C32.7691 19.5442 33.2274 19.1673 33.7081 18.9346C33.7416 18.9235 33.7751 18.9013 33.8087 18.8902C34.0881 18.7683 34.0546 18.3582 33.7528 18.2807ZM21.8814 23.4012C20.9872 23.1573 20.4283 22.3372 20.4283 22.3372C20.4283 22.3372 21.3896 21.6389 22.2839 21.8827C23.1781 22.1266 23.67 23.2127 23.67 23.2127C23.67 23.2127 22.7757 23.645 21.8814 23.4012ZM27.2023 23.4012C26.308 23.645 25.4138 23.2017 25.4138 23.2017C25.4138 23.2017 25.8944 22.1155 26.7999 21.8717C27.6942 21.6278 28.6555 22.3261 28.6555 22.3261C28.6555 22.3261 28.0966 23.1684 27.2023 23.4012Z"
                        fill="#B2BEC3"
                      />
                      <rect
                        width="191"
                        height="13"
                        transform="translate(47 6)"
                        fill="#DFE6E9"
                      />
                      <rect
                        width="191"
                        height="122"
                        transform="translate(47 22)"
                        fill="#DFE6E9"
                      />
                      <rect
                        x="1"
                        y="1"
                        width="242"
                        height="148"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>

                    <div className="hp-theme-customise-container-body-item-svg-check">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16.9987"
                          cy="17.0007"
                          r="14.1667"
                          fill="white"
                        />
                        <path
                          d="M16.9987 2.83398C9.1872 2.83398 2.83203 9.18915 2.83203 17.0007C2.83203 24.8122 9.1872 31.1673 16.9987 31.1673C24.8102 31.1673 31.1654 24.8122 31.1654 17.0007C31.1654 9.18915 24.8102 2.83398 16.9987 2.83398ZM16.9987 28.334C10.7498 28.334 5.66536 23.2496 5.66536 17.0007C5.66536 10.7517 10.7498 5.66732 16.9987 5.66732C23.2476 5.66732 28.332 10.7517 28.332 17.0007C28.332 23.2496 23.2476 28.334 16.9987 28.334Z"
                          fill="#2D3436"
                        />
                        <path
                          d="M14.1674 19.2479L10.9105 15.9966L8.91016 18.0026L14.1702 23.2514L23.6704 13.7512L21.6672 11.748L14.1674 19.2479Z"
                          fill="#2D3436"
                        />
                      </svg>
                    </div>
                  </div>
                </Col>

                <Col md={12} span={24}>
                  <div
                    className="hp-theme-customise-container-body-item-svg active"
                    ref={(ref) => {
                      widthRef[1] = ref;
                    }}
                    onClick={() => widthClick(1)}
                  >
                    <svg
                      width="244"
                      height="150"
                      viewBox="0 0 244 150"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="244" height="150" fill="white" />
                      <rect
                        width="37"
                        height="138"
                        transform="translate(6 6)"
                        fill="#DFE6E9"
                      />
                      <path
                        d="M33.7528 18.2807C32.9591 18.059 32.6126 18.0257 32.6126 18.0257C32.4785 18.0036 31.9531 17.9149 31.2377 17.8928C30.6676 17.8041 30.0751 17.6489 29.6839 17.3275C29.2591 16.9728 28.5437 16.3633 28.2642 16.2192C28.2531 16.2081 28.2419 16.2081 28.2307 16.2081C27.1576 15.4433 25.8497 15 24.4413 15C22.8316 15 21.3672 15.5653 20.227 16.5073C19.9029 16.7512 19.5116 17.0837 19.2434 17.3164C18.8521 17.6489 18.2597 17.793 17.6896 17.8817C16.9742 17.9038 16.4488 18.0036 16.3146 18.0147C16.3146 18.0147 16.0017 18.0479 15.2639 18.2474C14.9397 18.3361 14.9062 18.7794 15.208 18.9235C15.208 18.9235 15.2192 18.9235 15.2192 18.9346C15.6998 19.1673 16.1581 19.5442 16.7282 20.4419C17.4101 21.5059 17.5331 22.182 17.969 23.2017C18.6733 26.1277 21.3002 28.3 24.4301 28.3C27.4482 28.3 29.9969 26.2828 30.8129 23.5231C31.3718 22.315 31.4501 21.6167 32.199 20.4419C32.7691 19.5442 33.2274 19.1673 33.7081 18.9346C33.7416 18.9235 33.7751 18.9013 33.8087 18.8902C34.0881 18.7683 34.0546 18.3582 33.7528 18.2807ZM21.8814 23.4012C20.9872 23.1573 20.4283 22.3372 20.4283 22.3372C20.4283 22.3372 21.3896 21.6389 22.2839 21.8827C23.1781 22.1266 23.67 23.2127 23.67 23.2127C23.67 23.2127 22.7757 23.645 21.8814 23.4012ZM27.2023 23.4012C26.308 23.645 25.4138 23.2017 25.4138 23.2017C25.4138 23.2017 25.8944 22.1155 26.7999 21.8717C27.6942 21.6278 28.6555 22.3261 28.6555 22.3261C28.6555 22.3261 28.0966 23.1684 27.2023 23.4012Z"
                        fill="#B2BEC3"
                      />
                      <g clipPath="url(#clip0_5050:104461)">
                        <rect
                          width="133"
                          height="13"
                          transform="translate(76 6)"
                          fill="#DFE6E9"
                        />
                      </g>
                      <rect
                        width="133"
                        height="122"
                        transform="translate(76 22)"
                        fill="#DFE6E9"
                      />
                      <rect width="244" height="150" stroke="#DFE6E9" />
                      <defs>
                        <clipPath id="clip0_5050:104461">
                          <rect
                            width="133"
                            height="13"
                            fill="white"
                            transform="translate(76 6)"
                          />
                        </clipPath>
                      </defs>
                    </svg>

                    <div className="hp-theme-customise-container-body-item-svg-check">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16.9987"
                          cy="17.0007"
                          r="14.1667"
                          fill="white"
                        />
                        <path
                          d="M16.9987 2.83398C9.1872 2.83398 2.83203 9.18915 2.83203 17.0007C2.83203 24.8122 9.1872 31.1673 16.9987 31.1673C24.8102 31.1673 31.1654 24.8122 31.1654 17.0007C31.1654 9.18915 24.8102 2.83398 16.9987 2.83398ZM16.9987 28.334C10.7498 28.334 5.66536 23.2496 5.66536 17.0007C5.66536 10.7517 10.7498 5.66732 16.9987 5.66732C23.2476 5.66732 28.332 10.7517 28.332 17.0007C28.332 23.2496 23.2476 28.334 16.9987 28.334Z"
                          fill="#2D3436"
                        />
                        <path
                          d="M14.1674 19.2479L10.9105 15.9966L8.91016 18.0026L14.1702 23.2514L23.6704 13.7512L21.6672 11.748L14.1674 19.2479Z"
                          fill="#2D3436"
                        />
                      </svg>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="hp-theme-customise-container-body-item">
            <Col span={24} className="hp-mb-16">
              <span className="hp-d-block hp-caption hp-text-color-black-60">
                NAVIGATION STYLE
              </span>
              <span className="hp-d-block h5 hp-text-color-black-100 hp-text-color-dark-0">
                Vertical & Horizontal
              </span>
            </Col>

            <Col span={24}>
              <Row gutter={[24, 24]}>
                <Col md={12} span={24}>
                  <div
                    className="hp-theme-customise-container-body-item-svg active"
                    ref={(ref) => {
                      navigationRef[0] = ref;
                    }}
                    onClick={() => navigationClick(0)}
                  >
                    {child1Svg == 0 && (
                      <svg
                        width="244"
                        height="150"
                        viewBox="0 0 244 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="244" height="150" fill="white" />
                        <rect
                          width="37"
                          height="138"
                          transform="translate(6 6)"
                          fill="#DFE6E9"
                        />
                        <circle cx="38" cy="13" r="2" fill="#636E72" />
                        <path
                          d="M33.7528 18.2807C32.9591 18.059 32.6126 18.0257 32.6126 18.0257C32.4785 18.0036 31.9531 17.9149 31.2377 17.8928C30.6676 17.8041 30.0751 17.6489 29.6839 17.3275C29.2591 16.9728 28.5437 16.3633 28.2642 16.2192C28.2531 16.2081 28.2419 16.2081 28.2307 16.2081C27.1576 15.4433 25.8497 15 24.4413 15C22.8316 15 21.3672 15.5653 20.227 16.5073C19.9029 16.7512 19.5116 17.0837 19.2434 17.3164C18.8521 17.6489 18.2597 17.793 17.6896 17.8817C16.9742 17.9038 16.4488 18.0036 16.3146 18.0147C16.3146 18.0147 16.0017 18.0479 15.2639 18.2474C14.9397 18.3361 14.9062 18.7794 15.208 18.9235C15.208 18.9235 15.2192 18.9235 15.2192 18.9346C15.6998 19.1673 16.1581 19.5442 16.7282 20.4419C17.4101 21.5059 17.5331 22.182 17.969 23.2017C18.6733 26.1277 21.3002 28.3 24.4301 28.3C27.4482 28.3 29.9969 26.2828 30.8129 23.5231C31.3718 22.315 31.4501 21.6167 32.199 20.4419C32.7691 19.5442 33.2274 19.1673 33.7081 18.9346C33.7416 18.9235 33.7751 18.9013 33.8087 18.8902C34.0881 18.7683 34.0546 18.3582 33.7528 18.2807ZM21.8814 23.4012C20.9872 23.1573 20.4283 22.3372 20.4283 22.3372C20.4283 22.3372 21.3896 21.6389 22.2839 21.8827C23.1781 22.1266 23.67 23.2127 23.67 23.2127C23.67 23.2127 22.7757 23.645 21.8814 23.4012ZM27.2023 23.4012C26.308 23.645 25.4138 23.2017 25.4138 23.2017C25.4138 23.2017 25.8944 22.1155 26.7999 21.8717C27.6942 21.6278 28.6555 22.3261 28.6555 22.3261C28.6555 22.3261 28.0966 23.1684 27.2023 23.4012Z"
                          fill="#B2BEC3"
                        />
                        <rect
                          width="191"
                          height="13"
                          transform="translate(47 6)"
                          fill="#F0F3F5"
                        />
                        <rect
                          width="191"
                          height="121"
                          transform="translate(47 23)"
                          fill="#F0F3F5"
                        />
                        <rect width="244" height="150" stroke="#2D3436" />
                      </svg>
                    )}

                    {child1Svg == 1 && (
                      <svg
                        width="244"
                        height="150"
                        viewBox="0 0 244 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="244" height="150" fill="white" />
                        <rect
                          width="29"
                          height="138"
                          transform="translate(6 6)"
                          fill="#DFE6E9"
                        />
                        <path
                          d="M29.7528 18.2807C28.9591 18.059 28.6126 18.0257 28.6126 18.0257C28.4785 18.0036 27.9531 17.9149 27.2377 17.8928C26.6676 17.8041 26.0751 17.6489 25.6839 17.3275C25.2591 16.9728 24.5437 16.3633 24.2642 16.2192C24.2531 16.2081 24.2419 16.2081 24.2307 16.2081C23.1576 15.4433 21.8497 15 20.4413 15C18.8316 15 17.3672 15.5653 16.227 16.5073C15.9029 16.7512 15.5116 17.0837 15.2434 17.3164C14.8521 17.6489 14.2597 17.793 13.6896 17.8817C12.9742 17.9038 12.4488 18.0036 12.3146 18.0147C12.3146 18.0147 12.0017 18.0479 11.2639 18.2474C10.9397 18.3361 10.9062 18.7794 11.208 18.9235C11.208 18.9235 11.2192 18.9235 11.2192 18.9346C11.6998 19.1673 12.1581 19.5442 12.7282 20.4419C13.4101 21.5059 13.5331 22.182 13.969 23.2017C14.6733 26.1277 17.3002 28.3 20.4301 28.3C23.4482 28.3 25.9969 26.2828 26.8129 23.5231C27.3718 22.315 27.4501 21.6167 28.199 20.4419C28.7691 19.5442 29.2274 19.1673 29.7081 18.9346C29.7416 18.9235 29.7751 18.9013 29.8087 18.8902C30.0881 18.7683 30.0546 18.3582 29.7528 18.2807ZM17.8814 23.4012C16.9872 23.1573 16.4283 22.3372 16.4283 22.3372C16.4283 22.3372 17.3896 21.6389 18.2839 21.8827C19.1781 22.1266 19.67 23.2127 19.67 23.2127C19.67 23.2127 18.7757 23.645 17.8814 23.4012ZM23.2023 23.4012C22.308 23.645 21.4138 23.2017 21.4138 23.2017C21.4138 23.2017 21.8944 22.1155 22.7999 21.8717C23.6942 21.6278 24.6555 22.3261 24.6555 22.3261C24.6555 22.3261 24.0966 23.1684 23.2023 23.4012Z"
                          fill="#B2BEC3"
                        />
                        <rect
                          width="199"
                          height="13"
                          transform="translate(39 6)"
                          fill="#F0F3F5"
                        />
                        <rect
                          width="199"
                          height="121"
                          transform="translate(39 23)"
                          fill="#F0F3F5"
                        />
                        <circle cx="31" cy="13" r="2" fill="#636E72" />
                        <rect width="244" height="150" stroke="#2D3436" />
                      </svg>
                    )}

                    {child1Svg == 2 && (
                      <svg
                        width="244"
                        height="150"
                        viewBox="0 0 244 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="244" height="150" fill="white" />
                        <rect
                          width="37"
                          height="138"
                          transform="translate(6 6)"
                          fill="#DFE6E9"
                        />
                        <path
                          d="M33.7528 18.2807C32.9591 18.059 32.6126 18.0257 32.6126 18.0257C32.4785 18.0036 31.9531 17.9149 31.2377 17.8928C30.6676 17.8041 30.0751 17.6489 29.6839 17.3275C29.2591 16.9728 28.5437 16.3633 28.2642 16.2192C28.2531 16.2081 28.2419 16.2081 28.2307 16.2081C27.1576 15.4433 25.8497 15 24.4413 15C22.8316 15 21.3672 15.5653 20.227 16.5073C19.9029 16.7512 19.5116 17.0837 19.2434 17.3164C18.8521 17.6489 18.2597 17.793 17.6896 17.8817C16.9742 17.9038 16.4488 18.0036 16.3146 18.0147C16.3146 18.0147 16.0017 18.0479 15.2639 18.2474C14.9397 18.3361 14.9062 18.7794 15.208 18.9235C15.208 18.9235 15.2192 18.9235 15.2192 18.9346C15.6998 19.1673 16.1581 19.5442 16.7282 20.4419C17.4101 21.5059 17.5331 22.182 17.969 23.2017C18.6733 26.1277 21.3002 28.3 24.4301 28.3C27.4482 28.3 29.9969 26.2828 30.8129 23.5231C31.3718 22.315 31.4501 21.6167 32.199 20.4419C32.7691 19.5442 33.2274 19.1673 33.7081 18.9346C33.7416 18.9235 33.7751 18.9013 33.8087 18.8902C34.0881 18.7683 34.0546 18.3582 33.7528 18.2807ZM21.8814 23.4012C20.9872 23.1573 20.4283 22.3372 20.4283 22.3372C20.4283 22.3372 21.3896 21.6389 22.2839 21.8827C23.1781 22.1266 23.67 23.2127 23.67 23.2127C23.67 23.2127 22.7757 23.645 21.8814 23.4012ZM27.2023 23.4012C26.308 23.645 25.4138 23.2017 25.4138 23.2017C25.4138 23.2017 25.8944 22.1155 26.7999 21.8717C27.6942 21.6278 28.6555 22.3261 28.6555 22.3261C28.6555 22.3261 28.0966 23.1684 27.2023 23.4012Z"
                          fill="#B2BEC3"
                        />
                        <rect
                          width="191"
                          height="13"
                          transform="translate(47 6)"
                          fill="#F0F3F5"
                        />
                        <rect
                          width="191"
                          height="121"
                          transform="translate(47 23)"
                          fill="#F0F3F5"
                        />
                        <rect width="244" height="150" stroke="#2D3436" />
                      </svg>
                    )}

                    <div className="hp-theme-customise-container-body-item-svg-check">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16.9987"
                          cy="17.0007"
                          r="14.1667"
                          fill="white"
                        />
                        <path
                          d="M16.9987 2.83398C9.1872 2.83398 2.83203 9.18915 2.83203 17.0007C2.83203 24.8122 9.1872 31.1673 16.9987 31.1673C24.8102 31.1673 31.1654 24.8122 31.1654 17.0007C31.1654 9.18915 24.8102 2.83398 16.9987 2.83398ZM16.9987 28.334C10.7498 28.334 5.66536 23.2496 5.66536 17.0007C5.66536 10.7517 10.7498 5.66732 16.9987 5.66732C23.2476 5.66732 28.332 10.7517 28.332 17.0007C28.332 23.2496 23.2476 28.334 16.9987 28.334Z"
                          fill="#2D3436"
                        />
                        <path
                          d="M14.1674 19.2479L10.9105 15.9966L8.91016 18.0026L14.1702 23.2514L23.6704 13.7512L21.6672 11.748L14.1674 19.2479Z"
                          fill="#2D3436"
                        />
                      </svg>
                    </div>
                  </div>

                  <Row gutter={[4]} className="hp-mt-8">
                    <Col span={8}>
                      <div
                        className="hp-theme-customise-container-body-item-svg-other active active-check"
                        ref={(ref) => {
                          navigationChild1Ref[0] = ref;
                        }}
                        onClick={() => navigationChild1Click(0)}
                      >
                        <svg
                          width="244"
                          height="150"
                          viewBox="0 0 244 150"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="244" height="150" fill="white" />
                          <rect
                            width="37"
                            height="138"
                            transform="translate(6 6)"
                            fill="#DFE6E9"
                          />
                          <circle cx="38" cy="13" r="2" fill="#636E72" />
                          <path
                            d="M33.7528 18.2807C32.9591 18.059 32.6126 18.0257 32.6126 18.0257C32.4785 18.0036 31.9531 17.9149 31.2377 17.8928C30.6676 17.8041 30.0751 17.6489 29.6839 17.3275C29.2591 16.9728 28.5437 16.3633 28.2642 16.2192C28.2531 16.2081 28.2419 16.2081 28.2307 16.2081C27.1576 15.4433 25.8497 15 24.4413 15C22.8316 15 21.3672 15.5653 20.227 16.5073C19.9029 16.7512 19.5116 17.0837 19.2434 17.3164C18.8521 17.6489 18.2597 17.793 17.6896 17.8817C16.9742 17.9038 16.4488 18.0036 16.3146 18.0147C16.3146 18.0147 16.0017 18.0479 15.2639 18.2474C14.9397 18.3361 14.9062 18.7794 15.208 18.9235C15.208 18.9235 15.2192 18.9235 15.2192 18.9346C15.6998 19.1673 16.1581 19.5442 16.7282 20.4419C17.4101 21.5059 17.5331 22.182 17.969 23.2017C18.6733 26.1277 21.3002 28.3 24.4301 28.3C27.4482 28.3 29.9969 26.2828 30.8129 23.5231C31.3718 22.315 31.4501 21.6167 32.199 20.4419C32.7691 19.5442 33.2274 19.1673 33.7081 18.9346C33.7416 18.9235 33.7751 18.9013 33.8087 18.8902C34.0881 18.7683 34.0546 18.3582 33.7528 18.2807ZM21.8814 23.4012C20.9872 23.1573 20.4283 22.3372 20.4283 22.3372C20.4283 22.3372 21.3896 21.6389 22.2839 21.8827C23.1781 22.1266 23.67 23.2127 23.67 23.2127C23.67 23.2127 22.7757 23.645 21.8814 23.4012ZM27.2023 23.4012C26.308 23.645 25.4138 23.2017 25.4138 23.2017C25.4138 23.2017 25.8944 22.1155 26.7999 21.8717C27.6942 21.6278 28.6555 22.3261 28.6555 22.3261C28.6555 22.3261 28.0966 23.1684 27.2023 23.4012Z"
                            fill="#B2BEC3"
                          />
                          <rect
                            width="191"
                            height="13"
                            transform="translate(47 6)"
                            fill="#F0F3F5"
                          />
                          <rect
                            width="191"
                            height="121"
                            transform="translate(47 23)"
                            fill="#F0F3F5"
                          />
                          <rect width="244" height="150" stroke="#2D3436" />
                        </svg>
                      </div>
                    </Col>

                    <Col span={8}>
                      <div
                        className="hp-theme-customise-container-body-item-svg-other"
                        ref={(ref) => {
                          navigationChild1Ref[1] = ref;
                        }}
                        onClick={() => navigationChild1Click(1)}
                      >
                        <svg
                          width="244"
                          height="150"
                          viewBox="0 0 244 150"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="244" height="150" fill="white" />
                          <rect
                            width="29"
                            height="138"
                            transform="translate(6 6)"
                            fill="#DFE6E9"
                          />
                          <path
                            d="M29.7528 18.2807C28.9591 18.059 28.6126 18.0257 28.6126 18.0257C28.4785 18.0036 27.9531 17.9149 27.2377 17.8928C26.6676 17.8041 26.0751 17.6489 25.6839 17.3275C25.2591 16.9728 24.5437 16.3633 24.2642 16.2192C24.2531 16.2081 24.2419 16.2081 24.2307 16.2081C23.1576 15.4433 21.8497 15 20.4413 15C18.8316 15 17.3672 15.5653 16.227 16.5073C15.9029 16.7512 15.5116 17.0837 15.2434 17.3164C14.8521 17.6489 14.2597 17.793 13.6896 17.8817C12.9742 17.9038 12.4488 18.0036 12.3146 18.0147C12.3146 18.0147 12.0017 18.0479 11.2639 18.2474C10.9397 18.3361 10.9062 18.7794 11.208 18.9235C11.208 18.9235 11.2192 18.9235 11.2192 18.9346C11.6998 19.1673 12.1581 19.5442 12.7282 20.4419C13.4101 21.5059 13.5331 22.182 13.969 23.2017C14.6733 26.1277 17.3002 28.3 20.4301 28.3C23.4482 28.3 25.9969 26.2828 26.8129 23.5231C27.3718 22.315 27.4501 21.6167 28.199 20.4419C28.7691 19.5442 29.2274 19.1673 29.7081 18.9346C29.7416 18.9235 29.7751 18.9013 29.8087 18.8902C30.0881 18.7683 30.0546 18.3582 29.7528 18.2807ZM17.8814 23.4012C16.9872 23.1573 16.4283 22.3372 16.4283 22.3372C16.4283 22.3372 17.3896 21.6389 18.2839 21.8827C19.1781 22.1266 19.67 23.2127 19.67 23.2127C19.67 23.2127 18.7757 23.645 17.8814 23.4012ZM23.2023 23.4012C22.308 23.645 21.4138 23.2017 21.4138 23.2017C21.4138 23.2017 21.8944 22.1155 22.7999 21.8717C23.6942 21.6278 24.6555 22.3261 24.6555 22.3261C24.6555 22.3261 24.0966 23.1684 23.2023 23.4012Z"
                            fill="#B2BEC3"
                          />
                          <rect
                            width="199"
                            height="13"
                            transform="translate(39 6)"
                            fill="#F0F3F5"
                          />
                          <rect
                            width="199"
                            height="121"
                            transform="translate(39 23)"
                            fill="#F0F3F5"
                          />
                          <circle cx="31" cy="13" r="2" fill="#636E72" />
                          <rect width="244" height="150" stroke="#2D3436" />
                        </svg>
                      </div>
                    </Col>

                    <Col span={8}>
                      <div
                        className="hp-theme-customise-container-body-item-svg-other"
                        ref={(ref) => {
                          navigationChild1Ref[2] = ref;
                        }}
                        onClick={() => navigationChild1Click(2)}
                      >
                        <svg
                          width="244"
                          height="150"
                          viewBox="0 0 244 150"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="244" height="150" fill="white" />
                          <rect
                            width="37"
                            height="138"
                            transform="translate(6 6)"
                            fill="#DFE6E9"
                          />
                          <path
                            d="M33.7528 18.2807C32.9591 18.059 32.6126 18.0257 32.6126 18.0257C32.4785 18.0036 31.9531 17.9149 31.2377 17.8928C30.6676 17.8041 30.0751 17.6489 29.6839 17.3275C29.2591 16.9728 28.5437 16.3633 28.2642 16.2192C28.2531 16.2081 28.2419 16.2081 28.2307 16.2081C27.1576 15.4433 25.8497 15 24.4413 15C22.8316 15 21.3672 15.5653 20.227 16.5073C19.9029 16.7512 19.5116 17.0837 19.2434 17.3164C18.8521 17.6489 18.2597 17.793 17.6896 17.8817C16.9742 17.9038 16.4488 18.0036 16.3146 18.0147C16.3146 18.0147 16.0017 18.0479 15.2639 18.2474C14.9397 18.3361 14.9062 18.7794 15.208 18.9235C15.208 18.9235 15.2192 18.9235 15.2192 18.9346C15.6998 19.1673 16.1581 19.5442 16.7282 20.4419C17.4101 21.5059 17.5331 22.182 17.969 23.2017C18.6733 26.1277 21.3002 28.3 24.4301 28.3C27.4482 28.3 29.9969 26.2828 30.8129 23.5231C31.3718 22.315 31.4501 21.6167 32.199 20.4419C32.7691 19.5442 33.2274 19.1673 33.7081 18.9346C33.7416 18.9235 33.7751 18.9013 33.8087 18.8902C34.0881 18.7683 34.0546 18.3582 33.7528 18.2807ZM21.8814 23.4012C20.9872 23.1573 20.4283 22.3372 20.4283 22.3372C20.4283 22.3372 21.3896 21.6389 22.2839 21.8827C23.1781 22.1266 23.67 23.2127 23.67 23.2127C23.67 23.2127 22.7757 23.645 21.8814 23.4012ZM27.2023 23.4012C26.308 23.645 25.4138 23.2017 25.4138 23.2017C25.4138 23.2017 25.8944 22.1155 26.7999 21.8717C27.6942 21.6278 28.6555 22.3261 28.6555 22.3261C28.6555 22.3261 28.0966 23.1684 27.2023 23.4012Z"
                            fill="#B2BEC3"
                          />
                          <rect
                            width="191"
                            height="13"
                            transform="translate(47 6)"
                            fill="#F0F3F5"
                          />
                          <rect
                            width="191"
                            height="121"
                            transform="translate(47 23)"
                            fill="#F0F3F5"
                          />
                          <rect width="244" height="150" stroke="#2D3436" />
                        </svg>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col md={12} span={24}>
                  <div
                    className="hp-theme-customise-container-body-item-svg"
                    ref={(ref) => {
                      navigationRef[1] = ref;
                    }}
                    onClick={() => navigationClick(1)}
                  >
                    {child2Svg == 0 && (
                      <svg
                        width="244"
                        height="150"
                        viewBox="0 0 244 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="244" height="150" fill="white" />
                        <rect
                          width="232"
                          height="25"
                          transform="translate(6 6)"
                          fill="#DFE6E9"
                        />
                        <path
                          d="M28.7528 15.2807C27.9591 15.059 27.6126 15.0257 27.6126 15.0257C27.4785 15.0036 26.9531 14.9149 26.2377 14.8928C25.6676 14.8041 25.0751 14.6489 24.6839 14.3275C24.2591 13.9728 23.5437 13.3632 23.2642 13.2192C23.2531 13.2081 23.2419 13.2081 23.2307 13.2081C22.1576 12.4433 20.8497 12 19.4413 12C17.8316 12 16.3672 12.5653 15.227 13.5073C14.9029 13.7512 14.5116 14.0837 14.2434 14.3164C13.8521 14.6489 13.2597 14.793 12.6896 14.8817C11.9742 14.9038 11.4488 15.0036 11.3146 15.0147C11.3146 15.0147 11.0017 15.0479 10.2639 15.2474C9.93972 15.3361 9.90618 15.7794 10.208 15.9235C10.208 15.9235 10.2192 15.9235 10.2192 15.9346C10.6998 16.1673 11.1581 16.5442 11.7282 17.4419C12.4101 18.5059 12.5331 19.182 12.969 20.2017C13.6733 23.1277 16.3002 25.3 19.4301 25.3C22.4482 25.3 24.9969 23.2828 25.8129 20.5231C26.3718 19.315 26.4501 18.6167 27.199 17.4419C27.7691 16.5442 28.2274 16.1673 28.7081 15.9346C28.7416 15.9235 28.7751 15.9013 28.8087 15.8902C29.0881 15.7683 29.0546 15.3582 28.7528 15.2807ZM16.8814 20.4012C15.9872 20.1573 15.4283 19.3372 15.4283 19.3372C15.4283 19.3372 16.3896 18.6389 17.2839 18.8827C18.1781 19.1266 18.67 20.2127 18.67 20.2127C18.67 20.2127 17.7757 20.645 16.8814 20.4012ZM22.2023 20.4012C21.308 20.645 20.4138 20.2017 20.4138 20.2017C20.4138 20.2017 20.8944 19.1155 21.7999 18.8717C22.6942 18.6278 23.6555 19.3261 23.6555 19.3261C23.6555 19.3261 23.0966 20.1684 22.2023 20.4012Z"
                          fill="#B2BEC3"
                        />
                        <rect
                          width="232"
                          height="109"
                          transform="translate(6 35)"
                          fill="#F0F3F5"
                        />
                        <rect width="244" height="150" stroke="#DFE6E9" />
                      </svg>
                    )}

                    {child2Svg == 1 && (
                      <svg
                        width="244"
                        height="150"
                        viewBox="0 0 244 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="244" height="150" fill="white" />
                        <rect
                          width="240"
                          height="25"
                          transform="translate(2 2)"
                          fill="#DFE6E9"
                        />
                        <path
                          d="M24.7528 10.2807C23.9591 10.059 23.6126 10.0257 23.6126 10.0257C23.4785 10.0036 22.9531 9.91492 22.2377 9.89275C21.6676 9.80408 21.0751 9.64892 20.6839 9.3275C20.2591 8.97283 19.5437 8.36325 19.2642 8.21917C19.2531 8.20808 19.2419 8.20808 19.2307 8.20808C18.1576 7.44333 16.8497 7 15.4413 7C13.8316 7 12.3672 7.56525 11.227 8.50733C10.9029 8.75117 10.5116 9.08367 10.2434 9.31642C9.85212 9.64892 9.25967 9.793 8.68958 9.88167C7.97417 9.90383 7.44879 10.0036 7.31465 10.0147C7.31465 10.0147 7.00165 10.0479 6.26389 10.2474C5.93972 10.3361 5.90618 10.7794 6.20799 10.9235C6.20799 10.9235 6.21917 10.9235 6.21917 10.9346C6.69984 11.1673 7.15815 11.5442 7.72824 12.4419C8.41012 13.5059 8.53308 14.182 8.96903 15.2017C9.67327 18.1277 12.3002 20.3 15.4301 20.3C18.4482 20.3 20.9969 18.2828 21.8129 15.5231C22.3718 14.315 22.4501 13.6167 23.199 12.4419C23.7691 11.5442 24.2274 11.1673 24.7081 10.9346C24.7416 10.9235 24.7751 10.9013 24.8087 10.8902C25.0881 10.7683 25.0546 10.3582 24.7528 10.2807ZM12.8814 15.4012C11.9872 15.1573 11.4283 14.3372 11.4283 14.3372C11.4283 14.3372 12.3896 13.6389 13.2839 13.8827C14.1781 14.1266 14.67 15.2127 14.67 15.2127C14.67 15.2127 13.7757 15.645 12.8814 15.4012ZM18.2023 15.4012C17.308 15.645 16.4138 15.2017 16.4138 15.2017C16.4138 15.2017 16.8944 14.1155 17.7999 13.8717C18.6942 13.6278 19.6555 14.3261 19.6555 14.3261C19.6555 14.3261 19.0966 15.1684 18.2023 15.4012Z"
                          fill="#B2BEC3"
                        />
                        <rect
                          width="224"
                          height="105"
                          transform="translate(10 35)"
                          fill="#F0F3F5"
                        />
                        <rect width="244" height="150" stroke="#DFE6E9" />
                      </svg>
                    )}

                    {child2Svg == 2 && (
                      <svg
                        width="244"
                        height="150"
                        viewBox="0 0 244 150"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="244" height="150" fill="white" />
                        <rect
                          width="240"
                          height="33"
                          transform="translate(2 2)"
                          fill="#DFE6E9"
                        />
                        <path
                          d="M24.7528 10.2807C23.9591 10.059 23.6126 10.0257 23.6126 10.0257C23.4785 10.0036 22.9531 9.91492 22.2377 9.89275C21.6676 9.80408 21.0751 9.64892 20.6839 9.3275C20.2591 8.97283 19.5437 8.36325 19.2642 8.21917C19.2531 8.20808 19.2419 8.20808 19.2307 8.20808C18.1576 7.44333 16.8497 7 15.4413 7C13.8316 7 12.3672 7.56525 11.227 8.50733C10.9029 8.75117 10.5116 9.08367 10.2434 9.31642C9.85212 9.64892 9.25967 9.793 8.68958 9.88167C7.97417 9.90383 7.44879 10.0036 7.31465 10.0147C7.31465 10.0147 7.00165 10.0479 6.26389 10.2474C5.93972 10.3361 5.90618 10.7794 6.20799 10.9235C6.20799 10.9235 6.21917 10.9235 6.21917 10.9346C6.69984 11.1673 7.15815 11.5442 7.72824 12.4419C8.41012 13.5059 8.53308 14.182 8.96903 15.2017C9.67327 18.1277 12.3002 20.3 15.4301 20.3C18.4482 20.3 20.9969 18.2828 21.8129 15.5231C22.3718 14.315 22.4501 13.6167 23.199 12.4419C23.7691 11.5442 24.2274 11.1673 24.7081 10.9346C24.7416 10.9235 24.7751 10.9013 24.8087 10.8902C25.0881 10.7683 25.0546 10.3582 24.7528 10.2807ZM12.8814 15.4012C11.9872 15.1573 11.4283 14.3372 11.4283 14.3372C11.4283 14.3372 12.3896 13.6389 13.2839 13.8827C14.1781 14.1266 14.67 15.2127 14.67 15.2127C14.67 15.2127 13.7757 15.645 12.8814 15.4012ZM18.2023 15.4012C17.308 15.645 16.4138 15.2017 16.4138 15.2017C16.4138 15.2017 16.8944 14.1155 17.7999 13.8717C18.6942 13.6278 19.6555 14.3261 19.6555 14.3261C19.6555 14.3261 19.0966 15.1684 18.2023 15.4012Z"
                          fill="#B2BEC3"
                        />
                        <rect
                          width="224"
                          height="97"
                          transform="translate(10 43)"
                          fill="#F0F3F5"
                        />
                        <rect width="244" height="150" stroke="#DFE6E9" />
                      </svg>
                    )}

                    <div className="hp-theme-customise-container-body-item-svg-check">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16.9987"
                          cy="17.0007"
                          r="14.1667"
                          fill="white"
                        />
                        <path
                          d="M16.9987 2.83398C9.1872 2.83398 2.83203 9.18915 2.83203 17.0007C2.83203 24.8122 9.1872 31.1673 16.9987 31.1673C24.8102 31.1673 31.1654 24.8122 31.1654 17.0007C31.1654 9.18915 24.8102 2.83398 16.9987 2.83398ZM16.9987 28.334C10.7498 28.334 5.66536 23.2496 5.66536 17.0007C5.66536 10.7517 10.7498 5.66732 16.9987 5.66732C23.2476 5.66732 28.332 10.7517 28.332 17.0007C28.332 23.2496 23.2476 28.334 16.9987 28.334Z"
                          fill="#2D3436"
                        />
                        <path
                          d="M14.1674 19.2479L10.9105 15.9966L8.91016 18.0026L14.1702 23.2514L23.6704 13.7512L21.6672 11.748L14.1674 19.2479Z"
                          fill="#2D3436"
                        />
                      </svg>
                    </div>
                  </div>

                  <Row gutter={[4]} className="hp-mt-8">
                    <Col span={8}>
                      <div
                        className="hp-theme-customise-container-body-item-svg-other active-check"
                        ref={(ref) => {
                          navigationChild2Ref[0] = ref;
                        }}
                        onClick={() => navigationChild2Click(0)}
                      >
                        <svg
                          width="244"
                          height="150"
                          viewBox="0 0 244 150"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="244" height="150" fill="white" />
                          <rect
                            width="232"
                            height="25"
                            transform="translate(6 6)"
                            fill="#DFE6E9"
                          />
                          <path
                            d="M28.7528 15.2807C27.9591 15.059 27.6126 15.0257 27.6126 15.0257C27.4785 15.0036 26.9531 14.9149 26.2377 14.8928C25.6676 14.8041 25.0751 14.6489 24.6839 14.3275C24.2591 13.9728 23.5437 13.3632 23.2642 13.2192C23.2531 13.2081 23.2419 13.2081 23.2307 13.2081C22.1576 12.4433 20.8497 12 19.4413 12C17.8316 12 16.3672 12.5653 15.227 13.5073C14.9029 13.7512 14.5116 14.0837 14.2434 14.3164C13.8521 14.6489 13.2597 14.793 12.6896 14.8817C11.9742 14.9038 11.4488 15.0036 11.3146 15.0147C11.3146 15.0147 11.0017 15.0479 10.2639 15.2474C9.93972 15.3361 9.90618 15.7794 10.208 15.9235C10.208 15.9235 10.2192 15.9235 10.2192 15.9346C10.6998 16.1673 11.1581 16.5442 11.7282 17.4419C12.4101 18.5059 12.5331 19.182 12.969 20.2017C13.6733 23.1277 16.3002 25.3 19.4301 25.3C22.4482 25.3 24.9969 23.2828 25.8129 20.5231C26.3718 19.315 26.4501 18.6167 27.199 17.4419C27.7691 16.5442 28.2274 16.1673 28.7081 15.9346C28.7416 15.9235 28.7751 15.9013 28.8087 15.8902C29.0881 15.7683 29.0546 15.3582 28.7528 15.2807ZM16.8814 20.4012C15.9872 20.1573 15.4283 19.3372 15.4283 19.3372C15.4283 19.3372 16.3896 18.6389 17.2839 18.8827C18.1781 19.1266 18.67 20.2127 18.67 20.2127C18.67 20.2127 17.7757 20.645 16.8814 20.4012ZM22.2023 20.4012C21.308 20.645 20.4138 20.2017 20.4138 20.2017C20.4138 20.2017 20.8944 19.1155 21.7999 18.8717C22.6942 18.6278 23.6555 19.3261 23.6555 19.3261C23.6555 19.3261 23.0966 20.1684 22.2023 20.4012Z"
                            fill="#B2BEC3"
                          />
                          <rect
                            width="232"
                            height="109"
                            transform="translate(6 35)"
                            fill="#F0F3F5"
                          />
                          <rect width="244" height="150" stroke="#DFE6E9" />
                        </svg>
                      </div>
                    </Col>

                    <Col span={8}>
                      <div
                        className="hp-theme-customise-container-body-item-svg-other"
                        ref={(ref) => {
                          navigationChild2Ref[1] = ref;
                        }}
                        onClick={() => navigationChild2Click(1)}
                      >
                        <svg
                          width="244"
                          height="150"
                          viewBox="0 0 244 150"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="244" height="150" fill="white" />
                          <rect
                            width="240"
                            height="25"
                            transform="translate(2 2)"
                            fill="#DFE6E9"
                          />
                          <path
                            d="M24.7528 10.2807C23.9591 10.059 23.6126 10.0257 23.6126 10.0257C23.4785 10.0036 22.9531 9.91492 22.2377 9.89275C21.6676 9.80408 21.0751 9.64892 20.6839 9.3275C20.2591 8.97283 19.5437 8.36325 19.2642 8.21917C19.2531 8.20808 19.2419 8.20808 19.2307 8.20808C18.1576 7.44333 16.8497 7 15.4413 7C13.8316 7 12.3672 7.56525 11.227 8.50733C10.9029 8.75117 10.5116 9.08367 10.2434 9.31642C9.85212 9.64892 9.25967 9.793 8.68958 9.88167C7.97417 9.90383 7.44879 10.0036 7.31465 10.0147C7.31465 10.0147 7.00165 10.0479 6.26389 10.2474C5.93972 10.3361 5.90618 10.7794 6.20799 10.9235C6.20799 10.9235 6.21917 10.9235 6.21917 10.9346C6.69984 11.1673 7.15815 11.5442 7.72824 12.4419C8.41012 13.5059 8.53308 14.182 8.96903 15.2017C9.67327 18.1277 12.3002 20.3 15.4301 20.3C18.4482 20.3 20.9969 18.2828 21.8129 15.5231C22.3718 14.315 22.4501 13.6167 23.199 12.4419C23.7691 11.5442 24.2274 11.1673 24.7081 10.9346C24.7416 10.9235 24.7751 10.9013 24.8087 10.8902C25.0881 10.7683 25.0546 10.3582 24.7528 10.2807ZM12.8814 15.4012C11.9872 15.1573 11.4283 14.3372 11.4283 14.3372C11.4283 14.3372 12.3896 13.6389 13.2839 13.8827C14.1781 14.1266 14.67 15.2127 14.67 15.2127C14.67 15.2127 13.7757 15.645 12.8814 15.4012ZM18.2023 15.4012C17.308 15.645 16.4138 15.2017 16.4138 15.2017C16.4138 15.2017 16.8944 14.1155 17.7999 13.8717C18.6942 13.6278 19.6555 14.3261 19.6555 14.3261C19.6555 14.3261 19.0966 15.1684 18.2023 15.4012Z"
                            fill="#B2BEC3"
                          />
                          <rect
                            width="224"
                            height="105"
                            transform="translate(10 35)"
                            fill="#F0F3F5"
                          />
                          <rect width="244" height="150" stroke="#DFE6E9" />
                        </svg>
                      </div>
                    </Col>

                    <Col span={8}>
                      <div
                        className="hp-theme-customise-container-body-item-svg-other"
                        ref={(ref) => {
                          navigationChild2Ref[2] = ref;
                        }}
                        onClick={() => navigationChild2Click(2)}
                      >
                        <svg
                          width="244"
                          height="150"
                          viewBox="0 0 244 150"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="244" height="150" fill="white" />
                          <rect
                            width="240"
                            height="33"
                            transform="translate(2 2)"
                            fill="#DFE6E9"
                          />
                          <path
                            d="M24.7528 10.2807C23.9591 10.059 23.6126 10.0257 23.6126 10.0257C23.4785 10.0036 22.9531 9.91492 22.2377 9.89275C21.6676 9.80408 21.0751 9.64892 20.6839 9.3275C20.2591 8.97283 19.5437 8.36325 19.2642 8.21917C19.2531 8.20808 19.2419 8.20808 19.2307 8.20808C18.1576 7.44333 16.8497 7 15.4413 7C13.8316 7 12.3672 7.56525 11.227 8.50733C10.9029 8.75117 10.5116 9.08367 10.2434 9.31642C9.85212 9.64892 9.25967 9.793 8.68958 9.88167C7.97417 9.90383 7.44879 10.0036 7.31465 10.0147C7.31465 10.0147 7.00165 10.0479 6.26389 10.2474C5.93972 10.3361 5.90618 10.7794 6.20799 10.9235C6.20799 10.9235 6.21917 10.9235 6.21917 10.9346C6.69984 11.1673 7.15815 11.5442 7.72824 12.4419C8.41012 13.5059 8.53308 14.182 8.96903 15.2017C9.67327 18.1277 12.3002 20.3 15.4301 20.3C18.4482 20.3 20.9969 18.2828 21.8129 15.5231C22.3718 14.315 22.4501 13.6167 23.199 12.4419C23.7691 11.5442 24.2274 11.1673 24.7081 10.9346C24.7416 10.9235 24.7751 10.9013 24.8087 10.8902C25.0881 10.7683 25.0546 10.3582 24.7528 10.2807ZM12.8814 15.4012C11.9872 15.1573 11.4283 14.3372 11.4283 14.3372C11.4283 14.3372 12.3896 13.6389 13.2839 13.8827C14.1781 14.1266 14.67 15.2127 14.67 15.2127C14.67 15.2127 13.7757 15.645 12.8814 15.4012ZM18.2023 15.4012C17.308 15.645 16.4138 15.2017 16.4138 15.2017C16.4138 15.2017 16.8944 14.1155 17.7999 13.8717C18.6942 13.6278 19.6555 14.3261 19.6555 14.3261C19.6555 14.3261 19.0966 15.1684 18.2023 15.4012Z"
                            fill="#B2BEC3"
                          />
                          <rect
                            width="224"
                            height="97"
                            transform="translate(10 43)"
                            fill="#F0F3F5"
                          />
                          <rect width="244" height="150" stroke="#DFE6E9" />
                        </svg>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
