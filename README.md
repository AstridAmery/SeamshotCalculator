This is an updated version of Krzyhau's seamshot calculator, that allows you to find seams in a source engine map.
I have made the addition of:
file reading bug fixes, local hosting via a new batch file, and changed cfg generation to seperate files if 1mb size is reached. 

This is completely safe to use, but feel free to run it through [VirusTotal](https://www.virustotal.com/gui/home/upload) yourself.

You can run this by downloading everything, and running the Run.bat (python must be installed!)
This will then open in your browser, where you upload your bsp files (found in \Steam\steamapps\common\Team Fortress 2\tf\maps). 


After a moment, it will generate a cfg file(s) which will go into your default browser download folder. 
Put these into your cfg folder (\Steam\steamapps\common\Team Fortress 2\tf\cfg).

Then you can run tf2, open the map (console > "map MAP_NAME", and load into the map. Once in, enable the various commands for testing (mp_tournament 1, sv_cheats 1, noclip, god, etc) and then enable the config using "exec cfg_name" (example: exec pl_borneo_seams).
Now you can use the scroll wheel up and down to navigate through the various seams present in the map, which will highlight in red. 

Important info for finding and using seams - You must be looking through them at a 90 degree angle to be able to shoot through! The best way to verify this is using cl_showpos 1, verifying your Y angle is a 90 degree (0 -180 0 for example), and then when your sniper reticle dissapears, it means you can now shoot through it. 

Side note: I am not the original creator of this, and therefore know very little about the maths that went into this, but Krzyhau seems unresponsive, so I made these changes myself. 

Idea originally came from Htwo's newest video on pl_upward: https://youtu.be/BPoJa6HPRSQ?si=7H-17Mdpnj_9TWV5

