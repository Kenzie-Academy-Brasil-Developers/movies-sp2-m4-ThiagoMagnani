import express from "express";
import "dotenv/config";
import { connectDatabase, createDatabaseTables } from "./database";
import { createMovies, deleteMovies, editMovies, getMovies, getMoviesID } from "./logic";
import { isMovieValid, isMovieValidName } from "./middlewares";

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.listen(PORT, async () => {
    await connectDatabase();
    await createDatabaseTables();
    console.log(`Server started on por ${PORT}`);
});

app.get("/movies", getMovies);

app.post("/movies", isMovieValidName, createMovies);

app.get("/movies/:id", isMovieValid, getMoviesID);

app.patch("/movies/:id", isMovieValid, isMovieValidName, editMovies);

app.delete('/movies/:id', isMovieValid, deleteMovies);
