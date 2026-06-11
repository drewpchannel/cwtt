## How to install:

[Setup Video](https://imgur.com/a/SNRc7hJ)

Click code, download zip

Unzip the file by right clicking it and selecting extract

Go to chrome in the address bar type chrome://extensions/

Switch on dev mode

Load Unpacked

Naviagte to the folder you unzipped the extension to, select the folder, click open

Go to yahoo fantasy mock drafts and join a team

After the draft starts there will be a puzzle icon in the top right near your chrome address bar, click it

select chrome extension called Yahoo Fantasy Football

click setting and type in the name of your CSV file (has to be in the unzipped directory/ffbcext/rankings) do not include .csv

click save, then hit refresh

it will load the available players in the category selected (so if RBs are selected on yahoo you will only see your RB rankings)

## Rankings List
Rankings CSVs should be placed into the rankings folder

In Google Drive I'm going to do all my notes and editing
  The program finds the player name.  It assumes next is the Team, then position, then notes (if long text is founde)
  example: 1.01, Christian McCaffrey, CAR, RB
  everything else can just go behind RB, move this around in Google Spreadsheet: 1.01,Christian McCaffrey,CAR/13,RB,12.02,1.88,1,1,1.1,0,0.91,

The program looks for a player name (longer than 8 characters) then compares those names to Yahoo's list.  This will get tripped up by weird spacing or capitalization

The program will look for the player name, then the next column is assumed to be a team, the next position

Defenses should be named by the city 

## Work Around
To keep the popup open while clicking on Yahoo, right click the extension window and click inspect.  As long as the inspection window is open it will not disapear

notes at the end of player CSV row causing the next player to not show up, I have been creating a new CSV with out my notes

## Todo:

Compare players loaded to Yahoo table length

make sorting for pos (currently is handled by yahoo, clicking quarterbacks left on the yahoo page will refresh list with only QBs)

add custom notes from csv

maybe stop errors from coming up when site is not loaded (site almost certainly just needs to be reloaded)