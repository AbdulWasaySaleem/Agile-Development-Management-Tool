import React from "react";
import { HiBell } from "react-icons/hi"; // Notification icon
import { FaUser } from "react-icons/fa"; // User profile icon
import { useAuth } from "./Context/UserContext";
import { Layout, Badge, Dropdown, Menu, Avatar } from "antd";
import { Link } from "react-router-dom";

const { Header: AntdHeader } = Layout;

const Header = () => {
  const [auth] = useAuth();
  const user = auth?.user;

  const handleLogout = () => {}

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/profilepage">View Profile</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Item danger onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntdHeader style={{ padding: '0 16px', backgroundColor: '#f7fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Agile Development</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge count={5} style={{ marginRight: '16px' }}>
            <HiBell style={{ fontSize: '24px' }} />
          </Badge>
          <Dropdown overlay={menu} trigger={['click']}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              {user?.pic ? (
                <Avatar src={user.pic} />
              ) : (
                <FaUser style={{ fontSize: '24px' }} />
              )}
              <div style={{ marginLeft: '8px' }}>
                <span style={{ fontWeight: '600', marginRight:'8px' }}>{user?.name || 'User'}</span>
                <span style={{ color: '#a0aec0', fontSize: '12px' }}>{user?.role || 'Role'}</span>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
      
    </AntdHeader>
  );
};

export default Header;
