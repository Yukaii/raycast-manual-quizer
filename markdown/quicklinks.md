Everything you need to access quickly can be a Quicklink in Raycast. Open frequently visited links in the browser, open project folders in your favorite IDE or Terminal, jump to your loved Spotify playlist and use queries to perform searches on Google, Dribbble or other websites. The best thing is that you can access it directly from within the root search.

### Examples to get started

Raycast comes bundled with a set of Quicklinks which you can add easily. Go to _Raycast Preferences → Extensions → Quicklinks_ and click _Find in Library_ on the right pane. You will find a list of popular web searches. You can select any of them and they will be added to the Quicklink group on the main view.

Now you can close preferences, and access what you added in Raycast's root search.

## Create Quicklink

-   Search for the "**Create Quicklink**" command in Raycast. Alternatively, you can select _Create New Quicklink_ from Preferences window shown above.
-   Enter a name, link and the app you would like to open with.
-   You can make your quicklinks dynamic with Dynamic Placeholders.

Copy

```html
https://translate.google.com/?sl={argument name="source language" default="auto"}&tl={argument name="target language"}&text={argument name="word"}&op=translate
```

## Other Quicklink Actions

When you have a Quicklink selection open the action panel (`⌘ K`) to perform various actions on the Quicklink. You can edit, delete or duplicate it. You also have handy actions to copy the name or the link.

## Quick Search

Finding stuff with Quicklinks has become even faster now. Just select text in any app and press hotkey for a Quicklink to pass the selected text to the first argument of the Quicklink.

You can enable it from the preferences. Go to Preferences → Extensions → Quickinks. Select Quicklinks group and on the right pane, you will find the option for Quick Search at the bottom.

> 👉This requires Accessibility permissions to get selected text from the front most application

## Auto Fill

You can now enable this switch to let Raycast automatically fill the link from your active browser or your clipboard when you open the command . You can find the settings by navigating to Preferences → Extensions → Create Quicklink.

> 👉This requires Automation permissions to get url and title from the active browser tab. This features works in Safari, Chrome and a few other popular browsers. Let us know if it doesn’t work in your favourite browser.

## Import Quicklinks

You can read more about how to import quicklinks with a JSON file here

## Shared Quicklinks

If Raycast for Teams is enabled you can create shared Quicklinks for all members of your team.

Shared Quicklinks

Read more about Quicklinks here