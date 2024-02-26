import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import logo from "../resources/images/logo2.svg";
import bell from "../resources/images/bell.svg";
import email from "../resources/images/email.svg";
import setting from "../resources/images/setting.svg";
import search from "../resources/images/search.svg";
import person from "../resources/images/person.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./app-header.css";

export default function AppHeader() {
  return (
    <Box>
      <AppBar position="fixed" sx={{ boxShadow: "0px 4px 20px 0px #244F961A" }}>
        <Toolbar
          sx={{
            background: "#ffffff",
            boxShadow: "0px 4px 20px 0px #244F961A",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              p: 1,
              mx: 2,
            }}
          >
            <img src={logo} alt="logo_missing" className="toolbar-logo" />
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              borderLeft: "1px solid #D4D9E0",
              paddingLeft: "30px",
            }}
          >
            <IconButton
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "0px",
              }}
            >
              <img
                src={search}
                className="toolbar-icons"
                alt="search_missing"
              />
            </IconButton>
            <IconButton
              sx={{
                background: "#F3F6F9",
                width: "40px",
                height: "40px",
                borderRadius: "7px",
                m: 1,
                ml: 10,
              }}
            >
              <img
                src={setting}
                className="toolbar-icons"
                alt="setting_missing"
              />
            </IconButton>
            <IconButton
              sx={{
                background: "#F3F6F9",
                width: "40px",
                height: "40px",
                borderRadius: "7px",
                m: 1,
              }}
            >
              <img src={email} className="toolbar-icons" alt="email_missing" />
            </IconButton>
            <IconButton
              sx={{
                background: "#F3F6F9",
                width: "40px",
                height: "40px",
                borderRadius: "7px",
                m: 1,
              }}
            >
              <img src={bell} className="toolbar-icons" alt="bell_missing" />
            </IconButton>
            <IconButton disableRipple>
              <Avatar alt="person_missing" src={person} variant="rounded" />
              <Box sx={{ ml: 1, mr: 2 }}>
                <Box
                  sx={{ fontSize: "16px", color: "#4191FF", fontWeight: 400 }}
                >
                  Tayle
                </Box>
                <Box
                  sx={{
                    fontSize: "15px",
                    color: "#000",
                    fontWeight: 400,
                    display: "flex",
                  }}
                >
                  Admin
                </Box>
              </Box>
              <Box sx={{ m: 1 }}>
                <IconButton>
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
