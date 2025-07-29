# WIPbot for Beat Saber streamers

> [!NOTE]
> Required BeatSaberPlus or CatCore.
>   
> Make sure your channel moderation settings allow posting links in chat, otherwise only VIPs and above can post wip download links.
>   
> Request codes obtained from the dedicated website can be used 99.9% of the time. (Unless Cloudflare or Oracle Cloud dies)

## How to migrate from old wipbot to new wipbot.
It's [pretty simple](https://github.com/ThaNightHawk/wipbot/blob/main/GUIDE.md), if you already have wipbot installed!  

If you don't have it, download for either 1.37.1 or 1.40.6 (I'm not gonna support anything else), and you're good to go!  
Make sure `wipbot.json` does **NOT** exist in `UserData` if you're doing a clean install. It'll deny requests.

## Troubleshooting:
1) Close your game.
2) Delete `wipbot.json` from your `UserData`-folder.
3) Download the 1.37.1 or 1.40.6 version from [**HERE**](https://github.com/ThaNightHawk/wipbot/releases).
4) Copy the wipbot.dll to your `Plugins`-folder.
5) Start the game, and try again.
6) If this doesn't work ~~time to cry~~, contact [Hawk](https://discordapp.com/users/592779895084679188).


## This plugin adds the ``!wip`` command to your Twitch chat.  
Examples:  
``!wip`` prints a help message in chat  
``!wip e5a5bb`` using a request code obtained from [here!](https://wip.hawk.quest/)  
``!wip https://cdn.discordapp.com/attachments/9106712553161/9165053429928/Example_Wip.zip`` using Discord  
``!wip https://drive.google.com/file/d/1rcs9V_aq1kBjNhAQUdFz7f7kvWR/view?usp=sharing`` using Google Drive  
``!wip oops`` removes users most recent request from queue

After someone has requested a wip, press the WIP button to download it:
![image](https://user-images.githubusercontent.com/45233053/205438155-c58a499b-1b7a-4049-af67-30d15e1b1f6e.png)

> [!NOTE]
> You can also selfhost this, if you want to, by deploying `website` on your server

