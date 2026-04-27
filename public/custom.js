window.setBanner = {
  name: "Blog test 12345",
  bannerimg: "https://picsum.photos/600/400",
  summary:
    "The Inclusive Growth Framework shows how we can turn our region’s promise of equitable and sustainable growth into action, making the West Midlands the best place to live, work and visit.",
  position: "center",
};

const breadcrumb = [
  ["West Midlands Combined Authority", "/"],
  ["What we do", "/what-we-do/"],
  ["Inclusive Growth", "/what-we-do/inclusive-growth/"],
];

// set topics to be sent to the app
let tagsSrc = [];
tagsSrc = '["Inclusive growth, Transport"]';

let tags = [];
if (tagsSrc && tagsSrc.length > 0) {
  const tag = tagsSrc
    .toString()
    .replace("[", "")
    .replace("]", "")
    .replace(/["]/g, "");

  tags = tag.split(",").map((t) => t.trim()).filter(t => t);
}
// If tagsSrc is empty, tags will be an empty array and all articles will show


window.setTopics = {
  topics: tags,
  name: "Blog",
  url: "https://www.wmca.org.uk/what-we-do/inclusive-growth/blog/",
  breadcrumbs: {
    breadcrumb: breadcrumb,
  },
};

(function () {
  // Inject SVG sprite used by the original site so icons are available.
  try {
    var ajax = new XMLHttpRequest();
    ajax.open(
      "GET",
      "https://cloudcdn.wmca.org.uk/wmcaassets/ds/1.5.0/img/wmcads-icons.min.svg",
      true,
    );
    ajax.send();
    ajax.onload = function () {
      var div = document.createElement("div");
      div.style.display = "none";
      div.innerHTML = ajax.responseText;
      document.body.insertBefore(div, document.body.childNodes[0]);
    };
  } catch (e) {
    // ignore network errors
  }
})();
