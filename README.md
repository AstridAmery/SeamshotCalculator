This is an updated version of Krzyhau's seamshot calculator, that allows you to find seams in a source engine map.
I have made the addition of:
file reading bug fixes, local hosting via a new batch file, and changed cfg generation to seperate files if 1mb size is reached. 

This is completely safe to use, but feel free to run it through [VirusTotal](https://www.virustotal.com/gui/home/upload) yourself.

You can run this by downloading everything, and running the Run.bat. 
This will then open in your browser, where you upload your bsp files (found in \Steam\steamapps\common\Team Fortress 2\tf\maps). 
Note: You must have python installed

After a moment, it will generate a cfg file(s) which will go into your default browser download folder. 
Put these into your cfg folder (\Steam\steamapps\common\Team Fortress 2\tf\cfg).

Then you can run tf2, open the map (console > "map MAP_NAME", then use the scroll wheel up and down to navigate through the various seams present in the map, which will highlight in red. 

Side note: I am not the original creator of this, and therefore know very little about the maths that went into this, but Krzyhau seems unresponsive, so I made these changes myself. 

Idea originally came from Htwo's newest video on pl_upward: https://youtu.be/BPoJa6HPRSQ?si=7H-17Mdpnj_9TWV5

