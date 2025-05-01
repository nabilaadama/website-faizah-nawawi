import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/lib/firebase/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await signUp(req.body, (status: boolean) => {
        if (status) {
          res.status(200).json({ status: true, message: "success" });
        } else {
          res.status(400).json({ status: false, message: "failed" });
        }
      });
    } catch (error: any) {
      res
        .status(500)
        .json({
          status: false,
          message: error.message || "Internal server error",
        });
    }
  } else {
    res.status(405).json({ status: false, message: "Method not allowed" });
  }
}
