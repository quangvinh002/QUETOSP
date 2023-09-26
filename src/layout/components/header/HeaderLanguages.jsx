import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { switchLanguage } from "@/redux/customise/customiseActions";

import { Menu, Avatar, Card, Col } from "antd";

export default function HeaderLanguages() {
  // Redux
  const customise = useSelector((state) => state.customise);
  const dispatch = useDispatch();

  // Language
  const [activeLanguage, setActiveLanguage] = useState(customise.language);
  const languages = ["en", "vi"];

  useEffect(() => {
    setActiveLanguage(customise.language);
  }, [customise]);

  return (
    <Col className="hp-languages hp-mr-8">
      <div className="hp-d-flex-center">
        {/* <Avatar
          size={24}
          src={
            require(`@/assets/images/languages/${activeLanguage || 'en'}.svg`)
              .default
          }
        /> */}
        <span className="hp-languages-text hp-text-color-black-80 hp-text-color-dark-30 hp-text-uppercase hp-ml-8">
          {activeLanguage}
        </span>
      </div>

      <div className="hp-languages-list">
        <Card className="hp-border-color-black-40 hp-border-radius">
          <Menu>
            {languages?.map(
              (item, index) =>
                item !== activeLanguage && (
                  <Menu.Item
                    key={index}
                    onClick={() => dispatch(switchLanguage(item))}
                  >
                    <div className="hp-d-flex-center">
                      {/* <Avatar
                        size={24}
                        src={
                          require(`@/assets/images/languages/${item}.svg`)
                            .default
                        }
                      /> */}
                      <span className="hp-languages-text hp-text-color-black-80 hp-text-color-dark-30 hp-text-uppercase hp-ml-4">
                        {item}
                      </span>
                    </div>
                  </Menu.Item>
                )
            )}
          </Menu>
        </Card>
      </div>
    </Col>
  );
}
