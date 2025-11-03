Raycast Focus helps you stay in flow and get more done by blocking out distractions on your Mac. Define your goal, set a duration to focus and block out distracting apps and websites.

The Raycast Focus experience comes with these commands:

1.  **Start Focus Session:** This command opens a form to configure your focus session.
2.  **Toggle Focus Session:** This command allows you to toggle between starting or completing a focus session. Starting will use the previously used setup.
3.  **Create Focus Category:** Use this command to create categories of apps and websites to block. These categories can be used when starting a new focus session.
4.  **Search Focus Category:** Use this command to search focus categories. Built-in categories are crafted by Raycast and not editable. However, they can be duplicated and saved with another title.
5.  **Import Focus Categories:** Import categories from a JSON file. More info on the supported format here.

While you're in a session, there are 3 additional commands:

1.  **Edit Focus Session:** This command allows you to edit your current focus session.
2.  **Complete Focus Session:** This command allows you to complete your current focus session.
3.  **Pause Focus Session:** This command allows you to pause your current focus session.

> 💡

**Pro Tip:** We recommend assigning a hotkey to the Toggle Focus Session command for quicker access to start / complete a focus session. A commonly used hotkey is `^` `F`. Open Raycast → Settings → Extensions → Raycast Notes to record a hotkey.

# Starting

Begin by starting a new focus session. This can be something broad like “Coding Session” or a more granular task you want to complete.

-   Define your goal for the session.
-   Then set a duration, this can be anything from 5 minutes to an entire day. You can also use natural language to define a timeframe like `until 4:30pm` .
-   Set the filtering mode for running the session.

-   **Block:** Only apps and websites that are listed will be blocked.
-   **Allow**: All apps and websites will be blocked except those listed.

-   Finally enter the distracting apps or websites you want to block out for the duration of your focus session. We’ve defined some categories to make this easier to block out things like **Social Media** or **News sites**.

![Start a focus session](https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/613d365f-67e9-43d2-8588-8d7cbc8ea032/Raycast_2025-02-26_at_18.01.58/w=3840,quality=90,fit=scale-down)

Start a focus session

# Custom Focus Categories

Use **Create Focus Category** to create a custom category of apps and websites to block or allow. Once create, they can be found using **Search Focus Categories** command.

There’s two types of categories:

-   _Built-in:_ These categories are built and curated by Raycast and cannot be edited. They can be duplicated.
-   _Custom:_ User created categories. They can be created using **Create Focus Categories**, or imported from a JSON file.

All these categories can be used in new sessions by issuing the **Start Focus Session** command.

> Categories can be used in both _**Allow**_ and _**Block**_ modes.

For example, you can create a category for the apps and websites you frequently use for work and apply it with **Allow** mode. Conversely, you can create a category for distracting apps and websites and use it in a session with **Block** mode.

# Tracking

## Focus Bar

The Focus Bar will float above all your windows, subtly reminding you to stay focus throughout. You can keep track of your progress, pause, complete or manage your focus session.

## Menu Bar

If the Focus Bar isn’t to your liking, you can use the more discrete Menu Bar item instead. Hover the Focus Bar, and click `Move to Menu Bar` under the more menu.

# Blocking

Any app or website you defined in your block list will quit immediately when the session starts.

If you stumble on a blocked app during your session, you’ll be presented with an orange glow and toast to notify you. Blocked websites will be redirected to a block page.

![App Blocked](https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/c5d0a8b2-08f0-429c-8688-e96d1d28a322/CleanShot_2025-01-10_at_14.43.432x/w=3840,quality=90,fit=scale-down)

App Blocked

If you really need to access blocked content, you have the option to snooze. By default this is set to 3 minutes. You can customize this in Raycast Settings → Extensions.

After the snooze period you’ll see the blocked overlay. The app will quit after you switch focus.

![Blocked app overlay](https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/20e7b22f-7754-4301-a133-7752f6947ebb/CleanShot_2025-01-10_at_17.14.472x/w=3840,quality=90,fit=scale-down)

Blocked app overlay

# Editing

Need to add more time, or block additional apps/websites? You can edit a focus session at any time. Use the **Edit Focus Session** command, or hover the floating bar and use the Edit action under the more menu.

![Focus bar more menu](https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/5d3a8ca3-509e-4c97-9ffe-df0d1c2bceb3/CleanShot_2025-01-10_at_14.44.522x/w=3840,quality=90,fit=scale-down)

Focus bar more menu

# Taking a break

If you need a break from your session, you can easily pause your session if something urgent comes up, or you need to make a brew. You can use one of the predefined break options, helping you to step away but ready to nudge you when to jump back in.

![Paused session countdown](https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/717e6cc0-2a97-47c9-afa9-26517b55f2c0/CleanShot_2025-01-10_at_14.45.462x/w=3840,quality=90,fit=scale-down)

Paused session countdown

# Completing

If you’ve managed to finish your task before the clock hits zero, you can manually complete your focus session. You’ll be greeted by a celebratory green glow and toast.

Your session will auto-complete after the set duration. You’ll be presented with the same green glow, but with the option to extend your session, or complete it.

![Completed session](https://images.spr.so/cdn-cgi/imagedelivery/j42No7y-dcokJuNgXeA0ig/2531b16b-7c8e-43bf-827b-686e32687735/CleanShot_2025-01-10_at_14.47.322x/w=3840,quality=90,fit=scale-down)

Completed session

# Deeplinks

Raycast Focus supports deeplinks to programmatically control focus sessions from other apps or scripts. The base URL is `⁠raycast://focus/` followed by one of these actions:

### Toggle Focus Session

Toggles the current focus session on or off. If no session is active, it will start a new one with the provided parameters. If a session is already active, it will complete the session.

Example:

`raycast://focus/toggle?goal=Deep%20Focus&categories=social,gaming&duration=300&mode=block`

Parameters:

• `⁠goal` (optional): The title of the focus session. Should be percent encoded.

• `⁠categories`: A comma-separated list of app/website categories to block.

• `⁠duration` (optional): The duration of the focus session in seconds.

• `mode` (optional): The filtering mode of the session (`block` or `allow`). Defaults to `block`.

### Start Focus Session

Starts a new focus session with the provided parameters. If a session is already active, no action is taken.

Example:

`raycast://focus/start?goal=Deep%20Focus&categories=social,gaming&duration=300&mode=block`

Parameters:

• `goal` (optional): The title of the focus session. Should be percent encoded.

• `categories`: A comma-separated list of app/website categories to block.

• `⁠duration` (optional): The duration of the focus session in seconds.

• `mode` (optional): The filtering mode of the session (`block` or `allow`). Defaults to `block`.

### Complete Focus Session

Completes the currently active focus session. If no session is active, the deeplink is ignored.

Example:

`raycast://focus/complete`

# FAQs

‣What is free and paid in Raycast Focus?‣What permissions are required for Raycast Focus to function properly?‣Does Raycast Focus work in every browser?‣What happens if I need to access an app while in focus?‣I can't see my Focus session in the Menu Bar. How can I make it visible?

⬇️How to import focus categoriesHow to create a Focus FilterHow to create a Shortcut