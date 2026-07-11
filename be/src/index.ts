import express from "express";
import cors from "cors";
import seminarRoute from "./routes/seminarRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import speakerRoute from "./routes/speakerRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import hasilRoute from "./routes/hasilRoute.js";
import bobotRoute from "./routes/bobotRoute.js";
import levelRoute from "./routes/levelRoute.js"
import speakerSeminarRoute from "./routes/speakerSeminarRoute.js";
import fasilitasRoute from "./routes/fasilitasRoute.js";
import kelengkapanFasilitasRoute from "./routes/kelengkapanFasilitasRoute.js"
import ratingPembicaraRoute from "./routes/ratingPembicaraRoute.js";
import kriteriaRoutes from "./routes/kriteriaRoute.js";
import subKriteriaRoutes from "./routes/perhitunganSPKRoute.js";
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/categories", categoryRoute);
app.use("/levels", levelRoute);
app.use("/speaker", speakerRoute);
app.use("/seminar", seminarRoute);
app.use("/speaker-seminars", speakerSeminarRoute);
app.use("/fasilitas", fasilitasRoute);
app.use("/kelengkapan-fasilitas", kelengkapanFasilitasRoute);
app.use("/rating-pembicara", ratingPembicaraRoute);
app.use("/bobot", bobotRoute);
app.use("/hasil", hasilRoute);
app.use("/kriteria", kriteriaRoutes);
app.use("/sub-kriteria", subKriteriaRoutes);




app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});