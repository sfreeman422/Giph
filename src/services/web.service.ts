import { ChatPostMessageArguments, WebClient, ChatPostEphemeralArguments } from '@slack/web-api';
import Axios from 'axios';

export class WebService {
  public static getInstance(): WebService {
    if (!WebService.instance) {
      WebService.instance = new WebService();
    }
    return WebService.instance;
  }
  private static instance: WebService;
  private web: WebClient = new WebClient(process.env.GIPH_BOT_TOKEN);

  public deleteEphem(responseUrl: string): void {
    // eslint-disable-next-line @typescript-eslint/camelcase
    Axios.post(responseUrl, { delete_original: true });
  }
  /**
   * Handles sending messages to the chat.
   */
  public sendMessage(
    channel: string,
    text: string,
    searchTerm: string,
    userId: string,
    isEphemeral: boolean,
    threadTimeStamp?: string,
  ): void {
    const token: string | undefined = process.env.GIPH_BOT_TOKEN;
    if (isEphemeral) {
      const postEphem: ChatPostEphemeralArguments = {
        token,
        channel,
        text: text,
        user: userId,
        blocks: [
          {
            type: 'image',
            // eslint-disable-next-line @typescript-eslint/camelcase
            image_url: text,
            // eslint-disable-next-line @typescript-eslint/camelcase
            alt_text: searchTerm,
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Send',
                },
                style: 'primary',
                value: 'send',
                // eslint-disable-next-line prettier/prettier
                // eslint-disable-next-line @typescript-eslint/camelcase
                action_id: `${text} ${searchTerm}`,
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Shuffle',
                },
                value: 'shuffle',
                // eslint-disable-next-line prettier/prettier
                // eslint-disable-next-line @typescript-eslint/camelcase
                action_id: `${searchTerm}`,
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Cancel',
                },
                style: 'danger',
                value: 'cancel',
                // eslint-disable-next-line prettier/prettier
                // eslint-disable-next-line @typescript-eslint/camelcase
                action_id: `cancel`,
              },
            ],
          },
        ],
      };

      this.web.chat.postEphemeral(postEphem).catch((e) => {
        console.error(e);
        console.error(e.data.response_metadata);
      });
    } else {
      const postRequest: ChatPostMessageArguments = {
        token,
        channel,
        text: `a gif`,
        // eslint-disable-next-line @typescript-eslint/camelcase
        thread_ts: threadTimeStamp,
        blocks: [
          {
            type: 'image',
            // eslint-disable-next-line @typescript-eslint/camelcase
            image_url: text,
            // eslint-disable-next-line @typescript-eslint/camelcase
            alt_text: 'whatever',
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Posted by: <@${userId}> | Search: ${searchTerm}`,
              },
            ],
          },
        ],
      };
      this.web.chat.postMessage(postRequest).catch((e) => console.error(e));
    }
  }
}
