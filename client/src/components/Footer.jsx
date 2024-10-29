import React from "react";
import { Layout } from "antd";

const { Footer: AntdFooter } = Layout;

const Footer = () => {
  return (
    <AntdFooter style={{ textAlign: 'center' }}>
      ©2024 My Application. All Rights Reserved.
    </AntdFooter>
  );
};

export default Footer;
