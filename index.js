const express = require("express");
var responseTime = require("response-time");
const app = express();
const fs = require("fs");
const axios = require("axios");

let video;
let videoUrl;
let videoQuality = "sd";
let latency;

app.use(responseTime());

app.get("/", async function (req, res) {
  let videoId = req?.query?.videoId;

  if (req?.query?.videoId) {
    videoId = req?.query?.videoId;
  } else {
    videoId = "6624849";
  }

  if (req?.query?.videoQuality) {
    videoQuality = req?.query?.videoQuality;
  }

  video = await getVideo(videoId);
  videoUrl = video.video_files.find((v) => v.quality === videoQuality)?.link;
  if (!videoUrl && videoQuality === "hls") {
    videoUrl = video.video_files.find(
      (v) => v.width === 1080 && v.height === 1920
    )?.link;
    if (!videoUrl) {
      videoUrl = video.video_files.find(
        (v) => v.width === 2048 && v.height === 1080
      )?.link;
    }
  }
  res.sendFile(__dirname + "/index.html");
});

app.get("/getVideoDetails", async function (req, res) {
  const videoDetails = video;
  const duration = videoDetails.duration;
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  const quality = videoQuality;
  const size = getSize();
  const htmlResponse = `
  <p class="text-white">Current Video Details:</p>
  <br/>
  <p class="text-white">Duration: ${result}</p>
  <p class="text-white">Quality: <span class="uppercase">${quality}</spna></p>
  <p class="text-white">Size: ${size}MB</p>
  <br/>`;
  res.send(htmlResponse);
});

app.get("/video", function (req, res) {
  if (!!video) {
    res.sendFile(__dirname + `/${video?.id}_${videoQuality}.mp4`);
  }
});

app.get("/video-with-streaming", function (req, res) {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  if (!!video) {
    const videoPath = `${video.id}_${videoQuality}.mp4`;
    const videoSize = fs.statSync(`${video.id}_${videoQuality}.mp4`).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  }
});

app.get("/media", async (req, res) => {
  res.status(200).send(videoUrl);
});

app.get("/media-with-streaming", async (req, res) => {
  try {
    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream",
    });

    // You can also save it to a file if needed
    // response.data.pipe(fs.createWriteStream("2499611.mp4"));

    res.setHeader("Content-Type", "video/mp4");

    response.data.on("data", (chunk) => {
      res.write(chunk); // Write each chunk to the response stream
    });

    response.data.on("end", () => {
      res.end(); // End the response stream when all data has been sent
    });

    response.data.on("error", (error) => {
      console.error("Error streaming video:", error);
      res.status(500).send("Error streaming video");
    });
  } catch (error) {
    console.error("Error downloading video:", error);
  }
});

app.get("/setLatency", (req, res) => {
  res.send("");
  latency = res.get("X-Response-Time");
});

app.get("/getLatency", (req, res) => {
  const htmlResponse = `<p class="text-white">Latency: ${latency}</p>`;
  res.send(htmlResponse);
});

async function getVideo(id) {
  try {
    const response = await axios.get(
      `https://api.pexels.com/videos/videos/${id}`,
      {
        headers: {
          Authorization:
            "n9upBDJQriTRZ730MLHDxg8974uzKH0pLDusUSl6kw5mXXyGusPrz7SC",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching video URL:", error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

const getSize = () => {
  if (!!video) {
    if (video.id === 6624849) {
      switch (videoQuality) {
        case "sd":
          return "0.8";
        case "hd":
          return "1.5";
        case "hls":
          return "4";
      }
    }
    if (video.id === 6251859) {
      switch (videoQuality) {
        case "sd":
          return "111.3";
        case "hd":
          return "201.5";
        case "hls":
          return "398.6";
      }
    }
  }
};

app.listen(8000, function () {
  console.log("Listening on port 8000");
});
