/* eslint-disable @typescript-eslint/no-unused-vars */

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import * as Ably from "ably/promises";

const handler: Handler = async (
  _event: HandlerEvent,
  _context: HandlerContext
) => {
  if (!process.env.ABLY_API_KEY) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(`Missing ABLY_API_KEY (recevied: ${process.env.ABLY_API_KEY}) environment variable.
        If you're running locally, please ensure you have a ./.env file with a value for ABLY_API_KEY=your-key.
        If you're running in Netlify, make sure you've configured env variable ABLY_API_KEY.
        Please see README.md for more details on configuring your Ably API Key.`),
    };
  }

  const client = new Ably.Rest(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: "caro",
  });

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(tokenRequestData),
  };
};

export { handler };
