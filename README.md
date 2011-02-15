# Balloon Diaspora

Balloon Diaspora is a [game by Cardboard Computer](http://cardboardcomputer.com/games/balloon-diaspora/) with music by [Oliver Blank](http://mroliverblank.com) about exploring a foreign culture, making new friends, and riding through the clouds on a hot air balloon.

These are the [Unity3D](http://unity3d.com/) components (written in javascript) used to create Balloon Diaspora, as well as the XML data files used to generate conversations and state within the game. I hope they can be useful!

A couple notes:

* The conversation engine relies on the XML parser plugin available at http://www.roguishness.com/unity/
* The scripts in the "InitScripts" folder will probably not be very interesting; they just set variable states for different scenes & are attached to an otherwise empty GameObject for their respective scene.