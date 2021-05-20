import Dropzone, { IDropzoneProps } from "react-dropzone-uploader";
import { Header } from "semantic-ui-react";

type UploaderProps = {
  deckId: String;
  caption?: String;
  onUploaded?: (response: any) => void;
  onError?: (error: any) => void;
};

const Uploader = ({
  deckId,
  caption = "Drop your deck here!",
  onUploaded = () => {},
  onError = () => {},
}: UploaderProps) => {
  const getUploadParams: IDropzoneProps["getUploadParams"] = () => ({
    url: `/api/${deckId}/upload`,
  });

  const handleChangeStatus = ({ meta, remove }, status, [file]) => {
    console.log(status, file);
    switch (status) {
      case "done":
        onUploaded(JSON.parse(file.xhr.response));
        break;
      case "error_upload":
        onError(JSON.parse(file.xhr.response));
      // case "aborted"
    }
  };

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      maxFiles={1}
      multiple={false}
      canCancel={false}
      accept="application/pdf"
      inputContent={
        <Header subheader="" textAlign="center">
          {caption}
          <p>(Or click)</p>
        </Header>
      }
      styles={{
        dropzone: {
          overflow: "hidden",
        },
        dropzoneActive: { borderColor: "green" },
      }}
    />
  );
};

export default Uploader;
