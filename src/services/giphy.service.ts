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
    const endpoint = isRandom ? 'translate' : 'search';
    const queryParam = isRandom ? 's' : 'q';
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const weirdness = isRandom ? Math.floor(Math.random() * 5) : 0;
    let url = `http://api.giphy.com/v1/gifs/${endpoint}?${queryParam}=${encodedSearchTerm}&api_key=${process.env.GIPHY_API_TOKEN}`;
    if (isRandom) {
      url = url + `&weirdness=${weirdness}`;
    }

    return await Axios.get(url)
      .then((resp: any) => {
        if (!resp.data.data || resp.data.data.length === 0) {
          return { error: `No gifs found.` };
        }
        if (isRandom) {
          const downsized: string = resp.data.data.images.downsized.url;
          return {
            data: downsized,
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
        if (e && e.response && e.response.status === 404) {
          return {
            error: `No gifs found.`,
          };
        }
        return {
          error: `Uh oh! Something went wrong. Please try again.`,
        };
      });
  }
}
