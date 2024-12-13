import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client();

console.log("Attempting to upload to S3.");

await client.send(
  new PutObjectCommand({
    Bucket: Deno.env.get("S3_BUCKET")!,
    Key: "test-object",
    Body: "a body",
  }),
);

console.log("Successfully uploaded to S3.");
