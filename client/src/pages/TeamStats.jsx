import { useState, useEffect } from 'react'
import '../App.css'
import axios from 'axios'
import { BrowserRouter, useNavigate } from 'react-router-dom'

const MYKEY = "f7f1bb20-0641-462b-96ab-def0baf31f6b";
const BASE = "https://open.faceit.com/data/v4";
const LEAGUE_ID  = "a14b8616-45b9-4581-8637-4dfd0b5f6af8";
const SEASON_ID  = "18dc2875-1b17-45e0-9e9b-a336ed0aecbb"; // optional
const ORGANIZER_ID = "08b06cfc-74d0-454b-9a51-feda4b6b18da";
function TeamStats() {
    const [league, setLeague] = useState(null);
  const [error,  setError]  = useState(null);


  const fetchLeague = async () => {
   (async () => {
        try {
          const url = `${BASE}/leagues/${LEAGUE_ID}`;                 // meta
          // const url = `${BASE}/leagues/${LEAGUE_ID}/seasons/${SEASON_ID}`; // season
    
          const { data } = await axios.get(`https://open.faceit.com/data/v4/leagues/${LEAGUE_ID}/seasons/${SEASON_ID}`, {
            headers: { Authorization: `Bearer ${MYKEY}` }
          });
          console.log(data);
        } catch (err) {
          console.error(err);   // 401 bad key, 404 wrong id, etc.
        }
      })();


  }
useEffect(() => {
    fetchLeague();
  }, []);                                  // ← run once
                                                 // (no infinite loop)
  if (error)  return <p>Couldn’t load league.</p>;
  if (!league) return <p>Loading…</p>;
  return (
    <div>
      <h1>Team Stats</h1>
      <form>
        <input 
          name="nickname" 
          type="text" 
          placeholder="Enter a team name..." 
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  )
}

export default TeamStats