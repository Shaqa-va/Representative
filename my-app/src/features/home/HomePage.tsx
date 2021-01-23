import React, { Fragment } from "react";
import { Container, Segment, Header, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>

        <Fragment>
          <Header as="h2" inverted content={`Welcome back shaghayegh`} />
          <Button as={Link} to="/activities" size="huge" inverted>
            Activities
          </Button>
        </Fragment>

        <Fragment>
          <Header as="h2" inverted content="Welcome to Reactivities" />
          <Button size="huge" inverted>
            Login
          </Button>
          <Button disabled={true} size="huge" inverted>
            Register
          </Button>
        </Fragment>
      </Container>
    </Segment>
  );
};

export default HomePage;
