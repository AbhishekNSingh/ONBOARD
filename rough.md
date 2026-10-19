Add /api/health route, then ping it every 5 minutes with UptimeRobot (Render free tier sleeps)
2	Production cookie: sameSite: "none", secure: true
3	CLIENT_URL set to the real Vercel address
4	vercel.json rewrite so page refresh doesn’t 404
5	VITE_API_URL and VITE_RAZORPAY_KEY_ID in Vercel env settings
6	File name casing must match imports exactly (Linux is case-sensitive)
7	Change the seeded admin password, and keep .env out of Git
8	README with screenshots and a demo login for each role