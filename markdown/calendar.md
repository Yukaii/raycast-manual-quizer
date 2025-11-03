Raycast makes it easy to check your upcoming schedule and join conference calls without opening new tabs or switching context.

# Check Your Schedule

Use the My Schedule command to quickly check your availability, block focus time or get an overview of your daily plan.

-   The summary on the top shows your next upcoming meeting.
-   The sections below are dynamic. They help you focus on the here and now: This week is represented as days, followed by sections for the next week, the rest of the month and the upcoming months. We only show you three months.
-   Press `⌘` `K` to open the Action Panel to join conference calls (Zoom or Google Meet), block time or email attendees.
-   You can use the Search Bar to filter events by title.
-   Use the extension preferences to configure your calendars. We use the macOS native calendar which supports most common providers such as Google Calendar, iCloud and Microsoft.

## Keyboard Shortcuts

-   `↵` to open the event in the macOS Calendar app
-   `⌘` `↵` to join a conference call
-   `⌘` `⇧` `B` to block time
-   `⌘` `⇧` `E` to email all attendees
-   `⌘` `.` to copy event details
-   `⌘` `.` to copy event details
-   `⌘` `⇧` `.` to copy event title
-   `⌘` `⇧` `,` to copy event attendees
-   `⌃` `X` to delete event

# Join Events

Raycast shows your next event on the top of the root search to make it convenient to join. Just hit `↵` to open the conference call. If there is a native app installed for the conference service, the app is opened directly without any annoying tabs.

# Auto-Join Events

Raycast can automatically join events when they are about to begin. When enabled, Raycast will automatically join all events with meeting links in your enabled calendars that you are attending.

By default an alert with a confirmation prompt will be shown before joining, but the alert can be disabled in which case Raycast will join meetings right away. Disabling the confirmation alert is useful if your conferencing app already has its own confirmation screen before joining a meeting.

Auto-join is disabled initially but can be enabled in the preferences of the My Schedule command. Right below it is the checkbox to control whether to show the confirmation alert.

# Troubleshooting

The Calendar extension accesses the native macOS calendars. Make sure that Raycast has access to the events in the _**System Preferences > Security & Privacy > Privacy > Calendars**_.

Additionally, make sure that the calendars that you are interested in are enabled in the Extensions Preferences of Raycast. This way you can also fine-tune which events you want to see in the My Schedule command.

Read more about the Calendar here