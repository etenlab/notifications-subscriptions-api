create or replace function admin.fn_notification_created() 
	returns trigger as $notification_created$
	begin
		perform pg_notify(
    		'notification_created',
			json_build_object(
			    'operation', TG_OP,
			    'record', row_to_json(NEW)
    		)::text);
  		return NEW;
	end;
	$notification_created$ language plpgsql;

drop trigger if exists notification_created
  on admin.notifications;
 
create trigger notification_created
  after insert
  on admin.notifications
  for each row execute function admin.fn_notification_created();