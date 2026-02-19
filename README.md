# Film Hall Seat Booking Website

This repository contains a simple, client‑side film hall seat booking website. Visitors can see the available seats, select seats visually, and pay for their tickets using PayPal. Seat selections are stored in a Firebase Realtime Database so the availability updates for all users in real time.

## Features

* **Visual seat map:** A grid representing rows and seats lets visitors see which seats are available, selected, or already booked. The layout can be adjusted by modifying the `rows` and `seatsPerRow` constants in `script.js`.
* **Real‑time updates:** Seat availability is synced with Firebase Realtime Database. When a seat is booked, it becomes unavailable to others immediately.
* **Simple pricing:** You can set a flat price per seat via the `seatPrice` constant. The total cost updates as the user selects seats.
* **PayPal integration:** Payments are handled via the PayPal JavaScript SDK. The current configuration uses the sandbox environment; replace the `client-id` parameter in `index.html` with your own PayPal client ID when going live.
* **Free hosting:** Because the site is completely client‑side, you can deploy it for free using [GitHub Pages](https://pages.github.com/). Firebase’s no‑cost **Spark** plan provides the realtime database and hosting quotas you’ll need during development【903708589266431†L431-L440】.

## Prerequisites

* A **GitHub** account for hosting the static site. GitHub Pages is free for public repositories and will serve your HTML, CSS and JavaScript files directly【840394711361006†L0-L16】.
* A **Firebase** project with the Realtime Database enabled. On the Spark plan you don’t need to enter payment information and can use the free quotas【903708589266431†L431-L447】.
* A **PayPal** developer account to obtain a client ID. The PayPal sandbox lets you test the payment flow without real transactions【733090819712576†L50-L67】.

## Setup

1. **Clone this repository** (or create a new repository on GitHub and add these files):

   ```bash
   git clone https://github.com/your‑username/filmhall-site.git
   cd filmhall-site
   ```

2. **Configure Firebase:**
   * Sign in to the [Firebase console](https://console.firebase.google.com/) and create a new project.
   * In the project settings, add a new Web app and copy the Firebase configuration keys (`apiKey`, `authDomain`, `databaseURL`, etc.).
   * Enable **Realtime Database** in test mode. Under the **Data** tab, create a new node called `shows/show1/seats` and populate it with your initial seat layout. For example:

     ```json
     {
       "A1": { "booked": false },
       "A2": { "booked": false },
       "B1": { "booked": true },
       // … and so on for each seat
     }
     ```

   * Open `script.js` and replace the placeholder values in `firebaseConfig` with your project’s credentials.

3. **Configure PayPal:**
   * Create a PayPal developer account at [developer.paypal.com](https://developer.paypal.com/) and create an **app** in the **Sandbox** environment.
   * Copy your sandbox **Client ID** and replace `YOUR_PAYPAL_CLIENT_ID` in the `<script>` tag of `index.html`.
   * When you’re ready to accept real payments, create a Live app in PayPal and use its Client ID instead.

4. **Run locally:**
   * You can open `index.html` directly in your browser for testing. For a better development experience, you can serve the files using a simple HTTP server:

     ```bash
     python3 -m http.server 8000
     ```

   * Then navigate to `http://localhost:8000` in your browser.

5. **Deploy to GitHub Pages:**
   * Commit and push your changes to a public GitHub repository.
   * On GitHub, go to the repository settings. Under the **Pages** section, choose `main` (or whichever branch) and `/` (root) as the source. Save the settings.
   * GitHub Pages will publish your site at `https://your‑username.github.io/filmhall-site`. Changes pushed to the repository will automatically update the live site.

## Customization

* **Seat layout & pricing:** Modify `rows`, `seatsPerRow` and `seatPrice` in `script.js` to reflect your venue’s capacity and ticket pricing.
* **Appearance:** Edit `style.css` to change colors, fonts or spacing.
* **Multiple shows:** You can support multiple screenings by creating separate paths in Firebase (e.g., `shows/show2/seats`) and reading that path based on a query parameter or drop‑down menu.

## Important Notes

* This project is designed for educational purposes and small venues. For a production‑grade system, you should implement user authentication, server‑side validations and consider using a backend that can enforce seat reservations atomically.
* Always test thoroughly in the PayPal Sandbox before going live. The sandbox environment behaves like the real environment but uses fictitious accounts so no real money is transferred【733090819712576†L50-L67】.

## License

This project is released under the MIT License. See `LICENSE` for details.