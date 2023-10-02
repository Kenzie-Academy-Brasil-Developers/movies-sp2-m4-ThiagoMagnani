import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";

export const isMovieValidName = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const queryString = "SELECT * FROM movies WHERE name = $1";
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [name],
    };
    const { rowCount } = await client.query(queryConfig);
    if (rowCount > 0) {
        return res.status(409).json({ message: "Movie name already exists!" });
    }
    return next();
}

export const isMovieValid = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const queryString = "SELECT * FROM movies WHERE id = $1";
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const { rowCount } = await client.query(queryConfig);
    if (!rowCount) {
        return res.status(404).json({ message: "Movie not found!" });
    }
    return next();
}
