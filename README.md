# Last20
Instructions to run:
*Make sure to set VITE_BASE_API_URL in .env file to desired URL. Ex: http://localhost:8080 (local) or http://last20.onrender.com (service)*


To run the application locally, cd to the client folder. Run npm I, then npm run dev
 
To run the backend locally,

Pip install -r requirements.txt

Python3 main.py

To run the frontend on a service such as render:
Npm I;; npm run build
Set build folder as dist

To run the backend on a service such as render:
Pip install -r requirements.txt
gunicorn main:app



**OFFICIAL (sorta) URL: https://last20-static.onrender.com/stats**
Project Description

Last20 is an application to view your last 20 matches on facet and get a quick stat dashboard for it. These matches are mainly pugs but can include league matches. Las20 also analyzes your Season53 league stats and presents it in an easy, readable summary that shows individual form without having to click around on Faceit. Additionally, the season can be changed but must be manually changed via a line in App.jsx internally. It is very easy to change, you just change the line that looks for ’53’ to whatever season you wish to view.

Development of this application was quite tedious. I used a combination of faceit’s open V4 API to fetch specific information such as playerIDs in order to grab the last 20 matches.

For the league statistics, it was much harder to obtain. I had to reach API endpoints on facets official website, only viewable from the network portion of developer tools when visiting their official website. This is because Faceit’s league statistics are not accessible by their official v4 API, so I used these unofficial endpoints as a workaround to grab this specific data.

My calls comprise of access from V3 and below of Faceit’s API, which does not require a key, unlike V4. Additionally, I had to grab specific data such as playerID, premade_team_id, and championship IDs in order to look at an individuals matches. Then, I parsed through these individual matches through an endpoint that would return statistics of specific matches based on match ID. 

The best way I would describe it is going down a rabbit hole of different API endpoints to grab an ID, that leads to another ID, that leads to another ID, that leads to a JSON response with numerous fields for specific statistics. Whilst it was quite Tedious fetching all this data, I found it very rewarding to complete. 
