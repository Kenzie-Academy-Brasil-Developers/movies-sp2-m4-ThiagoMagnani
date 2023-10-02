import { Request, Response } from "express";
import { client } from "./database";
import { QueryConfig } from "pg";
import format from "pg-format";

export const getMovies = async (req: Request, res: Response) => {
    const query = `SELECT * FROM movies;`;
    const data = await client.query(query);
    const category = req.query.category;
    if (category) {
        const queryString = `SELECT * FROM movies WHERE category = $1;`
        const queryConfig: QueryConfig = {
            text: queryString,
            values: [category],
        }
        const data = await client.query(queryConfig);

        if (!data.rowCount) {
            const query = `SELECT * FROM movies;`;
            const data = await client.query(query);
            return res.status(200).json(data.rows);
        }
        return res.status(200).json(data.rows);
    }
    return res.status(200).json(data.rows);
}

export const getMoviesID = async (req: Request, res: Response) => {
    const { id } = req.params;
    const queryString = `SELECT * FROM movies WHERE id = $1;`;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    }
    const data = await client.query(queryConfig);
    return res.status(200).json(data.rows[0]);
}

export const createMovies = async (req: Request, res: Response) => {
    const { name, category, duration, price } = req.body;
    const queryString = `INSERT INTO movies (name, category, duration, price)
    VALUES ($1, $2, $3, $4) RETURNING *;`
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [name, category, duration, price],
    }
    const data = await client.query(queryConfig);
    res.status(201).json(data.rows[0]);
}

export const editMovies = async (req: Request, res: Response) => {
    const { id } = req.params;
    const query = format(`UPDATE movies SET (%I) = ROW(%L) WHERE id = (%s) RETURNING *;`, Object.keys(req.body), Object.values(req.body), id);
    const data = await client.query(query);
    return res.status(200).json(data.rows[0]);
}

export const deleteMovies = async (req: Request, res: Response) => {
    const { id } = req.params;
    const queryString = `DELETE FROM movies WHERE ID = $1;`;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    }
    await client.query(queryConfig);
    return res.status(204).json();
}
