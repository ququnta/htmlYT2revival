//settings
let glype = localStorage.getItem('glype');
let apikey = localStorage.getItem('key');
if (!glype) {
	localStorage.setItem('glype', 'https://api.codetabs.com/v1/proxy/?quest=');
	glype = localStorage.getItem('glype');
}
if (!apikey) {
	localStorage.setItem('key', 'AIzaSyAFfAXy_qKdeCY7ypwDbLA63HbCuilVvHU');
	apikey = localStorage.getItem('key');
}

//per page functions
function trends(region) {
	let xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.open('GET', 'https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=15&regionCode='+region+'&key='+apikey, true);
	xhr.send();
	xhr.onload = function() {
		let response = xhr.response;
		let videolist = document.getElementById('videobits');
		response.items.forEach(function(item) {
			let id = item.id;
			let date = timeSince(item.snippet.publishedAt);
			let title = item.snippet.title;
			let thumb = item.snippet.thumbnails.default.url;
			let channelTitle = item.snippet.channelTitle;
			let duration = isoDurationToHHMMSS(item.contentDetails.duration);
			let views = item.statistics.viewCount;
			videolist.insertAdjacentHTML('beforeend', `
			<!--bit start-->
			<div class="videobit">
			<a href="video.html?id=${id}">
			<table>
			<tr>
			<td class="videobitPic"><img src="${thumb}" height="90" width="140"/> <div>${duration}</div></td>
			<td class="videobitDesc">
			<h4>${title}</h4>
			<p>${channelTitle}</p>
			<p>${date} | ${views} views</p>
			</td>
			</tr>
			</table>
			</a>
			</div>
			<!--bit end-->
			`);
		});
	}
}
function video() {
	let videoid = getParameterByName('id');
	let xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.open('GET', 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id='+videoid+'&key='+apikey, true);
	xhr.send();
	xhr.onload = function() {
		let response = xhr.response;
		console.log(response);
		let vidTitle = document.getElementById('vidTitle');
		let vidDate = document.getElementById('vidDate');
		let viewsLikes = document.getElementById('viewsLikes');
		let vidChannel = document.getElementById('vidChannel');
		let vidDescription = document.getElementById('vidDescription');
		vidTitle.innerHTML = response.items[0].snippet.title;
		vidDate.innerHTML = timeSince(response.items[0].snippet.publishedAt);
		viewsLikes.innerHTML = response.items[0].statistics.viewCount+' views, '+response.items[0].statistics.likeCount+' likes';
		let chanId = response.items[0].snippet.channelId;
		let chanTitle = response.items[0].snippet.channelTitle;
		vidChannel.innerHTML = `<a class="button" href="channel.html?channelId=${chanId}">${chanTitle}</a>`;
		vidDescription.innerHTML = response.items[0].snippet.description.replace('\n', '<br />');
		comments(videoid);
	}
}

let pageToken = '';
let page = 0;

function search() {
	let videolist = document.getElementById('videobits');
	page+=1;
	let query = getParameterByName('searchField');
	let sort = getParameterByName('sort');
	let encquery = encodeURIComponent(query);
	let containerQuery = document.getElementById('containerQuery');
	containerQuery.innerHTML = query;
	//film music https://ok.ru/video/1367341533919?fromTime=3408
	let url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&maxResults=25&type=video&q='+encquery+'&order='+sort+'&key='+apikey;
	if (!!pageToken) {
		url+='&pageToken='+pageToken;
	}
	videolist.insertAdjacentHTML('beforeend', `
	<p>Page: ${page}</p>
	`);
	let xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.open('GET', url, true);
	xhr.send();
	xhr.onload = function() {
		let response = xhr.response;
		pageToken = response.nextPageToken;
		response.items.forEach(function(item) {
			let id = item.id.videoId;
			let date = timeSince(item.snippet.publishedAt);
			let title = item.snippet.title;
			let thumb = item.snippet.thumbnails.default.url;
			let channelTitle = item.snippet.channelTitle;
			videolist.insertAdjacentHTML('beforeend', `
			<!--bit start-->
			<div class="videobit">
			<a href="video.html?id=${id}">
			<table>
			<tr>
			<td class="videobitPic"><img src="${thumb}" height="90" width="140"/></td>
			<td class="videobitDesc">
			<h4>${title}</h4>
			<p>${channelTitle}</p>
			<p>${date}</p>
			</td>
			</tr>
			</table>
			</a>
			</div>
			<!--bit end-->
			`);
		});
	}
}
function comments(vid){
	let commentContainer = document.getElementById('comments');
	let xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.open('GET', 'https://www.googleapis.com/youtube/v3/commentThreads?textFormat=plainText&part=snippet&maxResults=50&videoId='+vid+'&key='+apikey, true);
	xhr.send();
	xhr.onload = function() {
		let response = xhr.response;
		response.items.forEach(function(item) {
			let date = timeSince(item.snippet.topLevelComment.snippet.publishedAt);
			let name = item.snippet.topLevelComment.snippet.authorDisplayName;
			let text = item.snippet.topLevelComment.snippet.textDisplay.replace('\n', '<br />');
			commentContainer.insertAdjacentHTML('beforeend', `
			  <div class="comments">
				<h4>${name}</h4>
				<p>${text}</p>
				<p>${date}</p>
			  </div>
			`);
		});
	} 
}
function channel() {
	//main info
	let channelId = getParameterByName('channelId');
	let xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.open('GET', 'https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics&id='+channelId+'&key='+apikey, true);
	xhr.send();
	xhr.onload = function() {
		let response = xhr.response;
		let chanUsername = document.getElementById('chanUsername');
		let chanPic = document.getElementById('chanPic');
		let chanViews = document.getElementById('chanViews');
		let chanUploaded = document.getElementById('chanUploaded');
		let chanCustomName = document.getElementById('chanCustomName');
		let chanRegion = document.getElementById('chanRegion');
		let chanDescription = document.getElementById('chanDescription');
		let chanSubscribers = document.getElementById('chanSubscribers');
		chanUsername.innerHTML = response.items[0].snippet.title;
		chanViews.innerHTML = response.items[0].statistics.viewCount;
		chanUploaded.innerHTML = response.items[0].statistics.videoCount;
		chanSubscribers.innerHTML = response.items[0].statistics.subscriberCount;
		chanCustomName.innerHTML = response.items[0].snippet.customUrl;
		chanDescription.innerHTML = response.items[0].snippet.description;
		chanRegion.innerHTML = response.items[0].snippet.country;
		chanPic.innerHTML = `<img src="${response.items[0].snippet.thumbnails.default.url}" height="100" width="100" />`;
	}
}
function playlist() {
	let playlistId = getParameterByName('playlistId');
}
function showPopup() {
	let popup = document.getElementById('popup');
	let wrapper = document.getElementById('wrapper');
	popup.style.display = "block";
	wrapper.style.display = "none";
}
function hidePopup() {
	let popup = document.getElementById('popup');
	let wrapper = document.getElementById('wrapper');
	wrapper.style.display = "block";
	popup.style.display = "none";
}

//stolen scripts

//urlparser
function getParameterByName(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//tab manager
function openTab(evt, tabName) {
	var i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}

//spoiler
window.acc=(e)=>{
	let q=document.querySelectorAll(".acc"),
	w=document.querySelectorAll(".accD");
	q.forEach((e2,l)=>{
		if(e==e2){
			if(!e.classList.contains("accCl")){
				e.classList.add("accCl");
				w[l].classList.remove("dn")
			}else{
				e.classList.remove("accCl");
				w[l].classList.add("dn")
			}
		}

	})
};

//duration
function isoDurationToHHMMSS(duration) {
	// Parse the ISO 8601 duration
	const regex = /P(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
	const matches = duration.match(regex);

	if (!matches) {
		throw new Error("Invalid ISO 8601 duration format");
	}

	// Extract hours, minutes, and seconds
	let hours = parseInt(matches[1] || 0, 10);
	let minutes = parseInt(matches[2] || 0, 10);
	let seconds = parseInt(matches[3] || 0, 10);

	// Format each component to be two digits
	const pad = (num) => String(num).padStart(2, '0');

	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
//relative time from timestamp
function timeSince(date) {
	const now = new Date();
	const past = new Date(date);
	const seconds = Math.floor((now - past) / 1000);

	const intervals = [
		{ label: 'year', seconds: 31536000 },
		{ label: 'month', seconds: 2592000 },
		{ label: 'day', seconds: 86400 },
		{ label: 'hour', seconds: 3600 },
		{ label: 'minute', seconds: 60 },
		{ label: 'second', seconds: 1 }
	];

	for (const interval of intervals) {
		const count = Math.floor(seconds / interval.seconds);
		if (count > 0) {
			return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
		}
	}

	return 'just now';
}
function shareVideo() {
	let videoid = getParameterByName('id');
	let data = {title: 'YT Link', url: 'https://www.yaoutube.com/watch?v='+videoid};
	navigator.share(data);
}
function copyUrl(){
	var dummy = document.createElement('input'),
    text = window.location.href;
	document.body.appendChild(dummy);
	dummy.value = text;
	dummy.select();
	document.execCommand('copy');
	document.body.removeChild(dummy);
	console.log('copied');
}