// Firebase configuration (replace with your own project settings)
// To get these values, create a Firebase project and enable the Realtime Database.
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJyYkMPu5LTnaPTOUBIRLNuZINqDT02pI",
  authDomain: "filhall-cfc42.firebaseapp.com",
  databaseURL: "https://filhall-cfc42-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "filhall-cfc42",
  storageBucket: "filhall-cfc42.firebasestorage.app",
  messagingSenderId: "433538658170",
  appId: "1:433538658170:web:168e266492e3e9d2fb30c3",
  measurementId: "G-P89KWS9PBR"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Configuration for the seat map
const rows = 8;
const seatsPerRow = 10;
const seatPrice = 5; // price per seat in USD
let selectedSeats = [];

// Reference to the seats data in the database
const seatsRef = database.ref('shows/show1/seats');

// Render the seat map on page load
function renderSeatMap(seatsData) {
  const seatMapDiv = document.getElementById('seat-map');
  seatMapDiv.innerHTML = '';
  for (let row = 0; row < rows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`; // e.g., A1, A2...
      const seatStatus = seatsData && seatsData[seatId] ? seatsData[seatId].booked : false;
      const seatElement = document.createElement('div');
      seatElement.classList.add('seat');
      seatElement.dataset.seatId = seatId;

      if (seatStatus) {
        seatElement.classList.add('booked');
      } else if (selectedSeats.includes(seatId)) {
        seatElement.classList.add('selected');
      } else {
        seatElement.classList.add('available');
      }

      seatElement.addEventListener('click', () => handleSeatClick(seatId, seatStatus));
      seatMapDiv.appendChild(seatElement);
    }
  }
}

// Handle seat click events
function handleSeatClick(seatId, isBooked) {
  if (isBooked) {
    // Do nothing if the seat is already booked
    return;
  }
  const index = selectedSeats.indexOf(seatId);
  if (index > -1) {
    // Seat already selected; deselect it
    selectedSeats.splice(index, 1);
  } else {
    selectedSeats.push(seatId);
  }
  updateSummary();
  // Re-render to update seat color
  seatsRef.once('value').then((snapshot) => {
    renderSeatMap(snapshot.val());
  });
}

// Update the booking summary display
function updateSummary() {
  const selectedSeatsElement = document.getElementById('selected-seats');
  const totalPriceElement = document.getElementById('total-price');
  if (selectedSeats.length === 0) {
    selectedSeatsElement.textContent = 'No seats selected';
    totalPriceElement.textContent = 'Total: $0';
  } else {
    selectedSeatsElement.textContent = `Selected seats: ${selectedSeats.join(', ')}`;
    const total = selectedSeats.length * seatPrice;
    totalPriceElement.textContent = `Total: $${total}`;
  }
}

// Listen for changes to the seats data and update the seat map accordingly
seatsRef.on('value', (snapshot) => {
  const seatsData = snapshot.val() || {};
  renderSeatMap(seatsData);
});

// If no realtime connection is available (e.g., running locally without Firebase),
// render an empty seat map so the UI doesn’t appear blank. This fallback
// ensures development is possible without configuring Firebase immediately.
if (typeof navigator !== 'undefined') {
  // Use a timeout to wait for Firebase to establish a connection. If after a
  // short delay there has been no data callback, draw a default map.
  setTimeout(() => {
    const seatMapDiv = document.getElementById('seat-map');
    if (seatMapDiv.childElementCount === 0) {
      renderSeatMap({});
    }
  }, 1000);
}

// Initialize PayPal Buttons
function initPayPalButtons() {
  paypal.Buttons({
    createOrder: (data, actions) => {
      if (selectedSeats.length === 0) {
        alert('Please select at least one seat before proceeding to payment.');
        return null;
      }
      const total = (selectedSeats.length * seatPrice).toFixed(2);
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: total
            },
            description: `Tickets for seats: ${selectedSeats.join(', ')}`
          }
        ]
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(() => {
        // Payment was successful; mark seats as booked in the database
        const updates = {};
        selectedSeats.forEach((seatId) => {
          updates[seatId] = { booked: true };
        });
        return seatsRef.update(updates).then(() => {
          alert('Booking successful! Your seats have been reserved.');
          // Clear the selection
          selectedSeats = [];
          updateSummary();
        });
      });
    },
    onError: (err) => {
      console.error('PayPal checkout error:', err);
      alert('There was an error during the transaction. Please try again later.');
    }
  }).render('#paypal-button-container');
}

// Once the DOM is ready, initialize the PayPal buttons
document.addEventListener('DOMContentLoaded', () => {
  initPayPalButtons();
});