# Deno S3 upload failure reproduction

This repo demonstrates a recent issue where puts to S3 with `@aws-sdk/client-s3`
hang indefinitely in the deno runtime. I've narrowed this down to a change in a
the `@smithy/node-http-handler` package used by the client, specifically around
how it handles the `expect` request header with "100-continue" (specifically
commits
[f4e1a45](https://github.com/smithy-lang/smithy-typescript/commit/f4e1a45b667bfa0b95f78cddfb027b6c6f01272b)
and
[a257792](https://github.com/smithy-lang/smithy-typescript/commit/a2577922d8ce5e31256dcf396ecc688c484a8067)).

## Running the example

1. Setup your AWS credentials however you like. See
   [this guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html).
2. Create a bucket in the AWS account.
3. Run `S3_BUCKET={your bucket} deno run -A main.ts`

The lockfile is currently setup to use the version of
`@smithy/
node-http-handler` that does not work (`3.3.2`). The console should
output `Attempting to upload to S3.`, hang for a bit, and then error out because
it uses a top-level await.

To get it to work, manually update the version of `@smithy/node-http-handler`
used in the lockfile with the entry below.

```json
"@smithy/node-http-handler@3.3.1": {
  "integrity": "sha512-fr+UAOMGWh6bn4YSEezBCpJn9Ukp9oR4D32sCjCo7U81evE11YePOQ58ogzyfgmjIO79YeOdfXXqr0jyhPQeMg==",
  "dependencies": [
    "@smithy/abort-controller",
    "@smithy/protocol-http",
    "@smithy/querystring-builder",
    "@smithy/types",
    "tslib"
  ]
},
```

Run the example again and the upload should succeed.

## Lockfile changes

This works.

```json
"@smithy/node-http-handler@3.3.1": {
  "integrity": "sha512-fr+UAOMGWh6bn4YSEezBCpJn9Ukp9oR4D32sCjCo7U81evE11YePOQ58ogzyfgmjIO79YeOdfXXqr0jyhPQeMg==",
  "dependencies": [
    "@smithy/abort-controller",
    "@smithy/protocol-http",
    "@smithy/querystring-builder",
    "@smithy/types",
    "tslib"
  ]
},
```

This does not work.

```json
"@smithy/node-http-handler@3.3.2": {
  "integrity": "sha512-t4ng1DAd527vlxvOfKFYEe6/QFBcsj7WpNlWTyjorwXXcKw3XlltBGbyHfSJ24QT84nF+agDha9tNYpzmSRZPA==",
  "dependencies": [
    "@smithy/abort-controller",
    "@smithy/protocol-http",
    "@smithy/querystring-builder",
    "@smithy/types",
    "tslib"
  ]
},
```
