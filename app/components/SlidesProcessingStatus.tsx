import { Progress, Segment, Header, Icon } from "semantic-ui-react";
import { gql, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";

import { isServer } from "../lib/utils";

const DeckWithSlidesSubscription = gql`
  subscription DeckWithSlidesSubscription($deckId: uuid!) {
    deck: decks_by_pk(id: $deckId) {
      title
      pagesCount
      status
      slides: slides_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

type SlidesProcessingStatusProps = {
  deckId: String;
  isDone?: () => void;
};

const SlidesProcessingStatus = ({
  deckId,
  isDone = () => {},
}: SlidesProcessingStatusProps) => {
  const { data, loading, error } = useSubscription(DeckWithSlidesSubscription, {
    variables: {
      deckId,
    },
    skip: isServer(),
  });

  const [status, setStatus] = useState("");
  const [percent, setPercent] = useState(100);

  useEffect(() => {
    if (!data) return;

    setStatus(data.deck.status);

    if (data.deck.status === "done") {
      isDone();
    }

    const { pagesCount, slides } = data.deck;
    const _percent = (100 / pagesCount || 0) * slides.aggregate.count;

    setPercent(_percent);
  }, [data]);

  if (status === "") {
    return null;
  }

  return (
    <Segment placeholder>
      <Header textAlign="center" icon>
        {status == "done" ? (
          <>
            <Icon name="checkmark" color="green" />
            You deck is ready!
          </>
        ) : (
          <>
            <Icon name="setting" loading />
            We are processing your presentation
          </>
        )}
      </Header>
      <Progress
        indicating={status !== "done"}
        success={status === "done"}
        percent={percent}
      />
    </Segment>
  );
};

export default SlidesProcessingStatus;
