import {
  action,
  EmailStatus,
  getEmailStatus,
  hashMessageId,
  StatusEvent,
} from "~/routes/api/sendinblue";
import { Feature, redis } from "~/redis.server";
import { mockActionArgs } from "testUtil/mockActionArgs";
import * as crypto from "crypto";

const MESSAGE_ID = "<202209121050.12345678901@smtp-relay.mailin.fr>";

async function createRequest(payload: {
  "message-id": string;
  event: string;
  ts_event: number;
  email: string;
  reason?: string;
}) {
  return await mockActionArgs({
    json: payload,
    context: {},
  });
}

describe("/sendinblue", () => {
  afterEach(async () => {
    await redis.del(Feature.EMAIL, hashMessageId(MESSAGE_ID));
  });

  it("should generate sha1 hash from messageId", async () => {
    const payload = {
      "message-id": MESSAGE_ID,
      email: "foo@bar.com",
      event: StatusEvent.SENT,
      ts_event: Math.floor(Date.now() / 1000),
    };
    const args = await createRequest(payload);

    await action(args);

    const hashedMessageId = crypto
      .createHash("sha1")
      .update(MESSAGE_ID)
      .digest("hex");

    const record: EmailStatus | null = await getEmailStatus(hashedMessageId);

    expect(record).toBeTruthy();
    expect(record?.email).toEqual("foo@bar.com");
  });

  it("should store the first event", async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = {
      "message-id": MESSAGE_ID,
      email: "foo@bar.com",
      event: StatusEvent.SENT,
      ts_event: timestamp,
      reason: "wait what?",
    };
    const args = await createRequest(payload);

    await action(args);

    const record: EmailStatus | null = await getEmailStatus(
      hashMessageId(MESSAGE_ID)
    );

    expect(record).toBeTruthy();
    expect(record?.email).toEqual("foo@bar.com");
    expect(record?.event).toEqual(StatusEvent.SENT);
    expect(record?.timestamp).toEqual(timestamp);
    expect(record?.reason).toEqual("wait what?");
  });

  it("should store reason", async () => {
    const payload = {
      "message-id": MESSAGE_ID,
      email: "foo@bar.com",
      event: StatusEvent.BLOCKED,
      ts_event: Math.floor(Date.now() / 1000),
      reason: "spam",
    };
    const args = await createRequest(payload);

    await action(args);

    const record: EmailStatus | null = await getEmailStatus(
      hashMessageId(MESSAGE_ID)
    );

    expect(record).toBeTruthy();
    expect(record?.event).toEqual(StatusEvent.BLOCKED);
    expect(record?.reason).toEqual("spam");
  });

  const cases = [
    {
      firstEvent: StatusEvent.SENT,
      secondEvent: StatusEvent.DELIVERED,
      result: StatusEvent.DELIVERED,
    },
    {
      firstEvent: StatusEvent.SENT,
      secondEvent: StatusEvent.DEFERRED,
      result: StatusEvent.DEFERRED,
    },
    {
      firstEvent: StatusEvent.SENT,
      secondEvent: StatusEvent.SOFT_BOUNCE,
      result: StatusEvent.SOFT_BOUNCE,
    },
    {
      firstEvent: StatusEvent.SENT,
      secondEvent: StatusEvent.HARD_BOUNCE,
      result: StatusEvent.HARD_BOUNCE,
    },
    {
      firstEvent: StatusEvent.SENT,
      secondEvent: StatusEvent.BLOCKED,
      result: StatusEvent.BLOCKED,
    },
    {
      firstEvent: StatusEvent.DEFERRED,
      secondEvent: StatusEvent.SENT,
      result: StatusEvent.DEFERRED,
    },
    {
      firstEvent: StatusEvent.DEFERRED,
      secondEvent: StatusEvent.DELIVERED,
      result: StatusEvent.DELIVERED,
    },
    {
      firstEvent: StatusEvent.DEFERRED,
      secondEvent: StatusEvent.SOFT_BOUNCE,
      result: StatusEvent.SOFT_BOUNCE,
    },
    {
      firstEvent: StatusEvent.DEFERRED,
      secondEvent: StatusEvent.HARD_BOUNCE,
      result: StatusEvent.HARD_BOUNCE,
    },
    {
      firstEvent: StatusEvent.DEFERRED,
      secondEvent: StatusEvent.BLOCKED,
      result: StatusEvent.BLOCKED,
    },
    {
      firstEvent: StatusEvent.DELIVERED,
      secondEvent: StatusEvent.SENT,
      result: StatusEvent.DELIVERED,
    },
    {
      firstEvent: StatusEvent.DELIVERED,
      secondEvent: StatusEvent.DEFERRED,
      result: StatusEvent.DELIVERED,
    },
    {
      firstEvent: StatusEvent.DELIVERED,
      secondEvent: StatusEvent.SOFT_BOUNCE,
      result: StatusEvent.DELIVERED,
    },
    {
      firstEvent: StatusEvent.DELIVERED,
      secondEvent: StatusEvent.HARD_BOUNCE,
      result: StatusEvent.DELIVERED,
    },
    {
      firstEvent: StatusEvent.DELIVERED,
      secondEvent: StatusEvent.BLOCKED,
      result: StatusEvent.DELIVERED,
    },
    {
      firstEvent: StatusEvent.SOFT_BOUNCE,
      secondEvent: StatusEvent.SENT,
      result: StatusEvent.SOFT_BOUNCE,
    },
    {
      firstEvent: StatusEvent.SOFT_BOUNCE,
      secondEvent: StatusEvent.DEFERRED,
      result: StatusEvent.SOFT_BOUNCE,
    },
    {
      firstEvent: StatusEvent.SOFT_BOUNCE,
      secondEvent: StatusEvent.DELIVERED,
      result: StatusEvent.SOFT_BOUNCE,
    },
    {
      firstEvent: StatusEvent.SOFT_BOUNCE,
      secondEvent: StatusEvent.HARD_BOUNCE,
      result: StatusEvent.SOFT_BOUNCE,
    },
    {
      firstEvent: StatusEvent.SOFT_BOUNCE,
      secondEvent: StatusEvent.BLOCKED,
      result: StatusEvent.SOFT_BOUNCE,
    },
    {
      firstEvent: StatusEvent.HARD_BOUNCE,
      secondEvent: StatusEvent.SENT,
      result: StatusEvent.HARD_BOUNCE,
    },
    {
      firstEvent: StatusEvent.HARD_BOUNCE,
      secondEvent: StatusEvent.DEFERRED,
      result: StatusEvent.HARD_BOUNCE,
    },
    {
      firstEvent: StatusEvent.HARD_BOUNCE,
      secondEvent: StatusEvent.DELIVERED,
      result: StatusEvent.HARD_BOUNCE,
    },
    {
      firstEvent: StatusEvent.HARD_BOUNCE,
      secondEvent: StatusEvent.SOFT_BOUNCE,
      result: StatusEvent.HARD_BOUNCE,
    },
    {
      firstEvent: StatusEvent.HARD_BOUNCE,
      secondEvent: StatusEvent.BLOCKED,
      result: StatusEvent.HARD_BOUNCE,
    },
  ];

  it.each(cases)(
    "should yield $result when first event is $firstEvent and second event is $secondEvent",
    async ({ firstEvent, secondEvent, result }) => {
      const timestamp = Math.floor(Date.now() / 1000);

      const firstPayload = {
        "message-id": MESSAGE_ID,
        email: "foo@bar.com",
        event: firstEvent,
        ts_event: timestamp,
      };
      const secondPayload = {
        "message-id": MESSAGE_ID,
        email: "foo@bar.com",
        event: secondEvent,
        ts_event: timestamp + 1,
      };
      const firstRequestArgs = await createRequest(firstPayload);
      const secondRequestArgs = await createRequest(secondPayload);

      await action(firstRequestArgs);
      await action(secondRequestArgs);

      const record: EmailStatus | null = await getEmailStatus(
        hashMessageId(MESSAGE_ID)
      );

      expect(record).toBeTruthy();
      expect(record?.event).toEqual(result);
    }
  );
});
