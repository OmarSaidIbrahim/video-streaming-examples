# **video-streaming-examples**

![image](https://github.com/OmarSaidIbrahim/video-streaming-examples/assets/32266102/eb8c8000-3fe4-4bc9-8906-c3c6b9ba11a1)

Welcome to the "video-streaming-examples" repository! This project serves as a comprehensive exploration of the mechanics of video streaming technology using JavaScript and Node.js. It showcases various scenarios related to video streaming, including streaming from remote and local servers, loading videos without streaming, and more. Each scenario is meticulously coded to demonstrate the nuances of video streaming, such as latency impact and time to availability for users.

For developers and enthusiasts interested in the technicalities of video streaming services and the challenges faced in delivering content seamlessly, this repository provides insightful resources and practical examples. Dive into the code and documentation to explore different video streaming techniques and gain a holistic understanding of the streaming experience.

**How to Run:**

1. Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/video-streaming-examples.git
```

2. Navigate to the project directory:

```bash
cd video-streaming-examples
```

3. Install dependencies:

```bash
npm install
```

4. Download these videos for free from Pexels:

https://www.pexels.com/video/alps-and-hills-drone-footage-6251859/ <br />
https://www.pexels.com/video/illuminated-hands-holding-drink-glasses-6624849/

You will need the SD, HD and Full HD versions. In total 6 videos (3 for each link)

5. Save them in the project folder as:

6251859_sd.mp4 <br />
6251859_hd.mp4 <br />
6251859_hls.mp4 <br />

6624849_sd.mp4 <br />
6624849_hd.mp4 <br />
6624849_hls.mp4 <br />

6. Request an API key from Pexels here

https://www.pexels.com/api/

You can either paste it in the .env file or execute this command in the terminal before running the index.js file

```bash
export PEXELS_API_KEY=myapikey
```

6. Run the server.js file:

```bash
node index.js
```

5. Once the server is running, open your web browser and go to `http://localhost:port` where `port` is the port number specified in the console log.

6. You should now be able to explore the various video streaming examples provided in the project.

# **Notes**

In the code, you will find a very ugly piece that you may not understand.

```javascript
videoUrl = video.video_files.find((v) => v.quality === videoQuality)?.link;

if (!videoUrl && videoQuality === "hls") {
  videoUrl = video.video_files.find(
    (v) =>
      (v.width === 1080 && v.height === 1920) ||
      (v.width === 2048 && v.height === 1080)
  )?.link;
}
```

This is because Pexels API does not return the 'hls' quality video on their JSON response, so I had to work around and play with the resolutions.

# **Demo**

[DropBox Link](https://www.dropbox.com/scl/fi/zotfbodj1rihjfuzem9cp/demo.mov?rlkey=mp1w3qzlelq5ff16wkkico9je&dl=0)

# **Plans For The Future**

I am planning to improve the UI and include a video compression functionality to see how that could improve the speed of the streaming. Also, would be great to see how the loading speed changes for larger videos but lower resolution set by the user. For caching the video chunks streamed, could be helpful to implement a caching system using Redis ?

Feel free to modify the code, experiment with different scenarios, and contribute to the project! If you encounter any issues or have suggestions for improvement, please don't hesitate to open an issue or submit a pull request.

Happy coding! 🎥🚀
