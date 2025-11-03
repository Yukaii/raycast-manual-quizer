Raycast allows you to resize, reorganize and move your focused window effortlessly, without lifting your hands from the keyboard.

# Commands

Reorganize and refresh your workspace

-   **Toggle Fullscreen:** Toggle the focused window in a Fullscreen state
-   **Maximize:** Maximize the focused window to the full height and width.
-   **Maximize height:** Maximise the focused window to its full height.
-   **Maximize Width:** Maximise the focused window to its full width.
-   **Left/Right/Bottom/Top Half:** Move the focused window to fill one half of the screen. Perfect for focused work in 2 documents.
-   **Center:** Center the focused window. Height and width stay the same.
-   **Move Up/Down/Left/Right:** Move the focused window to the edge of the screen in any direction.
-   **Restore:** Restore the focused window to the position and size that it was before.
-   **Reasonable size:** Resize the focused window to 60% of the screen (maximum: 1025x900px)
-   **Previous/Next Display:** For multi-display setups; easily move your windows between displays.
-   **First, First Two, Center, Last Two, Last Third:** Resize and move the focused window to fill a third of the screen.
-   **First, Second, Third, Last Fourth:** Resize focused window to the specified fourth of the screen.
-   **Top Left/Top Right, Bottom Left/Bottom Right Quarter:** Resize and move the focused window to fit a quarter corner of the screen.
-   **Top Left/Top Center/Top Right Sixth:** Resize and realign the focused window to the specified sixth at the top of the screen.
-   **Bottom Left/Center/Right Sixth:** Resize and realign the focused window to the specified sixth at the bottom of the screen.

> 💡**Pro Tip:** Super-power your monitor by assigning hotkeys to your window management commands. For example, use `⌃` `⌥` `←` for the Left Half command to move and scale the focused window to the left half of the screen.

## Preferences

Customize your workspace - set a gap around the window edge between 0px to 128px.

## Troubleshooting

The Window Management extension requires Accessibility permissions to be turned on in your Security and Privacy settings. When you run a window management command for the first time, you will see some dialog regarding this.

# Custom Commands

> This feature requires an active Pro subscription. Don’t have one? Upgrade here!

You can setup your own window commands by customising window size, pinning position and offset. Use absolute values in points or percentage values relative to the display size.

## Window Layout

Besides single-window commands, you can set up multiple apps window layouts. Use the **Create Window Layout** command to add app windows on designated displays. You can also specify file or link to be opened with the app.

## Deeplinks

Custom commands support _Deeplinks_ that can be used outside of Raycast app. The _Deeplinks_ should be created in the following format with selected absolute / relative values:

Copy

```javascript
raycast://customWindowManagementCommand?&name=MyCommand&position=center&absoluteWidth=500.0&relativeHeight=0.5&absoluteXOffset=0.0&absoluteYOffset=0.0
```

Argument

Description

Required

`name`

Command name. If a corresponding single-window command with the same name is found, all other arguments will be ignored. If no name is provided, a temporary command will be used with the provided arguments.

No

`position`

Window pinning position. If no position is provided and a temporary command is used, top left position will be used.

No

`absoluteWidth`

Window width in points.

No

`relativeWidth`

Window width in percentage relative to screen’s width. Ignored if absolute width is provided.

No

`absoluteHeight`

Window height in points.

No

`relativeHeight`

Window height in percentage relative to screen’s height. Ignored if absolute height is provided.

No

`absoluteXOffset`

Window position’s horizontal offset in points.

No

`relativeXOffset`

Window position’s horizontal offset in percentage relative to screen’s width. Ignored if absolute X offset is provided.

No

`absoluteYOffset`

Window position’s vertical offset in points.

No

`relativeYOffset`

Window position’s vertical offset in percentage relative to screen’s height. Ignored if absolute Y offset is provided.

No

You can create a temporary _Deeplink_ - simply do not specify any name to be used for querying existing commands. That way a transient custom command will be used to position and resize a window on the fly.

Window Layout _Deeplinks_ only support name argument meaning that only existing window layouts can be used.

For more info on using _Deeplinks_ for Window Management Commands, refer to this troubleshooting guide.

## Additional notes

-   Gaps are currently not supported for the custom commands.
-   Using Window Layout with Stage Manager enabled will result in only the top window showing on screen as Window Manager hides the other ones. A workaround would be to group the apps in the Stage Manager (with ⇧ key down) before applying the layout, that way they will all remain on the screen.

Read more about Window Management here