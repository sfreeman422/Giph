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
    return await Axios.get(`http://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${process.env.GIPHY_API_TOKEN}`)
      .then((resp: any) => {
        const random = Math.floor(Math.random() * resp.data.data.length);
        console.log(random);
        const downsized: string = resp.data.data[random].images.downsized.url as string;
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
