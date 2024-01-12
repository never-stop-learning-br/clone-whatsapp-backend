import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  constructor() {}

  getConnected() {
    return true;
  }
}
