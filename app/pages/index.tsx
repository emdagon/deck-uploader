import React, { useState } from "react";
import Link from "next/link";
import { gql, useSubscription } from "@apollo/client";

import {
  Container,
  Dimmer,
  Loader,
  Image,
  Card,
  Message,
  Placeholder,
  Transition,
} from "semantic-ui-react";

import { isServer } from "../lib/utils";

const CompaniesSubscription = gql`
  subscription CompaniesSubscription {
    companies {
      handler
      decks: decks_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

const Home = () => {
  const { data, loading } = useSubscription(CompaniesSubscription, {
    skip: isServer(),
  });

  return (
    <Container text style={{ marginTop: "4em" }}>
      {loading ? (
        <Dimmer active inverted>
          <Loader inverted />
        </Dimmer>
      ) : !data || !data.companies.length ? (
        <Message header="There are no companies yet, create one!" info />
      ) : (
        <Card.Group itemsPerRow={3}>
          {data.companies.map(({ handler, decks }) => (
            <CompanyCard
              key={handler}
              handler={handler}
              decksCount={decks.aggregate.count}
            />
          ))}
        </Card.Group>
      )}
    </Container>
  );
};

type CompanyCardProps = {
  handler: String;
  decksCount: Number;
};

const CompanyCard = ({ handler, decksCount }: CompanyCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link href={`/${handler}`}>
      <Card link>
        {/* Preload image */}
        <img
          src={`https://picsum.photos/200?random=${handler}`}
          style={{ display: "none" }}
          onLoad={() => setImgLoaded(true)}
        />
        <Transition.Group animation="fade" duration={5000}>
          {imgLoaded ? (
            <Image
              floated="right"
              size="mini"
              src={`https://picsum.photos/200?random=${handler}`}
              wrapped
              // hidden={!imgLoaded}
              ui={false}
            />
          ) : (
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>
          )}
        </Transition.Group>

        <Card.Content>
          <Card.Header>{handler}</Card.Header>
        </Card.Content>
        <Card.Content extra>
          <Card.Meta>Decks: {decksCount}</Card.Meta>
        </Card.Content>
      </Card>
    </Link>
  );
};

export default Home;
