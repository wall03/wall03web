

fetch('https://urbanists.social/api/v1/accounts/109304302905328734/statuses')
.then(response => response.json())
.then(data => renderFeed(data))
.catch(error => console.error('Error fetching data:', error));
function formatDate(dateString) {
const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
};
const date = new Date(dateString);
return date.toLocaleString('en-US', options); // Format the date in a human-readable way
}
// Function to render the feed
function renderFeed(data) {
const feedContainer = document.getElementById("feed");
feedContainer.innerHTML = ''; // Clear previous feed content

data.forEach(post => {
const postElement = document.createElement("div");
postElement.classList.add("feed-item");


// Create content
const content = document.createElement("div");
content.classList.add("content");
content.innerHTML = post.content;
postElement.appendChild(content);


// Create poll if available
if (post.poll) {
const pollContainer = document.createElement("div");
    pollContainer.classList.add("poll");

// Calculate total votes
    const totalVotes = post.poll.votes_count;
    post.poll.options.forEach(option => {
    const pollOption = document.createElement("div");
    pollOption.classList.add("poll-option");

// Calculate the percentage of votes for the option
    const percentage = totalVotes > 0 ? (option.votes_count / totalVotes) * 100 : 0;

// Set the content of the poll option (title and votes count)
    pollOption.innerHTML = `<strong>${option.title}</strong> (${option.votes_count} votes)`;

// Create the poll result bar container
    const pollBar = document.createElement("div");
    pollBar.classList.add("poll-bar");

// Create the inner part of the poll bar with the dynamic width based on the percentage
    const pollBarInner = document.createElement("div");
    pollBarInner.classList.add("poll-bar-inner");
    pollBarInner.style.width = `${percentage}%`;

// Optional: Set a background color for the bars (you can randomize or define specific colors)
    pollBarInner.style.backgroundColor = '#4CAF50'; // Green color for the poll bar (adjust as needed)

// Append the poll bar to the poll option
    pollBar.appendChild(pollBarInner);
    pollOption.appendChild(pollBar);

// Append the poll option to the poll container
    pollContainer.appendChild(pollOption);
});

// Add the poll container to the post element
postElement.appendChild(pollContainer);
}
function getImageUrlFromFeed(feed) {
// Check if 'card' and 'image' exist in feed
return feed.card && feed.card.image ? feed.card.image : null;
}

// Function to get image URL from a feed item
function getImageUrlFromFeed(feed) {
return feed.card && feed.card.image ? feed.card.image : null;
}

// Function to render image URLs (link embeds hopefully)
function renderFeed(data) {
data.forEach(feed => {
    const imageUrl = getImageUrlFromFeed(feed);
    const imageContainer = document.createElement("div");
    const linkImg = document.createElement("img");

    if (imageUrl) {
        linkImg.src = imageUrl;
        imageContainer.appendChild(linkImg);
    } else {
        console.log("No image URL found in feed.");
    }

    // Append imageContainer to the body or a specific element
    document.body.appendChild(imageContainer);
});
}
// Display media (images or other attachments)
if (post.media_attachments && post.media_attachments.length > 0) {
const mediaContainer = document.createElement("div");
mediaContainer.classList.add("media");
post.media_attachments.forEach(media => {
    if (media.url) {
        const image = document.createElement("img");
        image.src = media.url;
        image.alt = "Media attachment";
        mediaContainer.appendChild(image);
        }
    });
    postElement.appendChild(mediaContainer);
}
// Add post link
const postLink = document.createElement("a");
postLink.href = post.url;
postLink.textContent = `Posted on ${formatDate(post.created_at)}`;
postLink.target = "_blank";
postElement.appendChild(postLink);

// Append post to feed
feedContainer.appendChild(postElement);
});
}

// Render the feed on page load
document.addEventListener("DOMContentLoaded", () => {
renderFeed(feedData);
}); 
function handleReload() {
fetchFeedData()
.then(data => renderFeed(data))
.catch(error => console.error("Error fetching feed:", error));
}

// Initialize the feed and set up the reload button
document.addEventListener("DOMContentLoaded", () => {
handleReload(); // Load the feed when the page loads
document.getElementById("reload-btn").addEventListener("click", handleReload); // Add event listener for reload button
});