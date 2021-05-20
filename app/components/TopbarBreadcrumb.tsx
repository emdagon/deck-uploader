import Link from "next/link";
import { gql, useQuery } from "@apollo/client";

import { Breadcrumb } from "semantic-ui-react";

const DeckQuery = gql`
  query DeckQuery($id: uuid!) {
    deck: decks_by_pk(id: $id) {
      title
    }
  }
`;

type TopbarBreadcrumbProps = {
  handler?: String;
  deckId?: String;
};

const TopbarBreadcrumb = ({ handler, deckId }: TopbarBreadcrumbProps) => {
  const { data, loading, called } = useQuery(DeckQuery, {
    variables: {
      id: deckId,
    },
    skip: !deckId,
  });

  return (
    <Breadcrumb>
      <Breadcrumb.Section as={Link} href="/">
        Companies
      </Breadcrumb.Section>
      {handler && (
        <>
          <Breadcrumb.Divider />
          <Breadcrumb.Section as={Link} href={`/${handler}`} active={!deckId}>
            {handler}
          </Breadcrumb.Section>
          {deckId && called && data && (
            <>
              <Breadcrumb.Divider />
              <Breadcrumb.Section active>{data.deck.title}</Breadcrumb.Section>
            </>
          )}
        </>
      )}
    </Breadcrumb>
  );
};

export default TopbarBreadcrumb;
