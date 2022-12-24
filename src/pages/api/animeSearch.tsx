import { NextApiRequest, NextApiResponse } from "next";
var JSSoup = require("jssoup").default;
const animeSearch = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { search },
  } = req;
  const url = "https://ww4.gogoanimes.org/";
  const endpoint = `/search?keyword=${search != "" ? search : "one piece"}`;
  const response = await fetch(url + endpoint);
  var soup = new JSSoup(await response.text());
  var soupItems = soup.find("ul", "items").findAll("li");
  const items: any = [];
  soupItems.forEach((item: any) => {
    const endpointLink = item.find("a").attrs.href;
    const img = item.find("img").attrs.src.replace(" ", "%20");
    const name = item.find("p", "name").find("a").attrs.title;
    const released = item.find("p", "released").text.trim();
    items.push({
      endpointLink,
      img,
      name,
      released,
    });
  });
  res.status(200).json(items);
};

export default animeSearch;
