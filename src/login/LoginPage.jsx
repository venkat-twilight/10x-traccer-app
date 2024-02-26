import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  useMediaQuery,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  TextField,
  Link,
  Snackbar,
  IconButton,
  Tooltip,
  LinearProgress,
  Box,
  Grid,
  Typography,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ReactCountryFlag from "react-country-flag";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionActions } from "../store";
import {
  useLocalization,
  useTranslation,
} from "../common/components/LocalizationProvider";
import LoginLayout from "./LoginLayout";
import usePersistedState from "../common/util/usePersistedState";
import {
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from "../common/components/NativeInterface";
import { useCatch } from "../reactHelper";
import "../resources/styles/login.css";
import shadow from "../resources/images/shadow.png";
import Logo from "../resources/images/logo.svg";
import { useFormik } from "formik";
import * as Yup from "yup";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email")
    .matches(emailRegex, "In-correct email"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Wrong password"),
});

const useStyles = makeStyles((theme) => ({
  options: {
    position: "fixed",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  extraContainer: {
    display: "flex",
    gap: theme.spacing(2),
  },
  registerButton: {
    minWidth: "unset",
  },
  resetPassword: {
    cursor: "pointer",
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({
    code: values[0],
    country: values[1].country,
    name: values[1].name,
  }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState("loginEmail", "");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const registrationEnabled = useSelector(
    (state) => state.session.server.registration
  );
  const languageEnabled = useSelector(
    (state) => !state.session.server.attributes["ui.disableLoginLanguage"]
  );
  const changeEnabled = useSelector(
    (state) => !state.session.server.attributes.disableChange
  );
  const emailEnabled = useSelector(
    (state) => state.session.server.emailEnabled
  );
  const openIdEnabled = useSelector(
    (state) => state.session.server.openIdEnabled
  );
  const openIdForced = useSelector(
    (state) =>
      state.session.server.openIdEnabled && state.session.server.openIdForce
  );
  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector(
    (state) => state.session.server.announcement
  );

  const generateLoginToken = async () => {
    if (nativeEnvironment) {
      let token = "";
      try {
        const expiration = dayjs().add(6, "months").toISOString();
        const response = await fetch("/api/session/token", {
          method: "POST",
          body: new URLSearchParams(`expiration=${expiration}`),
        });
        if (response.ok) {
          token = await response.text();
        }
      } catch (error) {
        token = "";
      }
      nativePostMessage(`login|${token}`);
    }
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    const isMatch = checkCredentials();
    if (isMatch) {
      setFailed(false);
      try {
        const params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("client_id", "tenx-rbac");
        params.append("username", "admintest");
        params.append("password", formik.values.password);
        params.append("email", formik.values.email);
        const query = `email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`;
        const response = await fetch(
          "http://192.168.100.170:8080/realms/TenX/protocol/openid-connect/token",
          {
            method: "POST",
            body: params,
          }
        );

        if (response.ok) {
          const user = await response.json();

          const obj = {
            id: 20,
            attributes: {},
            name: "fleetadmin",
            login: null,
            email: "fleetadmin@gmail.com",
            phone: null,
            readonly: false,
            administrator: true,
            map: null,
            latitude: 0,
            longitude: 0,
            zoom: 0,
            twelveHourFormat: false,
            coordinateFormat: null,
            disabled: false,
            expirationTime: null,
            deviceLimit: -1,
            userLimit: 0,
            deviceReadonly: false,
            limitCommands: false,
            disableReports: false,
            fixedEmail: false,
            poiLayer: null,
            totpKey: null,
            temporary: false,
            password: null,
          };

          generateLoginToken();
          dispatch(sessionActions.updateUser(obj));
          navigate("/dashboard");
        } else if (
          response.status === 401 &&
          response.headers.get("WWW-Authenticate") === "TOTP"
        ) {
          setCodeEnabled(true);
        } else {
          throw Error(await response.text());
        }
      } catch (error) {
        setFailed(true);
        setPassword("");
      }
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetch(
      `/api/session?token=${encodeURIComponent(token)}`
    );
    if (response.ok) {
      const user = await response.json();
      dispatch(sessionActions.updateUser(user));
      navigate("/");
    } else {
      throw Error(await response.text());
    }
  });

  const handleSpecialKey = (e) => {
    if (e.keyCode === 13 && email && password && (!codeEnabled || code)) {
      handlePasswordLogin(e);
    }
  };

  const handleOpenIdLogin = () => {
    document.location = "/api/session/openid/auth";
  };

  useEffect(() => nativePostMessage("authentication"), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  if (openIdForced) {
    handleOpenIdLogin();
    return <LinearProgress />;
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const checkCredentials = () => {
    return true;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handlePasswordLogin,
  });

  return (
    <Box className="login-container">
      <Grid container spacing={0}>
        <Grid item xs={0} sm={7} md={8} lg={8} className="front-image" />
        <Grid
          item
          xs={12}
          sm={5}
          md={4}
          lg={4}
          container
          justifyContent="center"
          alignItems="center"
          style={{ position: "relative" }}
        >
          <Box
            className="shadow-image"
            style={{ backgroundImage: `url(${shadow})` }}
          />
          <Box className="form">
            <img src={Logo} alt="Logo" className="logo" />
            <Typography className="title">Log in to your account</Typography>
            <Typography className="subtitle">
              Welcome back! Please enter your details.
            </Typography>
            <form onSubmit={handlePasswordLogin}>
              <Box>
                <TextField
                  name="email"
                  label="Email"
                  placeholder="Enter the Email ID"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                />
                {formik.touched.email && formik.errors.email && (
                  <Box className="error-text">{formik.errors.email}</Box>
                )}
              </Box>
              <Box>
                <TextField
                  name="password"
                  label="Password"
                  placeholder="Enter the password"
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {formik.touched.password && formik.errors.password && (
                  <Box className="error-text">{formik.errors.password}</Box>
                )}
              </Box>
              <Box style={{ marginTop: "10px" }}>
                <Box className="checkbox-container">
                  <Box className="checkbox-label">
                    <Checkbox
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: 16 },
                      }}
                    />
                    <span>Remember Me</span>
                  </Box>
                  <Box>
                    <Typography className="forgot-password">
                      {" "}
                      Forgot Password?{" "}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    marginTop: 2,
                    backgroundColor: "#EB6247",
                    color: "#FFFFFF",
                    textDecoration: "none",
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </form>
          </Box>

          <Box className="login-footer">
            <span>© 2024 Copyright</span>{" "}
            <span className="login-footer-link">10XTECHNOLOGIES</span>. All
            Rights Reserved
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
