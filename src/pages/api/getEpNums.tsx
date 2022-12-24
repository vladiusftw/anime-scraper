import { NextApiRequest, NextApiResponse } from "next";
var JSSoup = require("jssoup").default;
const getEpNums = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { path },
  } = req;
  const url = "https://ww4.gogoanimes.org/";
  const response = await fetch(url + "/category/" + path);
  const soup = new JSSoup(await response.text());
  console.log(path);
  const pages = soup.find("ul", { id: "episode_page" }).findAll("li");
  if (pages) {
    const firstPage = pages[0];
    if (pages.length > 1) {
      const lastPage = pages[pages.length - 1];
      const firstPageText = firstPage
        .find("a")
        .text.replaceAll("/[^0-9-]/g", "")
        .trim();
      const firstEp = parseFloat(
        firstPageText.substring(0, firstPageText.indexOf("-"))
      );
      const lastPageText = lastPage
        .find("a")
        .text.replaceAll("/[^0-9-]/g", "")
        .trim();
      console.log(
        "lastPage",
        lastPageText.substring(lastPageText.indexOf("-") + 1)
      );
      const lastEp = parseFloat(
        lastPageText.substring(lastPageText.indexOf("-") + 1)
      );
      const eps = [];
      for (var i = firstEp; i <= lastEp; i++) {
        eps.push(i);
      }
      console.log(eps);
      res.status(200).json(eps);
    } else {
      const firstPageText = firstPage
        .find("a")
        .text.replaceAll("/[^0-9-]/g", "")
        .trim();
      const firstEp = parseFloat(
        firstPageText.substring(0, firstPageText.indexOf("-"))
      );
      const lastEp = parseFloat(
        firstPageText.substring(firstPageText.indexOf("-") + 1)
      );
      const eps = [];
      var increment = lastEp - firstEp < 1 ? 0.1 : 1;

      console.log("test", increment);
      for (var i = firstEp; i <= lastEp; i += increment) {
        eps.push(i);
      }
      console.log(eps);
      res.status(200).json(eps);
    }
  } else {
    res.status(404);
  }
};

export default getEpNums;
