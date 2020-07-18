import React from 'react';


import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import AuthContext from '../../utils/AuthContext';

import './Home.css';

const Home = () => (
  <div className="App">
    <header className="App-header">
      <img src='/logo512.png' className="App-logo" alt="logo" />
      <div>
        <h1>Stylobate</h1>
        <AuthContext.Consumer>
          {({authContext}) => authContext && <h2> Welcome, {authContext.email}! </h2>}
        </AuthContext.Consumer>
      </div>
    </header>
    <div>
      <div className="App-description">
        <p>
          This is Stylobate, a one-stop shop for all your webapp needs.
        </p>
        <p>
          The page you are looking at is rendered from <pre>frontend/src/pages/home/Home.js</pre>. Edit that to see your changes live!
        </p>
        <p>
          See <a href='https://github.com/digitaltembo/stylobate' target="_blank">the README</a> for more details, 
          and maybe install <a href='https://github.com/digitaltembo/stylobate-mgmt' target="_blank">the stylobate-mgmt tool</a> while you are at it!
        </p>
        <p>
          For some documentation on the various technologies in use, see below:
        </p>
        <div className="App-docs">
          <Accordion>
            <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>Deployment</AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem button component="a" href='https://docs.docker.com/' target='_blank'>
                  <ListItemText 
                    primary='Docker'
                    secondary={`
                      Definitions of individual containers to run the sub-applications (NginX, Certbot, FastAPI, Yarn) in an isolated manner
                    `}                
                  />
                </ListItem>
                <ListItem button component="a" href='https://docs.docker.com/compose/' target='_blank'>
                  <ListItemText 
                    primary='Docker Compose'
                    secondary={`
                      Orchestration of the Docker containers
                    `}                
                  />
                </ListItem>
                <ListItem button component="a" href='https://nginx.org/en/docs/beginners_guide.html' target='_blank'>
                  <ListItemText 
                    primary='NginX'
                    secondary={`
                      Load balancing web proxy that, in the production docker compositions, serves the static frontend artifacts and passes API requests 
                  through ASGI/Gunicorn/Uvicorn to the FastAPI backend application
                    `}                
                  />
                </ListItem>
                <ListItem button component="a" href='https://letsencrypt.org/how-it-works/' target='_blank'>
                  <ListItemText 
                    primary='LetsEncrypt'
                    secondary={`
                      With the Cerbot Docker container, LetsEncrypt grants and manages the SSL certificate for the production-with-ssl docker composition
                    `}                
                  />
                </ListItem>
                <ListItem button component="a" href='https://asgi.readthedocs.io/en/latest/' target='_blank'>
                  <ListItemText 
                    primary='ASGI'
                    secondary={`
                      Asynchronous Server Gateway Interface; the method by which NginX, Gunicorn and Uvicorn communicate
                    `}                
                  />
                </ListItem>
                <ListItem button component="a" href='https://docs.gunicorn.org/en/stable/' target='_blank'>
                  <ListItemText 
                    primary='Gunicorn'
                    secondary={`
                      Manages instances of the Uvicorn ASGI HTTP Server
                    `}                
                  />
                </ListItem>
                <ListItem button component="a" href='https://www.uvicorn.org/deployment/' target='_blank'>
                  <ListItemText 
                    primary='Uvicorn'
                    secondary={`
                      The base ASGI server that invokes our FastAPI-defined endpoints
                    `}                
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>Database</AccordionSummary>
            <AccordionDetails>
            <List>
              <ListItem button component="a" href='https://www.sqlite.org/about.html' target='_blank'>
                <ListItemText 
                  primary='Sqlite'
                  secondary={`
                    Lighweight SQL Database tool, may be invoked to manually inspect/edit data with SQL calls in its CLI
                  `}                
                />
              </ListItem>
              <ListItem button component="a" href='https://docs.sqlalchemy.org/en/13/orm/tutorial.html#declare-a-mapping' target='_blank'>
                <ListItemText 
                  primary='SqlAlchemy'
                  secondary={`
                    ORM (Object Relational Manager) for all of the DB-related code in the FastAPI application, so no SQL code actually needs to exist in the code base 
                and queries make sense within Python
                  `}                
                />
              </ListItem>
              <ListItem button component="a" href='https://alembic.sqlalchemy.org/en/latest/tutorial.html' target='_blank'>
                <ListItemText 
                  primary='Alembic'
                  secondary={`
                    Using SqlAlchemy's data models, automatically generates and manages database migrations
                  `}                
                />
              </ListItem>
            </List>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>Backend</AccordionSummary>
            <AccordionDetails>
            <List>
              <ListItem button component="a" href='https://docs.python.org/3/whatsnew/3.8.html' target='_blank'>
                <ListItemText 
                  primary='Python 3.8'
                  secondary={`
                    You know, python. If you don't, this probably isn't the project for you. Notably, the FastAPI application makes heavy use of the new type hints.
                  `}                
                />
              </ListItem>
              <ListItem button component="a" href='https://fastapi.tiangolo.com/' target='_blank'>
                <ListItemText 
                  primary='FastAPI'
                  secondary={`
                    This is the base web application, defining how API endpoints are added and auto-generating documentation
                  `}                
                />
              </ListItem>
              <ListItem button component="a" href='https://swagger.io/resources/open-api/' target='_blank'>
                <ListItemText 
                  primary='OpenAPI/Swagger'
                  secondary={`
                    FastAPI automatically generates an open-api specification for the project, accessible at [server]/openapi.json. It then uses OpenAPI to turn that
                    into very nice and fancy documentation accessible at [server]/docs
                  `}                
                />
              </ListItem>
              <ListItem button component="a" href='https://pydantic-docs.helpmanual.io/' target='_blank'>
                <ListItemText 
                  primary='Pydantic'
                  secondary={`
                    Library used to help define the input/output types of the endpoints
                  `}                
                />
              </ListItem>
            </List>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>Frontend</AccordionSummary>
            <AccordionDetails>
            <List>
              <ListItem button component="a" href='https://reactjs.org/docs/introducing-jsx.html' target='_blank'>
                <ListItemText 
                  primary='ES6/JSX'
                  secondary={`
                    You know, ES6/JSX. If you don't, this probably isn't the project for you. 
                  `}                
                />
              </ListItem>
              <ListItem button component="a" href='https://reactjs.org/docs/create-a-new-react-app.html' target='_blank'>
                <ListItemText 
                  primary='create-react-app'
                  secondary={`
                    The frontend server used in development was created with create-react-app
                  `}                
                />
              </ListItem>
              <ListItem button component="a" href='https://reactrouter.com/web/guides/quick-start' target='_blank'>
                <ListItemText 
                  primary='react-router-dom'
                  secondary={`
                    The mapping between URLs and what is displayed is managed by react-router-dom
                  `}                
                />
              </ListItem>
              <ListItem button component="a" href='https://material-ui.com/getting-started/usage/' target='_blank'>
                <ListItemText 
                  primary='MaterialUI'
                  secondary={`
                    MaterialUI provides most of the basic UX components in a decently pretty and usable way
                  `}                
                />
              </ListItem>
              <ListItem button component="a" href='https://fontawesome.com/icons?d=gallery&s=solid&m=free' target='_blank'>
                <ListItemText 
                  primary='Font Awesome'
                  secondary={`
                    Font Awesome is used for the icons
                  `}                
                />
              </ListItem>
            </List>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
