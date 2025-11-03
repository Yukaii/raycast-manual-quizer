Sometimes you may want to trigger Raycast from somewhere else – the browser, the terminal, a different application. This is possible with _Deeplinks_, by using the `raycast://` URL scheme.

-   Supported URLs
-   Show confetti 🎉
-   Run a command
-   Pass fallbackText to a command
-   Run a script command
-   Run an AI command
-   Troubleshooting
-   Running a Window Management command using its Deeplink doesn’t work

# Supported URLs

## Show confetti 🎉

Use `raycast://confetti` URL scheme to trigger confetti. Especially handy to spice up those long running scripts.

## Run a command

You can run any command you have enabled in Raycast by using _Deeplinks_. To do so, your _Deeplink_ needs to follow the following format:

Copy

```javascript
raycast://extensions/<author-or-owner>/<extension-name>/<command-name>
```

However, it’s probably easier to find the command in Raycast and use the _Copy Deeplink_ action.

Once the _Deeplink_ is in your clipboard, you can then paste it in Raycast and use _Open in Browser_

Whenever a command is run using a _Deeplink_, Raycast will ask you to confirm that you _actually_ want to run the command, instead of doing so by accident. Choosing **Always Open Command** will run the command and skip the confirmation in the future.

For more advanced uses, check out the Developer Docs.

### Pass `fallbackText` to a command

You can use the fallbackText query parameter to pass initial data to a command. It works the same way as Fallback Commands. The following _Deeplink_ will open File Search in the `~/Library/Application Support/` folder:

Copy

```javascript
raycast://extensions/raycast/file-search/search-files?fallbackText=~/Library/Application%20Support/
```

You can also use it to open the Create Quicklink command with the `Link` input prefilled:

Copy

```javascript
raycast://extensions/raycast/raycast/create-quicklinkraycast://extensions/raycast=https://raycast.com
```

## Run a script command

You can also run any enabled script command by using _Deeplinks._ The _Deeplink_ needs to follow the following format:

Copy

```javascript
raycast://script-commands/<slugified-file-name-without-extension>
```

As with non-script commands, it’s probably easier to find the command in Raycast and use the _Copy Deeplink_ action.

If your script command accepts arguments, like Color Conversion:

You can use the `arguments` query parameter in order to pass e.g. `#FF0000` and `rgb`:

Copy

```javascript
raycast://script-commands/color-conversion?arguments=%23FF0000&arguments=rgb
```

Note the `%23FF0000` in the URL; that’s because query parameters need to be URL encoded, so `#` becomes `%23`.

## Run an AI command

You can also run any enabled AI command by using _Deeplinks._ The _Deeplink_ needs to follow the following format:

Copy

```javascript
raycast://ai-commands/<slugified-command-name>
```

As with other commands, it’s probably easier to find the command in Raycast and use the _Copy Deeplink_ action.

# Troubleshooting

## Running a Window Management command using its Deeplink doesn’t work

Depending on how a Deeplink is opened, Raycast might become focused; since Window Management commands rely on the _target_ app being focused, this will lead to the commands not working.

One way to ensure Raycast doesn’t get focused is to use a shell script. Running the following command in the terminal should result in the terminal being displayed in the left half of the screen:

Copy

```javascript
open -g raycast://extensions/raycast/window-management/left-half
```

This can, then, be included in a Shortcut: