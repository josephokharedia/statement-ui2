import {environment} from '../../environments/environment';

export class BackendService {
  HOSTNAME = environment['BACKEND_HOSTNAME'];
  PORT = environment['BACKEND_PORT'];

  getUrl(url: string) {
    if (!url.startsWith('/')) {
      url = `/${url}`;
    }
    const hostname = this.HOSTNAME ? `${this.HOSTNAME}` : '';
    const port = this.PORT ? `:${this.PORT}` : '';
    return `${hostname}${port}${url}`;
  }
}
