import axios from "axios";
import Match from "../models/Match.js";

const api = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: { 
    "x-apisports-key": process.env.API_FOOTBALL_KEY,
    "Content-Type": "application/json"
  },
});

export async function updateLiveScores() {
  try {
    console.log('Updating live scores...');
    
    const { data } = await api.get("/fixtures?live=all");
    const liveMatches = data.response;

    if (!liveMatches || liveMatches.length === 0) {
      console.log('No live matches found');
      return;
    }

    for (const match of liveMatches) {
      try {
        await Match.findOneAndUpdate(
          { apiFootballId: match.fixture.id },
          {
            status: "live",
            score: {
              home: match.goals.home || 0,
              away: match.goals.away || 0,
            },
          },
          { upsert: false }
        );
      } catch (error) {
        console.error(`Error updating match ${match.fixture.id}:`, error.message);
      }
    }

    console.log(`Updated ${liveMatches.length} live matches`);
  } catch (error) {
    console.error('Error updating live scores:', error.message);
  }
}

export async function updateUpcomingFixtures() {
  try {
    console.log('Updating upcoming fixtures...');
    
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const { data } = await api.get(
      `/fixtures?date=${today.toISOString().split('T')[0]}&timezone=UTC`
    );
    
    const fixtures = data.response;

    if (!fixtures || fixtures.length === 0) {
      console.log('No upcoming fixtures found');
      return;
    }

    for (const fixture of fixtures) {
      try {
        const matchData = {
          title: `${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
          league: fixture.league.name,
          kickoff_time: new Date(fixture.fixture.date),
          home_team: fixture.teams.home.name,
          away_team: fixture.teams.away.name,
          status: "upcoming",
          apiFootballId: fixture.fixture.id,
          thumbnail: fixture.teams.home.logo || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop'
        };

        await Match.findOneAndUpdate(
          { apiFootballId: fixture.fixture.id },
          matchData,
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(`Error updating fixture ${fixture.fixture.id}:`, error.message);
      }
    }

    console.log(`Updated ${fixtures.length} upcoming fixtures`);
  } catch (error) {
    console.error('Error updating upcoming fixtures:', error.message);
  }
}

export async function getMatchDetails(apiFootballId) {
  try {
    const { data } = await api.get(`/fixtures?id=${apiFootballId}`);
    return data.response[0];
  } catch (error) {
    console.error('Error fetching match details:', error.message);
    return null;
  }
}

export async function getLeagueStandings(leagueId) {
  try {
    const { data } = await api.get(`/standings?league=${leagueId}&season=2024`);
    return data.response;
  } catch (error) {
    console.error('Error fetching league standings:', error.message);
    return null;
  }
}
