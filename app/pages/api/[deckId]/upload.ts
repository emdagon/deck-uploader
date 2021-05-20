import fs from "fs";

import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";

// PDF
import { fromBuffer } from "pdf2pic";
import PDFParser from "pdf2json";

import { gql } from "@apollo/client";

import initMiddleware from "../../../lib/uploader-middleware";

import apiClient from "../../../lib/api-client";
import { PDF_TYPES, PPT_TYPES } from "../../../lib/constants";

const upload = multer();
const multerAny = initMiddleware(upload.any());

type NextApiRequestWithFormData = NextApiRequest & {
  files: any[];
};

type BlobCorrected = Blob & {
  buffer: Buffer;
};

const defaultOptions = {
  density: 200,
  quality: 100,
  saveFilename: "slide",
  savePath: "./public/uploads",
  format: "png",
  width: 2304,
  height: 1296,
};
const pagesToExport = -1; // -1 for all pages

// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
};

const UpdateDeckMutation = gql`
  mutation UpdateDeckMutation($id: uuid!, $pagesCount: Int, $status: String) {
    update_decks_by_pk(
      _set: { pagesCount: $pagesCount, status: $status }
      pk_columns: { id: $id }
    ) {
      id
      pagesCount
    }
  }
`;

// Bulk insertion
// const InsertSlidesMutation = gql`
//   mutation InsertSlidesMutation($slides: [slides_insert_input!]!) {
//     insert_slides(objects: $slides) {
//       affected_rows
//     }
//   }
// `;

const InsertSlideMutation = gql`
  mutation InsertSlideMutation(
    $deckId: uuid!
    $filename: String!
    $priority: Int
    $dimentions: String
    $fileSize: numeric
    $originalPage: Int
  ) {
    slide: insert_slides_one(
      object: {
        deckId: $deckId
        filename: $filename
        priority: $priority
        dimentions: $dimentions
        fileSize: $fileSize
        originalPage: $originalPage
      }
    ) {
      id
    }
  }
`;

export default async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  const { deckId } = req.query;

  await multerAny(req, res);

  // This operation expects a single file upload. Edit as needed.
  if (!req.files?.length || req.files.length > 1) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const [file] = req.files;
  const blob: BlobCorrected = file;

  console.log("Processing: ", deckId, blob.size);

  const savePath = `./public/uploads/${deckId}`;
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }

  if (PPT_TYPES.includes(file.mimetype)) {
    return res.status(400).json({
      error: `${file.mimetype} files are not yet supported`,
    });
  } else if (PDF_TYPES.includes(file.mimetype)) {
    fs.writeFileSync(`${savePath}/original.pdf`, blob.buffer);
  } else {
    return res.status(400).json({
      error: `${file.mimetype} type is not supported`,
    });
  }

  await getPdfData(blob.buffer)
    .then((data) => {
      const { pages, width, height } = data;
      const slidesExporter = fromBuffer(blob.buffer, {
        ...defaultOptions,
        width,
        height,
        savePath,
      });

      apiClient.mutate({
        mutation: UpdateDeckMutation,
        variables: {
          id: deckId,
          status: "processing",
          pagesCount: pages,
        },
      });

      res.status(200).json({ pages, fileSize: blob.size });

      const processes = Array.from({ length: pages }, (_, i) => i + 1).map(
        (pageNumber) => {
          return slidesExporter(pageNumber).then(
            async ({ name, size, fileSize, page }) => {
              await apiClient.mutate({
                mutation: InsertSlideMutation,
                variables: {
                  deckId,
                  filename: name,
                  priority: page,
                  dimentions: size,
                  fileSize,
                  originalPage: page,
                },
              });

              return pageNumber;
            }
          );
        }
      );

      Promise.all(processes).then(() => {
        apiClient.mutate({
          mutation: UpdateDeckMutation,
          variables: {
            id: deckId,
            status: "done",
            pagesCount: pages,
          },
        });
      });

      /* Alternatively, this can be done in batches, but I wanted to ilustrate that's possible to run in parallel /*
      slidesExporter
        .bulk(pagesToExport)
        .then((result) => {
          const slides = result.map(({ name, size, fileSize, page }) => ({
            deckId,
            filename: name,
            priority: page,
            dimentions: size,
            fileSize,
            originalPage: page,
          }));

          apiClient.mutate({
            mutation: InsertSlidesMutation,
            variables: {
              slides,
            },
          });

          return result;
        })
        .catch((reason) => console.error(reason));
        */
    })
    .catch((reason) => {
      console.error(reason);
      res.status(500).json({ error: reason });
    });
};

const getPdfData = (buffer: Buffer) =>
  new Promise<{ pages: number; width: number; height: number }>(
    (resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.parseBuffer(buffer);
      pdfParser.on("pdfParser_dataError", (errData: { parserError: string }) =>
        reject(errData.parserError)
      );
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        if (
          typeof pdfData.formImage !== "object" ||
          !("Pages" in pdfData.formImage) ||
          !Array.isArray(pdfData.formImage.Pages)
        ) {
          return reject("Unable to parse PDF");
        }

        // Values are in "page size" not pixels, so we multiply by 25 (e.g., 38.25 becomes 957px)
        resolve({
          pages: pdfData.formImage.Pages.length,
          width: Math.round(pdfData.formImage.Width * 25),
          height: Math.round(pdfData.formImage.Pages[0].Height * 25),
        });
      });
    }
  );
