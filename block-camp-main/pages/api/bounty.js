// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mockBounty } from "../../mock";

export default function handler(req, res) {
  res.status(200).json(mockBounty);
}
