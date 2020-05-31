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
    isRandom?: boolean,
  ): Promise<{
    data?: string;
    error?: string;
  }> {
    const endpoint = isRandom ? 'random' : 'search';
    const queryParam = isRandom ? 'tag' : 'q';
    return await Axios.get(
      `http://api.giphy.com/v1/gifs/${endpoint}?${queryParam}=${searchTerm}&api_key=${process.env.GIPHY_API_TOKEN}`,
    )
      .then((resp: any) => {
        if (!resp.data.data || resp.data.data.length === 0) {
          return { error: `No gifs found.` };
        }
        if (isRandom) {
          const downsized = resp.data.data.images.downsized.url as string;
          const shortened = downsized.slice(0, downsized.indexOf('?'));
          return {
            data: shortened,
          };
        } else {
          const random = Math.floor(Math.random() * resp.data.data.length);
          const downsized: string = resp.data.data[random].images.downsized.url as string;
          const shortened = downsized.slice(0, downsized.indexOf('?'));
          return {
            data: shortened,
          };
        }
      })
      .catch((e) => {
        console.error(e);
        return {
          error: `Uh oh! Something went wrong. Please try again.`,
        };
      });
  }
}
