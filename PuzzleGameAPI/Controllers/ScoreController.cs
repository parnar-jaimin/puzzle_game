using Microsoft.AspNetCore.Mvc;

namespace PuzzleGameAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreController : ControllerBase
    {
        static List<Score> scores = new List<Score>();

        [HttpGet]
        public IActionResult GetScores()
        {
            return Ok(scores);
        }

        [HttpPost]
        public IActionResult AddScore([FromBody] Score score)
        {
            scores.Add(score);
            return Ok(score);
        }
    }

    public class Score
    {
        public string PlayerName { get; set; }
        public int Points { get; set; }
        public int TimeTaken { get; set; }
    }
}