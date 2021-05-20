import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";

import { Button, Form, Input, Modal, Step, Icon } from "semantic-ui-react";

import Uploader from "./Uploader";
import SlidesProcessingStatus from "./SlidesProcessingStatus";

const UpsertDeckMutation = gql`
  mutation UpsertDeckMutation($id: uuid!, $handler: String!, $title: String!) {
    deck: insert_decks_one(
      object: {
        id: $id
        title: $title
        status: "pending"
        company: {
          data: { handler: $handler }
          on_conflict: { constraint: companies_pkey, update_columns: [handler] }
        }
      }
      on_conflict: { constraint: decks_pkey, update_columns: [title] }
    ) {
      id
    }
  }
`;

type NewDeckModalProps = {
  handler: String;
};

const NewDeckModal = ({ handler }: NewDeckModalProps) => {
  const [open, setOpen] = useState(false);

  const handlerModalClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      size="small"
      onClose={handlerModalClose}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button primary icon="plus" content="Create Deck" />}
    >
      <Modal.Header>Add Deck</Modal.Header>
      {open && <NewDeckModalBody handler={handler} />}
    </Modal>
  );
};

const NewDeckModalBody = ({ handler }: NewDeckModalProps) => {
  const router = useRouter();

  const id = useMemo((): String => uuidv4(), []);
  const [title, setTitle] = useState("");

  const [stage, setStage] =
    useState<"title" | "files" | "processing" | "done">("title");

  const [upsertDeck, { called, loading, data, error }] =
    useMutation(UpsertDeckMutation);

  const performUpsert = useCallback(() => {
    upsertDeck({
      variables: {
        id,
        handler,
        title,
      },
    });
  }, [title]);

  useEffect(() => {
    if (called && data) {
      setStage("files");
    }
  }, [called, data]);

  const handleBackClick = () => {
    setStage("title");
  };

  const handleOnUploaded = (response) => {
    setStage("processing");
  };

  const handleProcessingDone = () => {
    setStage("done");
  };

  return (
    <>
      <Modal.Content>
        <Step.Group size="small" fluid>
          <Step key="title" active={stage == "title"}>
            <Icon name="tag" />
            <Step.Content>
              <Step.Title>Set title</Step.Title>
              <Step.Description>Give your deck a title</Step.Description>
            </Step.Content>
          </Step>

          <Step key="files" active={stage == "files"}>
            <Icon name="images" />
            <Step.Content>
              <Step.Title>Upload slides</Step.Title>
              <Step.Description>Upload your presentation</Step.Description>
            </Step.Content>
          </Step>

          <Step key="processing">
            <Icon name="settings" />
            <Step.Content>
              <Step.Title>We do the rest!</Step.Title>
            </Step.Content>
          </Step>
        </Step.Group>
        <Form>
          {stage == "title" && (
            <Form.Field>
              <label>Title</label>
              <Input
                value={title}
                onChange={(_, { value }) => setTitle(value)}
                size="large"
                type="text"
                fluid
                placeholder="This is how we will take over the world..."
              />
            </Form.Field>
          )}

          {called && !!data && (
            <>
              {stage == "files" && (
                <Uploader deckId={id} onUploaded={handleOnUploaded} />
              )}

              {["processing", "done"].includes(stage) && (
                <SlidesProcessingStatus
                  deckId={id}
                  isDone={handleProcessingDone}
                />
              )}
            </>
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        {/* <Button color="black" onClick={handleCancelClick}>
          Cancel
        </Button> */}

        <Button.Group>
          {stage == "files" && (
            <Button onClick={handleBackClick} disabled={loading}>
              Back
            </Button>
          )}
          {stage == "title" && (
            <Button
              disabled={loading || title == ""}
              loading={loading}
              content="Create"
              labelPosition="right"
              icon="save"
              onClick={() => performUpsert()}
              positive
            />
          )}
          {["processing", "done"].includes(stage) && (
            <Button
              content="Check your Deck!"
              labelPosition="right"
              icon="chevron right"
              onClick={() => router.push(`/${handler}/${id}`)}
              positive
            />
          )}
        </Button.Group>
      </Modal.Actions>
    </>
  );
};

export default NewDeckModal;
