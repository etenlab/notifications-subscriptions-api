import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { Notification } from './notification.model';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubSub.module';
import { NotificationToken } from './notification.token';

@Injectable()
export class NotificationsService {
  constructor(@Inject(PUB_SUB) private readonly pubSub: PubSub) {}

  // Whenever we found changed in Notification, send notification to the Client
  // via PubSub object.
  async listenNofity(notification: Notification): Promise<void> {
    const notificationAdded = NotificationToken.NotificationAdded;
    this.pubSub.publish(notificationAdded, {
      [notificationAdded]: {
        ...notification,
        created_at: new Date(notification.created_at),
      },
    });
  }
}
