require("dotenv").config();
const app = require("./src/app");

const coffeeDateRoutes = require(
    "./src/routes/coffeeDateRoutes"
);

const connectDatabase = require(
    "./src/config/database"
);

const PORT = 3000;

async function startServer() {
    await connectDatabase();

    app.use(
        "/api/coffee-date",
        coffeeDateRoutes
    );

    app.listen(PORT, () => {
        console.log(
            `Server is running on http://localhost:${PORT}`
        );
    });
}

startServer();