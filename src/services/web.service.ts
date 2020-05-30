import { ChatPostMessageArguments, WebClient, ChatPostEphemeralArguments } from '@slack/web-api';

export class WebService {
  public static getInstance(): WebService {
    if (!WebService.instance) {
      WebService.instance = new WebService();
    }
    return WebService.instance;
  }
  private static instance: WebService;
  private web: WebClient = new WebClient(process.env.GIPH_BOT_TOKEN);

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
    console.log('channel', channel);
    console.log('text', text);
    console.log('searchTerm', searchTerm);
    console.log('userId', userId);
    console.log('isEpehemeral', isEphemeral);
    console.log('ts', threadTimeStamp);
    const postRequest: ChatPostMessageArguments = {
      token,
      channel,
      text: `<@${userId}> \n ${text}`,
      // eslint-disable-next-line @typescript-eslint/camelcase
      thread_ts: threadTimeStamp,
    };
    if (isEphemeral) {
      const postEphem: ChatPostEphemeralArguments = {
        token,
        channel,
        text,
        user: userId,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text,
            },
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
                action_id: `${text}`,
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
                action_id: `${searchTerm}`,
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
      this.web.chat.postMessage(postRequest).catch((e) => console.error(e));
    }
  }
}
