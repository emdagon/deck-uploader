import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, Modal } from "semantic-ui-react";

function CreateCompanyModal() {
  const [open, setOpen] = useState(false);
  const [handler, setHandler] = useState("");
  const router = useRouter();

  const handleGoClick = () => {
    setOpen(false);
    router.push(`/${handler}`);
  };

  return (
    <Modal
      size="mini"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button primary basic>
          New Company
        </Button>
      }
    >
      <Modal.Header>New Company</Modal.Header>
      <Modal.Content>
        <form onSubmit={handleGoClick}>
          <Input
            value={handler}
            onChange={(_, { value }) => setHandler(value)}
            size="large"
            type="text"
            fluid
            placeholder="ie: wefunder..."
          />
        </form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Go"
          labelPosition="right"
          icon="checkmark"
          onClick={handleGoClick}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default CreateCompanyModal;
