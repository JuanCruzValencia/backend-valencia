import { Request, Response } from "express";

//TODO endpoint no implementado en el front con next
export const getChatPage = async (req: Request, res: Response) => {
  try {
    const user = req.session.user;

    res.render("chat", {
      style: "style.css",
      user,
    });
  } catch (error) {
    req.logger.error(error);

    res.send({
      succes: false,
      error,
    });
  }
};
