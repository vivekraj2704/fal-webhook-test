# FAL Video-to-Video Conversion using Next.js

## Overview
This project is a web application built with Next.js that leverages FAL (Fast Artificial Learning) models to perform video-to-video conversions. Users can upload a video, apply transformations, and download the processed video.

## Features
- Upload videos for processing
- Apply AI-driven video transformations using FAL
- Preview processed videos before downloading
- Download the converted videos in supported formats
- Responsive UI with a smooth user experience

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API routes
- **AI Processing:** FAL API
- **Storage:** Cloudinary/AWS S3 (optional)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/vivekraj2704/Fal-video.git
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Set up environment variables in a `.env.local` file:
   ```env
   MONGODB_URI=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    FAL_API_KEY=
    NEXT_PUBLIC_BASE_URL=
    UPLOADTHING_SECRET=
    UPLOADTHING_APP_ID=
    UPLOADTHING_TOKEN=
   ```
4. Run the development server:
   ```sh
   npm run dev  # or yarn dev
   ```
5. Open `http://localhost:3000` in your browser.

## API Usage
This project utilizes FAL API for video processing. Ensure you have an API key and configure your requests properly.

## Deployment
To deploy on Vercel:
1. Push the code to GitHub.
2. Connect the repository to Vercel.
3. Set up environment variables in Vercel.
4. Deploy!

## Contribution
Feel free to fork this project and submit pull requests.

## License
MIT License

