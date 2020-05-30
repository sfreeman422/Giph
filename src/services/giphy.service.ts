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
      `http://api.giphy.com/v1/gifs/random?tag=${searchTerm}&api_key=${process.env.GIPHY_API_TOKEN}`,
    )
      .then((resp: any) => {
        return { data: resp.data.data.images.downsized.url };
      })
      .catch((e) => {
        console.error(e);
        return {
          error: `Uh oh! Something went wrong. Please try again.`,
        };
      });
  }
}
