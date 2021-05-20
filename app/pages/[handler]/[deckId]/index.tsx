import React, { useState } from "react";
import { useRouter } from "next/router";
import { gql, useSubscription } from "@apollo/client";

import {
  Container,
  Dimmer,
  Loader,
  Image,
  Visibility,
  Transition,
  Segment,
  Message,
} from "semantic-ui-react";

import { isServer } from "../../../lib/utils";
import SlidesProcessingStatus from "../../../components/SlidesProcessingStatus";
import Uploader from "../../../components/Uploader";

const DeckSubscription = gql`
  subscription DeckSubscription($id: uuid!) {
    deck: decks_by_pk(id: $id) {
      id
      title
      status
      slides(order_by: { priority: asc_nulls_last, updateAt: desc }) {
        id
        filename
      }
    }
  }
`;

const Deck = () => {
  const router = useRouter();
  const deckId = router.query.deckId as String;

  const { data, loading } = useSubscription(DeckSubscription, {
    variables: { id: deckId },
    skip: isServer(),
  });

  let content = null;

  if (loading) {
    content = (
      <Dimmer active inverted>
        <Loader inverted />
      </Dimmer>
    );
  } else if (data) {
    if (data.deck.status == "processing") {
      content = (
        <Container style={{ marginTop: "7em" }}>
          <SlidesProcessingStatus deckId={deckId} />
        </Container>
      );
    } else {
      content = !data.deck.slides.length ? (
        <Container style={{ marginTop: "7em" }}>
          <Message warning header="This Deck has no slides..." />
          <Uploader
            deckId={deckId}
            caption="Add them dropping your presentation here!"
          />
        </Container>
      ) : (
        <>
          {data.deck.slides.map(({ id, filename }) => (
            <Slide
              key={id}
              src={`/uploads/${deckId}/${filename}`}
              defaultVisible={data.deck.slides[0].id == id}
            />
          ))}
        </>
      );
    }
  } else {
    content = (
      <Container style={{ marginTop: "7em" }}>
        <Message error header="There was an error trying to load your Deck" />
      </Container>
    );
  }

  return (
    <Container fluid textAlign="center" style={{ marginTop: "3em" }}>
      {content}
    </Container>
  );
};

type SlideProps = {
  src: string;
  defaultVisible?: boolean;
};

const Slide = ({ src, defaultVisible = false }: SlideProps) => {
  const [visible, setVisible] = useState(defaultVisible);

  return (
    <Visibility offset={[-10, -10]} onTopVisible={() => setVisible(true)}>
      <Segment textAlign="center" basic style={{ height: "96vh" }}>
        <Transition.Group animation="vertical flip" duration={1000}>
          {visible && (
            <Image centered src={src} rounded style={{ height: "100%" }} />
          )}
        </Transition.Group>
      </Segment>
    </Visibility>
  );
};
export default Deck;
