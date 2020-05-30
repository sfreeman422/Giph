import Axios from 'axios';

export class GiphyService {
  public static getInstance(): GiphyService {
    if (!GiphyService.instance) {
      GiphyService.instance = new GiphyService();
    }
    return GiphyService.instance;
  }
  private static instance: GiphyService;

  async getGif(
    searchTerm: string,
  ): Promise<{
    data?: string;
    error?: string;
  }> {
    return await Axios.get(
      `http://api.giphy.com/v1/gifs/translate?s=${searchTerm}&api_key=${process.env.GIPHY_API_TOKEN}`,
    )
      .then((resp: any) => {
        const downsized: string = resp.data.data.images.downsized.url as string;
        const shortened = downsized.slice(0, downsized.indexOf('?'));
        return {
          data: shortened,
        };
      })
      .catch((e) => {
        console.error(e);
        return {
          error: `Uh oh! Something went wrong. Please try again.`,
        };
      });
  }
}
