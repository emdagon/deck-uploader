import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { gql, useSubscription } from "@apollo/client";

import {
  Container,
  Dimmer,
  Loader,
  Button,
  Card,
  Segment,
  Icon,
  Header,
  Message,
} from "semantic-ui-react";

import NewDeckModal from "../../components/NewDeckModal";
import { isServer } from "../../lib/utils";

const DecksSubscription = gql`
  subscription DecksSubscription($handler: String!) {
    decks(where: { company: { handler: { _eq: $handler } } }) {
      id
      title
      slides: slides_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

const UserDecks = () => {
  const router = useRouter();
  const handler = router.query.handler as String;

  const { data, loading } = useSubscription(DecksSubscription, {
    variables: { handler },
    skip: isServer(),
  });

  return (
    <>
      <Container text style={{ marginTop: "4em" }}>
        <Segment basic textAlign="right">
          <NewDeckModal handler={handler} />
        </Segment>
        {loading ? (
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
        ) : !data || !data.decks.length ? (
          <Message info header="No decks yet, add one!" />
        ) : (
          <Card.Group itemsPerRow={3}>
            {data.decks.map(({ id, title, slides }) => (
              <Card key={id}>
                <Card.Content>
                  {/* <Image TODO: Would be great to have the first slide here
                  floated="right"
                  size="mini"
                  src="https://picsum.photos/200"
                /> */}
                  <Card.Header>{title}</Card.Header>
                  <Card.Meta>Slides: {slides.aggregate.count}</Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    <Link href={`/${handler}/${id}`}>
                      <Button basic color="green">
                        Open Deck
                      </Button>
                    </Link>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        )}
      </Container>
    </>
  );
};

export default UserDecks;
