import { Client, WebhookController } from '@zenvia/sdk';
import * as assert from 'assert';
import { ZENVIA_API_TOKEN, PORT } from './env';
import { get as getSession, save as saveSession } from './session';
import { run as botRun } from './bot';

assert.ok(ZENVIA_API_TOKEN, 'Zenvia API token is not configured');

const client = new Client(ZENVIA_API_TOKEN);

const webhook = new WebhookController({
  client,
  port: Number(PORT ?? 3000),
  messageEventHandler: async (messageEvent) => {
    try {
      console.log(JSON.stringify(messageEvent, null, 4));
      const { from, to, channel } = messageEvent.message;
      const contactPhone = from;
      const businessPhone = to;
      const session = getSession(contactPhone, businessPhone);
      const contentsToSend = await botRun(session, messageEvent.message);
      saveSession(contactPhone, businessPhone, session);
      client.getChannel(channel).sendMessage(
        businessPhone, // from
        contactPhone, // to
        ...contentsToSend, // content
      );
    } catch (e) {
      console.error(e);
    }
  },
  loggerInstance: {
    debug: console.log,
    warn: console.warn,
    error: console.error,
  },
});

webhook.init();
