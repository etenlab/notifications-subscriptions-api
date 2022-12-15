import { Injectable, Inject } from '@nestjs/common';
import { Resolver, Subscription, Query, Args, Int } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubSub.module';
import { Notification } from './notification.model';
import { NotificationsService } from './notifications.service';
import { NotificationToken } from '../token';

@Resolver(() => Notification)
@Injectable()
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => String)
  async hello(): Promise<string> {
    return 'Hello World!';
  }

  @Subscription(() => Notification, {
    name: NotificationToken.NotificationAdded,
    filter: (payload, variables) => {
      return payload.notificationAdded.user_id === variables.userId;
    },
  })
  async subscribeNotificationAdded(
    @Args('userId', { type: () => Int }) _userId: number,
  ) {
    return this.pubSub.asyncIterator(NotificationToken.NotificationAdded);
  }
}
