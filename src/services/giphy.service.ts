import Axios from 'axios';

export class GiphyService {
  public static getInstance(): GiphyService {
    if (!GiphyService.instance) {
      GiphyService.instance = new GiphyService();
    }
    return GiphyService.instance;
  }
  private static instance: GiphyService;

  async getGif(searchTerm: string) {
    return await Axios.get(
      `http://api.giphy.com/v1/gifs/random?tag=${searchTerm}&api_key=${process.env.GIPHY_API_TOKEN}`,
    )
      .then((data: any) => data.bitly_url)
      .catch((e) => {
        console.error(e);
        return {
          error: `Uh oh! Something went wrong. Please try again.`,
        };
      });
  }
}
