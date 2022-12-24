import { NextApiRequest, NextApiResponse } from "next";
var JSSoup = require("jssoup").default;
const getEpLink = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { path, ep },
  } = req;
  const url = "https://gogohd.net/videos/";
  const epNum = parseFloat(ep);
  const endpoint = epNum == 0 ? path : path + `-episode-${epNum}`;
  const response = await fetch(url + endpoint);
  const soup = new JSSoup(await response.text());
  const frame = soup.find("iframe");
  if (frame) {
    console.log("link", frame.attrs.src);
    const link = frame.attrs.src;
    res.status(202).json(link);
  } else {
    res.status(404);
  }
};

export default getEpLink;
