import express, { Request, Response, Router } from 'express';
import { WebService } from '../services/web.service';
import { SlashCommandRequest } from '../models/slack.model';
import { GiphyService } from '../services/giphy.service';

export const eventController: Router = express.Router();

const webService = WebService.getInstance();
const giphyService = GiphyService.getInstance();

eventController.post('/get/gif', async (req: Request, res: Response) => {
  const request: SlashCommandRequest = req.body;
  const userId = request.user_id;
  const searchTerm = request.text;
  const gifUrl: { data?: string; error?: string } = await giphyService.getGif(searchTerm);
  if (gifUrl.error) {
    res.send(gifUrl.error);
  } else {
    webService.sendMessage(request.channel_name, gifUrl.data as string, searchTerm, userId, true);
  }
  res.status(200).send();
});

eventController.post('/get/gif/random', async (req: Request, res: Response) => {
  const request: SlashCommandRequest = req.body;
  const userId = request.user_id;
  const searchTerm = request.text;
  const gifUrl: { data?: string; error?: string } = await giphyService.getGif(searchTerm, true);
  if (gifUrl.error) {
    res.send(gifUrl.error);
  } else {
    webService.sendMessage(request.channel_name, gifUrl.data as string, searchTerm, userId, true);
  }
  res.status(200).send();
});

eventController.post('/interaction', async (req: Request, res: Response) => {
  const request = JSON.parse(req.body.payload);
  const type = request.type;
  const value = request.actions[0].value;
  const channel = request.channel.name;
  const text = request.actions[0].action_id;
  const userId = request.user.id;
  if (type === 'block_actions') {
    if (value === 'send') {
      const words = text.split(',');
      const url = words[0];
      const searchTerm = words[1];
      webService.deleteEphem(request.response_url);
      webService.sendMessage(channel, url, searchTerm, userId, false);
    } else if (value === 'cancel') {
      webService.deleteEphem(request.response_url);
    } else if (value === 'shuffle') {
      const gifUrl: { data?: string; error?: string } = await giphyService.getGif(text);
      if (gifUrl.error) {
        res.send(gifUrl.error);
      } else {
        webService.sendMessage(channel, gifUrl.data as string, text, userId, true);
        webService.deleteEphem(request.response_url);
      }
    }
  }
  res.status(200).send();
});
