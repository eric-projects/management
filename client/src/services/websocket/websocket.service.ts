import { Observable, Subject } from 'rxjs';
import io from 'socket.io-client';

class WebsocketService {
  private websocket: any;
  private emitter: any = {};
  constructor() {
    this.websocket = io({ transports: ['websocket'] });
  }

  /**
   * 监听事件，并返回可观察对象
   * @param event 事件名
   */
  on<T>(event: string): Observable<T> {
    if (!this.emitter[event]) {
      const source: Subject<T> = new Subject();
      this.emitter[event] = source.asObservable();
      this.websocket.on(event, (response: T) => {
        source.next(response);
      });
    }
    return this.emitter[event];
  }
}

export const websocketService = new WebsocketService();
