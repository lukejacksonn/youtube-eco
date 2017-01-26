# videco

> Less than 20 lines of code that YouTube have looked into implementing and found a good reason not to, but..

A chrome extension that drops the quality of YouTube videos when they are running in the _background_ (where `document.hidden === true`). The aim is to highlight potential benefits of this technique, ideally the implementation would by done by YouTube, this is a hack to demonstrate the desired behavior. The overarching goal of the project was to make some gains:

- Bandwidth - less bits down the line frees up the network
- CPU & Memory - smaller packets means less client processing
- Energy - both the client and the servers get to do less work

Thousands if not millions of people incessantly ~~watch~~ listen to YouTube videos ([40% of 18-24 year olds](https://surveys.google.com/view?survey=5n3bp67fdkshk&question=1&grouping=age&ha=4)). If the video is not actually visible (inactive tab or minimized window) delivering these users 1080p is not necessary. If any savings can be made unbeknownst to the user then #yolo!


## Implementation

The lazy hacker approach was quite simply to do a bit of DOM investigation and just mimic what happens when a user changes the quality by clicking on the UI. Entering the following in the chrome inspector console:

```
$('.ytp-settings-button').click();
$('.ytp-settings-menu .ytp-menuitem:last-child').click();
$('.ytp-quality-menu .ytp-menuitem:nth-last-child(2)').click();
```

Routinely replicates the actions of a user clicking on the settings icon, the quality menu then the lowest quality option (140p). The inverse of this operation is returning the video back to optimal quality. This can be achieved by clicking on the bottom most option in the quality menu (Auto):

```
$('.ytp-quality-menu .ytp-menuitem:last-child').click();
```

These steps need to be executed every time the window loses and gains focus respectively. It is possible to derive a documents visibility quite simply with:

```
document.hidden ? 'hidden' : 'visible'
```

Bundling this logic into a chrome extension isn't rocket science (see content.js). It's quick, it's dirty but there are only 15 lines and it works!

## Result

When the extension is installed and the user navigates to a Youtube Video, then user swaps tab or minimizes the window, the video is set to the 144p quality setting. When they return to the video, the quality is set back to the Auto setting.

## Observations

- When the window loses focus, there is a noticeable disruption to the stream for a short period of time. Presumably the player buffering lower quality frames. Not sure why it doesn't play the already buffered higher quality frames until the low quality frames arrive.
- When the window gains focus, there is no stream disruption but rather the video is of 144p quality for a short period of time before fading back into optimal quality. Presumably the player is happy to consume the already buffered 144p quality frames until the higher quality data has loaded.
- When ever a change in quality occurs, most of the already buffered data is wasted, overwritten by the new data. The associated overhead cost can be quite substantial.

## TODO

- Only change quality if the video is playing to prevent unnecessary buffering
- Toggle quality only when out of focus for some amount of time
- Look into how to gracefully degrade stream to 144p; without disruption
- ~~Pick Auto quality setting instead of top most setting when the focussing~~
