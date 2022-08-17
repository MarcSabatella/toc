function getChapters (book) {
  //console.log("getChapters");
  let chapters = book.querySelectorAll(".book-navigation ul:not(.book-pager) a");
  return chapters;
}

async function getPages (chapter) {
  //console.log("getPages");
  const fetchInit = { "cache": "default", };
  let r = await fetch(chapter, fetchInit);
  let t = await r.text();
  let d = new DOMParser;
  let x = d.parseFromString(t, "text/html");
  let pages = x.querySelectorAll(".book-navigation ul:not(.book-pager) a");
  return pages;
}

// show main headings as subheadings; subheadings as lists
async function getHeadings (page) {
  //console.log("getHeadings");
  const fetchInit = { "cache": "default", };
  let r = await fetch(page, fetchInit);
  let t = await r.text();
  let d = new DOMParser;
  let x = d.parseFromString(t, "text/html");
  let content = x.querySelector(".content-wrapper");
  let raw = content.querySelectorAll("h2, h3, h4, h5");
  var headings = document.createElement("div");
  var top = headings;
  var level = "H2";
  for (const h of raw) {
    let eType =(h.nodeName == "H2") ? "h4" : "li";
    let i = document.createElement(eType);
    let anchor = h.querySelector("a");
    if (anchor) {
      let ahref = anchor.getAttribute("href");
      let a = document.createElement("a");
      a.href = page + ahref;
      a.innerText = h.innerText;
      i.innerHTML = a.outerHTML;
      //console.log("anchor found " + i.innerHTML);
    } else {
      i.innerText = h.innerText;
      //console.log("no anchor found " + i.innerHTML);
    }
    if (h.nodeName > level) {
      let inner = document.createElement("ul");
      headings.append(inner);
      headings = inner;
    } else if (h.nodeName < level) {
      let n = level.substring(1) - h.nodeName.substring(1);
      //console.log(level + " - " + h.nodeName + " = " + n);
      for (let ii = 0; ii < n; ++ii) {
        headings = headings.parentNode;
      }
    }
    level = h.nodeName;
    headings.append(i);
    //console.log(h.nodeName + " " + i.innerText);
  }
  return top;
}

// show all headings as lists
async function getHeadingsList (page) {
  //console.log("getHeadings");
  const fetchInit = { "cache": "default", };
  let r = await fetch(page, fetchInit);
  let t = await r.text();
  let d = new DOMParser;
  let x = d.parseFromString(t, "text/html");
  let content = x.querySelector(".content-wrapper");
  let raw = content.querySelectorAll("h2, h3, h4, h5");
  var headings = document.createElement("div");
  var top = headings;
  var level = "H1";
  for (const h of raw) {
    let i = document.createElement("li");
    let anchor = h.querySelector("a");
    if (anchor) {
      let ahref = anchor.getAttribute("href");
      let a = document.createElement("a");
      a.href = page + ahref;
      a.innerText = h.innerText;
      i.innerHTML = a.outerHTML;
      //console.log("anchor found " + i.innerHTML);
    } else {
      i.innerText = h.innerText;
      //console.log("no anchor found " + i.innerHTML);
    }
    if (h.nodeName > level) {
      let inner = document.createElement("ul");
      headings.append(inner);
      headings = inner;
    } else if (h.nodeName < level) {
      let n = level.substring(1) - h.nodeName.substring(1);
      //console.log(level + " - " + h.nodeName + " = " + n);
      for (let ii = 0; ii < n; ++ii) {
        headings = headings.parentNode;
      }
    }
    level = h.nodeName;
    headings.append(i);
    //console.log(h.nodeName + " " + i.innerText);
  }
  return top;
}

async function buildTOC (url, toc) {
  //console.log("buildTOC");
  let chapters = await getChapters(url);
  for (const c of chapters) {
    let n = document.createElement("h2");
    n.innerText = c.innerText;
    toc.append(n);
    let pages = await getPages(c.href);
    if (pages) {
      let l = document.createElement("div");
      for (const p of pages) {
        let n = document.createElement("h3");
        let a = document.createElement("a");
        a.innerText = p.innerText;
        a.href = p.href;
        n.append(a);
        l.append(n);
        let headings = await getHeadings(p.href);
        l.append(headings);
      }
      toc.append(l);
    }
  }
  return toc;
}

async function tocNew () {
  try {
    let w = window.open();
    let doc = w.document;
    doc.title = document.title;
    let h1 = document.createElement("h1");
    h1.innerText = "Loading, please wait...";
    doc.body.append(h1);
    let div = document.createElement("div");
    doc.body.append(div);
    let ss = doc.createElement("style");
    ss.type = "text/css";
    doc.head.append(ss);
    ss.sheet.insertRule("h2, h3, h4, li, a { color: lightgray; }", 0);
    await buildTOC(document, div);
    ss.sheet.deleteRule(0);
    let oh1 = document.querySelector("h1");
    h1.innerText = oh1.innerText;
  } catch (err) {
    console.log(err);
  }
}

tocNew();