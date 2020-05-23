import { ChatPostMessageArguments, WebClient } from '@slack/web-api';

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
  public sendMessage(channel: string, text: string, threadTimeStamp?: string): void {
    const token: string | undefined = process.env.GIPH_BOT_USER_TOKEN;
    const postRequest: ChatPostMessageArguments = {
      token,
      channel,
      text,
      // eslint-disable-next-line @typescript-eslint/camelcase
      thread_ts: threadTimeStamp,
    };
    this.web.chat.postMessage(postRequest).catch((e) => console.error(e));
  }
}
