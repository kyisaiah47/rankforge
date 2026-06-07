/**
 * Run once to provision the DynamoDB table.
 * Usage: npx tsx scripts/create-table.ts
 */
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  ResourceInUseException,
} from "@aws-sdk/client-dynamodb";

const TABLE = process.env.DYNAMODB_TABLE_NAME ?? "rankforge";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? "us-east-1",
});

async function main() {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: TABLE,
        BillingMode: "PAY_PER_REQUEST",
        AttributeDefinitions: [
          { AttributeName: "PK", AttributeType: "S" },
          { AttributeName: "SK", AttributeType: "S" },
          { AttributeName: "GSI1PK", AttributeType: "S" },
          { AttributeName: "GSI1SK", AttributeType: "N" },
          { AttributeName: "apiKey", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "PK", KeyType: "HASH" },
          { AttributeName: "SK", KeyType: "RANGE" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "GSI1",
            KeySchema: [
              { AttributeName: "GSI1PK", KeyType: "HASH" },
              { AttributeName: "GSI1SK", KeyType: "RANGE" },
            ],
            Projection: { ProjectionType: "ALL" },
          },
          {
            IndexName: "apiKey-index",
            KeySchema: [{ AttributeName: "apiKey", KeyType: "HASH" }],
            Projection: { ProjectionType: "ALL" },
          },
        ],
        // Enable TTL (activate separately in AWS Console or via UpdateTimeToLive)
      })
    );
    console.log(`Table "${TABLE}" created. Enable TTL on attribute "ttl".`);
  } catch (e) {
    if (e instanceof ResourceInUseException) {
      console.log(`Table "${TABLE}" already exists.`);
    } else {
      throw e;
    }
  }

  const desc = await client.send(
    new DescribeTableCommand({ TableName: TABLE })
  );
  console.log("Status:", desc.Table?.TableStatus);
}

main().catch(console.error);
