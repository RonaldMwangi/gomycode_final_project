# TODO - In-app Smart Deadline Alerts + Productivity Dashboard

## Step 1: Product Requirements (in-app only)

- Implement a daily cron job to create in-app notifications for the logged-in users.
- Notifications categories:
  - `deadline_today`
  - `deadline_tomorrow`
  - `overdue`
- Deliver notifications in the UI (no emails).

## Step 2: Backend data model

- Add `Notification` mongoose model:
  - `userId` (required, indexed)
  - `taskId` (optional, referenced)
  - `type`
  - `message`
  - `read` (default false)
  - `createdAt`

## Step 3: Backend endpoints

- `GET /api/notifications` (auth required) -> list current notifications for the user
- `POST /api/notifications/:id/read` (auth required) -> mark as read

## Step 4: Cron job

- Add `node-cron` and implement a job (daily) that:
  - finds tasks where `status != completed`
  - checks deadlines relative to local date
  - upserts notifications to avoid duplicates (use uniqueness constraint or query-before-insert)

## Step 5: Frontend updates

- Add notifications panel (dropdown or card) showing unread count.
- Fetch notifications after login.
- Add a “mark all as read” and/or mark individual notification as read.

## Step 6: Productivity dashboard cards

- Add dashboard metrics computed from tasks:
  - total tasks
  - completed
  - pending
  - overdue
  - completion rate

## Step 7: Testing

- Test signup/login.
- Create tasks with deadlines:
  - today, tomorrow, overdue
- Confirm notifications appear in-app.

## Step 8: Documentation

- Update `README.md` with:
  - how to configure cron schedule (if needed)
  - how notifications work
