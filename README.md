# How to use - WIP
Welcome to this obsidian vault made for Role playing table top game. The goal of this vault is to make it simple to take notes in a role playing game. There is logic made to make it easier to takes notes and link between them. 

1. First thing first is to create your first campaign ! 
> [!warning]
> When clicking on a button in the vault make sure you don't have anything selected at the same time or other wise it will take what you have selected and use it as an input for the button input field
- Go in the [[Game Index]] and click on `Add New Campaign` or you can click this one 
```button
name Add New Campaign
type command
action QuickAdd: Template - Create New Campaign
```
When using the button across the vault you will be prompted an input modal such as ![[Pasted image 20250912092521.png|450]] This field will define the title of the element you are created such as name of a location, npc, establishment and others. 
> [!warning]
> When creating an title make sure there is no space at the beginning or at the end. 


After Creating the new campaign it will open on the side a new tab which will look like this 
![[Pasted image 20250912092829.png]]
This will be the dashboard of the campaign you are currently in. Congrats the campaign as been created !.

Now that you are in your campaign dashboard you will something at the top that is quite interesting ![[Pasted image 20250912093026.png]]
These are the properties of every files and they have been custom define by me to help you out. In the campaign there is 8 of them.
- `type` = this need to never be altered it help the vault to know which type of file this is such as `campaign`, `NPC` and more
- `tags` = I personally don't use them that often but these to to create a tag system for all the files you have you can add some tags if you want. Like the one i added above `Tutorrial`
- `world` = This is one of the first important field but it will be currently empty which is normal. you will have to fill it up but after this explanation. 
- `campaign` = Name of the campaign, it's redundant but can be usefull for me if i want to use it later
- `role` = player. Currently the only role set for this vault but if one day you want the dual GM/Player vault that can be change
- `system` = help you know what you are playing it's defaulted at `5e` but we could have more. It's a field to keep our-self organized  
- `dndbeyond_url` = put the campaign url not usefull anywhere else, so it's not that important, just just a place to have a quick shortcut. 
- `urls` = This is the first field that is not like the others but act a little like `tags`, meaning you can add multiple entries in there. It's similar to `dndbeyond_url` but you can have more. 

2. Now you will need to create your first location. to put in the `world` property in the dashboard. This first location will act as the center of the campaign and used at a lot place. Example for the campaign of soltpeak, `Soltpeak` could be your fist location.
> [!warning]
> When Creating a new notes, with a button or without make sure that the name is unique to simplefy the use later. The issue that can be raise, is when you have multiple notes that have the same name such as `Material_plane` if you have it across multiple campaign it will become more and more difficult to know which one is the right one. So in the case of that one over just naming it `Material_plane` i would name it something like `Material_plane_solteak` which make it unique. 

After creating your first location. A new page will open but this time it will be a location with the name you just input. It should look like something like this. 
![[Pasted image 20250912100434.png|450]]
Now with this created you will have to go back to your campaign dashboard and input this for the `world` property, but it will not be as just the name you will have to input it as a link. In Obsidian you can like item with the `[[NameOfFile]]` brackets so for this is example i shall input in the `world` property `[[Example_Material_Plane]]` which should look like this [[Example_Material_Plane]] or ![[Pasted image 20250912100812.png|450]]
these brackets can be use while writing notes or in properties to link to other notes. You also have a auto fill mechanic that is also there that can help link to.
Now Go back to your first location and we will have to set the properties for this new notes. Most Notes will have similar properties which some will be automatically fill be others have to be user inputed. 
So for this new location we have these
![[Pasted image 20250912101122.png]]

- `version` = Version number of the template you are currently using but this is not important for now
- `type` = same as before but now is a location
- `name` = well 
- `aliases` = other name that note can be reference. Meaning if you have a notes that has a aliases in your note late you can write it with the aliases and it will display as such. Example you have a NPC named `Bob Tremblay` and has an aliases of `Bob the Strong`  like such ![[Pasted image 20250912101444.png|450]]
		You can now write in your notes `[[Bob Tremblay|Bob the strong]]`  which display as [[Bob Tremblay|Bob the strong]]
- `world` = which will be empty since this is the top location but later it will be autofill by what you have put in the world of the campaign dashboard.
- `date` = created date 
- `campaigns` = plurial but still the same. 
- `tags` = same as before
- `locations` = in the case of this first location that should be empty but later if you create another locations. this field is to define the children of. Example: I create a location called `Country of Canada` In the field locations of `Country of Canada` I will input `[[Example_Material_Plane]]` ![[Pasted image 20250912102031.png]]
		This mean `Country of Canada` is a child of `Example_Material_Plane` and in the index of `[[Example_Material_Plane]]` it will show now `Country of Canada` in it ![[Pasted image 20250912102527.png]]
- `location_type` = Define what type of location that is `country`, `city` and more, again help to orginize and also filter in the index of locations
- `description` = Long worded description
- `word_description` = quick short word to describe a something, like adjective
- `urls` = if there any 
- `img` = this is the image use in the note 
		![[Pasted image 20250912102756.png|300]]

Now you understand how to create location you can do the same for all the other buttons the logic is pretty much the same except `New Session`

3. New Session



--- 
### Quick tips
if you notes look weird like this 
![[Pasted image 20250912103505.png|850]]
Press on your keyboard `ctrl + shift + e` which will switch you to live edit mode over full edit more which you were

--- 
To search rapidly for a not `ctrl + p` you also have this at the top left ![[Pasted image 20250912103735.png]]

---
you can press `ctrl + g` to insert quick template which can be found and created in the folder `Configurations/Notes Templates` I have created some for you over there like `Note_sending` which will help create the note when you send or receive sending. 

--- 

