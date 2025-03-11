import React from 'react';
import { AppBar, Toolbar, Typography, Container, Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import logo from "../.././logo.svg";
import "../../App.css";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  logo: {
    height: '40vmin',
    pointerEvents: 'none',
  },
  image: {
    width: '100%',
    maxWidth: '600px',
    marginTop: '20px',
  },
  title: {
    flexGrow: 1,
  },
  link: {
    marginTop: '20px',
  },
});

function Page() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Solar Nexus
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.header}>
        <img src={logo} className={classes.logo} alt="logo" />
        <Typography variant="h4">File2!</Typography>
        <Link
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
        >
          Dewna U
        </Link>
      </Container>
    </div>
  );
}

export default Page;