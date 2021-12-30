import express, { Request, Response, Router } from 'express';
import { WebService } from '../services/web.service';
import { SlashCommandRequest } from '../models/slack.model';
import { GiphyService } from '../services/giphy.service';

export const eventController: Router = express.Router();

const webService = WebService.getInstance();
const giphyService = GiphyService.getInstance();

eventController.post('/get/gif', async (req: Request, res: Response) => {
  res.status(200).send();
  const request: SlashCommandRequest = req.body;
  const userId = request.user_id;
  const searchTerm = request.text;
  const isSuppressed = await giphyService.isSuppressed(userId, request.team_id);

  if (!isSuppressed) {
    const gifUrl: { data?: string; error?: string } = await giphyService.getGif(searchTerm);
    if (gifUrl.error) {
      webService.sendErrorMessage(request.channel_name, gifUrl.error, userId);
    } else {
      webService.sendMessage(request.channel_name, gifUrl.data as string, searchTerm, userId, true, false);
    }
  }
});

eventController.post('/get/gif/random', async (req: Request, res: Response) => {
  res.status(200).send();
  const request: SlashCommandRequest = req.body;
  const userId = request.user_id;
  const searchTerm = request.text;
  const isSuppressed = await giphyService.isSuppressed(userId, request.team_id);
  if (!isSuppressed) {
    const gifUrl: { data?: string; error?: string } = await giphyService.getGif(searchTerm, true);
    if (gifUrl.error) {
      webService.sendErrorMessage(request.channel_name, gifUrl.error, userId);
    } else {
      webService.sendMessage(request.channel_name, gifUrl.data as string, searchTerm, userId, false, true);
    }
  }
});

eventController.post('/interaction', async (req: Request, res: Response) => {
  res.status(200).send();
  const request = JSON.parse(req.body.payload);
  const type = request.type;
  const value = request.actions[0].value;
  const channel = request.channel.name;
  const text = request.actions[0].action_id;
  const userId = request.user.id;
  const isSuppressed = await giphyService.isSuppressed(userId, request.team_id);
  if (!isSuppressed) {
    if (type === 'block_actions') {
      if (value === 'send') {
        const words = text.split(',');
        const url = words[0];
        const searchTerm = words[1];
        webService.deleteEphem(request.response_url);
        webService.sendMessage(channel, url, searchTerm, userId, false, false);
      } else if (value === 'cancel') {
        webService.deleteEphem(request.response_url);
      } else if (value === 'shuffle') {
        const gifUrl: { data?: string; error?: string } = await giphyService.getGif(text);
        if (gifUrl.error) {
          webService.sendErrorMessage(request.channel_name, gifUrl.error, request.user_id);
        } else {
          webService.sendMessage(channel, gifUrl.data as string, text, userId, true, false);
          webService.deleteEphem(request.response_url);
        }
      }
    }
  }
});
