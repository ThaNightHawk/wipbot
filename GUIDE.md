# Migrating from old WIPBot?

If you already have wipbot.dll, but can't use it due to catse shutting down their service, do the following:

1) Close your game
2) Find your `UserData` inside your Beat Saber installation.
3) Delete `wipbot.json`
4) Open [this](https://raw.githubusercontent.com/ThaNightHawk/wipbot/refs/heads/main/wipbot.json) and press CTRL+S (CMD+S), and save as `wipbot.json` inside `UserData`
5) Launch your game, and you're good to go!

If you want to test, upload a zipped map-file to [this](https://wip.hawk.quest/), and request through your chat while your game is open. You should now see `1 wip` on the WIP-button.
