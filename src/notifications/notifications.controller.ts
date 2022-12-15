import {
  Controller,
  Inject,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { PgNotifyEventPattern } from 'nestjs-pg-notify';
import { ExceptionFilter } from '../exception.filter';
import { LoggingInterceptor } from '../logging.interceptor';
import { NotificationToken } from '../token';
import { NotificationsService } from './notifications.service';

import { NotificationDto } from './notification.dto';

@Controller()
@UseFilters(ExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class NotificationsController {
  constructor(
    @Inject(NotificationToken.PgNotifyClient)
    private readonly client: ClientProxy,
    private readonly notificationsService: NotificationsService,
  ) {}

  @PgNotifyEventPattern('notification_created')
  @UsePipes(new ValidationPipe({ transform: true }))
  onNotificationCreated(@Payload() payload: NotificationDto): void {
    this.notificationsService.listenNofity(payload.record);
  }
}
