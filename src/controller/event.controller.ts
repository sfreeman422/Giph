import express, { Request, Response, Router } from 'express';
import { WebService } from '../services/web.service';
import { SlashCommandRequest } from '../models/slack.model';
import { GiphyService } from '../services/giphy.service';

export const eventController: Router = express.Router();

const webService = WebService.getInstance();
const giphyService = GiphyService.getInstance();

eventController.post('/get/gif', async (req: Request, res: Response) => {
  if (req.body.challenge) {
    res.send({ challenge: req.body.challenge });
  } else {
    // This 200 is necessary in order to acknowledge that we have received the event and are handling it.
    // Without this, we will receive duplicate notifications for the same events.
    res.sendStatus(200);
    const request: SlashCommandRequest = req.body;
    const userId = request.user_id;
    const gifUrl = giphyService.getGif(request.text);
    webService.sendMessage(request.channel_name, gifUrl);
  }
});
