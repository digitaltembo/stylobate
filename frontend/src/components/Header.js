// @flow
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import AuthContext from '../utils/AuthContext';

import './Header.css';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);

  const handleEmailClick = React.useCallback((event) => {
    setUserMenuAnchor(event.currentTarget);
  }, [setUserMenuAnchor]);

  const handleUserMenuClose = React.useCallback(() => {
    setUserMenuAnchor(null);
  }, [setUserMenuAnchor]);

  return (
    <AppBar position="static" className="header" >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" clasName="header-menuButton" onClick={() => setDrawerOpen(true)}>
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
        <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <List>
            <ListItem button>
              <ListItemText primary='Hello' />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Good Bye!' />
            </ListItem>
          </List>
        </Drawer>
        <Typography variant="h6" className="header-title">
          Stylobate
        </Typography>
        <AuthContext.Consumer>
          {({authContext, logout}) => (authContext)
            ? (
              <>
                <Button color="inherit" onClick={handleEmailClick}>{authContext.email}</Button>
                <Menu
                  anchorEl={userMenuAnchor}

                  getContentAnchorEl={null}
                  keepMounted
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}

                  anchorOrigin={{
                    vertical: 'bottom',
                  }}

                  transformOrigin={{
                    vertical: 'top',
                  }}
                >
                  <MenuItem onClick={logout}>Log Out</MenuItem>
                </Menu>
              </>
            ) : <Button color="inherit" href="/login">Login</Button>
          }
        </AuthContext.Consumer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;