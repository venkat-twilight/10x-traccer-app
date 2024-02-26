import React from "react";
import AppHeader from "./AppHeader";
import { Box, Breadcrumbs, Card, Grid, Link, Typography } from "@mui/material";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import facility from "../resources/images/facility-management.svg";
import fleet from "../resources/images/fleet-management.svg";
import inventory from "../resources/images/inventory-management.svg";
import asset from "../resources/images/asset-management.svg";
import vehicle from "../resources/images/vehicle-tracking.svg";

const DashboardData = [
  {
    id: 1,
    image: facility,
    title: "Facility Management",
    short_description:
      "Lorem ipsum dolor sit amet consectetur. Amet ullamcorper auctor tempor mauris condimentum.",
  },
  {
    id: 2,
    image: fleet,
    title: "Fleet Management",
    short_description:
      "Lorem ipsum dolor sit amet consectetur. Amet ullamcorper auctor tempor mauris condimentum.",
  },
  {
    id: 3,
    image: inventory,
    title: "Inventory Management",
    short_description:
      "Lorem ipsum dolor sit amet consectetur. Amet ullamcorper auctor tempor mauris condimentum.",
  },
  {
    id: 4,
    image: asset,
    title: "Asset Management",
    short_description:
      "Lorem ipsum dolor sit amet consectetur. Amet ullamcorper auctor tempor mauris condimentum.",
  },
  {
    id: 5,
    image: vehicle,
    title: "Vehicle Tracking",
    short_description:
      "Lorem ipsum dolor sit amet consectetur. Amet ullamcorper auctor tempor mauris condimentum.",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box>
      <AppHeader />
      <Box className="app-main">
        <Box sx={{ margin: "auto", width: "75%", paddingY: "200px" }}>
          <Box>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="none"
                style={{ color: "#A2ADD0", fontSize: "14px" }}
                href="/"
              >
                HOME
              </Link>
              <Typography
                color="#4191FF"
                fontSize="14px"
                sx={{ cursor: "pointer" }}
              >
                DASHBOARD
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {DashboardData.map((item) => (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={4}
                  key={item.id}
                  sx={{ cursor: "pointer" }}
                >
                  <Card
                    sx={{
                      padding: "20px 25px",
                      boxShadow: "0px 4px 4px 0px #4A72D240",
                      borderRadius: "10px",
                    }}
                    onClick={() => navigate("/")}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Box sx={{ py: 1 }}>
                          <img
                            src={item.image}
                            alt="facility_missing"
                            className="dashboard-image"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                        <Box sx={{ py: 1 }}>
                          <Typography
                            variant="h6"
                            color="#282828"
                            fontWeight={700}
                          >
                            {item.title}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            color="#A2ADD0"
                            fontSize={14}
                          >
                            {item.short_description}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box className="app-footer">
            © 2024 Copyright{" "}
            <span className="app-footer-link">10XTECHNOLOGIES</span>. All Rights
            Reserved
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
