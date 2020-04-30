dayjs.extend(dayjs_plugin_relativeTime);
let sort = "created";
let page = 1;

// Button event listener
$("#get").click((event) => {
  event.preventDefault();
  let user = $("#username").val().trim();
  getTimeline(user);
});

// Load more event listener
$("#load-more").click((event) => {
  event.preventDefault();
  let user = $("#username").val().trim();
  getRepos(user);
});

// Append Repo data
function getRepos(user) {
  fetchData(user, page)
    .then((data) => {
      // display loading and timeline
      $(".spinner-border").css("display", "none");
      $(".timeline").css("display", "block");

      // clear only if first page
      if (page == 1) {
        $(".timelinelist").html("");
      }
      data.forEach((element) => {
        // check for nulls
        if (element.description == null) {
          element.description = "None";
        }

        if (element.language == null) {
          element.language = "None";
        }

        // append only public personal repos to timeline
        if (element.fork == false) {
          var date = new Date(element.created_at);
          date = date.toDateString();
          $(".timelinelist").append(`
            <li id=${element.id}>
                <div>
                    <time>${date} - ${dayjs(date).fromNow()}</time>
                    Name: <strong>${element.name}</strong>
                    <br>
                    Description <strong>${element.description}</strong>
                    <br>
                    Primary language used: <strong>${element.language}</strong>
                    <br>
                    <a href="${
                      element.svn_url
                    }" target="_blank">View on GitHub</a>
                </div>
            </li>`);
        }
      });
      page++;
    })
    .catch((error) => console.log(error.message));
}

// Fetch repo data from Github API users/username/repos + params page & sort
async function fetchData(user, page = 1) {
  $(".spinner-border").css("display", "block");
  let res = await fetch(
    `https://api.github.com/users/${user}/repos?received_events&page=${page}&sort=${sort}`
  );

  // Display error message if user does not exist
  if (res.status == 404) {
    $(".alert").css("display", "block");
  } else {
    $(".alert").css("display", "none");
  }

  let data = await res.json();
  return data;
}

// Add username to search params, append header under input, display load more button, get repos to generate timeline
function getTimeline(user) {
  page = 1;
  addUser(user);
  $(".center").html(`<h2>@${user}'s Repository Timeline</h2>`);
  $("#load-more").css("display", "block");
  getRepos(user);
}

// add user to search params
function addUser(user) {
  const url = new URL(document.location.href);
  const params = new URLSearchParams(url.search);
  params.set("username", user);
  window.history.pushState(
    {},
    "",
    decodeURIComponent(`${location.pathname}?${params}`)
  );
}

// reload
function reload() {
  const params = new URLSearchParams(location.search);
  const user = params.get("username");

  if (user) {
    $("#username").val(user);
    getTimeline(user);
  }
}
reload();

// Timeline

(function () {
  "use strict";

  // define variables
  var items = document.querySelectorAll(".timeline li");

  // check if an element is in viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
      }
    }
  }

  // listen for events
  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);
})();
